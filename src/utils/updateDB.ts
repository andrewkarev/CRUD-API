import fs from 'node:fs/promises';
import { IUser } from 'interfaces/IUser';
import { getDBPath } from './getDBPath';

export const updateDB = async (data: IUser[]) => {
  const pathToDB = getDBPath();
  await fs.writeFile(pathToDB, JSON.stringify(data));
};
