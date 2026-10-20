require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'team-zyvora-web', uptime: process.uptime(), time: new Date().toISOString() });
});

app.get('/api/status', (_req, res) => {
  res.json({
    website: 'online',
    botConfigured: Boolean(process.env.DISCORD_TOKEN),
    node: process.version,
    uptimeSeconds: Math.round(process.uptime())
  });
});

app.get('*splat', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Team Zyvora web running on port ${PORT}`);
});
