/*
Davery Valdez
RESTFUL API
server.js

*/
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/MOVIES')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define movie schema
const movieSchema = new mongoose.Schema({
    title: String,
    director: String,
    genre: String,
    releaseDate: Date,
    rating: Number
});

// Define Movie model
const Movie = mongoose.model('Movie', movieSchema);

// Define route for the root path ("/")
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the 'index.html' file
});

// Define route for handling POST requests to "/movies"
app.post('/movies', async (req, res) => {
    try {
        // Create a new movie document using data from the request body
        const newMovie = new Movie(req.body);

        // Save the new movie document to the database
        await newMovie.save();

        // Send a success response
        res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error creating movie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define route to list all movies
app.get('/list', async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.status(200).json({ movies });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Define route to handle movie query
app.get('/query', async (req, res) => {
    try {
        const { genre } = req.query;
        const movies = await Movie.find({ genre });
        res.status(200).json({ movies });
    } catch (error) {
        console.error('Error querying movies:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle requests for favicon.ico
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
