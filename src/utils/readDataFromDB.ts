import fs from 'node:fs/promises';
import { IUser } from 'interfaces/IUser';
import { getDBPath } from './getDBPath';

export const readDataFromDB = async () => {
  const pathToDB = getDBPath();
  const data = await fs.readFile(pathToDB, 'utf-8');

  return JSON.parse(data) as IUser[];
};
