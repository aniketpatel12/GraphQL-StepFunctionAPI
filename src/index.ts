import { ApolloServer } from 'apollo-server-express';
import AWS from 'aws-sdk';
import express from 'express';
import * as dotenv from 'dotenv';
import { Version3Client } from 'jira.js';
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

export const client = new Version3Client({
	host: 'https://aniket-jira.atlassian.net',
	authentication: {
		basic: {
			email: 'patelaniket128@gmail.com',
			apiToken:
				'ATATT3xFfGF0Yoy6vjQw_pLyeu-e5-R6mSdxDI1P0M3ndlK6WyFBqoxCXoiB5oCYvfNn7pODdVyl7VHZtDlDmhRPq2yqz-aDI8NVvTX2MxITxPxghS9sykDZ4Z2GTYSfhN-gDoqojBr2nHWz6YzrZuoC3YisoNE_0Vv8SBgTPAUKqY7H_qCEF5M=8CEE0715',
		},
	},
	newErrorHandling: true,
});

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
