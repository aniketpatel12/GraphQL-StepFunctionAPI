import { gql } from 'apollo-server-express';

const typeDefs = gql`
	enum IssueType {
		Task
		Bug
		Story
	}
	enum IssuePriority {
		Highest
		High
		Medium
		Low
		Lowest
	}
	type TicketType {
		title: String!
		type: IssueType!
		priority: IssuePriority!
		projectId: String!
		description: String
	}
	input TicketType {
		title: String!
		type: IssueType!
		priority: IssuePriority!
		projectId: String!
		description: String
	}
	type Mutation {
		createJiraTicket(input: TicketType!): String!
	}
`;

export default typeDefs;
