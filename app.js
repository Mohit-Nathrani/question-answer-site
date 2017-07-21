// =======================
//the packages we need
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var expressValidator = require('express-validator');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./routes/user'); // get our mongoose model-user
var Ques   = require('./routes/ques'); // get our mongoose model-ques
var Ans   = require('./routes/ans'); // get our mongoose model-ans

// =======================
// configuration =========
// used to create, sign, and verify tokens
var port = process.env.PORT || 8080;
// connect to database
mongoose.connect(config.database);
mongoose.Promise = global.Promise;

// secret variable
app.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

//Express Validator:
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.lenght){
      formParam+='[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

// =======================
// routes ================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

//route to register a new user(POST http://localhost:3001/signup)
app.post('/signup', function(req, res,next) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody('firstname','First name is reqired').notEmpty();
  req.checkBody('lastname','Last name is reqired').notEmpty();
  req.checkBody('email','Email is reqired').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('password','Password is reqired').notEmpty();
  req.checkBody('password2','Both passwords do not match').equals(req.body.password);
  var errors = req.validationErrors();

  if(errors){
    res.send({success:false,errors:errors});
  }
  else {
      var newUser = new User({
        firstname : firstname,
        lastname : lastname,
        email : email,
        password : password
      });
      User.createUser(newUser,function(err,user){
        if(err) throw err;
      });
      res.json({success:true});
  }
});

// API ROUTES -------------------
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:3001/api/authenticate)
apiRoutes.post('/authenticate', function(req, res,next) {
  // find the user
  User.findOne({
    email: req.body.email
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, errmsg: 'Authentication failed. User not found.' });
    } else if (user) {
      // check if password matches
      User.comparePassword(req.body.password,user.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          var token = jwt.sign(user, app.get('superSecret'), {
            expiresIn: "10h" // expires in 10 hours
          });
          // return the information including token as JSON
          res.json({ success:true, token:token });
        }
        else{
          res.json({ success: false, errmsg: 'Authentication failed. Wrong password.' });
        }
    });
    }
  });
});

//middleware to authenticate user before accessing required resource
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});


// route to show a random message (GET http://localhost:3001/api/)
apiRoutes.get('/', function(req, res) {
  res.json({success:true, message: 'Welcome to the QnA API' });
});

// route to show user detail (POST http://localhost:3001/api/profile)
apiRoutes.post('/profile',function(req,res) {
    res.json({
      "success":true,
      "email": req.decoded._doc.email,
      "lastname": req.decoded._doc.lastname,
      "firstname": req.decoded._doc.firstname
    });
});

//route to store the asked question(POST http://localhost:3001/api/asking)
apiRoutes.post('/asking', function(req, res) {
  var userid = req.decoded._doc._id;
  var question = req.body.question;

  req.checkBody('question','Question field can not be empty').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    res.json({aksed:false,error:"Sorry! Empty question field is not allowed.",errors:errors});
  }
  else {
      var newQues = new Ques({
        userid : userid,
        question : question
      });
      Ques.createQues(newQues,function(err,ques){
        if(err) throw err;
        else{
          User.findOneAndUpdate(
            {'_id':userid},
            {$push:{'ques':ques._id}},
            function(err,data){
            }
          )
          res.json({asked:true});
        }
      });
  }
});

// route to submit an answer (POST http://localhost:3001/api/answer)
apiRoutes.post('/answer',function(req,res){
  var ans=req.body.ans;
  req.checkBody('ans','Answer field can not be empty').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    res.json({success:false,error:"Sorry! Empty question field is not allowed."});
  }
  else{
      Ques.findOne(
        {'_id': req.body.id},
        function(err,ques){
          if(err){
            res.json({success:false});
          }
          else{
            var newAns = new Ans({
              userid : req.decoded._doc._id,
              ans : req.body.ans,
              quesid:ques._id
            });

            Ans.createAns(newAns,function(err,ans){
              if(err) {
                res.json({success:false});
              }
              else{
                var id=ans._id;
                ques.ansid.push(id);
                ques.save(function (err) {
                  if(err) {
                      res.json({success:false});
                  }
                  else{
                    User.findOne({ "_id" :  req.decoded._doc._id },function(err,user){
                      user.ans.push(id);
                      user.save();
                    });
                    Ques.findOne({'_id': req.body.id}).then(function(ques){
                      res.json({"success":true,"new data": ques});
                    });
                  }
                });
              }
            });
          }
        }
      );
    }
});


// route to get top 15 feeds (POST http://localhost:3001/api/feeds)
apiRoutes.post('/feeds', function(req, res) {
  Ans.find({})
      .sort({"up":-1})
      .sort({"date":-1})
      .limit(15)
      .exec(function(err, ans) {
      res.json({success:true,feeds:ans});
  });
});

apiRoutes.post('/unanswered', function(req, res) {
  Ques.find({ansid: {$size: 0} })
      .sort('-date')
      .limit(10)
      .exec(function(err, quess) {
        if(err){
            res.json({success:false})
        }
        else {
            res.json({success:true,unanswered:quess})
        }
  });
});


// route to get all the questions detail asked by a user (POST http://localhost:3001/api/quesactivity)
apiRoutes.post('/quesactivity', function(req, res) {
  var userid = req.decoded._doc._id;
  User.findOne({'_id':userid}, function(err, user) {
    var ids = user.ques.map(function(id) { return id; });
    Ques.find({_id: {$in: ids}}, function(err, docs) {
       var result=docs.map(function(quess) { return ({id:quess._id,question:quess.question,answers:quess.ansid.length}); });
       res.json({"result":result});
   });
  });
});

// route to get all the answers detail answered by a user (POST http://localhost:3001/api/ansactivity)
apiRoutes.post('/ansactivity', function(req, res) {
  var userid = req.decoded._doc._id;
  User.findOne({'_id':userid}, function(err, user) {
    var ids = user.ans.map(function(id) { return id; });
    Ans.find({_id: {$in: ids}}, function(err, docs) {
       var result=docs.map(function(anss) { return ({id:anss._id,answer:anss.ans,quesid:anss.quesid,userid:anss.userid}); });
       res.json({"result":result});
   });
  });
});


// route to get details of a particular question (POST http://localhost:3001/api/qdetail)
apiRoutes.post('/qdetail', function(req, res) {
  var qid = req.body.id;
  Ques.findOne({'_id':qid}, function(err, q) {
    if(err){res.json({success:false})}
    else{
      res.json({success:true,q:q});
    }
  });
});

// route to get details of a particular answer (POST http://localhost:3001/api/adetail)
apiRoutes.post('/adetail', function(req, res) {
  var aid = req.body.aid;
  Ans.findOne({'_id':aid}, function(err, a) {
    if(err){res.json({success:false})}
    else{
      res.json({success:true,a:a});
    }
  });
});

// route to get details of a particular user (POST http://localhost:3001/api/udetail)
apiRoutes.post('/udetail', function(req, res) {
  var uid = req.body.uid;
  User.findOne({'_id':uid})
  .select('firstname lastname -_id')
  .exec(function(err, u) {
    if(err){res.json({success:false})}
    else{
      res.json({success:true,u:u});
    }
  });
});

// route to check whether a user upvoted a particular answer or not (POST http://localhost:3001/api/upstat)
apiRoutes.post('/upstat', function(req, res) {
  var ansid = req.body.ansid;
  var viewerid = req.decoded._doc._id
  Ans.find({'_id':ansid,'up':viewerid},function(err,ans){
    if(err){
      res.json({upcon:false});
    }
    else{
      if(ans.length>0){
        res.json({upcon:true});
      }
      else {
        res.json({upcon:false});
      }
    }
  });
});

// route to check whether a user downvoted a particular answer or not (POST http://localhost:3001/api/downstat)
apiRoutes.post('/downstat', function(req, res) {
  var ansid = req.body.ansid;
  var viewerid = req.decoded._doc._id
  Ans.find({'_id':ansid,'down':viewerid},function(err,ans){
    if(err){
      res.json({downcon:false});
    }
    else{
      if(ans.length>0){
        res.json({downcon:true});
      }
      else {
        res.json({downcon:false});
      }
    }
  });
});

// route to upvote  a particular answer (by a particular user)
// or altering the upvote if it is already upvoted (POST http://localhost:3001/api/upvote)
apiRoutes.post('/upvote', function(req, res) {
  var ansid = req.body.ansid;
  var upBefore,upAfter;
  Ans.findOne({'_id': ansid },function(err,ans){
    upBefore=ans.up.length;
    Ans.findOneAndUpdate(
      { "_id": ansid },{$addToSet:{up:req.decoded._doc._id}},{new: true}, function(err, doc){
        if(err){
            res.json({success:false});
        }
        upAfter=doc.up.length;
        if(upAfter>upBefore)
        {
            res.json({success:true,upvoted:true,quan:upAfter});
        }
        else {
          Ans.findOneAndUpdate(
            { "_id": ansid },{$pull: { up:req.decoded._doc._id} },function(err,doc){
              res.json({success:true,upvoted:false,quan:upAfter-1});
            })
        }
      }
    );
  });
});


// route to downvote  a particular answer (by a particular user)
// or altering the downvote if it is already downvoted (POST http://localhost:3001/api/downvote)
apiRoutes.post('/downvote', function(req, res) {
  var ansid = req.body.ansid;
  var downBefore,downAfter;
  Ans.findOne({'_id': ansid },function(err,ans){
    downBefore=ans.down.length;
    Ans.findOneAndUpdate(
      { "_id": ansid },{$addToSet:{down:req.decoded._doc._id}},{new: true}, function(err, doc){
        if(err){
            res.json({success:false});
        }
        downAfter=doc.down.length;
        if(downAfter>downBefore)
        {
            res.json({success:true,downvoted:true,quan:downAfter});
        }
        else {
          Ans.findOneAndUpdate(
            { "_id": ansid },{$pull: { down:req.decoded._doc._id} },function(err,doc){
              res.json({success:true,downvoted:false,quan:downAfter-1});
            })
        }
      }
    );
  });
});


// apply the routes to our application with the prefix '/api'
app.use('/api', apiRoutes);

module.exports = app;
