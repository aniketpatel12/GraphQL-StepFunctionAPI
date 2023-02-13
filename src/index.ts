import { ApolloServer, gql } from 'apollo-server-express';
import AWS from 'aws-sdk';
import express from 'express';
import { GraphQLJSON } from 'graphql-type-json';

AWS.config.update({ region: 'us-east-1' });
// AWS.config.loadFromPath('./config.json');

const typeDefs = gql`
  scalar JSON

  type Mutation {
    getExecutionArn(input: JSON): JSON
  }

  type Query {
    getExecutionStatus(exectuionId: String!): String!
  }
`;

type DynamicJsonWithStepFunctionName = {
  [key: string]: string;
} & {
  stateFunctionName: string;
};

// AWS Step Function client
const stepFunctions = new AWS.StepFunctions();

const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getExecutionStatus: async (
      _,
      { exectuionId }
    ) => {
      try {
        const executionArn = exectuionId as string;
        const { status } = await stepFunctions
          .describeExecution({
            executionArn,
          })
          .promise();

        console.log('Execution Arn:', exectuionId);
        console.log('Status:', status);
        return status;
      } catch (error) {
        console.error(error);
        throw new Error(
          'An error occurred while fetching the status of the Step Function execution'
        );
      }
    },
  },
  Mutation: {
    getExecutionArn: async (
      _,
      { input }: { input: DynamicJsonWithStepFunctionName }
    ) => {
      try {
        // Input for the Step Function
        const updatedStepFunctionInput = input;
        const stateMachineName = input.stateFunctionName;

        // Filter out stateFunctionName from JSON
        delete updatedStepFunctionInput.stateFunctionName;

        const region = 'us-east-1';
        const sts = new AWS.STS();
        const data = await sts.getCallerIdentity().promise();
        const account = data.Account;
        const stateMachineArn = `arn:aws:states:${region}:${account}:stateMachine:${stateMachineName}`;
        // Start an execution
        const { executionArn } = await stepFunctions
          .startExecution({
            stateMachineArn,
            input: JSON.stringify(updatedStepFunctionInput),
          })
          .promise();
        return executionArn;
      } catch (error) {
        console.error(error);
        throw new Error(
          'An error occurred while starting the Step Function execution'
        );
      }
    },
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () =>
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    )
  );
});
