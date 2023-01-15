import * as dotenv from 'dotenv';
import { updateDB } from './utils/updateDB';
import { server } from './server';

dotenv.config();

try {
  server.start();
  process.on('SIGINT', async () => {
    await updateDB([]);
    process.exit();
  });
} catch (error) {
  if (error instanceof Error) {
    process.stderr.write(`An error appeared - ${error.message}`);
  }
  process.exit(1);
}
