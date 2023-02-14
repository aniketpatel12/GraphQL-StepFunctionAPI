import { ApolloServer } from 'apollo-server-express';
import AWS from 'aws-sdk';
import express from 'express';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

const PORT = process.env.PORT || 4000;

AWS.config.update({ region: 'us-east-1' });
// AWS.config.loadFromPath('./config.json');

// AWS Step Function client
export const stepFunctions = new AWS.StepFunctions();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
	server.applyMiddleware({ app });
	app.listen({ port: PORT }, () =>
		console.log(
			`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
		)
	);
});
