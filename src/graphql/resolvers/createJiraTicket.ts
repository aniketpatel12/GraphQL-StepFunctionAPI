import { GraphQLJSON } from 'graphql-type-json';
import { client } from '../..';

export enum IssueType {
	TASK = 'task',
	BUG = 'bug',
	STORY = 'story',
}

export enum IssuePriority {
	HIGHEST = '5',
	HIGH = '4',
	MEDIUM = '3',
	LOW = '2',
	LOWEST = '1',
}

type TicketType = {
	title: string;
	type: IssueType;
	priority: IssuePriority;
	projectId: number;
	description: string | null;
};

const resolvers = {
	JSON: GraphQLJSON,
	Mutation: {
		createJiraTicket: async (_, { input }: { input: TicketType }) => {
			try {
				const project = await client.projects.getProject({
					projectIdOrKey: input.projectId,
				});

				if (project) {
					const { id } = await client.issues.createIssue({
						fields: {
							summary: input.title,
							issuetype: {
								name: input.type,
							},
							project: {
								key: project.key,
							},
							description: input.description,
							priority: {
								id: input.priority,
							},
						},
					});

					return id;
				}
			} catch (error) {
				console.error(
					'An error occurred while creating jira issue',
					error
				);
			}
		},
	},
};

export default resolvers;
