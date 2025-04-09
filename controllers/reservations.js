const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');

// Get all reservations
exports.getReservations = async (req, res, next) => {
    try {
        let query;

        // General users can see only their reservations
        if (req.user.role !== 'admin') {
            query = Reservation.find({ user: req.user.id }).populate({
                path: 'restaurant',
                select: 'name address telephone openTime closeTime'
            });
        } else {
            // Admin can see all reservations
            if (req.params.restaurantId) {
                query = Reservation.find({ restaurant: req.params.restaurantId }).populate({
                    path: 'restaurant',
                    select: 'name address telephone openTime closeTime'
                });
            } else {
                query = Reservation.find().populate({
                    path: 'restaurant',
                    select: 'name address telephone openTime closeTime'
                });
            }
        }

        const reservations = await query;
        
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Cannot find reservations'
        });
    }
};

// Get single reservation
exports.getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'restaurant',
            select: 'name address telephone openTime closeTime'
        });

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        // Make sure user is reservation owner or admin
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this reservation'
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Cannot find reservation'
        });
    }
};

// Add reservation
exports.addReservation = async (req, res, next) => {
    try {
        req.body.restaurant = req.params.restaurantId;
        const restaurant = await Restaurant.findById(req.params.restaurantId);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: `No restaurant with the id of ${req.params.restaurantId}`
            });
        }

        // Add user ID to request body
        req.body.user = req.user.id;

        // Check for existing reservations
        const existingReservations = await Reservation.find({ user: req.user.id });

        // If user is not an admin, they can only create 3 reservations
        if (existingReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }

        const reservation = await Reservation.create(req.body);

        res.status(201).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Cannot create reservation'
        });
    }
};

// Update reservation
exports.updateReservation = async (req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        // Make sure user is reservation owner or admin
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reservation`
            });
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Cannot update reservation'
        });
    }
};

// Delete reservation
exports.deleteReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        // Make sure user is reservation owner or admin
        if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this reservation`
            });
        }

        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Cannot delete reservation'
        });
    }
};