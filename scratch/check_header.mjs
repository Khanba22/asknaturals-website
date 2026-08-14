import fs from 'fs';
const buf = fs.readFileSync('assets/badge_low_stock.png');
console.log(buf.subarray(0, 16).toString('hex'));
console.log(buf.subarray(0, 16).toString('ascii'));
