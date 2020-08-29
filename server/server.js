const express = require('express')
const app = express()
const port = 4000


var fs = require('fs');

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




app.get('/template_count', (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed


  console.log(req.body)

  const reply = {
    templates :  [
      "hello1",
      "hello2"
    ]
  }

  res.send(reply)


})


var cors = require('cors');
app.use(cors({origin: 'http://localhost:3000'}));





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})