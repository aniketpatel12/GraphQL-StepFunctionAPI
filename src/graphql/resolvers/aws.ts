import { getExecutionStatus, getExecutionArn } from '../../dataSources/aws';
import { GraphQLJSON } from 'graphql-type-json';
import { Resolvers } from '../../__generated__/resolvers-types';

const resolvers: Resolvers = {
	JSON: GraphQLJSON,

	Query: {
		getExecutionStatus: (_parent, { exectuionId }) =>
			getExecutionStatus(exectuionId),
	},

	Mutation: {
		getExecutionArn: (_parent, { input }) => getExecutionArn(input),
	},
};

export default resolvers;
