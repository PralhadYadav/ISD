### Using NPM.

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Project structure.

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── createLead
│   │   │   ├── handler.ts      # `createLead` lambda source code
│   │   │   ├── index.ts        # `createLead` lambda Serverless configuration
│   │   │   └── schema.ts       # `createLead` lambda input event JSON-Schema
|   |   |
│   │   ├── getAllLeads
│   │   │   ├── handler.ts      # `getAllLeads` lambda source code
│   │   │   ├── index.ts        # `getAllLeads` lambda Serverless configuration
│   │   │   └── schema.ts       # `getAllLeads` lambda input event JSON-Schema
|   |   |
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json                # All project dependencies and dev dependencies
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

## Tech Stack used.

1. Lambda functions point to aws, which has credentials locally configured. Please use your personal aws cred when running this project locally.
2. For this project aws DynamoDB is used.
3. Project is developed in NodeJs >=14.15.0 and Typescript ^4.1.3 using serverless framework.

## API Notes.

1. GetAllLeads - function will return all leads from LeadTable in desc order by created_date.
2. CreateLead - Function will add data to LeadTable and InterestTable depending on below conditions.
    
    * - If Email Id or Phone number is new and Lead Id is not present in request body. createLead Lambda function will create new record in LeadTable and add corresponding entry in InterestTable.
    * - If Email Id or Phone number provided in request body is already exist, function will return error.
    * - To add new record in LeadTable email, phone and first_name are required field.
    * - createLead lambda function can also insert in InterestTable only if Lead Id and message is provided in the request body.
    * - If function get Lead Id in the request Body it will verify it first with LeadTable data if it is valid Lead Id, record will get created in InterestTable or function will return error.

## Possible future improvements.

1. Adding email and phone no validation.
2. With current proposed schema, application can be more suitable with schema based Database such as MySql or SQLServer.
3. Implementing logger machanism for debugging and analytics purpose.


