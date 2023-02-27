import {
	GraphQLResolveInfo,
	GraphQLScalarType,
	GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
	[P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
	JSON: any;
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

export type Mutation = {
	__typename?: 'Mutation';
	createJiraTicket: Scalars['String'];
	getExecutionArn?: Maybe<Scalars['JSON']>;
};

export type MutationCreateJiraTicketArgs = {
	input: TicketInputType;
};

export type MutationGetExecutionArnArgs = {
	input?: InputMaybe<Scalars['JSON']>;
};

export type Query = {
	__typename?: 'Query';
	getExecutionStatus: Scalars['String'];
};

export type QueryGetExecutionStatusArgs = {
	exectuionId: Scalars['String'];
};

export type TicketInputType = {
	description?: InputMaybe<Scalars['JSON']>;
	priority: IssuePriority;
	projectId: Scalars['String'];
	title: Scalars['String'];
	type: IssueType;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
	TResult,
	TKey extends string,
	TParent,
	TContext,
	TArgs
> {
	subscribe: SubscriptionSubscribeFn<
		{ [key in TKey]: TResult },
		TParent,
		TContext,
		TArgs
	>;
	resolve?: SubscriptionResolveFn<
		TResult,
		{ [key in TKey]: TResult },
		TContext,
		TArgs
	>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
	resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
	TResult,
	TKey extends string,
	TParent,
	TContext,
	TArgs
> =
	| SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
	TResult,
	TKey extends string,
	TParent = {},
	TContext = {},
	TArgs = {}
> =
	| ((
			...args: any[]
	  ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
	| SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
	obj: T,
	context: TContext,
	info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
	TResult = {},
	TParent = {},
	TContext = {},
	TArgs = {}
> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
	Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
	IssuePriority: IssuePriority;
	IssueType: IssueType;
	JSON: ResolverTypeWrapper<Scalars['JSON']>;
	Mutation: ResolverTypeWrapper<{}>;
	Query: ResolverTypeWrapper<{}>;
	String: ResolverTypeWrapper<Scalars['String']>;
	TicketInputType: TicketInputType;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
	Boolean: Scalars['Boolean'];
	JSON: Scalars['JSON'];
	Mutation: {};
	Query: {};
	String: Scalars['String'];
	TicketInputType: TicketInputType;
}>;

export interface JsonScalarConfig
	extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
	name: 'JSON';
}

export type MutationResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
	createJiraTicket?: Resolver<
		ResolversTypes['String'],
		ParentType,
		ContextType,
		RequireFields<MutationCreateJiraTicketArgs, 'input'>
	>;
	getExecutionArn?: Resolver<
		Maybe<ResolversTypes['JSON']>,
		ParentType,
		ContextType,
		Partial<MutationGetExecutionArnArgs>
	>;
}>;

export type QueryResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
	getExecutionStatus?: Resolver<
		ResolversTypes['String'],
		ParentType,
		ContextType,
		RequireFields<QueryGetExecutionStatusArgs, 'exectuionId'>
	>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
	JSON?: GraphQLScalarType;
	Mutation?: MutationResolvers<ContextType>;
	Query?: QueryResolvers<ContextType>;
}>;