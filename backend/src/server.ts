import { ApolloServer } from 'apollo-server-express';
import { config } from 'dotenv';
import express from 'express';
import { connect } from 'mongoose';
import { buildSchema } from 'type-graphql';
import { initialiseDB } from './initialise-db';
import { UserResolver } from './resolvers/UserResolver';

(async () => {
  config({ path: __dirname + '../../.env' });
  const schema = await buildSchema({
    resolvers: [UserResolver],
    emitSchemaFile: true,
    validate: false,
  });

  // create mongoose connection
  const mongoose = await connect('mongodb://localhost:27017/graph', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection;
  await initialiseDB();

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      const context = {
        req,
        res,
      };
      return context;
    },
  });
  const app: any = express();
  server.applyMiddleware({ app });
  app.listen(4000, () => console.log('server started'));
})().catch((err) => console.error(err));
