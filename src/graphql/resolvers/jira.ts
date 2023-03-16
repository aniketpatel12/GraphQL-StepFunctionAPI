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

	IssueResolution: {
		Done: 'Done',
		Wont_Do: "Won't Do",
		Duplicate: 'Duplicate',
		Declined: 'Declined',
	},

	Mutation: {
		createJiraTicket: (_parent, { input }) => Jira.createJiraTicket(input),

		closeJiraTicket: (_parent, { input }) => Jira.closeJiraTicket(input),

		moveToInProgressTicket: (_parent, { input }) =>
			Jira.moveToInProgressTicket(input),
	},
};

export default resolvers;
