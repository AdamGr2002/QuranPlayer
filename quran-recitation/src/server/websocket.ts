import { WebSocketServer } from 'ws';
import http from 'http';

export function setupWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ server });

  let listeners = 0;

  wss.on('connection', (ws) => {
    listeners++;
    broadcastListeners();

    ws.on('close', () => {
      listeners--;
      broadcastListeners();
    });
  });

  function broadcastListeners() {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ listeners }));
    });
  }

  // Simulate some fluctuation in listener count
  setInterval(() => {
    const change = Math.floor(Math.random() * 5) - 2; // Random number between -2 and 2
    listeners = Math.max(0, listeners + change);
    broadcastListeners();
  }, 5000);
}