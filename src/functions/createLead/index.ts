import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

/*
* @@description index file return route config for createLead lambda function.
*/
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'lead/add',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
