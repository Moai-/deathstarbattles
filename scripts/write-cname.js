#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const domain =
  process.env.GITHUB_PAGES_DOMAIN ||
  (() => {
    try {
      const p = path.join(root, 'github-pages-domain');
      if (fs.existsSync(p)) {
        const line = fs.readFileSync(p, 'utf8').split(/\r?\n/)[0].trim();
        if (line && !line.startsWith('#')) return line;
      }
    } catch (_) {}
    return '';
  })();

if (domain) {
  const dist = path.join(root, 'dist');
  const cname = path.join(dist, 'CNAME');
  fs.mkdirSync(dist, { recursive: true });
  fs.writeFileSync(cname, domain + '\n', 'utf8');
}
