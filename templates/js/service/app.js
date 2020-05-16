'use strict'
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()
const router = express.Router()
var AWSXRay = require('aws-xray-sdk');
app.use(AWSXRay.express.openSegment('ExpressLambda'));

var fs = require('fs')
var models = require('./models/models')


router.use(compression())
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())




router.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

router.post('/users', async (req, res) => {
  var users = await models.users.get_users(req.body)
  res.json(users)
})

router.get('/users/:userId', (req, res) => {
  res.json({
    id: req.params.userId,
    body: req.body
  })
})

router.put('/users/:userId', (req, res) => {
  res.json({
    id: req.params.userId,
    body: req.body
  })
})

router.delete('/users/:userId', (req, res) => {
  res.json({
    id: req.params.userId,
    body: req.body
  })
})

router.get('/public/microfrontend.js*', async (req, res) => {
  var module_path = `${__dirname}/${req.path.slice(1)}`
  if(req.apiGateway){
    var umd_module = await fs.readFileSync(module_path)
    res.send(umd_module.toString().replace(/http:\/\/localhost:3000/g, 'https://'+req.apiGateway.event.headers.Host))
  }else{
    res.sendFile(module_path)
  }
});

router.get('/public/*', (req, res) => {
  res.sendFile(`${__dirname}/${req.path.slice(1)}`)
})


// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)
app.use(AWSXRay.express.closeSegment());

module.exports = app




