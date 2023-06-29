const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/signup.html")
})
app.post("/failure", function(req,res){
  res.redirect("/");
})

app.post("/", function(req, res){
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;
  
  const data = {
    members:[
      {
        email_address: email,
        status:"subscribed",
        merge_fields:{
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  }
  const jsonData= JSON.stringify(data);

  const url ="https://us21.api.mailchimp.com/3.0/kists/e906ab63a5"     //lists not kists
  const options={
    method:"POST",
    auth:"pathetikGeek:784087f0f66d46b5c8be98e71d6dfaea-us21"
  }
  const request = https.request(url, options, function(response){
    if (response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is started on port 3000");
})