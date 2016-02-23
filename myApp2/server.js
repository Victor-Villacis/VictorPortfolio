var express =   require('express');
var app     =   express();
var exphb   =   require('express-handlebars');
var port    =   Number(process.env.PORT || 3000);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.engine('handlebars', exphb({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.listen(port, function() {
  console.log("Listening on port:" + port);
});

app.get('/', function(req, res) {
  res.render('index', {msg:'index-page'});
});

app.get('/home', function(req, res) {
  res.send("This is the home page");
});

//when you go to /hello it renders hello, notice there is no slash as this pertains to the file hello.handlebars
app.get('/about', function(req, res) {
  res.render('about', {msg:"HELLO WORLD I AM ABOUT"} )
});

//When you go to /another it redirects you to the '/' which is the index
//or you can state an external website or even a .handblebars page, or even a preveious path with res.send
app.get('/another', function(req, res){
  res.redirect('/?msg=another one');
});