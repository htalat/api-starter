const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk  = require('chalk');
const passport = require('passport');
const errorhandler = require('errorhandler');
//loading env file
dotenv.load({path:'.env'});

//load passportConfig file
const passportConfig = require('./config/passport');

const app = express();

//cors
app.use((req, res, next) =>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

//errorhandler
app.use(errorhandler());

//mongoose
mongoose.promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', ()=>{
	console.log('%s DB Connected!', chalk.green('✓')); 
})
mongoose.connection.on('error', ()=>{
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit(1);	
})

//passport initialize
app.use(passport.initialize());
app.use(passport.session());
app.set('port',process.env.PORT || 3000);

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//routes
app.use(require('./routes'));

//error handling
app.use((req,res,next) =>{
	const error  = new Error('Not found');
	error.status = 404;
	next(err);
})

app.use((err,req,res,next) =>{
	res.status  = err.status || 500;
	res.json({
		error: err.message
	})
})

//start the server
app.listen( app.get('port'), () => {
	console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
	console.log('  Press CTRL-C to stop\n');
});

module.exports = app;