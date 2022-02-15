const mongoose = require('mongoose');
const Dealer = require('./dealer');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const DealerSchema = new Schema({
    name: String,
    mobileNumber: String,
    natOfMat: String,
    weightOfMat: String,
    quantity: String,
    city: String,
    state: String,
    type: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    drivers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Driver'
        }
    ]

});

DealerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Dealer', DealerSchema);