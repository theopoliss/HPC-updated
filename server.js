const express = require('express');
const mongoose = require('mongoose');
const Subscriber = require('./models/subscriber');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hpc-website')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.static('public'));
app.use(express.json());

app.post('/join', async (request, response) => {
    try {
        const { name, email } = request.body;
        
        // Validate inputs
        if (!name || !email) {
            return response.status(400).json({
                success: false,
                error: 'Name and email required'
            });
        }

        // Create subscriber
        const subscriber = new Subscriber({ name, email });

        // Save to database
        await subscriber.save();

        // Send welcome email
        // await sendWelcomeEmail(name, email);

        response.json( {success: true });
        
    }
    catch (error) {
        // Email already registered
        if(error.code === 11000) {
            return response.status(400).json({
                success: false,
                error: 'This email is already registered'
            });
        }
        console.error('Error:', error);
        response.status(500).json({ success: false, error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`)
});