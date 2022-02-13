const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Driver = require('./models/driver');
const Dealer = require('./models/dealer');

const dbUrl = 'mongodb://localhost:27017/hackathon';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const app = express();
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Driver.authenticate()));
passport.use(new LocalStrategy(Dealer.authenticate()));

passport.serializeUser(Driver.serializeUser());
passport.deserializeUser(Driver.deserializeUser());

passport.serializeUser(Dealer.serializeUser());
passport.deserializeUser(Dealer.deserializeUser());

app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/registerdriver', (req, res) => {
    res.render('registerDriver')
})

app.post('/registerdriver', async (req, res) => {
    try {
        const driver = new Driver({
            name: req.body.newDriver.name,
            username: req.body.newDriver.username,
            email: req.body.newDriver.email,
            age: req.body.newDriver.age,
            truckNumber: req.body.newDriver.truckNumber,
            mobileNumber: req.body.newDriver.mobileNo,
            truckCapacity: req.body.newDriver.truckCap,
            transporterName: req.body.newDriver.transporterName,
            route1state: req.body.newDriver.route1state,
            route1city: req.body.newDriver.route1city,
            route2state: req.body.newDriver.route2state,
            route2city: req.body.newDriver.route2city,
            route3state: req.body.newDriver.route3state,
            route3city: req.body.newDriver.route3city
        })
        const { password } = req.body.newDriver;
        const registeredDriver = await Driver.register(driver, password);
        req.login(registeredDriver, err => {
            res.redirect('/');
        });
    } catch (e) {
        console.log(e)
        res.redirect('/registerdriver')
    }
})

app.get('/registerdealer', (req, res) => {
    res.render('registerDealer')
})
app.post('/registerdealer', async (req, res) => {
    try {
        const dealer = new Dealer({
            name: req.body.newDealer.name,
            email: req.body.newDealer.email,
            username: req.body.newDealer.username,
            mobileNumber: req.body.newDealer.mobileNo,
            natOfMat: req.body.newDealer.materialType,
            weightOfMat: req.body.newDealer.materialWeight,
            quantity: req.body.newDealer.quantity,
            city: req.body.newDealer.city,
            state: req.body.newDealer.state,
        })
        const { password } = req.body.newDealer;
        const registeredDealer = await Dealer.register(dealer, password);
        req.login(registeredDealer, err => {
            res.redirect('/');
        });
    } catch (e) {
        console.log(e)
        res.redirect('/registerdealer')
    }
})

const port = 3000;
app.listen(port, () => {
    console.log(`Connected to database! Port: ${port}`)
});