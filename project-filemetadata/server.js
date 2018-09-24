'use strict';
const express = require('express')
const cors = require('cors')
const app = express()
const multer = require('multer')
const bodyParser = require('body-parser')
const fs =require('fs')
const ip=require('ip')


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });
  //the location that the data upload
  var upload = multer({ dest: "uploads/" });
  app.post("/api/fileanalyse", upload.single("upfile"), function(req, res, next) {
    var upfile = req.file;
   if(req.file == null)
    {
      res.json({ error: "Please select a file." });
    }
    else {
      console.log('file uploaded');
      var data = {
        name: upfile.originalname,
        type: upfile.mimetype,
        size: upfile.size
      };
      //delete the data from the server
        fs.unlink(upfile.path, function () {
                console.log("Deleted file: " + req.file.path);
            });
    return res.json(data);
    }
  });
  //catch all 404 errors and pass to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  //error handlers
  //development error handler will print stacktrace
  if(app.get('env') === 'development'){
    app.use(function(err, req, res, next){
      if (!res.headersSent) { //if the headers are not already sent then set them
        res.status(err.status || 500);
      }
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }
  //production error handler will hide stacktrace
  app.use(function(err, req, res, next) {
    if (!res.headersSent){
      res.status(err.status || 500);
    }
    res.render('error', {
      message: err.message,
      error: null
    });
  });
//app's listener
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('App is starting...')//app starts
  console.log('Port:' + listener.address().port+'\t'+ 'IP:' +ip.address())// port and ip address of host
})
