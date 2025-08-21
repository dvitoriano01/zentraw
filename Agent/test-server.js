console.log('Testing Agent startup...');

const express = require('express');
const cors = require('cors');
const path = require('path');

console.log('Creating Express app...');
const app = express();
const PORT = 3007;

console.log('Setting up middleware...');
app.use(cors());
app.use(express.json());

console.log('Setting up routes...');

app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/zentraw-agent.js', (req, res) => {
    console.log('Agent JS file requested');
    res.sendFile(path.join(__dirname, 'public', 'zentraw-agent.js'));
});

console.log('Starting server...');
app.listen(PORT, () => {
    console.log(`🤖 Test Agent running on port ${PORT}`);
});

console.log('Setup complete.');
