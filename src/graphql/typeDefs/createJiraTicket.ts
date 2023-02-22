import { gql } from 'apollo-server-express';

const typeDefs = gql`
	scalar JSON

	type Mutation {
		createJiraTicket(input: JSON): JSON
	}
`;

export default typeDefs;
