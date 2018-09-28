
const express = require('express');
const nanoid = require('nanoid');
const request = require('request');
const app = express();
const port = 3000;


const Quizlet = require('./quizlet.js');

const clientID = "YOUR_CLIENT_ID";
const secret = "YOUR_SECRET_KEY";

var stateID = nanoid();	//	prevent MITM

var token;

app.get('/quizlet/callback', function(req, res){
	console.log(req.query);
	if(!('error' in req.query)){
		if(req.query.state == stateID){
			res.send("okay");
			get_token(req.query.code);
		}else{
			res.send("mitm");
		}
	}else{
		res.send("reject");
	}
});

app.listen(port, () => {console.log(`Quizlet Server listening on port ${port}!`);initialize_auth();});

function initialize_auth(){

	const load = `https://quizlet.com/authorize?response_type=code&client_id=${clientID}&scope=read%20write_set%20write_group&state=${stateID}`;

	console.log(`Open the following URL on your browser to continue: ${load}`);
}

function get_token(code){

	request({
		har:{
			"method": "POST",
			"url": "https://api.quizlet.com/oauth/token",
			"headers": [
				{
					"name": "Content-Type",
					"value": "application/x-www-form-urlencoded; charset=utf-8"
				},
				{
					"name": "Authorization",
					"value": 'Basic '+(new Buffer(`${clientID}:${secret}`)).toString('base64')
				}
			],
			"postData": {
				"mimeType": "application/x-www-form-urlencoded;",
				"params": [
					{
						"name": "grant_type",
						"value": "authorization_code"
					},
					{
						"name": "code",
						"value": code
					}
				]
			}
		}
	}, function(error, res, body){

		var jbody = JSON.parse(body);
		token = jbody.access_token;
		jbody.client_id = clientID;
		var quizlet  = new Quizlet(jbody);
		//	Do whatever you want to do here
	});

}
