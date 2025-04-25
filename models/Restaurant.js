const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    telephone: {
        type: String,
        required: [true, 'Please add a telephone number']
    },
    openTime: {
        type: String,
        required: [true, 'Please add opening time']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add closing time']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Reverse populate with virtuals
RestaurantSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'restaurant',
    justOne: false
});

// Cascade delete reservations when a restaurant is deleted
RestaurantSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    console.log(`Reservations being removed from restaurant ${this._id}`);
    await this.model('Reservation').deleteMany({ restaurant: this._id });
    next();
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);