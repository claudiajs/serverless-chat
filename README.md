# Serverless chat

This is an example project showing how to abuse AWS IOT Gateway to create a massively-scalable online chat system using a static HTML page.

IOT Gateway supports websockets, which can be used to connect browsers directly to a message queue, and send/receive messages connected to hierarchical topics. In this case, we're allowing anonymous users to subscribe to any topic starting with `/chat/` (check the  [unauthenticated policy](src/policies/unauthenticated-mqtt.json) for more information. The security is enforced using normal AWS IAM policies, and provided through AWS Cognito authentication, which allows us to assign IAM policies to unauthenticated users.

The result is that chat allows anonymous users to access exchange messages through hierarchical chat topics, without any active server components we need to maintain. 

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

## Posting an update directly to the gateway

Check out the [`src/util/post-message.js`](src/util/post-message.js) to see how you can also post messages directly to chat channels (eg a system notification, or replying to messages from a Lambda function.

### TODO

1. Add sender info
2. authenticated access
3. automated config
4. Connection keep-alive/reconnect

# More info

* [Paho MQTT Client for JavaScript](https://eclipse.org/paho/clients/js/) - used to connect to the IoT Gateway
* [AWS IOT Platform](https://aws.amazon.com/iot-platform/how-it-works/)
