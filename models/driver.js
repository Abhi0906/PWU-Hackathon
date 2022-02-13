const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    name: String,
    age: Number,
    truckNumber: String,
    mobileNumber: Number,
    truckCapacity: String,
    transporterName: String,
    route1city: String,
    route1state: String,
    route2city: String,
    route2state: String,
    route3city: String,
    route3state: String,
    email: {
        type: String,
        required: true,
        unique: true
    },

});

DriverSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Driver', DriverSchema);