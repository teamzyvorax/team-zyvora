require('dotenv').config();
const express = require('express');
const os = require('os');
const { execFile } = require('child_process');
const app = express();
const PORT = Number(process.env.AGENT_PORT || 8787);
const KEY = process.env.HOSTING_API_KEY;

if (!KEY) console.warn('HOSTING_API_KEY is not set. Agent will reject all requests.');
app.use(express.json());
app.use((req,res,next)=>{ if (!KEY || req.get('x-host-key') !== KEY) return res.status(401).json({error:'unauthorized'}); next(); });

app.get('/health', (_req,res)=>res.json({ok:true, hostname:os.hostname(), uptime:os.uptime(), load:os.loadavg(), memory:{total:os.totalmem(),free:os.freemem()}}));
app.get('/processes', (_req,res)=>execFile('pm2',['jlist'],{timeout:5000},(err,out)=>{if(err)return res.status(500).json({error:err.message});try{res.json(JSON.parse(out))}catch(e){res.status(500).json({error:'invalid pm2 output'})}}));
app.post('/process/:name/:action',(req,res)=>{const allowed=['start','stop','restart','delete'];if(!allowed.includes(req.params.action))return res.status(400).json({error:'invalid action'});execFile('pm2',[req.params.action,req.params.name],{timeout:10000},(err,stdout,stderr)=>{if(err)return res.status(500).json({error:stderr||err.message});res.json({ok:true,output:stdout})});});

app.listen(PORT,'127.0.0.1',()=>console.log(`Zyvora host agent listening on 127.0.0.1:${PORT}`));
