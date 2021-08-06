import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LoginToken {
  @Field()
  accessToken: string;
}
