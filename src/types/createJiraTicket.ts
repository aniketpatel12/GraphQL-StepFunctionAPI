export enum IssueType {
	Task = 'Task',
	Bug = 'Bug',
	Story = 'Story',
}

export enum IssuePriority {
	Highest = '1',
	High = '2',
	Medium = '3',
	Low = '4',
	Lowest = '5',
}

export type TicketType = {
	title: string;
	type: IssueType;
	priority: IssuePriority;
	projectId: string;
	description: string | null;
};
