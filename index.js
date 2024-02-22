const express = require('express');
const app = express();
const port = 4000;
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const session = require('express-session');

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db',function(err){
  if(err){
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  }else{
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const userRoutes = require('./routes/main');

//set the app to use ejs for rendering
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up a static route to serve the 'views' folder, including the style.css file
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('imgLogin'));
app.use(express.static('imgHome'));

// //this adds all the userRoutes to the app under the path /user
// app.use('/user', userRoutes);
require("./routes/main")(app);


/////////////////Login / Signup///////////////

// Session middleware
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

// Authentication middleware
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});


app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.run(sql, [username, password], (err) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      res.redirect('/');
    }
  });
});

app.post('/', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.get(sql, [username, password], (err, row) => {
    if (err || !row) {
      res.render('login', { error: 'Invalid username or password' });
    } else {
      req.session.user = row.username;
      res.redirect('/home');
    }
  });
});

app.get('/index', requireLogin, (req, res) => {
  res.render('index', { username: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

app.get('/home', (req, res) => {
  res.render('home.ejs');
});







app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


