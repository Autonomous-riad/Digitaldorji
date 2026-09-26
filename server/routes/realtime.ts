import { Router, Request, Response } from 'express';

export const realtimeRouter = Router();

// Store active Server-Sent Event client connections
const clients: Set<Response> = new Set();

/**
 * GET /api/realtime/events
 * Real-time SSE channel for live order updates
 */
realtimeRouter.get('/events', (req: Request, res: Response) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Initial handshake
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  clients.add(res);

  // Keep-alive heartbeat every 20s
  const heartbeat = setInterval(() => {
    if (!res.writableEnded) {
      res.write(': keepalive\n\n');
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients.delete(res);
  });
});

/**
 * POST /api/realtime/broadcast
 * Broadcast notification payload to all active clients
 */
realtimeRouter.post('/broadcast', (req: Request, res: Response) => {
  const { notification, order } = req.body;
  if (!notification) {
    return res.status(400).json({ error: 'Notification payload required' });
  }

  broadcastServerNotification(notification, order);
  res.json({ success: true, clientCount: clients.size });
});

/**
 * Internal helper to broadcast to all connected web clients
 */
export function broadcastServerNotification(notification: any, order?: any) {
  const payload = JSON.stringify({
    type: 'order_status_update',
    notification,
    order
  });

  clients.forEach((client) => {
    try {
      if (!client.writableEnded) {
        client.write(`data: ${payload}\n\n`);
      }
    } catch {
      clients.delete(client);
    }
  });
}
