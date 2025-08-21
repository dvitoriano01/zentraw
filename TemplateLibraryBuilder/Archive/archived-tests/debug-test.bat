@echo off
echo === ZENTRAW DEBUG TEST ===
echo.

cd /d "c:\Users\Denys Victoriano\Documents\GitHub\clone\zentraw\TemplateLibraryBuilder"

echo Current directory: %CD%
echo.

echo Testing Node.js installation...
node --version
echo.

echo Testing simple script...
echo console.log('Node.js is working!'); > temp-test.js
node temp-test.js
del temp-test.js
echo.

echo Checking package.json...
if exist package.json (
    echo package.json found
    type package.json | findstr "type"
) else (
    echo package.json not found
)
echo.

echo Testing simple HTTP server...
echo const http = require('http'); > simple-server.js
echo const server = http.createServer((req, res) => { >> simple-server.js
echo   res.writeHead(200, {'Content-Type': 'text/plain'}); >> simple-server.js
echo   res.end('Server working!'); >> simple-server.js
echo }); >> simple-server.js
echo server.listen(3001, () => console.log('Server on 3001')); >> simple-server.js

echo.
echo Starting simple server...
start "Simple Server" node simple-server.js

echo.
echo Testing server response...
timeout 3
curl http://localhost:3001

echo.
echo === TEST COMPLETE ===
pause
