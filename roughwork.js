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