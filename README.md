## Prerequisites

### Find your aws gateway name:

```bash
aws iot describe-endpoint --query endpointAddress --output text
```
#### Create a Cognito Identity Pool for Federated Identities (not a Cognito User Pool).

For unauthenticated access, do the following when creating the identity pool:

* enable access to unauthenticated identities
* no need to attach authentication providers
* on 'Your Cognito identities require access to your resources' screen open up the 'Show details' dropdown and adjust role names if you want
* go to IAM, then add the [unauthenticated policy](src/policies/unauthenticated-mqtt.json) to your unauthenticated access role 


## Configuring

1. create `./env/<ENV NAME>.json` for your environment, with 

```js
{
  "iotGatewayName": "<YOUR IOT GATEWAY NAME>",
  "cognitoIdentityPoolId": "<YOUR COGNITO IDENTITY POOL ID>"
}
```
## Building for development usagw

1. create `dev.json` in `./env` as described in the Configuring section
2. `npm run rebuild`
3. `npm run serve-dev`

## Building for production usage

1. create `production.json` in `./env`
2. `npm run rebuild --serverless-chat:buildenv=production`
3. upload the `site` folder somewhere

### TODO

1) remove account ID from the policy to simplify setup?
2) authenticated access
3) automated config
