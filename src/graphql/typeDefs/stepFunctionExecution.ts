import { gql } from 'apollo-server-express';

const typeDefs = gql`
	scalar JSON

	type Mutation {
		getExecutionArn(input: JSON): JSON
	}

	type Query {
		getExecutionStatus(exectuionId: String!): String!
	}
`;

export default typeDefs;
