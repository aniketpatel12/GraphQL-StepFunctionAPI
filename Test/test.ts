import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import AWS from 'aws-sdk';
import { GraphQLJSON } from 'graphql-type-json';

AWS.config.update({region:'us-east-1'});

const typeDefs = gql`
  scalar JSON

  type Mutation {
    getExecutionArn(input: JSON): JSON
  }
  
  type Query{
    getExecutionStatus(exectuionId: String): String
  }
`;

// Your AWS Step Function client
const stepFunctions = new AWS.StepFunctions();

const resolvers = {
  JSON: GraphQLJSON,
  Query:{
    getExecutionStatus: async (_, {exectuionId} ) =>{
      try{

        const executionArn = exectuionId as string
        // // Get the status of the execution
        // const getStepFunctionStatus =  async () => {
        //     const { status } = await stepFunctions
        //     .describeExecution({
        //       executionArn
        //     }).promise();
        //     return status;
        // }
        // let status = await getStepFunctionStatus();
        // while(status !== 'SUCCEEDED'){
        //     status = await getStepFunctionStatus();
        // }
        
        const { status } = await stepFunctions
            .describeExecution({
              executionArn
        }).promise();
        
        console.log("Execution Arn:",executionArn);
        console.log("Status:", status)
        return status;

      }catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching the status of the Step Function execution');
      }
    }
  },
  Mutation: {
    getExecutionArn: async (_, { input }) => {

      try {
         // Your input for the Step Function
        const stepFunctionInput = JSON.stringify(input);
        
        // Start an execution and wait for the response
        const { executionArn } = await stepFunctions
          .startExecution({
            stateMachineArn: 'arn:aws:states:us-east-1:016293920362:stateMachine:HelloWorld',
            input: stepFunctionInput,
          })
          .promise();
        return executionArn;
    
      } catch (error) {
        console.error(error);
        throw new Error('An error occurred while starting the Step Function execution');
      }
    },
  },
};


const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(res => {
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
  });

