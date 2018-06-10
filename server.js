const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();

const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use('/listing/:id', express.static(path.join(__dirname, 'public')));


const ServerOne = 'http://localhost:3001',
      ServerTwo = 'http://localhost:3002',
      ServerThree = 'http://localhost:3003';
 
app.all("/images/*", function(req, res) {
    console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: ServerOne});
});

app.all("/api/*", function(req, res) {
    console.log('redirecting to Server2');
    apiProxy.web(req, res, {target: ServerTwo});
});

app.all("/purchase/*", function(req, res) {
    console.log('redirecting to Server3');
    apiProxy.web(req, res, {target: ServerThree});
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});