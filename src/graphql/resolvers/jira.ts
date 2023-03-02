import { GraphQLJSON } from 'graphql-type-json';
import Jira from '../../dataSources/jira';
import { Resolvers } from '../../__generated__/resolvers-types';

const resolvers: Resolvers = {
	JSON: GraphQLJSON,

	IssueType: {
		Task: 'Task',
		Problem: '[System] Problem',
		Service_Request: '[System] Service request',
	},

	IssuePriority: {
		Highest: '1',
		High: '2',
		Medium: '3',
		Low: '4',
		Lowest: '5',
	},

	Mutation: {
		createJiraTicket: (_parent, { input }) => Jira.createJiraTicket(input),
	},
};

export default resolvers;
