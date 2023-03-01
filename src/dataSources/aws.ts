import AWS, { StepFunctions, STS } from 'aws-sdk';
import { DynamicJson } from '../types';
import { AssumeRoleRequest } from 'aws-sdk/clients/sts';

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

		// Create an STS client with your AWS credentials
		const sts = new STS();
		
		// Assume the specified role to get temporary credentials
		const assumeRoleParams: AssumeRoleRequest = {
			RoleArn: "<Role-Arn>",
			RoleSessionName: 'AssumeRoleSession'
		};

		const assumedRole = await sts.assumeRole(assumeRoleParams).promise();
		const accuntId = assumedRole.AssumedRoleUser.Arn.split('::')[1].split(":")[0];
		const stateMachineArn = `arn:aws:states:${region}:${accuntId}:stateMachine:${stateMachineName}`;

		// Create a StepFunctions client with the temporary credentials
		const stepFunctions = new StepFunctions({
		credentials: {
			accessKeyId: assumedRole.Credentials?.AccessKeyId ?? '',
			secretAccessKey: assumedRole.Credentials?.SecretAccessKey ?? '',
			sessionToken: assumedRole.Credentials?.SessionToken ?? ''
		}
		});

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
