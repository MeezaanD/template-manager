const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const templatesFilePath = path.join(__dirname, 'templates.json');

// API route to fetch templates
app.get('/api/templates', (req, res) => {
	fs.readFile(templatesFilePath, 'utf-8', (err, data) => {
		if (err) {
			return res.status(500).json({ error: 'Failed to read templates file' });
		}
		res.json(JSON.parse(data));
	});
});

// API route to save templates
app.post('/api/templates', (req, res) => {
	const templates = req.body;
	fs.writeFile(templatesFilePath, JSON.stringify(templates, null, 2), (err) => {
		if (err) {
			return res.status(500).json({ error: 'Failed to save templates' });
		}
		res.json({ message: 'Templates saved successfully' });
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
