const mongoose = require('mongoose');
const router = require('express').Router(); 
const Post = require('../../models/Post');
const User = require('../../models/User');
const Util = require('../../helper/util');

router.get('/',(req,res,next) =>{
	Post.find({})
	.populate('author', 'name')
	.then(data =>{
		res.status(200).json({
			data: data
		})
	})
	.catch(err =>{
		next(err);
	})
})

router.post('/', (req,res,next) =>{
	
	//check if all required values present
	req.assert('title').notEmpty();
	req.assert('author').notEmpty();
	req.assert('text').notEmpty();

	const errors = req.validationErrors();
	if(errors){
		const validationErrors = Util.extractError(errors);
		return res.status(422).json({
			errors:validationErrors
		});
	}

	//check if the id provided is valid
	//by casting to a objectID
	let authorId = false;	
	authorId  = mongoose.Types.ObjectId.isValid(req.body.author); 

	if(!authorId){
		return res.status(422).json({
			errors: ['Invalid value for Author']
		})
	}

	//checking if a legit user
	//then create a post
	let user;
	User.findById(req.body.author)
	.then( foundUser =>{
		if(!foundUser){
			return res.status(400).json({
				errors: ['User does not exist']
			});
		}
		user = foundUser;
	})
	.then(()=>{
		const post = new Post({
			title: req.body.title,
			text: req.body.text,
			author: req.body.author
		})
		return post.save();
	})
	.then( savedPost=>{
		user.posts.push(savedPost._id);
		return user.save();
	})
	.then(savedUser =>{
		res.status(200).json({
			message: ['Post Created!']
		})
	})
	.catch( err =>{
		next(err);
	})
})

module.exports = router