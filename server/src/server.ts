import dotenv from 'dotenv';
import connectDB from '@/config/db';

import app from '@/app';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  app.listen({ port: PORT, host: HOST }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    connectDB();
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();