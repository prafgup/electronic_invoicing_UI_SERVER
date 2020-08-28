const express = require('express')
const app = express()
const port = 4000


var fs = require('fs');




app.get('/template_count', (req, res) => {

  console.log(req.body)


  var reply = {
      status : 200,
      template : [
          "template_1",
          "template_2",
          "template_3",
          "template_4",
          "template_5"
      ]
  }


  res.send(reply)


})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})