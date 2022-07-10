import { handlerPath } from '@libs/handler-resolver';

/*
* @@description index file return route config for getAllLeads lambda function.
*/
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'leads'
      },
    },
  ],
};
