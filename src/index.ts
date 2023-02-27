import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import typeDefs from './graphql/schemas';
import resolvers from './graphql/resolvers';

// Load environment variables

const PORT = process.env.PORT || 4000;

const start = async () => {
	const app = express();
	const server = new ApolloServer({ typeDefs, resolvers });

	await server.start();

	server.applyMiddleware({ app });

	app.listen({ port: PORT }, () =>
		console.log(
			`🚀 Server ready at ${process.env.BACK_END_ENDPOINT}${PORT}${server.graphqlPath}`
		)
	);
};

start().catch((err) => console.log(err));
