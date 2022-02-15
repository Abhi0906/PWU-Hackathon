const mongoose = require('mongoose');
const Dealer = require('./dealer');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    name: String,
    age: Number,
    truckNumber: String,
    mobileNumber: Number,
    truckCapacity: String,
    transporterName: String,
    from1city: String,
    from1state: String,
    to1city: String,
    to1state: String,
    from2city: String,
    from2state: String,
    to2city: String,
    to2state: String,
    from3city: String,
    from3state: String,
    to3city: String,
    to3state: String,
    type: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    dealers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Dealer'
        }
    ]

});

DriverSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Driver', DriverSchema);