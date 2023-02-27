import { gql } from 'apollo-server-express';

const typeDefs = gql`
	scalar JSON

	enum IssueType {
		Task
		Problem
		Service_Request
	}

	enum IssuePriority {
		Highest
		High
		Medium
		Low
		Lowest
	}

	input TicketInputType {
		title: String!
		type: IssueType!
		priority: IssuePriority!
		projectId: String!
		description: JSON
	}

	type Mutation {
		createJiraTicket(input: TicketInputType!): String!
	}
`;

export default typeDefs;
