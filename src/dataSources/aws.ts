import AWS, { StepFunctions, STS } from 'aws-sdk';
import { DynamicJson } from '../types';
import { AssumeRoleRequest, AssumeRoleResponse } from 'aws-sdk/clients/sts';

type DynamicJsonWithStepFunctionName = DynamicJson & {
	stateFunctionName: string;
};

class AwsDataSource {
	private stepFunctionClient: AWS.StepFunctions;
	private sts: AWS.STS;

	constructor() {
		AWS.config.update({ region: 'us-east-1' });
		// AWS.config.loadFromPath('./config.json');

		// Initialize the Aws StepFunction Client
		this.stepFunctionClient = new AWS.StepFunctions();
		// Initialize the Aws STS Client
		this.sts = new STS();
	}

	getExecutionStatus = async (executionArn: string) => {
		try {
			const { status } = await this.stepFunctionClient
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

	getAssumeRole = async (assumeRoleParams: AssumeRoleRequest) => {
		return await this.sts.assumeRole(assumeRoleParams).promise();
	};

	getAccountIdFromAssumeRole = (assumedRole: AssumeRoleResponse) =>
		assumedRole.AssumedRoleUser.Arn.split('::')[1].split(':')[0];

	getStateMachineArn = (
		region: string,
		accountId: string,
		stateMachineName: string
	) =>
		`arn:aws:states:${region}:${accountId}:stateMachine:${stateMachineName}`;

	createStepFunction = (assumedRole: AssumeRoleResponse) => {
		return new StepFunctions({
			credentials: {
				accessKeyId: assumedRole.Credentials?.AccessKeyId ?? '',
				secretAccessKey: assumedRole.Credentials?.SecretAccessKey ?? '',
				sessionToken: assumedRole.Credentials?.SessionToken ?? '',
			},
		});
	};

	getExecutionArn = async (input: DynamicJsonWithStepFunctionName) => {
		try {
			// Input for the Step Function
			const stepFunctionInputCopy = structuredClone(input);
			const stateMachineName = input.stateFunctionName;

			// Filter out stateFunctionName from JSON
			delete stepFunctionInputCopy.stateFunctionName;

			// Assume the specified role to get temporary credentials
			const assumeRoleParams: AssumeRoleRequest = {
				RoleArn: '<Role-Arn>',
				RoleSessionName: 'AssumeRoleSession',
			};

			const region = 'us-east-1';
			const assumedRole = await this.getAssumeRole(assumeRoleParams);
			const accuntId = this.getAccountIdFromAssumeRole(assumedRole);

			const stateMachineArn = this.getStateMachineArn(
				region,
				accuntId,
				stateMachineName
			);

			// Create a StepFunctions client with the temporary credentials
			const stepFunctions = this.createStepFunction(assumedRole);

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
}

// Singleton Aws Instance
export default new AwsDataSource();
