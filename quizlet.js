
const request = require('request');


class Quizlet {

	constructor(info){

		if (('access_token' in info)) {
			this.access_token = info.access_token;
			//	nonessential
			if('scope' in info){
				this.scope = info.scope;
			}
			if('user_id' in info){
				this.user_id = info.user_id;
			}
		}else{
			// if(info){
			throw new Error("Not enough detail provided for creating Quizlet object.");
			// }
		}

		const qz = this;

		this.set = function(setID){
			var set = {};
			set.setID = setID;
			set.get = function(){return qz.set.get(this.setID);};
			set.delete = function(){return qz.set.delete(this.setID)};
			set.edit = function(info){return qz.set.delete(this.setID, info)};

			return set;
		}

		this.set.get = function(setID){
			return new Promise(function(resolve, reject){
				var requrl;
				if(typeof(setID) == 'string' || typeof(setID) == 'number'){
					requrl = `https://api.quizlet.com/2.0/sets/${setID}`;
				}else{
					requrl = `https://api.quizlet.com/2.0/sets?set_ids=`+setID.join(',');
				}
				request({
					url:requrl,
					method:'GET',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});

			});
		};

		this.set.edit = function(setID, info){

			return new Promise(function(resolve, reject){

				if(info){

					if('term_ids' in info){
						if(info.term_ids.length != info.terms.length || info.term_ids.length != info.definitions.length){
							reject(new Error("Term count mismatch"));
							return;
						}
					}

					request({
						url:`https://api.quizlet.com/2.0/sets/${setID}`,
						method:'PUT',
						headers:{Authorization: `Bearer ${qz.access_token}`},
						form:info
					}, function(error, res, body){

						console.log(error, res);

						if(!error){
							body = JSON.parse(body);
							if (body && !('error' in body)) {
								resolve(body);
							}else{
								reject(new Error(`${body.error_title}: ${body.error_description}`));
							}
						}else{
							console.log(err);
							reject(err);
						}
					});


				}else{
					reject(new Error('Not enough detail provided for creating Quizlet set.'))
				}
			});
		}

		this.set.create = function(info){

			return new Promise(function(resolve, reject){

				if(info && 'title' in info && 'terms' in info && 'definitions' in info && 'lang_terms' in info && 'lang_definitions' in info && info.terms.length == info.definitions.length){
					request({
						url:`https://api.quizlet.com/2.0/sets/`,
						method:'POST',
						headers:{Authorization: `Bearer ${qz.access_token}`},
						form:info
					}, function(error, res, body){
						if(!error){
							body = JSON.parse(body);
							if (body && !('error' in body)) {
								resolve(body);
							}else{
								reject(new Error(`${body.error_title}: ${body.error_description}`));
							}
						}else{
							console.log(err);
							reject(err);
						}
					});
				}else{
					if('terms' in info &&  'definitions' in info && info.terms.length == info.definitions.length){
						reject(new Error('Term count mismatch'));
					}else{
						reject(new Error('Not enough detail provided for creating Quizlet set.'));
					}
				}
			});

		};

		this.set.delete = function(setID){
			return new Promise(function(resolve, reject){
				request({
					url:`https://api.quizlet.com/2.0/sets/${setID}`,
					method:'DELETE',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});
			});
		};

		this.user = function(userID){
			var user = {};
			user.userID = userID;

			user.get = function(){return qz.user.get(this.userID);};
			user.sets = function(){return qz.user.sets(this.userID);};
			user.favorites = function(){return qz.user.favorites(this.userID);};
			user.classes = function(){return qz.user.classes(this.userID);};
			user.studied = function(){return qz.user.studied(this.userID);};

			return user;
		}

		this.user.get = function(userID){
			return new Promise(function(resolve, reject){
				request({
					url:`https://api.quizlet.com/2.0/users/${userID}`,
					method:'GET',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});
			});
		},
		this.user.sets = function(userID){
			return new Promise(function(resolve, reject){
				request({
					url:`https://api.quizlet.com/2.0/users/${userID}/sets`,
					method:'GET',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					debugger;
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});
			});
		},
		this.user.favorites = function(userID){
			return new Promise(function(resolve, reject){
				request({
					url:`https://api.quizlet.com/2.0/users/${userID}/favorites`,
					method:'GET',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});
			});
		},
		this.user.classes = function(userID){
			return new Promise(function(resolve, reject){
				request({
					url:`https://api.quizlet.com/2.0/users/${userID}/classes`,
					method:'GET',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});
			});
		},
		this.user.studied = function(userID){
			return new Promise(function(resolve, reject){
				request({
					url:`https://api.quizlet.com/2.0/users/${userID}/studied`,
					method:'GET',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});
			});
		}

		this.class = function(classID){
			var _class = {};
			_class.classID = classID;
			_class.get = function(){return qz.class.get(this.classID);}
			return _class;
		}

		this.class.get = function(classID){
			return new Promise(function(resolve, reject){
				request({
					url:`https://api.quizlet.com/2.0/classes/${classID}`,
					method:'GET',
					headers:{Authorization: `Bearer ${qz.access_token}`}
				}, function(error, res, body){
					if(!error){
						body = JSON.parse(body);
						if (body && !('error' in body)) {
							resolve(body);
						}else{
							reject(new Error(`${body.error_title}: ${body.error_description}`));
						}
					}else{
						console.log(err);
						reject(err);
					}
				});
			});
		}

	}

}


module.exports = Quizlet;
