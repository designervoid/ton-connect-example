import { engine } from 'express-handlebars';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { TonLoginServer, generateServerSecret } from '@tonapps/tonlogin-server';
import {config} from 'dotenv';

config();

// use generateServerSecret();
const staticSecret = generateServerSecret();
const port = 8080;

function init() {
  const host = 'localhost';
  const hostname = process.env.LT_HOSTNAME;
  const app = express();
  
  app.use(cors());
  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", path.resolve(__dirname, "./views"));

  const tonlogin = new TonLoginServer({ staticSecret });

  app.get('/authRequest', (req, res) => {
    const request = tonlogin.generateAuthRequest({
      image_url: 'https://ddejfvww7sqtk.cloudfront.net/images/landing/ton-nft-tegro-dog/avatar/image_d0315e1461.jpg',
      return_url: `${hostname}/tonlogin`,
      items: [{
        type: 'ton-address',
        require: true
      }],
    });

    res.send(request);
  });

  app.get('/tonlogin', (req, res) => {
    try {
      const encodedResponse = req.query.tonlogin as string;
      const decodedResponse = tonlogin.decodeAuthResponse(encodedResponse);

      console.log(decodedResponse.client_id, decodedResponse.payload);

      res.send(decodedResponse);
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: true });
    }
  });

  app.get('/', (req, res) => {
    res.render('home', { 
      layout: false,
      requestEndpoint: `${hostname}/authRequest` 
    });
  });

  app.listen(port, host, () => {
    console.log(`Server running at ${hostname}`);
  });
}

init();