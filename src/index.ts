import * as dotenv from 'dotenv';
import { updateDB } from './utils/updateDB';
import { server } from './server';
import { setUpDB } from './utils/setUpDB';

dotenv.config();

try {
  setUpDB.init();
  server.start();

  process.on('SIGINT', async () => {
    setUpDB.close();
    process.exit();
  });
} catch (error) {
  if (error instanceof Error) {
    process.stderr.write(`An error appeared - ${error.message}`);
  }
  process.exit(1);
}
