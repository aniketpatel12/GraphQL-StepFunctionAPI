import { IssueType } from './../../types/createJiraTicket';
import { client } from '../..';
import { TicketType } from '../../types/createJiraTicket';
import { IssuePriority } from '../../types/createJiraTicket';

const resolvers = {
	Mutation: {
		createJiraTicket: async (_, { input }: { input: TicketType }) => {
			try {
				const project = await client.projects.getProject({
					projectIdOrKey: input.projectId,
				});
				console.log(input);
				const { id } = await client.issues.createIssue({
					fields: {
						project: {
							key: project.key,
						},
						summary: input.title,
						description: input.description,
						issuetype: {
							name: IssueType[input.type],
						},
						priority: {
							id: IssuePriority[input.priority],
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
