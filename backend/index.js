const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const STEAM_COMMON_PATH = 'C:\\Program Files (x86)\\Steam\\steamapps\\common';
const GERONIMO_MODDED_PATH = path.join(STEAM_COMMON_PATH, 'GERONIMO modded');

// Route to check game status
app.get('/api/status', (req, res) => {
    try {
        const gameExists = fs.existsSync(GERONIMO_MODDED_PATH);
        const binariesPath = path.join(GERONIMO_MODDED_PATH, 'Geronimo', 'Binaries', 'Win64');
        const ue4ssExists = fs.existsSync(path.join(binariesPath, 'UE4SS.dll'));

        res.json({
            gameFound: gameExists,
            path: gameExists ? GERONIMO_MODDED_PATH : null,
            ue4ssInstalled: ue4ssExists
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Endpoint to simulate installing UE4SS
app.post('/api/install-ue4ss', (req, res) => {
    // In reality, this would download the ZIP and extract it.
    // For now, we simulate success.
    setTimeout(() => {
        res.json({ success: true, message: 'UE4SS installed successfully.' });
    }, 2000);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Mod Studio Backend running on http://localhost:${PORT}`);
});
