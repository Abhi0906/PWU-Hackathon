const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const DealerSchema = new Schema({
    name: String,
    mobileNumber: Number,
    natOfMat: String,
    weightOfMat: String,
    quantity: String,
    city: String,
    state: String,
    email: {
        type: String,
        required: true,
        unique: true
    },

});

DealerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Dealer', DealerSchema);