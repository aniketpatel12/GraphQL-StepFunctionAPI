import merge from 'lodash.merge';
import stepFunctionExecution from './stepFunctionExecution';
import createJiraTicket from './createJiraTicket';

const resolvers = merge({}, stepFunctionExecution, createJiraTicket);

export default resolvers;
