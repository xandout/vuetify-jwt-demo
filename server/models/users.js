const mongoose = require('mongoose');

// schema maps to a collection
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: 'String',
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true,
        trim: true
    },
    first_name: {
        type: 'String',
        required: true,
        trim: true
    },
    last_name: {
        type: 'String',
        required: true,
        trim: true
    },
});

module.exports = global.db.model('User', userSchema);