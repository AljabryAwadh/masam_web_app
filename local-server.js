const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const preferredPort = Number(process.env.PORT || 3000);

const pageMap = {
  index: 'Index',
  dashboard: 'Index',
  dws: 'DWS',
  ohc: 'OHC',
  tjet_registry: 'TJET_Registry',
  tjet_receipt_and_expenditure: 'TJET_Receipt_and_Expenditure'
};

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

function readProjectFile(fileName) {
  const resolved = path.resolve(rootDir, fileName);
  if (!resolved.startsWith(rootDir)) {
    throw new Error(`Blocked path outside project: ${fileName}`);
  }
  return fs.readFileSync(resolved, 'utf8');
}

function expandIncludes(html) {
  return html.replace(/<\?!=\s*include\(['"]([^'"]+)['"]\);\s*\?>/g, (_match, includeName) => {
    const fileName = includeName.endsWith('.html') ? includeName : `${includeName}.html`;
    return expandIncludes(readProjectFile(fileName));
  });
}

function injectLocalMock(html) {
  if (html.includes('/mock.js')) return html;
  const mockTag = '<script src="/mock.js"></script>';
  return html.replace(/<body([^>]*)>/i, `<body$1>\n${mockTag}`);
}

function renderPage(pageName) {
  const template = readProjectFile(`${pageName}.html`);
  return injectLocalMock(expandIncludes(template));
}

function serveStatic(reqPath, res) {
  const cleanPath = decodeURIComponent(reqPath).replace(/^\/+/, '');
  const resolved = path.resolve(rootDir, cleanPath);

  if (!resolved.startsWith(rootDir) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const ext = path.extname(resolved).toLowerCase();
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(resolved).pipe(res);
}

function handleRequest(req, res) {
  try {
    const host = req.headers.host || 'localhost';
    const url = new URL(req.url, `http://${host}`);

    if (url.pathname !== '/' && path.extname(url.pathname)) {
      serveStatic(url.pathname, res);
      return;
    }

    const requestedPage = url.searchParams.get('page') || 'Index';
    const targetFile = pageMap[requestedPage.toLowerCase()] || 'Index';
    const html = renderPage(targetFile);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>Local simulator error</h1>
      <pre>${String(error.stack || error)}</pre>
    `);
  }
}

function startServer(port) {
  const server = http.createServer(handleRequest);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port < preferredPort + 20) {
      startServer(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, () => {
    console.log(`MASAM local simulator running at http://localhost:${port}`);
    console.log(`Open http://localhost:${port}/?page=DWS to test the Daily Worksheet.`);
  });
}

startServer(preferredPort);
