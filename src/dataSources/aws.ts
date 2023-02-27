import AWS from 'aws-sdk';
import { DynamicJson } from '../types';

AWS.config.update({ region: 'us-east-1' });
// AWS.config.loadFromPath('./config.json');

// AWS Step Function client
const stepFunctions = new AWS.StepFunctions();

type DynamicJsonWithStepFunctionName = DynamicJson & {
	stateFunctionName: string;
};

export const getExecutionStatus = async (executionArn: string) => {
	try {
		const { status } = await stepFunctions
			.describeExecution({
				executionArn,
			})
			.promise();
		return status;
	} catch (error) {
		console.error(
			'An error occurred while fetching the status of the Step Function execution',
			error
		);
	}
};

export const getExecutionArn = async (
	input: DynamicJsonWithStepFunctionName
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
};
