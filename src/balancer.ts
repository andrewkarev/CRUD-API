import cluster from 'cluster';
import * as dotenv from 'dotenv';
import { cpus } from 'os';
import { pid } from 'process';
import { PORT } from './common/constants';
import { server } from './server';
import { updateDB } from './utils/updateDB';

dotenv.config();

try {
  if (cluster.isPrimary) {
    const cpusQuantity = cpus().length;
    console.log(`Master ${pid} is running`);

    server.start();

    for (let i = 1; i <= cpusQuantity; i++) {
      cluster.fork({ PORT: Number(PORT) + i });
    }

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    server.start();
  }

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
