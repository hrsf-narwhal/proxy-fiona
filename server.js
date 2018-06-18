const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();

const port = process.env.PORT || 3000;

app.use(morgan('dev'));

app.use('/listing/:id', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/listing/1001');
});

const ServerOne = 'http://itsyphotos-env.hksp68msdv.us-east-1.elasticbeanstalk.com',
        // ServerOne = 'http://localhost:3001',
        // ServerTwo = 'http://localhost:3002',
      ServerTwo = 'http://itsy-env.zxd4jnvtyb.us-west-1.elasticbeanstalk.com',
      //ServerThree = 'http://localhost:3003'; // for docker
      ServerThree = 'http://localhost:3003';
      //ServerThree = 'http://itsypurchasesidebar-env-1.mwfwxntniq.us-west-1.elasticbeanstalk.com/listing/1001/'; // for EBS

app.all("/images/*", function(req, res) {
    // console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: ServerOne});
});
app.all("/photo-gallery.js", function(req, res) {
    // console.log('redirecting to Server1');
    apiProxy.web(req, res, {target: ServerOne});
});

app.all("/api/*", function(req, res) {
    // console.log('redirecting to Server2');
    apiProxy.web(req, res, {target: ServerTwo});
});

app.all("/bundle.js", function(req, res) {
    // console.log('redirecting to Server2');
    apiProxy.web(req, res, {target: ServerTwo});
});

app.all("/purchase/*", function(req, res) {
    console.log('redirecting to Server3', req.url);
    apiProxy.web(req, res, {target: ServerThree});
});

app.all("/app.js", function(req, res) {
    console.log('redirecting to Server3', req.url);
    apiProxy.web(req, res, {target: ServerThree});
});

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});