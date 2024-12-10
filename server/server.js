const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const mongoURI = `mongodb+srv://adamlavie2369:${process.env.DB_PASSWORD}@cluster0.efk0fgf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const binSchema = new mongoose.Schema({
    binID: { type: String, required: true, unique: true },
    dis: { type: Number, required: true },
    location: {
        loc: { type: String, required: true },
        region: { type: String, required: true },
        country: { type: String, required: true }
    },
    timestamp: { type: Date, default: Date.now }
});
const Bucket = mongoose.model('Bin', binSchema);

const mqttServer = 'mqtt://broker.hivemq.com';
const mqttTopic = 'lele-dumbo-testing';
const mqttClient = mqtt.connect(mqttServer);

const app = express();
app.use(bodyParser.json());

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
    mqttClient.subscribe(mqttTopic, err => {
        if (err) {
            console.error('Failed to subscribe to topic:', err);
        } else {
            console.log(`Subscribed to topic: ${mqttTopic}`);
        }
    });
});

mqttClient.on('message', async (topic, message) => {
    if (topic === mqttTopic) {
        console.log(`Received message: ${message.toString()}`);

        try {
            const data = JSON.parse(message.toString());
            const bucketData = {
                binID: data.binID,
                dis: data.dis,
                location: {
                    loc: data.location.loc,
                    region: data.location.region,
                    country: data.location.country
                },
                timestamp: new Date()
            };

            await Bucket.findOneAndUpdate(
                { binID: data.binID }, // Match existing bucket by binID
                bucketData,           // Update with new data
                { upsert: true, new: true } // Insert if not found
            );
            console.log('Bin data saved/updated in MongoDB');
        } catch (err) {
            console.error('Error processing MQTT message:', err);
        }
    }
});

// HTTP Endpoints
app.get('/data/:binID', async (req, res) => {
    const binID = req.params.binID;

    try {
        const bucket = await Bucket.findOne({ binID });
        if (bucket) {
            res.json({ success: true, data: bucket });
        } else {
            res.status(404).json({ success: false, message: 'Bin not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});

app.get('/data', async (req, res) => {
    try {
        const buckets = await Bucket.find();
        if (buckets) {
            res.json({ success: true, data: buckets });
        } else {
            res.status(404).json({ success: false, message: 'Bin not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});

// Start Server
const port = 5000;
app.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
});
