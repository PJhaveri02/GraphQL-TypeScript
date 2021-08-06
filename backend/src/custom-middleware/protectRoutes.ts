import { verify } from 'jsonwebtoken';
import { IContext } from '../interface/IContext';
import { MiddlewareFn } from 'type-graphql';

export const ValidateAccess: MiddlewareFn<IContext> = async ({ context }, next) => {
  const token = context.req.headers['authorization'];
  if (!token) {
    throw new Error('Token does not exist');
  }

  try {
    const decode = verify(token.split(' ')[1], process.env.ACCESS_TOKEN!);
    if (!decode) {
      throw new Error('Invalid Token');
    }
  } catch (error) {
    console.log('toke auth error');
  }
  return next();
};
