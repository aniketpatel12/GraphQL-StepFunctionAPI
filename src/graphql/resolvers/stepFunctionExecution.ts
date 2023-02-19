import AWS from 'aws-sdk';
import { GraphQLJSON } from 'graphql-type-json';
import { stepFunctions } from '../..';

type DynamicJsonWithStepFunctionName = {
	[key: string]: string;
} & {
	stateFunctionName: string;
};

const resolvers = {
	JSON: GraphQLJSON,
	Query: {
		getExecutionStatus: async (
			_,
			{ exectuionId }: { exectuionId: string }
		) => {
			try {
				const { status } = await stepFunctions
					.describeExecution({
						executionArn: exectuionId,
					})
					.promise();
				return status;
			} catch (error) {
				console.error(
					'An error occurred while fetching the status of the Step Function execution',
					error
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
				const stepFunctionInputCopy = structuredClone(input);
				const stateMachineName = input.stateFunctionName;

				// Filter out stateFunctionName from JSON
				delete stepFunctionInputCopy.stateFunctionName;

				const region = 'us-east-1';
				const sts = new AWS.STS();
				const data = await sts.getCallerIdentity().promise();
				const stateMachineArn = `arn:aws:states:${region}:${data.Account}:stateMachine:${stateMachineName}`;

				// Start an execution
				const { executionArn } = await stepFunctions
					.startExecution({
						stateMachineArn,
						input: JSON.stringify(stepFunctionInputCopy),
					})
					.promise();
				return executionArn;
			} catch (error) {
				console.error(
					'An error occurred while starting the Step Function execution',
					error
				);
			}
		},
	},
};

export default resolvers;
