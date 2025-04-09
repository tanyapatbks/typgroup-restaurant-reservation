const Restaurant = require('../models/Restaurant');

// Get all restaurants
exports.getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find();
        
        res.status(200).json({
            success: true,
            count: restaurants.length,
            data: restaurants
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Get single restaurant
exports.getRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        res.status(200).json({ success: true, data: restaurant });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Create new restaurant
exports.createRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.status(201).json({
            success: true,
            data: restaurant
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// Update restaurant
exports.updateRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        res.status(200).json({ success: true, data: restaurant });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);

        if (!restaurant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }

        // Trigger the pre middleware
        await restaurant.deleteOne();
        
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};