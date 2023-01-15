import { User } from './user';
import { IUser } from './interfaces/IUser';

export class DB {
  private users: IUser[];

  constructor() {
    this.users = [];
  }

  getUsers() {
    return this.users;
  }

  getUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  addUser(payload: Omit<IUser, 'id'>) {
    const newUser = new User(payload);
    this.users.push(newUser);
    return newUser;
  }

  updateUser(userId: string, data: Partial<Omit<IUser, 'id'>>) {
    const userIdx = this.users.findIndex((user) => user.id === userId);

    if (userIdx !== -1) {
      return (this.users[userIdx] = { ...this.users[userIdx], ...data });
    } else {
      return null;
    }
  }

  removeUser(userId: string) {
    const userToRemove = this.users.find((user) => user.id === userId);
    this.users = this.users.filter((user) => user.id !== userId);
    return userToRemove;
  }
}

export const db = new DB();
