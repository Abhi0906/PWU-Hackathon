const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const Driver = require('./models/driver');
const Dealer = require('./models/dealer');
const MongoStore = require('connect-mongo')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

// Load config
dotenv.config({ path: './config/config.env' })

connectDB()

const app = express();
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const sessionConfig = {
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// passport.use('Driver', new LocalStrategy(Driver.authenticate()));
// passport.use('Dealer', new LocalStrategy(Dealer.authenticate()));

// passport.serializeUser(Driver.serializeUser());
// passport.serializeUser(Dealer.serializeUser());

// passport.deserializeUser(Driver.deserializeUser());
// passport.deserializeUser(Dealer.deserializeUser());
passport.use('Driver', new LocalStrategy(function (username, password, done) {
    Driver.findOne({ username: username }, function (err, user) {
        // ...
        return done(null, user);
    });
}));

passport.use('Dealer', new LocalStrategy(function (username, password, done) {
    Dealer.findOne({ username: username }, function (err, user) {
        // ...
        return done(null, user);
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Driver.findById(id, function (err, user) {
        if (err) done(err);
        if (user) {
            done(null, user);
        } else {
            Dealer.findById(id, function (err, user) {
                if (err) done(err);
                done(null, user);
            })
        }
    })
});

app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need to Login First!');
        return res.redirect('/signin');
    }
    next();
}

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

app.get('/signindealer', (req, res) => {
    res.render('signinDealer');
})

app.post('/signindealer', passport.authenticate('Dealer', { failureFlash: true, failureRedirect: '/signindealer' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

app.get('/signindriver', (req, res) => {
    res.render('signinDriver');
})

app.post('/signindriver', passport.authenticate('Driver', { failureFlash: true, failureRedirect: '/signindriver' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out!');
    res.redirect('/');
})

const port = 3000;
app.listen(port, () => {
    console.log(`Connected to Port: ${port}`)
});