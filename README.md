# TON Connect

**Important:** this is an alpha version intended for review and experiments. Do not use in production until the spec is finalized.

This library contains necessary functionality to implement TON Connect on the client and the server.

[📄 TON Connect Specification](TonConnectSpecification.md)

## How to run the demo

### Install localtunnel

```md
npx localtunnel --port 8080
```

### Put domain name into .env

```md
your url is: https://unique-string.loca.lt
```

Take only `unique-string.loca.lt` and put it `.env`:

```md
cd server-example
cp .env.example .env
```

`.env`:

```md
HOSTNAME=unique-string.loca.lt
```

### Run

Install packages and start:

```md
yarn install
yarn start
```

## How to use the server API

```js
// Generate static secret with generateServerSecret();
// and put static secret to env vars or config
import { generateServerSecret } from '@tonapps/tonlogin-server';
console.log(generateServerSecret());


// Create a TonLogin object configured with a static secret.
const tonlogin = new TonLoginServer({ staticSecret: "%fsa$tgs..." });

// When we need to authenticate the user, create an authentication request:
const request = tonlogin.generateAuthRequest({
    image_url: '<logo-url>',
    return_url: '<endpoint-url>',
    items: [{
        type: 'ton-address', 
        require: true
    }],
})

res.send(request);
 
// Example: Tonkeeper deeplink:
// Provide the user with the URL to download that request.
const requestURL = `example.com/myrequest`;
const deeplinkURL = `https://app.tonkeeper.com/ton-login/${requestURL}`;
```

Decode Auth Response

```js
const decodedResponse = tonlogin.decodeAuthResponse(encodedResponse);

console.log(decodedResponse.client_id, decodedResponse.payload);
```

[AuthPayload specification](TonConnectSpecification.md#auth-payload)





