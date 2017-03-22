var express = require('express');
var SparkPost = require('sparkpost');
var sp = new SparkPost('xxx');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
var collections = ["users", "blog", "comments", "property", "images", "notification", "bookmark", "messages","timetable", "timetablecategory", "timetablequestion", "locations"]
var db = mongojs('mongodb://xxx:xxx@xxx.mlab.com:xxx/xxx', collections)
var JSFtp = require("jsftp");
var Ftp = new JSFtp({
    host: 'ftp.xxx.com',
    port: 21,
    user: 'xxx',
    password: 'XXX'
});
var app = express();
var ObjectId = mongojs.ObjectId;
var passport = require("passport")
var blog=db.collection('blog');
var session = require('client-sessions');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport")
// smtp.gmail.com
// smtp.sendgrid.net
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp.sendgrid.net",
    secureConnection : false,
    port: 587,
    auth : {
        user : "shubham20.yeole@gmail.com",
        pass : "xxx"
    }
}));
function sendEmail(email, subject, title, message){
var emailBody = '<html><body style="padding:40px; background-color: #E3F2FD"><header style="background-color: #2196F3; padding: 10px !important; margin:0px !important;"><h1 style="color: #E3F2FD; text-align:center">Shubham-Great-Livings</h1></header><div style="background-color:#E3F2FD; "><h2 style="color:#E3F2FD; float: left; padding:5px;margin:0px !important; "><img src="https://cdn2.iconfinder.com/data/icons/New-Social-Media-Icon-Set-V11/512/email.png" width="22" height="22">shubhamyeole.cs@gmail.com</h2><h2 style="color:#E3F2FD; float: right; margin-top: -100cm; padding:5px; margin:0px !important; "><img src="http://icons.iconarchive.com/icons/graphicloads/100-flat/256/phone-icon.png" width="22" height="22"> +1 (201) 887-5323</h2></div><div style="background-image: url(http://www.ironfish.com.au/wp-content/uploads/2014/12/house-architecture-photography-hd-wallpaper-1920x1200-9237-1024x640.jpg); background-size: 100% 700px; height:auto; width:100%; overflow:hidden; background-repeat: no-repeat;"><div style=" background-color: #E3F2FD; width:300px;  text-align:center; margin:15% 30%; padding:1%; border-radius:15px; opacity: 0.7;"><h2 style="color: #052f3b; text-align:center;">[TITLE]</h2></div></div><div style=" background-color: #E3F2FD; padding: 3%;"><br><br><br>[MESSAGE]<br><br><br>Best, The Shubham-Great-Livings Accounts team <br><br> *You are receiving this email because you signed up for alerts from Shubham-Great-Livings  10 Front Street, Jersey City, NY 07302 <br><br></div><footer style="background-color: #2196F3; padding: 3px !important; margin:0px !important;color: #E3F2FD; text-align: center; padding: 2%;">&#169; 2016 Shubham-Great-Livings. All Rights Reserved.</footer></body></html>';
emailBody = emailBody.replace("[TITLE]", title);
emailBody = emailBody.replace("[MESSAGE]", "Hello "+email+"<br><br>"+message+"");
emailBody = emailBody.replace("[SIGNATURE]", 'By Shubham Yeole');

 var mailOptions={
        from : "shubham20.yeole@gmail.com",
        to : email,
        subject : subject,
        text : "Your Text",
        html : emailBody,
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
      if(error) console.log(error);
      else console.log(response);
    });
}

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// body parser middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)));
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
var notifications = null;

app.use(function(req, res, next) {
  if (req.session && req.session.users) {
    db.users.findOne({ email: req.session.users.email }, function(err, users) {
      if (users) {
    db.notification.find({useremail: req.session.users.email}).skip(0).sort({_id: -1}).limit(100).toArray(function (err, notifications1) {
          req.users = users;
          req.notifications = notifications;
          delete req.users.password; // delete the password from the session
          req.session.users = users;  //refresh the session value
          res.locals.users = users;
          notifications = notifications1;  //refresh the session value
          notifications = notifications1;
          next();
        });
      }
    });
  } else {
    var users = {
              fullname: 'Anonymous',
              email: 'N/A',
              phone: 'N/A',
              date: 'N/A',
              website: 'N/A',
              password: 'N/A',
              fbid: 'N/A',
              gender: 'N/A',
              photo: 'N/A',
              type: 'N/A',
            }
      res.locals.users = users;

    next();
  }
});
app.use(function(req, res, next){
  res.locals.errors = null;
  next();
})

// Express Validator
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
var errmsg = "Computer Science Project";

var fs = require('fs');
var S3FS = require('s3fs');

var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();
app.use(multipartyMiddleware);
    app.use(function(req, res, next){
      fs.appendFile('logs.txt', req.path + "token:" + req.query.access_token+'', 
        function(err){
          next();
        });
  });


function requireLogin (req, res, next) {
  if (!req.users) {
      res.render("message.ejs",{status: 'a', message: 'Sorry... Login required.', link: ''});
  } else {
    next();
  }
};

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

var dd = new Date();
var currentdate = dd.getMonth()+" / "+dd.getDate()+" / "+dd.getFullYear()+" at "+dd.getHours()+":"+dd.getMinutes();

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.get('*', function(req, res) {
  res.send('<img src="images/404.jpg" width="100%" height="100%">');
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("404.ejs");
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

      
// ************************************* LOGIN ADD REGISTER *************************************************

app.get('/', function(req, res){       
  db.property.find({}).skip(0).sort({timestamp: -1}).limit(9).toArray(function (err, docs) {
    res.render("index.ejs",{property: docs, notifications: notifications});
  })
});
app.get('/registerlogin', function(req, res){

   res.render("signupin.ejs", {errmsg: ""});
 
});

app.get('/logout/', function(req, res) {
  req.session.reset();
  res.redirect('/');
});


app.post('/loginwithfacebook', function(req, res){
var datetime = new Date();
 db.users.findOne({ email: req.body.email }, function(err, users) {
    if (!users) {      
         var newUser = {
          fullname: req.body.firstname,
          email: req.body.email,
          phone: req.body.phone,
          date: datetime,
          website: "N0 Website",
          password: "password",
          gender: 'male',
          photo: req.body.photo,
          type: 'user',
        }
        db.users.insert(newUser, function(err, result){
          if(err){console.log(err);}
          req.session.users = result;
          res.redirect("/postadd");
        // res.render("message.ejs",{property: "REGISTERED", status: 'registered', message: 'Congratulations. Your are successfully Logged in using facebook...', link: '<a href="/propertiesbymaps">Click me to view our properties by google map...</a>'});
        });
     } else {
        req.session.users = users;
        res.redirect("/postadd");
        // res.render("message.ejs",{property: "REGISTERED", status: 'registered', message: 'Congratulations. Your are successfully Logged in using facebook...', link: '<a href="/propertiesbymaps">Click me to view our properties by google map...</a>'});
      }
  });
});
app.post('/adduser', function(req, res){
var datetime = new Date();
var email = req.body.email;
 db.users.findOne({ email: req.body.email }, function(err, users) {
    if (!users) {
      var file = req.files.file;
      var c = new Client();
      c.on('ready', function() {
        c.put(file.path, 'htdocs/public_html/user/'+req.body.photoname, function(err) {
          if (err) throw err;
          c.end();
        });
      });
      // connect to localhost:21 as anonymous 
      c.connect(config);
      var photoUrl = 'http://shubhamyeole.byethost8.com/public_html/user/'+req.body.photoname;
      // console.log(photoUrl);
      var newUser = {
      fullname: req.body.firstname,
      email: req.body.email,
      phone: req.body.phone,
      date: datetime,
      website: req.body.website,
      password: req.body.password,
      gender: req.body.gender,
      photo: photoUrl,
      subscription: '0',
      addallowed: '20',
      addposted: '0',
      poststatus: 'true',
      type: 'user',
    }
    sendEmail(req.body.email, "REGISTERED SUCCESSFULLY to Shubham-Great-Livings", "REGISTERED SUCCESSFULLY", "Thank you for choosing our services... We appreciate your bussiness and time to register to our website...");
    db.users.insert(newUser, function(err, result){
      if(err){console.log(err);}
      req.session.users = newUser;
      setTimeout(function(){ 
        res.redirect("/postadd");
      }, 5000);
    });
  } else {res.render("message.ejs",{property: "REGISTERED", status: 'registered', message: 'Sorry. We are currently unable to register you to our system. Your are already registered...', link: '<a href="/propertiesbymaps">Click me to view our properties by google map...</a>'});}
  });
});

app.post('/updatedp', function(req, res){       
  var file = req.files.file;
  var filepath = file.path;
  var timestamp = new Date().valueOf();
  var dd = new Date();
  var currentdate = dd.getMonth()+1+"/"+dd.getDate()+"/"+dd.getFullYear()+" at "+dd.getHours()+":"+dd.getMinutes();
  var c = new Client();
    c.on('ready', function() {
      c.put(file.path, 'htdocs/public_html/user/'+"shubham-"+timestamp+"-"+file.originalFilename, function(err) {
        if (err) throw err;
         c.end();
        });
   });
   c.connect(config);
   var url = 'http://shubhamyeole.byethost8.com/public_html/user/'+"shubham-"+timestamp+"-"+file.originalFilename;
   var newNotification = {
          user: req.session.users._id,
          username: req.session.users.fullname,
          useremail: req.session.users.email,
          action: 'Profile picture Changed',
          noteimage: url,
          dateField: currentdate,
          message: "Image successfully changed"
        }
  setNotification(newNotification);
   db.users.update({ email: req.session.users.email}, {$set:{photo: url}}, function (err, result) {
      setTimeout(function(){ 
        res.redirect("/profile/0");
      }, 5000);    
    });
});





app.post('/login', function(req, res) {
  db.users.findOne({ email: req.body.email }, function(err, users) {
    if (!users) {
      // console.log(req.body.email);
      errmsg = 'Email not registered... Please try again or Signup to use our services. Thank you.'; 
         res.render("signupin.ejs", {errmsg: errmsg});
    } else {
      if (req.body.password === users.password) {
        // sets a cookie with the user's info
        req.session.users = users;
        res.redirect("/postadd");
      } else {
        errmsg = 'Incorrect Password... RESET new Password or login with facebook to use our services';
         res.render("signupin.ejs", {errmsg: errmsg});
      }
    }
  });
});

app.get('/newpassword/:id', function(req, res){
  db.users.findOne({_id: ObjectId(req.params.id)}, function (err, users) {
    res.render("setnewpassword.ejs",{users: users});
  }); 
});

app.post('/newpasswordupdate', function(req, res){
    // console.log("In newpasswordupdate method: "+req.body.email);
    var email = req.body.email;
  db.users.update({ email: req.body.email}, {$set:{password: req.body.passcode}}, function (err, result) {
    db.users.findOne({ email: req.body.email }, function(err, users) {
      req.session.users = users;
      sendEmail(req.body.email, "Password Reset", "SUCCESSFULLY PASSWORD RESETTED ON Shubham-Great-Livings", "Your password is successfully resetted at Shubham-Great-Livings. If you have not done this action please let us know at shubham20.yeole@gmail.com. Click the button below to visit our platform. <br><br><a href='https://shubham-great-livings.herokuapp.com/' target='_blank'>HOME</a><br><br>");
      res.render("message.ejs",{property: "REGISTERED", status: 'registered', message: 'Password reset successful.', link: '<a href="/propertiesbymaps">Click me to view our properties by google map...</a>'});
    });
  });
});

app.post('/resetpassword', function(req, res) {
    var email = req.body.email;
     db.users.findOne({ email: req.body.email }, function(err, users) {
    if (!users) {
      errmsg = 'Email not registered...'; 
      res.render("signupin.ejs", {errmsg: errmsg});
    } else {
      db.users.update({ email: req.body.email}, {$set:{password: "temppassword"}}, function (err, result) {
      sendEmail(email, "Password reset on Shubham-Great-Livings", "Password Reset", "<br>We received a request to reset the password for your account.<br> If you requested a reset for "+email+", <br>click the button below. <br><br><a style='padding: 1%; background-color: #6a67ce; color: #e1e0f5;' href='https://shubham-great-livings.herokuapp.com/newpassword/"+users._id+"' target='_blank'>SET NEW PASSWORD</a><br><br>e this email.Please click on Use temporary password as temppassword");
      res.render("signupin.ejs", {errmsg: "Temporary password has been sent to "+email+". Please check your email to reset new password."});
    });
    }
  });
});
// ************************************* ADMIN *************************************************


app.get('/admin', function(req, res){
  var user = req.session.users;

 if(user==null){
  res.render("message.ejs",{status: 'a', message: 'Sorry... Login required.', link: ''});
  }else{
    if(user.type=='user'){
      res.render("message.ejs",{status: 'a', message: 'Sorry... You are not a admin...', link: ''});
    }else{
      db.users.find({type: 'user'}).skip(0).sort({}).limit(9).toArray(function (err, user) {
        db.users.find({type: 'admin'}).skip(0).sort({}).limit(9).toArray(function (err, admin) {
        db.property.find({}).skip(0).sort({}).limit(100).toArray(function (err, property) {
          db.messages.find({to: "admin"}).skip(0).sort({}).limit(100).toArray(function (err, messages) {
            // console.log(user.length)
            res.render("admin.ejs",{user: user, admin: admin, property: property, messages:messages});
          })
        })  
      })
    })
  }
 }
});
app.post('/admintouser', function(req, res) {
  // console.log("In admintouser: "+req.body.id);
  res.send('Ok'); 
});


// ************************************* CONTACT *************************************************

app.get('/contact', function(req, res){  
var pageno = Number(0);  
  db.property.find({}).skip(pageno*6).sort({timestamp: -1}).limit(100).toArray(function (err, docs) {
      res.render("contact.ejs",{property: docs, notifications: notifications});

  })
});
// app.get('/contact/', function(req, res){       
//     res.render("contact.ejs",{property: 'CONTACT'});
// });

// ************************************* PROPERTIES *************************************************


app.get('/properties/:id', function(req, res){  
var pageno = Number(req.params.id);  
  db.property.find({}).skip(pageno*6).sort({timestamp: -1}).limit(6).toArray(function (err, docs) {
    db.property.count(function(err, count) {
      var status = 'Showing '+(pageno*6+1)+' to '+(pageno*6+6)+' of '+count+' Properties';
      // console.log(status);  
     db.property.find({}).skip(0).sort({timestamp: -1}).limit(5).toArray(function (err, latestproperty) {
    res.render("properties.ejs",{property: docs, count: count, pageno: pageno+1, status: status, latestproperty: latestproperty, notifications: notifications});
    })    
    })
  })
});
app.get('/gallery/:id', function(req, res){  
var pageno = Number(req.params.id);  
  db.property.find({}).skip(pageno*6).sort({timestamp: -1}).limit(6).toArray(function (err, docs) {
    db.property.count(function(err, count) {
      var status = 'Showing '+(pageno*6+1)+' to '+(pageno*6+6)+' of '+count+' Properties';
      // console.log(status);  
      res.render("gallery.ejs",{property: docs, count: count, pageno: pageno+1, status: status, notifications: notifications});
    })
  })
});
app.get('/propertiesbymaps', function(req, res){  
var pageno = Number(0);  
  db.property.find({}).skip(pageno*6).sort({timestamp: -1}).limit(100).toArray(function (err, docs) {
    db.property.count(function(err, count) {
      var status = 'Showing '+(pageno*6+1)+' to '+(pageno*6+6)+' of '+count+' Properties';
      // console.log(status);  
      res.render("propertiesbymaps.ejs",{property: docs, count: count, pageno: pageno+1, status: status, notifications: notifications});
    })
  })
});
app.get('/propertiesbymaps2', function(req, res){  
var pageno = Number(0);  
  db.property.find({}).skip(pageno*6).sort({timestamp: -1}).limit(100).toArray(function (err, docs) {
    db.property.count(function(err, count) {
      var status = 'Showing '+(pageno*6+1)+' to '+(pageno*6+6)+' of '+count+' Properties';
      // console.log(status);  
      res.render("propertiesbymaps2.ejs",{property: docs, count: count, pageno: pageno+1, status: status, notifications: notifications});
    })
  })
});


// ************************************* PROFILE *************************************************








app.get('/profile/:id', function(req, res){  
var user = req.session.users;
var pageno = Number(req.params.id);  
if(user==null){
  res.render("message.ejs",{status: 'a', message: 'Sorry... Login required.', link: ''});
}else{
    db.notification.find({useremail: req.session.users.email}).skip(pageno*5).sort({_id: -1}).limit(100).toArray(function (err, timeline) {
      db.notification.find({useremail: req.session.users.email}).count(function(err, count) {
        db.bookmark.find({email: req.session.users.email}).skip(0).sort({timestamp: -1}).limit(100).toArray(function (err, bookmark_a) {
          db.property.find({useremail: req.session.users.email}).skip(0).sort({timestamp: -1}).limit(100).toArray(function (err, pastproperty) {
            db.messages.find({to: req.session.users.email}).skip(0).sort({_id: -1}).limit(100).toArray(function (err, messages) {
            var status = 'Showing '+(pageno*1+5)+' to '+(pageno*1+5)+' of '+count+' Properties';
            res.render("profile.ejs", {property: '', timeline:timeline, bookmark_a: bookmark_a, pastproperty: pastproperty, messages: messages, notifications: notifications});
            })
          })
        })     
      })
    })
  }
});

app.post('/removebookmark', function(req, res) {
  var timestamp = req.body.timestamp;
  // console.log("Removebookmark id: "+timestamp);
  db.bookmark.remove({timestamp: timestamp, email: req.session.users.email}, function(err, result) {
    if (err) {
      console.log("Error Occured: "+err);
    }
    // console.log(result);
    res.send("ok");
  });
});

app.post('/removeproperty', function(req, res) {
  var timestamp = req.body.timestamp;
  // console.log("Removebookmark id: "+timestamp);
  db.property.remove({timestamp: timestamp}, function(err, result) {
    if (err) {
      console.log("Error Occured: "+err);
    }
    // console.log(result);
    res.send("ok");
  });
});

app.post('/sendemailtoadmin', function(req, res) {
  var comment = req.body.comment;
  // console.log("Removebookmark id: "+comment);
  var date = new Date();
  var datetime = date.getMonth()+" / "+date.getDate()+" / "+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes();
        
  var newmessage = {
    from: req.session.users.email,
    to: 'admin',
    subject: 'Customer message',
    message: comment,
    messageat: datetime,
  }

  db.messages.insert(newmessage, function(err, result){
    if(err){
      console.log(err);
    }else{
      sendEmail("shubham20.yeole@gmail.com", "You have one message from Customer", "CUSTOMER ASSISTANCE", "Below is the message from "+req.session.users.fullname+"<br><br>"+comment+"<br><br>");
      sendEmail(req.session.users.email, "SUCCESSFULLY SENT EMAIL TO ADMIN", "SUCCESSFULLY SENT EMAIL TO ADMIN",  "We sent your message to admin. Below is your message<br><br>"+comment+"<br><br>");
      res.send("ok");
   }
  });
});


// ************************************* POST ADD *************************************************

app.get('/postadd', function(req, res){
  var property = "";
    db.property.find({}).skip(0).sort({timestamp: -1}).limit(5).toArray(function (err, latestproperty) {
      res.render("postadd.ejs",{property: "latestproperty", latestproperty: latestproperty, notifications: notifications});  
  });
});
app.post('/postproperty/', function(req, res){
      var d = new Date();
      var datetime = d.getMonth()+" / "+d.getDate()+" / "+d.getFullYear()+" at "+d.getHours()+":"+d.getMinutes();
      var file = req.files.file;
      var filename = req.body.filename;
      var filelinks = req.body.filelinks;
      var propertyphoto = "";
      var allphoto = "";
      var c = new Client();
      // console.log(file.length);
      c.on('ready', function() {
         for(i=0; i<file.length; i++){
          var imageToDB = 'http://shubhamyeole.byethost8.com/public_html/property/'+filename[i];
            c.put(file[i].path, 'htdocs/public_html/property/'+filename[i], function(err) {
                if (err) throw err;
                else{ }
            });
          }
        c.end();
      });
      // connect to localhost:21 as anonymous 
      c.connect(config);
      for(i=0; i<filename.length; i++){
        var imageToDB = 'http://shubhamyeole.byethost8.com/public_html/property/'+filename[i];
        // console.log('imageToDB: '+imageToDB);
        allphoto = allphoto + " "+imageToDB;
        var newImage = { timestamp: req.body.timestamp, image: imageToDB };
        db.images.insert(newImage, function(err, imageResult){
          if(err){console.log(err);
          }else{
            // console.log("Actuallink: "+imageToDB+", SavedLink: "+imageResult.image);
          }
        });
      }
      var address
      if(req.body.city == " "){
        address = req.body.staddress;
      }else{
        address = req.body.staddress+", "+req.body.city+", "+req.body.state+", "+req.body.zip+", "+req.body.county+", "+req.body.country;
      }
      
      // console.log("propertyphoto: "+propertyphoto+", allphoto: "+allphoto);
      // console.log(req.body.propertyfeatures);
        var newProperty = {
          user: req.session.users._id,
          username: req.session.users.fullname,
          useremail: req.session.users.email,
          title: req.body.title,
          phone: req.body.phone,
          email: req.body.email,
          telephone: req.body.telephone,
          staddress: req.body.staddress,
          timestamp: req.body.timestamp,
          addToSearch: address.toLowerCase(),
          fulladdress: address,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          county: req.body.county,
          country: req.body.country,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          bedroom: req.body.bedroom,
          kitchen: req.body.kitchen,
          bathroom: req.body.bathroom,
          addtype: req.body.addtype,
          propertytype: req.body.propertytype,
          features: req.body.propertyfeatures,
          area: req.body.area,
          cost: req.body.cost,
          dateField: datetime,
          discription: req.body.discription,
          flagno: 0,
          flagcomment: "",
          image1: 'http://shubhamyeole.byethost8.com/public_html/property/'+filename[0],
          allphoto: allphoto
       }
       var newNotification = {
          user: req.session.users._id,
          username: req.session.users.fullname,
          useremail: req.session.users.email,
          action: 'Property Posted',
          noteimage: 'http://shubhamyeole.byethost8.com/public_html/property/'+filename[0],
          dateField: datetime,
          message: "You successfully posted property at Shubham Shubham-Great-Livings"
        }
        setNotification(newNotification);

         db.users.findOne({ email: req.session.users.email }, function(err, users) {
            var addposted = users.addposted+1;
            var addallowed = users.addallowed;
            // console.log('addposted: '+addposted +", addallowed: "+addallowed);
            db.users.update({_id: req.session.users._id},{$set : {"addposted": addposted}},{upsert:true,multi:false});
            if(addposted>=addallowed){
            db.users.update({_id: req.session.users._id},{$set : {"poststatus": 'false'}},{upsert:true,multi:false});
            }
          });
        db.property.insert(newProperty, function(err, result){
          if(err){
            console.log(err);
          }else{
            sendEmail(req.body.email, "SUCCESSFULLY POSTED  PROPERTY TO Shubham-Great-Livings", "YOUR PROPERTY POSTED AT Shubham-Great-Livings", "Your property advertisement has been posted successfully to our website. Follow the link below to view your addvertisement...<br><br><a style='padding: 1%; background-color: #6a67ce; color: #e1e0f5;' href='https://shubham-great-livings.herokuapp.com/detailedproperty/"+result.timestamp+"' target='_blank'>Review your add</a><br><br>");
            setTimeout(function(){ 
            res.redirect('http://shubham-great-livings.herokuapp.com/detailedproperty/'+result.timestamp);
            }, 5000);
          }
      });
});

app.post('/updateproperty', function(req, res) {
  var id = req.body.id;
  var imageurl = req.body.imageurl;
  var title = req.body.title;
  var cost = req.body.cost;
  var add = req.body.add;
  var disc = req.body.disc;
  var lat = req.body.lat;
  var long = req.body.long;
  var features = req.body.features;
  var email = req.body.email; 
  var phone = req.body.phone; 
  var bedroom = req.body.bed; 
  var bathroom = req.body.bath; 
  var kitchen = req.body.kitchen; 
  var addtype = req.body.atype; 
  var propertytype = req.body.ptype; 
  var area = req.body.area;
  // console.log(id+", "+title+", "+features);
  db.property.update({timestamp: id},{$set : {title: title, cost: cost, fulladdress: add, addToSearch: add.toLowerCase(), discription:disc, features: features, latitude: lat, longitude: long, email:email, phone:phone, bedroom:bedroom, kitchen:kitchen, bathroom:bathroom, addtype:addtype, propertytype:propertytype,area:area }},{upsert:true,multi:false});
  
  var newNotification = {
    user: req.session.users._id,
    username: req.session.users.fullname,
    useremail: req.session.users.email,
    action: 'Property Update',
    noteimage: imageurl,
    dateField: currentdate,
    message: "Property updated successfully",
    excessMsg: "",
    status: 'private'
  }
  setNotification(newNotification);

  res.send("ok");
});

app.post('/bookmark', function(req, res) {
  var email = req.body.email;
  var timestamp = req.body.timestamp;
  var imageurl = req.body.imageurl;
  var title = req.body.title;
  var cost = req.body.cost;
  var newBookmark = {
    email: email, timestamp: timestamp, image: imageurl, title: title, cost: cost,
    propertyurl: 'https://shubham-great-livings.herokuapp.com/detailedproperty/'+timestamp
  }

 db.bookmark.findOne({timestamp: timestamp, email: email}, function(err, check){
    if(!check){ 
      db.bookmark.insert(newBookmark, function(err, result){
        // if(err){ console.log("ERROR OCCURED: "+err);}
        //   else{ console.log("BOOKMARK SAVED: ");}
          res.send("save");
      });
    }
      else{ res.send("notsave");}
  });
});



function setNotification(newNotification){
  db.notification.insert(newNotification, function(err, result){
    // if(err){ console.log("ERROR OCCURED: "+err);}
    //   else{ console.log("NOTIFICATION SAVED: ");}
  });
}


// ************************************* SEARCH *************************************************


 



app.post('/search', function(req, res) {
  var loc = req.body.location;
  // console.log(loc);
   db.property.find({ addToSearch: {'$regex': loc} }, function (err, property) {
    res.send(property);
  });
});

app.post('/searchproperty', function(req, res) {
  var timestamp = req.body.timestamp;
  // console.log(timestamp);
   db.property.findOne({ timestamp: timestamp}, function (err, property) {
    res.send(property);
  });
});


app.get('/detailedproperty/:id', function(req, res){
    // console.log("In get comment method: "+req.params.id);
 
  db.property.findOne({ timestamp: req.params.id}, function (err, property) {
      db.property.find({}).skip(0).sort({timestamp: -1}).limit(5).toArray(function (err, latestproperty) {
         db.images.find({ timestamp: req.params.id}, function (err, images) {
          res.render("detailedproperty.ejs",{property: property, latestproperty: latestproperty, images: images, notifications: notifications});
        }) 
     })      
  });
});

app.post('/detailedproperty/sendinterestinproperty', function(req, res){
  var name = req.body.name;
  var emailofposter = req.body.emailofposter;
  var email = req.body.email;
  var dateodmovein = req.body.dateodmovein;
  var timestamp = req.body.timestamp;
  var propertyaddress = req.body.propertyaddress;
  
  var description = req.body.personaldiscription;
  var title = name+" is interested in your property at Shubham-Great-Livings";
  var message = "<br><br><span style='color: #4f4e56;'>"+name+"</span> can move in from: <span style='color: #4f4e56;'>"+dateodmovein+"</span><br><br>Moreover, "+name+" also left a message for you. Here it is: <br><br><span style='color: #4f4e56;'>"+description+"</span><br><br>You can reach back to <span style='color: #4f4e56;'>"+name+"</span> at <span style='color: #4f4e56;'>"+email+"</span> email address <br><br>Thank you for using our service.<br><br>";
  var subject = name+" is interested in your property at Shubham-Great-Livings";

  var description1 = req.body.personaldiscription;
  var title1 = "Confirmation of your interest";
  var message1 = "<br><br>It looks like you have shown interest in <span style='color: #4f4e56;'>"+propertyaddress+"</span> and we have successfully sent your thoughts to owner of mentioned property. You will here back soon if property owner is statisfied with your mentioned Quote<br><br>Thank you for using our service. ";
  var subject1 = "Shubham-Great-Livings sent your message to property owner";

  sendEmail(emailofposter, subject, title, message);
  sendEmail(email, subject1, title1, message1);
     res.redirect('/');
});

// ************************************* MESSAGE *************************************************







app.get('/message', function(req, res){
  res.render("message.ejs",{status: 'addpost', message: 'Congratulations. Your add is posted successfully...', link: '<a href="/detailedproperty/">Click me to view your post</a>'});
});

app.get('/workinprogress', function(req, res){
  res.render("message.ejs",{status: 'd', message: 'WORK IN PROGRESS. Sorry for any inconvenience caused', link: '<a href="/detailedproperty/">Click me to view your post</a>'});
});






app.post('/contactme', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var comment = req.body.comment;
  var currentUser = req.session.users;
  var d = new Date();
  var datetime = d.getMonth()+" / "+d.getDate()+" / "+d.getFullYear()+" at "+d.getHours()+":"+d.getMinutes();
      
  if(currentUser!=null){
    var newNotification = {
          user: req.session.users._id,
          username: req.session.users.fullname,
          useremail: req.session.users.email,
          action: 'Emailed Admin',
          noteimage: 'http://www.freeiconspng.com/uploads/email-icon-2.jpg',
          dateField: datetime,
          message: "You successfully emailed to ADMIN of Shubham-Great-Livings.",
          excessMsg: "SUBJECT: "+subject+", MESSAGE: "+comment,
          status: 'private'
        }
        setNotification(newNotification);
      }
    // console.log("In newpasswordupdate method: "+req.body.email);
    sendEmail('shubham20.yeole@gmail.com', ""+name+" contacted you via Shubham-Great-Livings", name+" contacted you through your Rental application", "<h1>"+name+" | "+email+" message...<br><br>"+comment+"</h1>");
    sendEmail(email, "CONTACT ME", "THANK YOU FOR CONTACTING Shubham-Great-Livings","We successfully received your message. We will be back soon as soon as possible");
    res.render("message.ejs",{status: 'addpost', message: 'Congratulations. Your email was sent to Owner of Shubham-Great-Livings. We will get back to you as soon as possible. Thank you for your time and using our services.', link: '<a href="/contact">Go Back</a>'});
});
app.get('/paypal', function(req, res) {
  res.render('paypal.ejs');
});

app.get('/timetable', function(req, res){
  res.render("timetableNew.ejs");
});


app.post('/submitnewtimetable', function(req, res){
  var timetablename = req.body.timetablename;
  var category = req.body.category;
  var from = req.body.from;
  var to = req.body.to;
  var timestamp = new Date().valueOf();
  var newTimetable = {
    timestamp: timestamp,
    timetablename: timetablename,
    status: "no",
    percent: 0,
    totalquestions: 0,
    solvedquestions: 0,
    totalcategories: category.length,
  }
  // console.log(category);
    if(category.length == 0){
      // console.log(splitDate(from));
    }else{
      db.timetable.insert(newTimetable, function(err, result){
       if(err){console.log(err);}
       else{ 
        // console.log("Category Saved successfully"); 
        for(i=0; i<category.length;i++){
        // console.log(splitDate(from[i]));
        var timetableid = ""+result._id+"";
        var newCategoty = {
            timetableid: timetableid,
            timestamp: timestamp,
            uniqueid: timestamp+"-cat-"+i,
            category: category[i],
            totalquestions: 0,
            timetablename: timetablename,
            solvedquestions: 0,
            totalcategories: category.length,
            from: splitDate(from[i]),
            to: splitDate(to[i]),
            status: "no",
            percent: 0,
          }
            db.timetablecategory.insert(newCategoty, function(error, result2){
                if(error){console.log(error);}
                else{ 
                  // console.log("Category Saved successfully"); 
                }
            });
          }
        }
      }); 
    }
    setTimeout(function(){ 
     res.redirect('/managecategories/'+timestamp);
    },550);
});



app.get('/timetableall', function(req, res){
  db.timetable.find(function (err, timetable) {
    res.render("timetableall.ejs", {timetable:timetable});
  });
});


app.get('/managecategories/:id', function(req, res){
  db.timetablecategory.find({timestamp: Number(req.params.id)}).skip(0).sort({}).limit(100).toArray(function (err, timetable) {
    db.timetable.findOne({timestamp: Number(req.params.id)}, function (err, timetablename) {
      res.render("timetablemanagecategories.ejs", {timetable:timetable, timetablename:timetablename});
    });
  });
});

app.post('/addnewcategory', function(req, res){
  var newcategory = {
          timetableid: req.body.timetableid,
          timestamp: Number(req.body.timestamp),
          uniqueid: req.body.uniqueid,
          category: req.body.category,
          totalquestions: Number(req.body.totalquestions),
          timetablename:req.body.timetablename,
          solvedquestions: Number(req.body.solvedquestions),
          totalcategories:Number(req.body.totalcategories),
          category: req.body.category,
          from: req.body.from,
          to: req.body.to,
          status: req.body.status,
          percent: Number(req.body.percent)
        }
  // console.log(newcategory);
  // db.timetablecategory.update({uniqueid: catuniqueid},{$set : {totalquestions: questionnumber}},{upsert:true,multi:false});
  db.timetable.update({timestamp: Number(req.body.timestamp)},{$inc : {'totalcategories': 1}},{upsert:false,multi:false});
  db.timetablecategory.update({timestamp: Number(req.body.timestamp)},{$inc : {'totalcategories': 1}},{upsert:false,multi:true});
  db.timetablecategory.insert(newcategory, function(error, result2){
    if(error){console.log(error);}
    else{res.send("ok");}
  });
// UPDATE TOTAL CATEGORIES OF TIMETABLE COLLECTION
// UPDATE TOTAL CATEGORIES OF TIMETABLE CATEGORY COLLECTION

});

app.post('/addquestion', function(req, res){

  var catuniqueid = req.body.catuniqueid ;
  var queuniqueid = req.body.queuniqueid ;
  var cattimestamp = req.body.timestamp ;
  var quetimestamp = new Date().valueOf();
  var question = req.body.question ;
  var timetableid = req.body.timetableid ;
  var categoryname = req.body.categoryname ;
  var totalquestions = req.body.totalquestions ;
  db.timetablecategory.findOne({ uniqueid: catuniqueid }, function(err, category) {
  var questionnumber = Number(category.totalquestions)+1;
  db.timetablecategory.update({uniqueid: catuniqueid},{$set : {totalquestions: questionnumber}},{upsert:true,multi:false});

  var newQuestion = {
    timetableid: timetableid,
    categoryname: categoryname,
    question: question,
    cattimestamp: cattimestamp,
    catuniqueid: catuniqueid,
    quetimestamp: quetimestamp,
    queuniqueid: queuniqueid+"-"+questionnumber,
    questionnumber: questionnumber,
    answer: 'NO SOLUTION HAS BEEN PROVIDED',
    status: 'no'
  }
    db.timetablequestion.insert(newQuestion, function(err, result){
      setTimeout(function(){

     if(err){console.log(err);}
      db.timetablequestion.find({catuniqueid: catuniqueid}, function (err, catego) {
        var total = 0;
        for(i=0;i<catego.length;i++){
          if(catego[i].status == 'yes') {
            total = total + 1;
          }
        }
      var percent = Math.round((total/catego.length) * 100);
        db.timetablecategory.update({uniqueid: catuniqueid},{$set : {percent: percent}},{upsert:true,multi:false});
        db.timetable.update({timestamp: Number(req.body.timestamp)},{$inc : {'totalquestions': 1}},{upsert:true,multi:true});
        db.timetable.findOne({timestamp: Number(req.body.timestamp)},function (err, elem) {
          var percentcalculation = Math.round((elem.solvedquestions/elem.totalquestions)*100);
          db.timetable.update({timestamp: Number(req.body.timestamp)},{$set: {percent: percentcalculation}});
        });
        // console.log(cattimestamp);
        res.send('ok');
        });
     });
     },1000); 
  });
});

app.post('/getquestion', function(req, res){
  var uniqueid = req.body.uniqueid ;
  db.timetablequestion.find({catuniqueid: uniqueid}).skip(0).sort({quetimestamp: -1}).limit(40).toArray(function (err, questions) {
    res.send(questions);
  });
});


app.post('/updatequeanswer', function(req, res){
  // console.log();
  var queuniqueid = req.body.queuniqueid ;
  var answer = req.body.answer ;
  var question = req.body.question ;

    db.timetablequestion.update({queuniqueid: queuniqueid},{$set : {question: question}},{upsert:true,multi:false});
    db.timetablequestion.update({queuniqueid: queuniqueid},{$set : {answer: answer}},{upsert:true,multi:false});
    res.send('okay');
});

app.post('/postanswer', function(req, res){
  var queuniqueid = req.body.queuniqueid ;
  var answer = req.body.answer ;
  var catuniqueid = req.body.catuniqueid ;
    db.timetablequestion.update({queuniqueid: queuniqueid},{$set : {status: 'yes'}},{upsert:true,multi:false});
    db.timetablequestion.update({queuniqueid: queuniqueid},{$set : {answer: answer}},{upsert:true,multi:false});
    setTimeout(function(){
       db.timetablequestion.find({catuniqueid: catuniqueid}, function (err, catego) {
        var total = 0;
        for(i=0;i<catego.length;i++){
          if(catego[i].status == 'yes') {
            total = total + 1;
          }
        }
      var percent = Math.round((total/catego.length) * 100);
      // console.log("PERCENT: "+catuniqueid+"%");
      var resee = catuniqueid.split("-");
    db.timetable.update({timestamp: Number(resee[0])},{$inc : {'solvedquestions': 1}},{upsert:true,multi:true});
    db.timetablecategory.update({uniqueid: catuniqueid},{$set : {percent: percent}},{upsert:true,multi:false});
    setTimeout(function(){
      db.timetable.findOne({timestamp: Number(resee[0])},function (err, elem) {
        var reseew = catuniqueid.split("-");
        var percentcalculation = Math.round((elem.solvedquestions/elem.totalquestions)*100);
        db.timetable.update({timestamp: Number(reseew[0])},{$set: {percent: percentcalculation}});
      });
      },1000); 
    res.send('ok');
    });
    },1000);   
});


app.get('/managequestions/:id', function(req, res){
  db.timetablecategory.find({timestamp: req.params.id}).skip(0).sort({timestamp: -1}).limit(10).toArray(function (err, timetable) {
    res.render("timetablemanagequestions.ejs", {timetable:timetable});
  });
});

app.get('/readonly/:id', function(req, res){
  db.timetablecategory.find({timestamp: req.params.id}).skip(0).sort({timestamp: -1}).limit(10).toArray(function (err, timetable) {
    res.render("timetablereadonly.ejs", {timetable:timetable});
  });
});

app.get('/updatetimetable', function(req, res){
  res.render("timetableUpdate.ejs");
});



function splitDate(str) {
    var res = str.split("-");
    var tdate = new Date();
    var month = "";
    if(res[1] == 1) month = "Jan";
    if(res[1] == 2) month = "Feb";
    if(res[1] == 3) month = "Mar";
    if(res[1] == 4) month = "Apr";
    if(res[1] == 5) month = "May";
    if(res[1] == 6) month = "June";
    if(res[1] == 7) month = "July";
    if(res[1] == 8) month = "Aug";
    if(res[1] == 9) month = "Sept";
    if(res[1] == 10) month = "Oct";
    if(res[1] == 11) month = "Nov";
    if(res[1] == 12) month = "Dec";

    // var saveDate = res[2]+" / "+month+" / "+res[0];
    var saveDate = res[2]+" / "+month;
    return saveDate;
}

app.post('/addloc', function(req, res){
var date = new Date();
var datetime = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes();
var long = req.body.long;
var lat = req.body.lat;
var whatdone = req.body.task;
var lat_1 = Number(lat)-0.000203;
var lat_2 = Number(lat)+0.000203;
var long_1 = Number(long)-0.00070989999;
var long_2 = Number(long)+0.00070989999;     
db.locations.findOne({
       $and : [
          { $and : [ { lat : { $gt: lat_1} }, { lat : { $lt: lat_2} } ] },
          { $and : [ { long: { $gt: long_1} }, { long : { $lt: long_2} } ] }
      ]
      }, function(err, location) {
      if (!location) {
        var newLoc = {
          visittime: 1,
          re_c: 1,
          tt_c: 0,
          bb_c: 0,
          rs_c: 0,
          mm_c: 0,
          re_task: whatdone+" ("+datetime+")",
          tt_task: "",
          bb_task: "",
          rs_task: "",
          mm_task: "",
          long: Number(long),
          lat: Number(lat)
        }
        db.locations.insert(newLoc, function(err, result){
        if(err){console.log(err);}
        res.send("INSERTED");
        });
      }else {
        var count = location.visittime+1;
        var cc = location.re_c+1;
        whatdone = whatdone+" ("+datetime+"),"+location.re_task;
        db.locations.update({_id: location._id},{$set : {"visittime": count, "re_c": cc, "re_task": whatdone}},{upsert:true,multi:false});
        res.send("UPDATED: "+count);
      }
  });
});

app.post('/addloc2', function(req, res){
var date = new Date();
var datetime = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes();
var long = req.body.long;
var lat = req.body.lat;
var whatdone = req.body.task;
var lat_1 = Number(lat)-0.000203;
var lat_2 = Number(lat)+0.000203;
var long_1 = Number(long)-0.00070989999;
var long_2 = Number(long)+0.00070989999;     
db.locations.findOne({
       $and : [
          { $and : [ { lat : { $gt: lat_1} }, { lat : { $lt: lat_2} } ] },
          { $and : [ { long: { $gt: long_1} }, { long : { $lt: long_2} } ] }
      ]
      }, function(err, location) {
      if (!location) {
        var newLoc = {
          visittime: 1,
          re_c: 0,
          tt_c: 1,
          bb_c: 0,
          rs_c: 0,
          mm_c: 0,
          re_task: "",
          tt_task: whatdone+" ("+datetime+")",
          bb_task: "",
          rs_task: "",
          mm_task: "",
          long: Number(long),
          lat: Number(lat)
        }
        db.locations.insert(newLoc, function(err, result){
        if(err){console.log(err);}
        res.send("INSERTED");
        });
      }else {
        var count = location.visittime+1;
        var cc = location.tt_c+1;
        whatdone = whatdone+" ("+datetime+"),"+location.tt_task;
        db.locations.update({_id: location._id},{$set : {"visittime": count, "tt_c": cc, "tt_task": whatdone}},{upsert:true,multi:false});
        res.send("UPDATED: "+count);
      }
  });
});

app.listen(port, function() {
  console.log('SHUBHAM GREAT LIVING RUNNING ON: http://localhost:' + port)
});

var date = new Date();
var datetime = date.getMonth()+1+"/"+date.getDate()+"/"+date.getFullYear()+" at "+date.getHours()+":"+date.getMinutes();

console.log(datetime);