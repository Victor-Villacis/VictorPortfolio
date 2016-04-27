//Boiler Plate Code - Initializing and Requiring all Modules
//express setup
var express = require('express');
var app = express();
//require (dotenv)
require('dotenv').config();
//Checks the environment port if not use 3000.
var PORT = process.env.PORT || 3000;
//Sequelize database setup
var Sequelize = require('sequelize');
//  "testdb1", "root", ""
var connection = new Sequelize(process.env.JAWSDB_URL);
//requiring passport last
var passport = require('passport');
var passportLocal = require('passport-local');
//requiring bcrypt, hashes passwords
var bcrypt = require("bcryptjs");
//requiring bodyParser an initializing for use
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
//get css,js, or images from files in public folder
app.use('/scripts', express.static('public/scripts'));
app.use('/css', express.static('public/css'));
app.use('/images', express.static('public/images'));
//Initializing and requiring middleware express-session, enabaling cookies
app.use(require('express-session')({
  secret:'HELLO WORLD',
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false, maxAge : (1000 * 60 * 60 * 2)},
}));
//Setting up and requring Handlebars
var exphb = require('express-handlebars');
app.engine('handlebars', exphb({defaultLayout:'main'}));
app.set('view engine', 'handlebars');


/************* PASSPORT CODE START *************/
//Initializing passport.
app.use(passport.initialize());
app.use(passport.session());
//passport use method as callback when being authenticated
passport.use(new passportLocal.Strategy(function(username, password, done) {
    //check password in db
    User.findOne({
        where: {
            username:username,
        }
    }).then(function(user) {
        //check password against hash
        if(user){
            bcrypt.compare(password, user.dataValues.password, function(err, user) {
                if (user) {
                  //if password is correct authenticate the user with cookie
                  done(null, { id: username, username: username });
                } else{
                  done(null, null);
                }
            });
        } else {
            done(null, null);
        }
    });
}));
//change the object used to authenticate to a smaller token, and protects the server from attacks.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  done(null, {id: id, username: id});
});
/************* PASSPORT CODE END*************/

/************* SEQUELIZE CODE START*************/
//sequelize modal
var User = connection.define('user', {
    username: {
      type:Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type:Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
            args: [4, 12],
            msg: ", or password must be between 4-12 characters"
        }
      }
    },
    firstName: {
      type:Sequelize.STRING,
    },
    lastName:{
      type:Sequelize.STRING,
    },
},{
  hooks: {
    beforeCreate: function(input){
      input.password = bcrypt.hashSync(input.password, 10);
    }
  }
});



//Account creation via sequelize
app.post('/create', function(req, res){
    User.create(req.body).then(function(result){
      res.redirect('/?msg=Account Created Please LogIn');
    }).catch(function(err) {
      console.log(err);
      res.redirect('/?msg='+ "E-mail " + err.errors[0].message);
    });
});


app.post('/', passport.authenticate('local', {
    successRedirect: '/test3',
    failureRedirect: '/?msg=Invalid Credentials'
}));

app.post('/addRes', function(req, res){
  Restaurant.create(req.body).then(function(result){
    res.redirect('/listings');
  }).catch(function(err) {
    console.log(err);
    res.render("restList", {msg: err.errors[0].message});
  });
});



/************* SEQUELIZE CODE END *************/



//************* EXPRESS HANDLEBARS CODE START HERE *************/

app.get('/', function(req, res) {
  res.render('index', {msg: req.query.msg});
});

app.get('/link', function(req, res) {
  res.render('error');
})


// app.get("/victor", function(req, res){
//   res.render('victor',{
//     user:req.user,
//     isAuthenticated: req.isAuthenticated()
//   });
// });




/************* EXPRESS HANDLEBARS CODE ENDS HERE *************/



//error handlers must go after exphb code
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//catch 404 and forward to error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// database connection via sequelize
connection.sync().then(function() {
  app.listen(PORT, function() {
    console.log("Listening on!!:" + PORT);
  });
});
