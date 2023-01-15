import { IUser } from 'interfaces/IUser';

export const isReqDataValid = (object: unknown): object is Omit<IUser, 'id'> => {
  let isValidData = false;

  if (object && typeof object === 'object') {
    isValidData = 'age' in object && 'username' in object && 'hobbies' in object;
  }

  return isValidData;
};
