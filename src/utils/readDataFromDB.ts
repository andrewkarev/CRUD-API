import { IUser } from 'interfaces/IUser';
import fs from 'node:fs/promises';
import { join, dirname } from 'node:path';

export const readDataFromDB = async () => {
  const pathToDB = join(dirname(__dirname), 'data.json');
  const data = await fs.readFile(pathToDB, 'utf-8');

  return JSON.parse(data) as IUser[];
};
