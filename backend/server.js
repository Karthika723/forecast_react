const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let forecasts = [];
let currentId = 1;

// Routes

// Get all forecasts
app.get('/api/forecasts', (req, res) => {
    res.json(forecasts);
});

// Create a new forecast
app.post('/api/forecasts', (req, res) => {
    const forecast = {
        id: currentId++,
        date: req.body.date,
        temperature: req.body.temperature,
        description: req.body.description
    };
    forecasts.push(forecast);
    res.status(201).json(forecast);
});

// Update an existing forecast
app.put('/api/forecasts/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = forecasts.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Forecast not found' });
    }
    forecasts[index] = { ...forecasts[index], ...req.body };
    res.json(forecasts[index]);
});

// Delete a forecast
app.delete('/api/forecasts/:id', (req, res) => {
    const index = forecasts.findIndex(f => f.id == req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Forecast not found' });
    }
    forecasts.splice(index, 1);
    res.json({ message: 'Forecast deleted' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
