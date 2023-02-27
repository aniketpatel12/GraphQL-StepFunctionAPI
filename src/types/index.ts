export type DynamicJson = {
	[key: string]: string;
};

export enum IssueType {
	Task = 'Task',
	Problem = '[System] Problem',
	Service_Request = '[System] Service request',
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
	description?: DynamicJson;
};
