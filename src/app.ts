import http from 'http';
import { DB, db } from './db';
import { parseURL } from './utils/parseURL';
import { checkIfValidUUID } from './utils/checkIfValidUUID';
import { sendResponse } from './utils/sendResponse';
import { responseStatusCodes } from './common/responseStatusCodes';
import { isReqDataValid } from './utils/isReqDataValid';

export class App {
  constructor(private db: DB) {
    this.db = db;
  }

  private async getUsers(res: http.ServerResponse) {
    const users = this.db.getUsers();

    sendResponse(res, responseStatusCodes.OK, users);
  }

  private async getUser(userId: string, res: http.ServerResponse) {
    const isValidId = checkIfValidUUID(userId);

    if (isValidId) {
      const user = this.db.getUser(userId);

      if (user) {
        sendResponse(res, responseStatusCodes.OK, user);
      } else {
        sendResponse(res, responseStatusCodes.NOT_FOUND, {
          error: `User with id ${userId} doesn't exist`,
        });
      }
    } else {
      sendResponse(res, responseStatusCodes.BAD_REQUEST, {
        error: 'Provided id is not valid uuid id',
      });
    }
  }

  private async updateUser(req: http.IncomingMessage, res: http.ServerResponse, userId: string) {
    let data: string = '';

    req.on('data', (dataChunk) => {
      data += dataChunk;
    });

    req.on('end', () => {
      const body = JSON.parse(data);
      const updatedUser = this.db.updateUser(userId, body);

      if (updatedUser) {
        sendResponse(res, responseStatusCodes.OK, updatedUser);
      } else {
        sendResponse(res, responseStatusCodes.NOT_FOUND, {
          error: `User with id ${userId} doesn't exist`,
        });
      }
    });
  }

  private async handleGetRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const userId = req.url ? parseURL(req.url) : null;

    if (userId) {
      this.getUser(userId, res);
    } else {
      this.getUsers(res);
    }
  }

  private async handlePostRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    let data: string = '';

    req.on('data', (dataChunk) => {
      data += dataChunk;
    });

    req.on('end', () => {
      const body = JSON.parse(data);
      const isValid = isReqDataValid(body);

      if (isValid) {
        const newUser = this.db.addUser(body);

        sendResponse(res, responseStatusCodes.CREATED, newUser);
      } else {
        sendResponse(res, responseStatusCodes.BAD_REQUEST, {
          error: 'body does not contain required fields',
        });
      }
    });
  }

  private async handlePutRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const userId = req.url ? parseURL(req.url) : null;

    if (userId) {
      const isValidId = checkIfValidUUID(userId);

      if (isValidId) {
        this.updateUser(req, res, userId);
      } else {
        sendResponse(res, responseStatusCodes.BAD_REQUEST, {
          error: 'Provided id is not valid uuid id',
        });
      }
    } else {
      sendResponse(res, responseStatusCodes.NOT_FOUND, { error: `User id is not provided` });
    }
  }

  private async handleDeleteRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    const userId = req.url ? parseURL(req.url) : null;

    if (userId) {
      const isValidId = checkIfValidUUID(userId);

      if (isValidId) {
        const deletedUser = this.db.removeUser(userId);

        if (deletedUser) {
          sendResponse(res, responseStatusCodes.NO_CONTENT, deletedUser);
        } else {
          sendResponse(res, responseStatusCodes.NOT_FOUND, {
            error: `User with id ${userId} doesn't exist`,
          });
        }
      } else {
        sendResponse(res, responseStatusCodes.BAD_REQUEST, {
          error: 'Provided id is not valid uuid id',
        });
      }
    } else {
      sendResponse(res, responseStatusCodes.NOT_FOUND, { error: `User id is not provided` });
    }
  }

  async handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    try {
      res.setHeader('Content-Type', 'application/json');

      const url = req.url;

      if (url && !url.startsWith('/api/users') && !/\/api\/users/.test(url)) {
        sendResponse(res, responseStatusCodes.NOT_FOUND, { error: `${url} doesn't exist` });

        return;
      }

      switch (req.method) {
        case 'GET':
          await this.handleGetRequest(req, res);
          break;
        case 'POST':
          await this.handlePostRequest(req, res);
          break;
        case 'PUT':
          await this.handlePutRequest(req, res);
          break;
        case 'DELETE':
          await this.handleDeleteRequest(req, res);
          break;
        default:
          sendResponse(res, responseStatusCodes.NOT_IMPLEMENTED, {
            error: 'HTTP method is not supported',
          });
      }
    } catch (error) {
      sendResponse(res, responseStatusCodes.INTERNAL_SERVER_ERROR, {
        error: 'Internal Server Error',
      });
    }
  }
}

export const app = new App(db);
