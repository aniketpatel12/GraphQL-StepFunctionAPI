import { Version3Client } from 'jira.js';
import {
	IssuePriority,
	IssueType,
	TicketInputType,
} from '../__generated__/resolvers-types';

const client = new Version3Client({
	host: process.env.JIRA_HOST,
	authentication: {
		basic: {
			email: process.env.JIRA_EMAIL,
			apiToken: process.env.JIRA_API_TOKEN,
		},
	},
	newErrorHandling: true,
});

export const createJiraTicket = async (input: TicketInputType) => {
	try {
		const { title, type, priority, projectId, description } = input;

		const project = await client.projects.getProject({
			projectIdOrKey: projectId,
		});

		const { id } = await client.issues.createIssue({
			fields: {
				project: {
					key: project.key,
				},
				summary: title,
				description: JSON.stringify(description),
				issuetype: {
					name: IssueType[type],
				},
				priority: {
					id: IssuePriority[priority],
				},
			},
		});

		return id;
	} catch (error) {
		console.error('An error occurred while creating jira ticket', error);
	}
};
