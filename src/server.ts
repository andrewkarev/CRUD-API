import http from 'http';
import { PORT } from './common/constants';
import { App, app } from './app';

export class Server {
  private server: http.Server;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.server = http.createServer();
  }

  public start() {
    this.server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    this.server.on('request', async (req, res) => await this.app.handleRequest(req, res));
  }
}

export const server = new Server(app);
