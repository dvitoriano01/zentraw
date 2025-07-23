const http = require('http'); 
const server = http.createServer((req, res) =
  res.writeHead(200, {'Content-Type': 'text/plain'}); 
  res.end('Server working!'); 
}); 
server.listen(3001, () = on 3001')); 
