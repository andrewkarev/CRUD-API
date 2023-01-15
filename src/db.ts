import { User } from './user';
import { IUser } from './interfaces/IUser';
import { readDataFromDB } from './utils/readDataFromDB';
import { updateDB } from './utils/updateDB';

export class DB {
  async getUsers() {
    return await readDataFromDB();
  }

  async getUser(userId: string) {
    const users = await readDataFromDB();
    return users.find((user) => user.id === userId);
  }

  async addUser(payload: Omit<IUser, 'id'>) {
    const newUser = new User(payload);
    const users = await readDataFromDB();

    users.push(newUser);
    await updateDB(users);

    return newUser;
  }

  async updateUser(userId: string, data: Partial<Omit<IUser, 'id'>>) {
    const users = await readDataFromDB();
    const userIdx = users.findIndex((user) => user.id === userId);

    if (userIdx !== -1) {
      users[userIdx] = { ...users[userIdx], ...data };
      await updateDB(users);

      return users[userIdx];
    } else {
      return null;
    }
  }

  async removeUser(userId: string) {
    const users = await readDataFromDB();
    const userToRemove = users.find((user) => user.id === userId);
    const updatedUsersList = users.filter((user) => user.id !== userId);

    await updateDB(updatedUsersList);

    return userToRemove;
  }
}

export const db = new DB();
