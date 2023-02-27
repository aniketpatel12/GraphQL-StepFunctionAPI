export type DynamicJson = {
	[key: string]: string;
};

// Override auto genrated types
export enum IssueType {
	Task = 'Task',
	Problem = '[System] Problem',
	Service_Request = '[System] Service request',
}

// Override auto genrated types
export enum IssuePriority {
	Highest = '1',
	High = '2',
	Medium = '3',
	Low = '4',
	Lowest = '5',
}
