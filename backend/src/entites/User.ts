import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import { Field, ID, ObjectType, Root } from 'type-graphql';

@ObjectType({ description: 'User Model' })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  getFullName(@Root() parent: any): string {
    const newParent = parent as User;
    return `${newParent.firstname} ${newParent.lastname}`;
  }

  @Field()
  @Property()
  firstname: string;

  @Field()
  @Property()
  lastname: string;
}

export const UserModel = getModelForClass(User);
