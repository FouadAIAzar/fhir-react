const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const FHIR_SERVER = "http://localhost:8090/fhir";

// Create Patient
app.post("/create-patient", async (req, res) => {
    console.log(req.body);
    try {
        const patient = req.body;
        const response = await fetch(`${FHIR_SERVER}/Patient`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patient),
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve Patient
app.get("/retrieve-patient/:id", async (req, res) => {
    try {
        const patientId = req.params.id;
        const response = await fetch(`${FHIR_SERVER}/Patient/${patientId}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create Observation
app.post("/create-observation", async (req, res) => {
    try {
        const observation = req.body;
        const response = await fetch(`${FHIR_SERVER}/Observation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(observation),
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve Observations
app.get("/retrieve-observations/:patientId", async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const response = await fetch(
            `${FHIR_SERVER}/Observation?subject=Patient/${patientId}`
        );
        const data = await response.json();
        res.status(200).json(data.entry ? data.entry.map(e => e.resource) : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
