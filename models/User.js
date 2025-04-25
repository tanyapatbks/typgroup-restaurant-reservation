const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    // Schema definition remains the same
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    telephone: {
        type: String,
        required: [true, 'Please add a telephone number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware and methods remain the same
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Check if model exists before creating
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);