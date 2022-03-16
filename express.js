
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
const { dirname } = require("path");
const { links } = require("express/lib/response");
var app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// POST /login gets urlencoded bodies
app.post("/login", urlencodedParser, function(req, res) {
  if (!req.body) return res.sendStatus(400);
  console.log(req.body);
  res.send("welcome, " + req.body.name);
});

app.post('/', function(req,res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/newMessage', function(req, res){
  res.sendFile(__dirname + '/public/guestbook.html');
});

app.post('/newMessage', function(req, res){
  res.sendFile(__dirname + '/public/guestbook.html');
});


app.post('/guestbook', function(req, res){
  res.redirect('/guestbook')
  //res.sendFile(__dirname + '/public/messages.html');
});

// Add data
app.post("/adduser", urlencodedParser, function(req, res) {
  console.log(req.body);

  var data = require("./exampledata2.json");

  // Collect the post data and add it to JSON obj
  data.push({
    name: req.body.name,
    message: req.body.message,
    date: Date()
  });

  var jsonStr = JSON.stringify(data);

  //Write data to a file
  fs.writeFile("exampledata2.json", jsonStr, function(err, data) {
    if (err) throw err;
    console.log("It's saved!");
  });
  res.sendFile(__dirname + '/public/messages.html');
  //loadMessages();
  res.redirect('/guestbook')
});

app.get("/guestbook", function(req, res) {
  var data = require("./exampledata2.json");

  // Parse the results into a variabke
  var results = '<table border="1"> ';

  for (var i = 0; i < data.length; i++) {
    results +=
      "<tr>" +
      "<td>" +
      data[i].name +
      "</td>" +
      "<td>" +
      data[i].message +
      "</td>" +
      "<td>" +
      data[i].date +
      "</td>" +
      "</tr>";
  }

  res.send(results);
});

app.listen(8081, function() {
  console.log("Example app listening on port 8081!");
});

function loadMessages(req, res){
  //var data = require("./exampledata2.json");

  let rawdata = fs.readFileSync(path.resolve(__dirname, 'exampledata2.json'));
  let data = JSON.parse(rawdata);

  for(i =0; i < data.length; i++){
    var li = document.createElement("li");
    var name = data[i].name;
    var message = data[i].message;
    var text= document.createTextNode(name + "/br" + message);
    li.appendChild(text);
    document.getElementById("messageList").appendChild(li);
  }
}