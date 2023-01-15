import * as dotenv from 'dotenv';
import { server } from './server';

dotenv.config();

try {
  server.start();
} catch (error) {
  if (error instanceof Error) {
    process.stderr.write(`An error appeared - ${error.message}`);
  }
  process.exit(1);
}
