const express = require('express')
const app = express()
const port = 4000
var bodyParser = require('body-parser')






var multer = require('multer')
var storage = multer.diskStorage(
  {
      destination: '../database/public/uploads/',
      filename: function ( req, file, cb ) {
          //req.body is empty...
          //How could I get the new_file_name property sent from client here?
          cb( null, file.originalname );
      }
  }
);

var upload = multer( { storage: storage } );

app.post('/upload', upload.any(), function(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  console.log(req.files)


  res.send(req.files)

})

const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());


app.post('/preprocess', function(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  var spawn = require("child_process").spawn; 
  

  console.log(req.body)

  var process = spawn('python',["./preprocess.py", 
                          "-i./../database/public/uploads/"+req.body.fname ] ); 

  process.stdout.on('data', function(data) { 
    res.send(data.toString())
    console.log(data.toString()); 
  } ) 

  process.stderr.on('data', (data) => {
    res.send(null)
    console.error(`stderr: ${data}`);
  });


})


app.post('/newtemplate', function(req, res) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  

  console.log(req.body)

  let rawdata = fs.readFileSync('../database/templates.json');
  let templates_lis = JSON.parse(rawdata);

  templates_lis = [...templates_lis,{
    name : req.body.fname,
    data_points : req.body.regions
  }]


  const data = JSON.stringify(templates_lis, null, 4);

  // write JSON string to a file
  fs.writeFile('../database/templates.json', data, (err) => {
      if (err) {
          throw err;
      }
      console.log("JSON data is saved.");
  });


  res.send({status : true})


})

app.get('/template_count', (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  let rawdata = fs.readFileSync('../database/templates.json');
  let templates_lis = JSON.parse(rawdata);
  console.log(templates_lis);

  console.log(req.body)

  const reply = {
    templates :  templates_lis
  }

  res.send(reply)

})


var cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}));









app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)



})