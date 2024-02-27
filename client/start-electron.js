import { execSync } from 'child_process';
import os from 'os';

function getLocalIPv4() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      if (!info.internal && info.family === 'IPv4') {
        return info.address;
      }
    }
  }
  return 'localhost'; 
}

const localIPv4 = getLocalIPv4();

execSync(`wait-on tcp:${localIPv4}:5173 && electron main.js`, { stdio: 'inherit' });
