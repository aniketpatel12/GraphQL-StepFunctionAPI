import { Version3Client } from 'jira.js';
import { TicketInputType } from '../__generated__/resolvers-types';
import { CreateIssue } from 'jira.js/out/version3/parameters';

class JiraDataSource {
	private client: Version3Client;

	constructor(config: { host: string; email: string; apiToken: string }) {
		// Initialize the Jira Client
		this.client = new Version3Client({
			host: config.host,
			authentication: {
				basic: {
					email: config.email,
					apiToken: config.apiToken,
				},
			},
			newErrorHandling: true,
		});
	}

	getProject = async (projectId: string) => {
		return await this.client.projects.getProject({
			projectIdOrKey: projectId,
		});
	};

	createJiraTicketTemplate = (
		project: { key: string } & TicketInputType
	): CreateIssue => {
		return {
			fields: {
				project: {
					key: project.key,
				},
				summary: project.title,
				description: JSON.stringify(project.description),
				issuetype: {
					name: project.type,
				},
				priority: {
					id: project.priority,
				},
			},
		};
	};

	createJiraTicket = async (input: TicketInputType) => {
		try {
			const { projectId } = input;

			const { key } = await this.getProject(projectId);

			const { id } = await this.client.issues.createIssue(
				this.createJiraTicketTemplate({ key, ...input })
			);
			return id;
		} catch (error) {
			console.error(
				'An error occurred while creating jira ticket',
				error
			);
		}
	};
}

// Singleton Jira Instance
export default new JiraDataSource({
	host: process.env.JIRA_HOST,
	email: process.env.JIRA_EMAIL,
	apiToken: process.env.JIRA_API_TOKEN,
});
