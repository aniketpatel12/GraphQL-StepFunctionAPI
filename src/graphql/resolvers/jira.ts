import { GraphQLJSON } from 'graphql-type-json';
import { createJiraTicket } from '../../dataSources/jira';
import { Resolvers } from '../../__generated__/resolvers-types';

const resolvers: Resolvers = {
	JSON: GraphQLJSON,

	Mutation: {
		createJiraTicket: (_parent, { input }) => createJiraTicket(input),
	},
};

export default resolvers;
