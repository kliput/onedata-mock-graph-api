'use strict';

const express = require('express');
const WebSocket = require('ws');
const console = require('console');

const wsPath = '/graph_sync/gui';
const port = 4200;
const staticPath = 'gui_static';

const app = express();
const server = app.listen(port);
const wss = new WebSocket.Server({
  path: wsPath,
  server
});

app.use(express.static(staticPath));

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(rawMessage) {
    console.log('received: %s', rawMessage);
    const message = JSON.parse(rawMessage);
    const {
      id,
      type,
      subtype,
      payload,
    } = message;

    ws.send(JSON.stringify(subtypeHandlers[subtype](message)));
  });
});

const subtypeHandlers = {
  handshake({ id, payload: { sessionId } }) {
    return {
      id,
      type: 'response',
      subtype: 'handshake',
      payload: {
        sessionId: sessionId || '123456789',
        attributes: {
          userId: 'lol1234',
        }
      },
    };
  },
};

const exampleHandshake = {
  "id": "31712e11-dcde-4acf-f0c9-b52899ca7a41",
  "type": "request",
  "subtype": "handshake",
  "payload": {
    "supportedVersions": [1],
    "sessionId": null
  }
};
