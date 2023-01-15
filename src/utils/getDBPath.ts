import { join, dirname } from 'node:path';

export const getDBPath = () => {
  return join(dirname(__dirname), 'data.json');
};
