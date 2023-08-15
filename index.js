/* Imports */
import https from 'https'
import * as fs from 'fs';
import bodyParser from 'body-parser';
import helmet from "helmet";
import { parse } from 'url';
import express from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { hostname, PORT, letsroute, fishyPK, fishyKC, fishyToken, fishyClient, fishyKC_port } from './cfg/apiconf.js';
import { fishyUsers } from './cfg/userRights.js';
import qs from 'query-string'
//line to avoid the self signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


/* Constants */
//const { pathname: root } = new URL('../src', import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const certRoute = letsroute + hostname;

/* Create https server */
https.createServer({
  //key: fs.readFileSync(certRoute + `/privkey.pem`, 'utf8'),
  //cert: fs.readFileSync(certRoute + `/cert.pem`, 'utf8'),
  //ca: fs.readFileSync(certRoute + `/fullchain.pem`, 'utf8')
  key: fs.readFileSync("ca.key"),
  cert: fs.readFileSync("ca.crt"),
  
}, app).listen(PORT, function () {
  console.log(`Server running at https://${hostname}:${PORT}/`);
});

const screenLogger = async function (req, res, next) {
  /* Print in the screen request relevant parameters for debug*/
  console.log("******************************************");
  console.log('Date = ' + new Date().toISOString());
  console.log('req.method = ' + req.method);
  console.log('req.URL = ' + req.originalUrl);
  console.log('req.body = ' + JSON.stringify(req.body));
  console.log("******************************************");
  next();
};

const refuseRequest = async function (req, res, next) {
  /* Refuses request that end with...[.map, robots.txt] */
  if (req.originalUrl.endsWith('.map')) res.status(404).send();
  else if (req.originalUrl.endsWith('robots.txt')) res.status(404).send();
  else next();
}

const platformLogin = async function (req, res) {
  /* Security checks */
  if (Object.keys(req.body).length != 2 ||
    !Object.prototype.hasOwnProperty.call(req.body, "pass") ||
    !Object.prototype.hasOwnProperty.call(req.body, "user") ||
    req.body.pass.length > 16 ||
    req.body.user > 16) {
    res.status(401).send();
    return;
  } else {
    /* All is fine, proceed */
    const writeData = qs.stringify({
      grant_type: 'password',
      scope: 'openid',
      password: req.body.pass,
      username: req.body.user,
      client_id: fishyClient
    })

    const options = {
      method: 'POST',
      hostname: fishyKC,
      path: fishyToken,
      port: fishyKC_port,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': writeData.length
      }
    };
    let data;
    try {
      /* Ask to KC instance for token */
      data = await httpsRequest(options, writeData);
    } catch (error) {
      res.status(401).json({ msg: 'Wrong credentials' });
      return
    }
    /* Check the rights to prepare tool array */
    let rights = fishyUsers[req.body.user];
    if (!rights) {
      res.status(401).json({ msg: 'Rights error' });
      return
    }

    let resp = {
      token: data.access_token,
      refresh: data.refresh_token,
      uri: rights
    }
    res.status(201).send(resp)
  }
}

const getHiddenIndex = async function (req, res) {
  /* Sends the main page of the dashboard if session token in session url parameters is valid */
  try {
    const token = parse(req.url, true).query.session;
    if (token) {
      /* Token verification */
      jwt.verify(token, fishyPK, { algorithms: ['RS256'] }, (err) => {
        if (err) {
          /* Expired or modified token */
          if (Object.prototype.hasOwnProperty.call(err, "expiredAt")) {
            /* Expired */
            res.sendFile('public/index.html', { root: __dirname });
            return;
          } else {
            /* Something worst */
            res.status(401).send();
            return;
          }
        } else {
          /* All ok, send the private file */
          res.sendFile('private/main.html', { root: __dirname });
        }
      });
    } else {
      /* No token found => 404 */
      res.sendFile('public/error404.html', { root: __dirname });
    }
  } catch (error) {
    /* Unknown error => 404 */
    console.error(error);
    res.sendFile('public/error404.html', { root: __dirname });
  }
};

const refreshToken = async function (req, res) {
  /* Security checks */
  if (Object.keys(req.body).length != 2 ||
    !Object.prototype.hasOwnProperty.call(req.body, "token") ||
    !Object.prototype.hasOwnProperty.call(req.body, "refresh")) {
    res.status(401).send();
    return;
  } else {
    /* All is fine, proceed */
    const writeData = qs.stringify({
      grant_type: 'refresh_token',
      scope: 'openid',
      refresh_token: req.body.refresh,
      client_id: fishyClient
    })

    const options = {
      method: 'POST',
      hostname: fishyKC,
      path: fishyToken,
      port: fishyKC_port,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': writeData.length
      }
    };
    let data;
    try {
      /* Ask to KC instance for a new token */
      data = await httpsRequest(options, writeData);
    } catch (error) {
      res.status(401).json({ msg: 'Wrong credentials' });
      return;
    }

    let resp = {
      token: data.access_token,
      refresh: data.refresh_token,
    }
    res.status(201).send(resp)

  }
}

const error404 = async function (req, res) {
  /* Someone is trying to get some file that does not exist */
  res.sendFile('public/error404.html', { root: __dirname });
}

function WearHelmet() {
  /* Request headers security config */
  app.use(bodyParser.json());
  app.use(helmet.noSniff());
  app.use(helmet.dnsPrefetchControl({ allow: true, }));
  app.use(helmet.hsts({ maxAge: 999999 }));
  app.use(helmet.referrerPolicy({ policy: "no-referrer", }));
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(helmet.hidePoweredBy());
  app.use(helmet.xssFilter());
}

function noInjection(str) {
  /* Avoid SQL injection */
  return str.toString().replace(/[\\$'"]/g, "\\$&")
}

async function httpsRequest(options, writeData = undefined) {
  /* Reusable http request function */
  return new Promise(function (resolve, reject) {
    var request = https.request(options, function (response) {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error('statusCode=' + response.statusCode));
      }
      var body = [];
      response.on('data', function (chunk) {
        body.push(chunk);
      });
      response.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
        } catch (e) {
          reject(e);
        }
        resolve(body);
      });
    });
    request.on('error', function (err) {
      console.log(err)
      reject(err);
    });
    if (writeData) request.write(writeData);
    request.end();
  });
}

WearHelmet();
/* ROUTER */
// Public
app.use('*', refuseRequest)
//app.use('*', screenLogger);
app.post('/api/login', platformLogin);
// Private
app.post('/api/refresh', refreshToken);
app.use('/', express.static('public/'));
app.get('/main.html', getHiddenIndex);
// All
app.use('*', error404);
