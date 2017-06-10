const router = require('express').Router(); 
const User = require('../../models/User');
const Util = require('../../helper/util');

router.post('/', (req,res,next)=>{
	
	//checking body
	req.assert('email').notEmpty().isEmail();
	req.assert('name').notEmpty();

	const errors = req.validationErrors();
	if(errors){
		const validationErrors = Util.extractError(errors);
		return res.status(422).json({
			errors:validationErrors
		});
	}

	let user = new User({
		name:  req.body.name,
		email: req.body.email
	})

	user.save()
	.then(savedUser =>{
		return res.status(201).json({
			message: ['User created!']
		})
	})
	.catch(err =>{
		next(err);
	})

})

module.exports = router