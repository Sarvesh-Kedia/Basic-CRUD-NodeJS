const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FormSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    name: {type: String},
    email: {type: String, required: true, max: 30, unique : true },
    subject: {type: String, max: 50},
    message: {type: String, required: true}
});

var Form = mongoose.model('FormModel', FormSchema);

// Export the model
module.exports = Form;