const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Require dotenv to use environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/file-upload-demo', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Ensure unique usernames
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// File Upload Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded.');

    // Detect file type
    const fileType = file.mimetype;

    // Handle image manipulation (example: using a hypothetical API)
    // For demonstration, just returning file details
    res.json({ filename: file.originalname, type: fileType });
});

// User registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check for duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('Username already taken.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        res.status(201).send('User registered!');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Server error');
    }
});

// User login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret'); // Use environment variable
    res.json({ token });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
