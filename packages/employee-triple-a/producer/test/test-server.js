const http = require('http');
const server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});

    var b = JSON.stringify({
      name: 'asad',
      class: 'paewe'
    });

    response.end(b);
});

module.exports = server;

server.listen(process.env.PORT || 8000);
console.log("Server running at http://localhost:8000/");