import AwsClient from '../../dataSources/aws';
import { GraphQLJSON } from 'graphql-type-json';
import { Resolvers } from '../../__generated__/resolvers-types';

const resolvers: Resolvers = {
	JSON: GraphQLJSON,

	Query: {
		getExecutionStatus: (_parent, { exectuionId }) =>
			AwsClient.getExecutionStatus(exectuionId),
	},

	Mutation: {
		getExecutionArn: (_parent, { input }) =>
			AwsClient.getExecutionArn(input),
	},
};

export default resolvers;
