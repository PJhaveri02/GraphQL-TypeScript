import { UserModel } from './entites/User';

export const initialiseDB = async () => {
  const numberOfUsers = (await UserModel.find({})).length;
  if (numberOfUsers > 0) {
    return;
  }

  await UserModel.deleteMany({});
  const dummyUser = new UserModel({
    firstname: 'Pranay',
    lastname: 'Jhaveri',
  });
  await dummyUser.save();
};
