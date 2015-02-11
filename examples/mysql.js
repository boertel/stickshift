var mysql = require('mysql');
var http = require('http');
var concat = require('concat-stream');
var st = require('st');

var mount = st({ path: __dirname + '/..', url: '/', cache: false });

var connection = mysql.createConnection(process.env.DATABASE_URL);


var server = http.createServer(function (req, res) {
  var stHandled = mount(req, res);
  if (!stHandled) {
    req.pipe(concat(function (query) {
      try {
        var q = JSON.parse(query);
        connection.query(q.query, function (err, rows) {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(err || rows));
        });
      } catch (e) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('error');
      }
    }));
  }
});

server.listen(3000, function (err, res) {
  connection.connect();
  console.log('listening on port 3000');
});
