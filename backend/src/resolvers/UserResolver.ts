import { verify } from 'jsonwebtoken';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ValidateAccess } from '../custom-middleware/protectRoutes';
import { LoginToken } from '../entites/LoginToken';
import { User, UserModel } from '../entites/User';
import { IContext } from '../interface/IContext';
import { IDecode } from '../interface/IDecode';
import { generateAccessToken, generateRefrestToken } from '../token/tokenGeneration';

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  @UseMiddleware(ValidateAccess)
  async user(@Ctx() { req }: IContext) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new Error('Invalid Token');
    }

    let userId: string | null = null;
    try {
      const payload = verify(token, process.env.ACCESS_TOKEN!) as IDecode;
      userId = payload.userId;
    } catch (err) {
      console.log(err);
      throw new Error('Invalid Token Resolver');
    }

    return await UserModel.findById({ _id: userId });
  }

  @Mutation(() => LoginToken)
  async login(
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string,
    @Ctx() { res }: IContext
  ): Promise<LoginToken> {
    const user = await UserModel.findOne({ firstname, lastname });
    if (!user) {
      throw new Error('Invalid login credentials');
    }

    const token = generateAccessToken(user._id);

    res.cookie('qid', generateRefrestToken(user._id), {
      httpOnly: true,
    });

    const loginToken = new LoginToken();
    loginToken.accessToken = token;
    return loginToken;
  }

  @Mutation(() => LoginToken)
  refreshAccessToken(@Ctx() { req, res }: IContext) {
    let refreshToken = req.headers['cookie'];
    if (!refreshToken) {
      throw new Error('No Refresh Token');
    }

    refreshToken = refreshToken.substring(4, refreshToken.length);
    let userId: string | null = null;
    try {
      const decode = verify(refreshToken, process.env.REFRESH_TOKEN!) as IDecode;
      userId = decode.userId;
    } catch (err) {
      console.log(err);
      throw new Error('Invalid Refresh Token');
    }

    res.cookie('qid', generateRefrestToken(userId), {
      httpOnly: true,
    });

    const loginToken = new LoginToken();
    loginToken.accessToken = generateAccessToken(userId);
    return loginToken;
  }
}
