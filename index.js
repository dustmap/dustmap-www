"use strict";

var http = require('http')
  , connect = require('connect')
  , app = connect()
  , name = require('./package.json').name
;

app.use(connect.logger());

app.use(connect.static(__dirname + '/public'));
if (process.env.NODE_ENV == 'prod') {
  app.use(connect.static(__dirname + '/public_prod'));
} else {
  app.use(connect.static(__dirname + '/public_dev'));
}

var port = process.env.npm_package_config_http_port;

http.createServer(app).listen(port, function(){
  console.log(name, 'is listening on port', port);
});