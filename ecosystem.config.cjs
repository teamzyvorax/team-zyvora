module.exports = {
  apps: [
    { name: 'zyvora-web', script: './server.js', env: { NODE_ENV: 'production', PORT: 3000 }, restart_delay: 3000, max_restarts: 10 },
    { name: 'zyvora-bot', script: './bot.js', env: { NODE_ENV: 'production' }, restart_delay: 3000, max_restarts: 10 },
    { name: 'zyvora-agent', script: './host-agent.js', env: { NODE_ENV: 'production', AGENT_PORT: 8787 }, restart_delay: 3000, max_restarts: 10 }
  ]
};
