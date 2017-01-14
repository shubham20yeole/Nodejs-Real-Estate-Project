**Welcome to Shubham Great Living Web Application.**

***Project URL: http://shubham-great-livings.herokuapp.com***

1. create a folder for your app.
2. open node cmd and go to that folder.
3. run command 'npm init'
4. add discription
5. edit entry point as app.js
6. author name
7. open package.json file and add dependencies as "dependencies":{
  "express":"*",
  "body-parser":"*"
  },
8. create app.js file
9. write console.log("Hello world");
10. run app as node app.js
 

11 Further define framework and other vital variables.
>>
```nodejs
var express = require('express');
var SparkPost = require('sparkpost');
var sp = new SparkPost('9bf6b6d7079252cab943971ff90c08cc3a9cee0d');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
var collections = ["users", "blog", "comments"]
```

12 Database connection and client session variables.
>>
```nodejs
var db = mongojs('mongodb://***********:***********@***********.mlab.com:***********/***********', collections)
var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var blog=db.collection('blog');
var session = require('client-sessions');
```

13 Set view engine and define folders where images, css and javascript files are stored.
>>
```nodejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// set static path
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
//Global vars
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
})
```

14 Utilize Express Validator to validate the form data
>>
```nodejs
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
```
