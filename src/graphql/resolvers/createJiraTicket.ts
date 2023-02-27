import { IssueType, TicketType, IssuePriority } from '../../types';
import { client } from '../..';

const resolvers = {
	Mutation: {
		createJiraTicket: async (_, { input }: { input: TicketType }) => {
			try {
				const project = await client.projects.getProject({
					projectIdOrKey: input.projectId,
				});

				const { title, type, priority, projectId, description } = input;

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
				console.error(
					'An error occurred while creating jira ticket',
					error
				);
			}
		},
	},
};

export default resolvers;
