const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const routes = require('./routes');
const { seedAdmin } = require('./auth.controller');

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

if (require.main === module) {
    app.listen(port, async () => {
        console.log(`Server running on port ${port}`);
        // Seed default admin user
        await seedAdmin();
    });
}

module.exports = app;
