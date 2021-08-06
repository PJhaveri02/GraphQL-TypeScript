import { sign } from 'jsonwebtoken';

export const generateAccessToken = (userId: string): string => {
  const token = sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      userId,
    },
    process.env.ACCESS_TOKEN!
  );

  if (!token) {
    throw new Error('Could not generate token');
  }

  return token;
};

export const generateRefrestToken = (userId: string): string => {
  const token = sign(
    {
      exp: (Math.floor(Date.now() / 1000) + 60 * 60) * 24,
      userId,
    },
    process.env.REFRESH_TOKEN!
  );

  if (!token) {
    throw new Error('Could not generate token');
  }

  return token;
};
