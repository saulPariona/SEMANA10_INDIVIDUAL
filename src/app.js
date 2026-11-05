import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDatabaseConnection } from './config/db.js';
import productosRoutes from './routes/productosRoutes.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'productos-api' });
});

app.use('/api/productos', productosRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo debe contener JSON válido' });
  }
  return res.status(500).json({ error: 'Error interno del servidor' });
});

async function startServer() {
  try {
    await checkDatabaseConnection();
    app.listen(port, () => {
      console.log(`API ejecutándose en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo conectar con MySQL:', error.message);
    process.exitCode = 1;
  }
}

startServer();
