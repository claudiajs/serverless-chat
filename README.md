## Prerequisites

### Find your aws gateway name:

```bash
aws iot describe-endpoint --query endpointAddress --output text
```


### Find your AWS Account ID:

```bash
aws sts get-caller-identity --output text --query Account
```

#### Create a Cognito Identity Pool for Federated Identities (not a Cognito User Pool).

For unauthenticated access, do the following when creating the identity pool:

* enable access to unauthenticated identities
* no need to attach authentication providers
* on 'Your Cognito identities require access to your resources' screen open up the 'Show details' dropdown and adjust role names if you want
* go to IAM, then add the policy to your unauthenticated access role (replace ACCOUNT-ID with your account ID).


## Configuring

1. create `env/dev.json` for your development environment (similarly for any other env you want to create), with

```js
{
  "iotGatewayName": "<YOUR IOT GATEWAY NAME>",
  "cognitoIdentityPoolId": "<YOUR COGNITO IDENTITY POOL ID>"
}
```

### TODO

1) remove account ID from the policy to simplify setup?
2) authenticated access
3) automated config
