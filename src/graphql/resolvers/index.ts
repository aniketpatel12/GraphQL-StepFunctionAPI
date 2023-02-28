import merge from 'lodash.merge';
import stepFunctionExecution from './aws';
import createJiraTicket from './jira';

const resolvers = merge({}, stepFunctionExecution, createJiraTicket);

export default resolvers;
