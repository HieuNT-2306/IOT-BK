require('dotenv').config();
const express = require('express');
const mqtt = require('mqtt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // Một số trình duyệt cũ (IE11, một số phiên bản SmartTV) không hiểu trạng thái 204
  };
  
  app.use(cors(corsOptions)); 

const mongoURI = `mongodb+srv://adamlavie2369:${process.env.DB_PASSWORD}@cluster0.efk0fgf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const binSchema = new mongoose.Schema({
    binID: { type: String, required: true, unique: true },
    currentDis: { type: Number, required: true },
    currentLoc: {
        loc: { type: String, required: true },
        region: { type: String, required: true },
        country: { type: String, required: true }
    },
    logs: [
        {
            dis: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    lastLogTimestamp: { type: Date, default: Date.now },
    timestamp: { type: Date, default: Date.now }
});
const Bin = mongoose.model('Bin', binSchema);

const mqttServer = 'mqtt://broker.hivemq.com';
const mqttTopic = 'lele-dumbo-testing';
const mqttClient = mqtt.connect(mqttServer);

const app = express();
app.use(bodyParser.json());

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
    mqttClient.subscribe(mqttTopic, err => {
        if (err) console.error('Failed to subscribe to topic:', err);
    });
});

mqttClient.on('message', async (topic, message) => {
    if (topic === mqttTopic) {
        try {
            const data = JSON.parse(message.toString());
            const binData = {
                binID: data.binID,
                currentDis: data.dis,
                currentLoc: {
                    loc: data.location.loc,
                    region: data.location.region,
                    country: data.location.country
                }
            };

            const existingBin = await Bin.findOne({ binID: data.binID });

            if (existingBin) {
                existingBin.currentDis = data.dis;
                existingBin.currentLoc = binData.currentLoc;

                const now = new Date();
                if (!existingBin.lastLogTimestamp || now - existingBin.lastLogTimestamp >= 5 * 60 * 1000) {
                    existingBin.logs.push({ dis: data.dis });
                    existingBin.lastLogTimestamp = now;
                }
                await existingBin.save();
            } else {
                // Create a new bin record if not found
                const newBin = new Bin({
                    ...binData,
                    logs: [{ dis: data.dis }],
                    lastLogTimestamp: new Date()
                });
                await newBin.save();
            }
            console.log('Bin data saved/updated in MongoDB');
        } catch (err) {
            console.error('Error processing MQTT message:', err);
        }
    }
});

app.get('/data/:binID', async (req, res) => {
    const binID = req.params.binID;
    try {
        const bin = await Bin.findOne({ binID });
        if (bin) {
            res.json({ success: true, data: bin });
        } else {
            res.status(404).json({ success: false, message: 'Bin not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});


app.get('/data', async (req, res) => {
    try {
        const bins = await Bin.find(); 
        res.json({ success: true, data: bins });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});


const port = 5000;
app.listen(port, () => {
    console.log(`HTTP server running at http://localhost:${port}`);
});
