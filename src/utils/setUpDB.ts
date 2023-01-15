import fs from 'node:fs';
import { getDBPath } from './getDBPath';

export const setUpDB = {
  pathToDB: getDBPath(),
  init() {
    fs.writeFile(this.pathToDB, '[]', (err) => {
      if (err) throw err;
    });
  },
  close() {
    fs.unlink(this.pathToDB, (err) => {
      if (err) throw err;
    });
  },
};
