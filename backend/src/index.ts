import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';
import http from 'http';

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors());
app.use(express.json());

// --- WebSocket (Socket.io) para Simulación P2P NFC ---
io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado:', socket.id);

  // Escuchar cuando un Teléfono "Emisor" lanza un E-Cheque
  socket.on('simulate_nfc_tap', (data) => {
    console.log('Toque NFC Simulado recibido:', data);
    // Transmitir a todos los clientes (El Teléfono TPV)
    io.emit('nfc_tap_received', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// --- API Gobernanza ---
app.get('/api/directors', async (req: express.Request, res: express.Response) => {
  const directors = await prisma.director.findMany({ orderBy: { id: 'desc' } });
  res.json(directors);
});

app.post('/api/directors', async (req: express.Request, res: express.Response) => {
  const { name, role, powerLevel, token } = req.body;
  const newDirector = await prisma.director.create({
    data: { name, role, powerLevel, token }
  });
  res.json(newDirector);
});

app.put('/api/directors/:id/toggle', async (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id as string);
  const director = await prisma.director.findUnique({ where: { id } });
  if (director) {
    const updated = await prisma.director.update({
      where: { id },
      data: { status: director.status === 'active' ? 'revoked' : 'active' }
    });
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Director not found' });
  }
});

app.delete('/api/directors/:id', async (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id as string);
  try {
    await prisma.director.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(404).json({ error: 'Director not found' });
  }
});

// --- API Factoring ---
app.get('/api/invoices', async (req: express.Request, res: express.Response) => {
  const invoices = await prisma.invoice.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(invoices);
});

app.post('/api/invoices/:id/liquidate', async (req: express.Request, res: express.Response) => {
  const id = req.params.id as string;
  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status: 'liquidated' }
  });
  
  // Aumentar Liquidez
  const liquidity = await prisma.liquidity.findUnique({ where: { id: 1 }});
  if (liquidity) {
    await prisma.liquidity.update({
      where: { id: 1 },
      data: { amount: liquidity.amount + invoice.amount }
    });
  }
  res.json(invoice);
});

// --- API Fiscal ---
app.get('/api/retentions', async (req: express.Request, res: express.Response) => {
  const retentions = await prisma.retention.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(retentions);
});

app.post('/api/retentions', async (req: express.Request, res: express.Response) => {
  const { id, date, client, baseAmount, ivaRetained, igtfRetained } = req.body;
  const retention = await prisma.retention.create({
    data: { id, date, client, baseAmount, ivaRetained, igtfRetained }
  });
  res.json(retention);
});

app.put('/api/retentions/:id/sync', async (req: express.Request, res: express.Response) => {
  const id = req.params.id as string;
  const { seniatCode } = req.body;
  const retention = await prisma.retention.update({
    where: { id },
    data: { status: 'synced', seniatCode }
  });
  res.json(retention);
});

// --- API Global Metrics ---
app.get('/api/liquidity', async (req: express.Request, res: express.Response) => {
  let liquidity = await prisma.liquidity.findUnique({ where: { id: 1 }});
  if (!liquidity) {
    liquidity = await prisma.liquidity.create({ data: { id: 1, amount: 145000 } });
  }
  res.json(liquidity);
});

app.put('/api/liquidity/subtract', async (req: express.Request, res: express.Response) => {
  const { amount } = req.body;
  const liquidity = await prisma.liquidity.findUnique({ where: { id: 1 }});
  if (liquidity) {
    const updated = await prisma.liquidity.update({
      where: { id: 1 },
      data: { amount: liquidity.amount - amount }
    });
    res.json(updated);
  } else {
    res.status(404).json({ error: 'Liquidity not found' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 ERP Backend con SQLite corriendo en http://localhost:${PORT}`);
});
