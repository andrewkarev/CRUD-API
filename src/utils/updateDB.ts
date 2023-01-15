import { IUser } from 'interfaces/IUser';
import fs from 'node:fs/promises';
import { join, dirname } from 'node:path';

export const updateDB = async (data: IUser[]) => {
  const pathToDB = join(dirname(__dirname), 'data.json');
  await fs.writeFile(pathToDB, JSON.stringify(data));
};
