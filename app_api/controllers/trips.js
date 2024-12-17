const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');
const User = mongoose.model('users');

// GET: /trips - list all the trips
const tripsList = async (req, res) => {
    try {
        const q = await Model.find({}).exec();
        if (!q) {
            return res.status(404).json({ message: "No trips found" });
        }
        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// GET: /trips/:tripCode - list a single trip
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model.find({ 'code': req.params.tripCode }).exec();
        if (!q) {
            return res.status(404).json({ message: "Trip not found" });
        }
        return res.status(200).json(q);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// POST: /trips - Add a new trip
const tripsAddTrip = async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) return; // getUser will have sent the response

        const trip = await Trip.create({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        return res.status(201).json(trip);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// PUT: /trips/:tripCode - Updates a Trip
const tripsUpdateTrip = async (req, res) => {
    try {
        const user = await getUser(req, res);
        if (!user) return; // getUser will have sent the response

        const trip = await Trip.findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true }
        ).exec();

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found with code " + req.params.tripCode
            });
        }
        return res.status(200).json(trip);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                message: "Trip not found with code " + req.params.tripCode
            });
        }
        return res.status(500).json(err);
    }
};

const getUser = async (req, res) => {
    if (!req.auth || !req.auth.email) {
        return res.status(404).json({ "message": "User not found" });
    }

    try {
        const user = await User.findOne({ email: req.auth.email }).exec();
        if (!user) {
            return res.status(404).json({ "message": "User not found" });
        }
        return user;
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    getUser
};