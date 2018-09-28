# node-quizlet

<a href="https://quizlet.com/"><img src='https://quizlet.com/static/ThisUsesQuizlet-Blue.png' alt='Powered by Quizlet'/></a>

Quizlet API wrapper for node that uses ``Promise``. It supports most of the endpoints provided by [Quizlet API 2.0](https://quizlet.com/api/2.0/docs).

However, node-quizlet does not provide API for authentication/authorization workflow. In other words, you are responsible for retrieving the authentication token and access token from Quizlet. An example code is inclueded to guide you through such steps.

## Installation

You can install node-quizlet with npm. It is recommended to use npm since it can automatically manage dependencies.

``npm install --save node-quizlet``


## Usage

Before anything else, import node-quizlet.

```var NodeQuizlet = require('node-quizlet')```


### Initializing

Initialize the quizlet object with the access token(The authentication/authorization is not done by this module. You are responsible for retrieving them with your own keys)

```javascript
var quizlet = new NodeQuizlet({
	access_token:YOUR_ACCESS_TOKEN,	//	required
	scope:YOUR_SCOPE,	//	optional
	user_id:USER_ID	//	optional
});
```

### Making Requests

The quizlet object created contains the functions that can perform requests to quizlet.

*Example: Retrieve information about a certain set with its id*

```javascript
var setID = "303781358";

quizlet.set(setID).get().then(function(data){
	console.log(data);
	// What you will get is the json-parsed response of the request sent with the Quizlet API. See https://quizlet.com/api/2.0/docs/sets#view
}).catch(function(error){
	console.error(error);
});	//	PROMISE

```

or you could also use ``set`` like an object, just for eyecandy purposes. The code above and below will give the same result.

```javascript
var setID = "303781358";

quizlet.set.get(setID).then(function(data){
	console.log(data);
}).catch(function(error){
	console.error(error);
});	//	PROMISE

```

## Progress

- Documentation - Incomplete
- Implementation - Incomplete