import { ApolloServer } from 'apollo-server-express';
import AWS from 'aws-sdk';
import express from 'express';
import * as dotenv from 'dotenv';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

AWS.config.update({ region: 'us-east-1' });
// AWS.config.loadFromPath('./config.json');

// AWS Step Function client
export const stepFunctions = new AWS.StepFunctions();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

const start = async () => {
	try {
		await server.start();
		server.applyMiddleware({ app });
		app.listen({ port: PORT }, () =>
			console.log(
				`🚀 Server ready at ${process.env.BACK_END_ENDPOINT}${PORT}${server.graphqlPath}`
			)
		);
	} catch (error) {
		console.error(error);
	}
};

start();
