require('dotenv').config;
const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxlength: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,      // Es un tipo de objeto de ID de mongoose
        ref: 'User',                        // Referencia al modelo User
        required: [true, 'Please provide User']
    }
},
    { timestamps: true }            //timestamps imprime createdAt y updatedAt
);


module.exports = mongoose.model('Job', JobSchema);