/* Services */

var appServices = angular.module('appServices', ['LocalStorageModule', 'ui.router']);

appServices
	.factory('ApiService', ['$http', '$interval', 'API', 'Auth','localStorageService', 'Notification', function ($http, $interval, API, Auth, localStorageService, Notification) {

		return {
			// get list of measurement/history items
			list: function(object_name, callback, error_callback) {
				function getList(object_name, get_all, loop_number, result) {
					var authorizationData = localStorageService.get('authorizationData'),
						headers = {
							'Authorization': 'Bearer ' + authorizationData.token
						};

					$http.get( API['URL_PATIENTS'] + '/' + Auth.user.id + '/' + object_name, {headers: headers})
						.success(function (response) {
							console.log('List items API success');

							if(get_all){
								is_ready = (loop_number===0)?1:0;

								//measurements
								if(response.length){
									result[object_name] = response;
									console.log(response)
									if(object_name === 'allergies' || object_name === 'medications' || object_name === 'bodysymptoms'){
										result.measurements = 1
									}else if(object_name === 'mc' || object_name === 'mh'){
										result.histories = 1
									}
								}else{
									result[object_name] = {};
								}

							}else{
								return callback((response.length)?response:undefined);
							}


						}).error(function (error, status) {
							error = error || 'Request failed, please try again later.';
							console.log(error, status);
							Notification.show(error.message + ' Please try again later.', 'danger', 1);
							return error_callback(error);
						});
				}

				if(object_name==='summaries'){
					var items = ['mc', 'mh', 'allergies', 'medications', 'bodysymptoms'],
						is_ready = 0,
						i = 0,
						result = {};
					for (var i = items.length - 1; i >= 0; i--) {
						getList(items[i], 1, i, result);
					};
					if(is_ready){
						return callback((result.length)?result:{});
					}else{
						var wait = $interval(function(){
							$interval.cancel(wait);
							return callback(result);
						}, 1000);
					}

				}else{
					getList(object_name, 0);
				}
			},

			// create a new measurement/history item
			create: function(object_name, data, callback, error_callback,title) {
				var authData = localStorageService.get('authorizationData'),
					headers = {'Authorization': 'Bearer ' + authData.token};
				
				// Default values we dont have on the create page
				if(object_name === 'mc') {
					//data['onset'] = 0;
					//data['status'] = 0;
				}else if(object_name === 'mh') {
					data['type'] = 2;
				}else if(object_name === 'allergies') {
					
					title = "Allergy"
                    if(!data['startDate'])
					    data['startDate'] = new Date();
					//else
						//data['startDate'] = new Date(data['startDate'].getTime() + 12*60*60000);
					console.log(data); 
				}else if(object_name === 'medications') {
					console.log(data);
					title = "Medication";
				}

				$http.post( API['URL_PATIENTS'] + '/' + Auth.user.id + '/' + object_name, data, {headers: headers})
					.success(function (response) {

						console.log(object_name +' created successfully');
						if(title != '' || title != undefined || title!='undefined' || !title)
							Notification.show(title +' created successfully', 'success', 1);
						else
							Notification.show(object_name +' created successfully', 'success', 1);
						return callback(response);
					}).error(function (error, status) {
						error = error || 'Request failed, please try again later.';
						console.log(error, status);
						Notification.show(error, 'danger', 1);
						return error_callback(error);
					});
			},

			// Save a measurement/history item
			save: function(object_name, item_id, data, callback, error_callback) {
				// if home...
				if(object_name == 'home'){
					var item = localStorageService.get(object_name);
					if (!item) {
						item = {};
					}
					item[item_id] = data;
					localStorageService.set(object_name, item);
					return callback(data);
				}

				// else...

				var authData = localStorageService.get('authorizationData'),
					headers = {'Authorization': 'Bearer ' + authData.token},
					method = 'put';

				if(object_name === 'bodysymptoms' || object_name === 'socialstatus'){
					item_id = '';
					method = 'post';
					localStorageService.set(object_name, 0);
				}else{
					item_id = '/' + item_id;
				}

				$http[method]( API['URL_PATIENTS'] + '/' + Auth.user.id + '/' + object_name + item_id , data, {headers: headers})
					.success(function (response) {
						console.log(object_name + ' saved successfully');
						return callback(response);
					}).error(function (error, status) {
						error = error || 'Request failed, please try again later.';
						console.log(error, status);
						Notification.show(error.message, 'danger', 1);
						return error_callback(error);
					});
			},

			// Get a measurement/history item
			get: function(object_name, item_id, callback, error_callback) {
				if(object_name === 'mc' || object_name === 'mh' || object_name === 'allergies' || object_name === 'medications' || object_name === 'bodysymptoms' || object_name === 'socialstatus'){
					var authData = localStorageService.get('authorizationData'),
						headers = {'Authorization': 'Bearer ' + authData.token},
						is_single_page = object_name === 'bodysymptoms' || object_name === 'socialstatus';
					if(is_single_page){
						item_id = '';
						var is_first_time = localStorageService.get(object_name);
						is_first_time = (is_first_time == null)?1:0;
					}else{
						item_id = '/' + item_id;
					}


					$http.get( API['URL_PATIENTS'] + '/' + Auth.user.id + '/' + object_name + item_id, {headers: headers})
						.success(function (response) {
							console.log('Get item API success');
							if(is_single_page){
								return callback(response, is_first_time);
							}
							return callback(response);

						}).error(function (error, status) {
							error = error || 'Request failed, please try again later.';
							console.error(error, status);
							Notification.show(error, 'danger', 1);
							return error_callback(error);
						});

				}else{
					// TODO: remove this when all the calls are made to the API
					var data = localStorageService.get(object_name);
					if(data){
						data = data[item_id];
					}else{
						data = undefined;
					}
					return callback(data);
				}

			},

			// Get summary health
			getSummary: function(callback, error_callback) {
				var authData = localStorageService.get('authorizationData'),
					headers = {'Authorization': 'Bearer ' + authData.token};
				$http.get( API['URL_PATIENTS'] + '/' + Auth.user.id + '/healthsummary', {headers: headers})
					.success(function (response) {
						console.log('Get summary API success');
						return callback(response);

					}).error(function (error, status) {
						error = error || 'Request failed, please try again later.';
						console.error(error, status);
						// Check if user need to login again
						if(error.message == 'Authorization has been denied for this request.'){
							Auth.needLogin();
							return;
						}
						Notification.show(error, 'danger', 1);
						return error_callback(error);
					});
			},

			delete: function(object_name, item_id, callback, error_callback){

				var authData = localStorageService.get('authorizationData'),
					headers = {'Authorization': 'Bearer ' + authData.token};

				$http.delete( API['URL_PATIENTS'] + '/' + Auth.user.id + '/' + object_name + '/' + item_id , {headers: headers})
					.success(function (response) {
						console.log(object_name + ' deleted successfully');
						Notification.show('Item deleted', 'success', 1);
						return callback(response);
					}).error(function (error, status) {
						error = error || 'Request failed, please try again later.';
						console.log(error, status);
						Notification.show(error, 'danger', 1);
						return error_callback(error);
					});

			},

			share: function(data, ID, callback, error_callback) {
				var authData = localStorageService.get('authorizationData'),
					headers = {'Authorization': 'Bearer ' + authData.token};

				if(!ID){
					ID = Auth.user.id;
				}

				//data['expiryDate'] = new Date(data['expiryDate'].getTime() + 24*60*60000-1);
				
				$http.post( API['URL_PATIENTS'] + '/' + ID + '/sharephr', data, {headers: headers})
					.success(function (response) {
						Notification.show('Health Summary shared successfully', 'success', 1);
						return callback(response);
					}).error(function (error, status) {
						//error = error || 'Request failed, please try again later.';
						console.log(error, status);
						Notification.show(error, 'danger', 1);
						return error_callback(error);
					});
			},

			shared: function(type, is_update, callback, error_callback, data) {
				var authData = localStorageService.get('authorizationData'),
					headers = {'Authorization': 'Bearer ' + authData.token};

				if(is_update){
					console.log(data);
					$http.put( API['URL_PATIENTS'] + '/' + Auth.user.id + '/sharephr', data, {headers: headers})
						.success(function (response) {
							console.table(response);
							Notification.show('Shared information updated successfully', 'success', 1);
							return callback(response);
						}).error(function (error, status) {
							error = error || 'Request failed, please try again later.';
							console.log(error, status);
							Notification.show(error.message, 'danger', 1);
							return error_callback(error);
						});
				}else{
					type = (type=='byMe')?'phrsharedby':'phrsharedwith';
					$http.get( API['URL_PATIENTS'] + '/' + Auth.user.id + '/' + type, {headers: headers})
						.success(function (response) {
							console.table(response);
							return callback(response);
						}).error(function (error, status) {
							error = error || 'Request failed, please try again later.';
							console.log(error, status);
							Notification.show(error.message, 'danger', 1);
							return error_callback(error);
						});
				}
			}


		};
	}])

	// Notification system
	.factory('Notification', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
		return {
			/**
			 * Show notifications to the user
			 * @param {string} msg Message to show
			 * @param {string} ntf_type type of the notification (Ex: success, info, warning, danger)
			 */
			show: function(msg, ntf_type, autohide) {
				$rootScope.msg = msg;
				$rootScope.ntf_type = 'alert-' + ntf_type;
				$rootScope.showNotification = 1;
				if(autohide){
					this.hide(2500);
				}
			},
			hide: function(delay) {
				// Hide the notification
				$timeout(function() {
					$rootScope.showNotification = 0;
				}, delay);
			}

		}
	}])

	// Overlay service
	.factory('Overlay', ['$rootScope', function ($rootScope) {
		return {
			/**
			 * Show the overlay to the user
			 * @param {object} overlay_data data for the overlay{title:'lorem ipsum', text:'lorem ipsum', submitLabel:'submit', cancelLabel:'Cancel'}
			 * @param {function} submit function to tigger with the submit button
			 * @param {function} cancel function to tigger with the cancel button
			 */
			show: function(overlay_data, submit, cancel, is_login) {
				overlay_data.submitLabel = (typeof overlay_data.submitLabel != 'undefined')?overlay_data.submitLabel:'Submit';
				overlay_data.cancelLabel = (typeof overlay_data.cancelLabel != 'undefined')?overlay_data.cancelLabel:'Cancel';
				$rootScope.overlay = overlay_data;
				if(is_login){
					$rootScope.user = {};
				}
				$rootScope.toggle('overlay', 'on');

				$rootScope.overlay.sumitOverlay = submit;
				$rootScope.overlay.cancelOverlay = cancel;
			},
			hide: function(delay) {
				// Hide the overlay
				$rootScope.toggle('overlay', 'off');
			}

		}
	}])

	// Handle user connections to the data base via API
	.factory('UserService', ['$rootScope', '$http', '$timeout', '$location', '$state', '$filter', 'localStorageService', 'API', 'Notification', 'Overlay', function ($rootScope, $http, $timeout, $location, $state, $filter, localStorageService, API, Notification, Overlay) {
		return {

			// Login form service
			login: function(user, callback, error_callback) {
				var data = 'grant_type=password&username=' + encodeURIComponent(user.email) + '&password=' + user.password,
					that = this;
				/*
				var data = {
						'grant_type': 'password',
						'username': user.email,
						'password': user.password
						
					};*/
				
				$http.post( API['URL'] + '/token', data, {headers:API['HEADERS']})
					.success(function (response) {
						console.log('Login success');
						Notification.show('Login success', 'success', 1);

						// Timeout to show the overlay when the token expire
						$timeout(function(){
							that.loginExpiration();
						}, response.expires_in *  1000);


						localStorageService.set('authorizationData', { 'token': response.access_token, 'userName': user.email,  'expires_in': response.expires_in, 'login_date': new Date });
						// Get basic user profile info
						return that.getProfile(callback, error_callback, {'userName': user.email, 'role': {bitMask: 2, title: 'user'}}, 0, 1);

					}).error(function (error, status) {
						error = error || {'error_description':'Request failed, please try again later.'};
						console.log(error, status);
						Notification.show(error['error_description'], 'danger', 1);
						return error_callback(error['error_description']);
					});
			},

			// Handle the login once the token expire
			loginExpiration: function() {

				var overlay_data = {
						'title': 'Session expired, please login again',
						'url': 'views/common/login-form.html'
					},
					that = this;

				function submitOverlay() {
					$rootScope.waiting = 1;
					that.login(
						$rootScope.user,
						function(logged_user){
							localStorageService.set('user', logged_user);
							$rootScope.waiting = 0;
							// Workaround for reloading the state and avoid missing data
							var currentState = $state.$current.name,
								timeState = $state;
							$state.go('user.home');
							$timeout(
								function(){timeState.go(currentState)},
								500);
							Overlay.hide();
						},
						function(error){
							$rootScope.waiting = 0;
						}
					);
				}

				function cancelOverlay() {
					Overlay.hide();
					$location.path('logout');
				}

				Overlay.show(overlay_data, submitOverlay, cancelOverlay, 1);
			},

			// Get basic user profile
			getProfile: function(callback, error_callback, basic_user_info, get_full, is_root) {
				var that = this,
					authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					};
				$http.get( API['URL_PATIENTS'] + '/profile', {headers: headers})
					.success(function (response) {
						console.log('Profile fetched');
						angular.extend(basic_user_info, response);
						console.table(basic_user_info);
						if(is_root){
							authorizationData.root_id = response.id;
							authorizationData.current_id = response.id;
							localStorageService.set('authorizationData', authorizationData);
						}else{
							authorizationData.current_id = response.id;
							localStorageService.set('authorizationData', authorizationData);
						}

						if(get_full){
							return that.getFullProfile(response.id, callback, error_callback, basic_user_info);
						}
						return callback(basic_user_info);
					}).error(function (error, status) {
						error = error || 'Request failed';
						console.log(error, status);
						Notification.show(error['error_description'], 'danger', 1);
						return error_callback(error['error_description']);
					});
			},

			// Get a particular user with the ID
			getFullProfile: function(ID, callback, error_callback, basic_user_info) {
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					}
				$http.get( API['URL_PATIENTS'] + '/' + ID, {headers: headers})
					.success(function (response) {
						console.log('getFullProfile: ', response);
						angular.extend(basic_user_info, response);
						return callback(basic_user_info);
					}).error(function (error, status) {
						error = error || 'Request failed';
						console.log(error, status);
						return error_callback(status);
					});
			},


			// Signup form service
			signup: function(data, callback, error_callback) {
				var user = {
						'Email': data['email'],
						'ConfirmEmail': data['email_verify'],
						'Password': data['password'],
						'ConfirmPassword': data['confirm_password'],
						'FirstName': data['firstName'],
						'LastName': data['lastName']
					};

				$http.post( API['URL_PATIENTS'] + '/register', user)
					.success(function (response) {
						console.log('Register success', response);
						return callback();
					}).error(function (error, status) {
						error = error || 'Request failed';
						Notification.show(error, 'danger', 1);
						console.log(error, status);
						return error_callback();
					});

			},

			// Email comfirmation form service
			confirmEmail: function(token, callback, error_callback) {
				token = {
					'Token': token
				}
				$http.put( API['URL_PATIENTS'] + '/confirm', token)
					.success(function (response) {
						console.log('Confirmation success', response);
						Notification.show(response, 'success', 0);
						return callback();
					}).error(function (error, status) {
						error = error || 'Confirmation failed';
						Notification.show(error.invalidToken, 'danger', 1);
						return error_callback(error, status);
					});
			},

			// Terms & conditions flag update
			acceptTerms: function(user, callback, error_callback) {
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					},
					data = {
						'tncCompleted': true
					};

				$http.post( API['URL_PATIENTS'] + '/tnc', data, {headers: headers})
					.success(function (response) {
						console.log('Terms & conditions API', response);
						user.tncCompleted = true;
						return callback();
					}).error(function (error) {
						error = error || 'Terms & conditions API error';
						return error_callback(error.message);
					});
			},

			save: function(user, callback, error_callback, use_local) {
				user.dob = $filter('date')(user.dob, "MM-dd-yyyy");
				use_local = (typeof use_local == 'undefined')?1:use_local;
				if(use_local){
					localStorageService.set('user', user);
					return callback(user);
				}
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					}

				$http.put( API['URL_PATIENTS'] + '/' + user.id, user, {headers: headers})
					.success(function (response) {
						console.log('Update user profile API', response);
						return callback();
					}).error(function (error) {
						error = error || 'Update user profile API error';
						Notification.show(error, 'danger', 1);
						return error_callback(error.message);
					});
			},

			createAccount: function(user, callback, error_callback) {
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					};

				$http.post( API['URL_PATIENTS'], user, {headers: headers})
					.success(function (response) {
						console.log('Save account API', response);
						Notification.show('Account created successfully', 'success', 1);
                        $state.go('user.home');
						return callback(response);
					}).error(function (error) {
						error = error || 'Account API error';
						return error_callback(error.message);
					});
			},

			getAccounts: function(callback) {
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					},
					ID = authorizationData.root_id;

				$http.get( API['URL_PATIENTS'] + '/' + ID + '/relatedpatients', {headers: headers})
					.success(function (response) {
						console.table('relatedpatients: ', response);
						return callback(response);
					}).error(function (error) {
						error = error || 'Request failed';
						console.log(error, status);
					});
			},

			// Creates, gets and updates user address
			address: function(address, user_id, address_id, method, callback, error_callback) {
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					},
					address_url = (address_id)?'/'+address_id :'';

				$http[method]( API['URL_PATIENTS'] + '/' + user_id + '/address' + address_url, address, {headers: headers})
					.success(function (response) {
						response = response;
						console.log('Address API', response);
						if(address_id){
							Notification.show('Address updated successfully', 'success', 1);
						}
						return callback(response);

					}).error(function (error, status) {
						error = error || 'Address ' + method + ' failed';
						console.log(error, status);
						if(address_id){
							Notification.show(error, 'danger', 1);
						}
						return error_callback(error, status);
					});
			},

			// Change logged in user password
			changePassword: function(data, callback, error_callback) {
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					};
				data.Username = authorizationData.userName;

				$http.post( API['URL_PATIENTS'] + '/changepassword', data, {headers: headers})
					.success(function (response) {
						response = response || 'Password changed';
						console.log('Change password API: ' + response);
						Notification.show(response, 'success', 1);
						return callback(response);

					}).error(function (error, status) {
						error = error || 'Request failed';
						console.log(error, status);
						Notification.show(error, 'danger', 1);
						return error_callback(error, status);
					});
			},

			forgotChangePassword: function(data, callback, error_callback) {
				$http.post( API['URL_PATIENTS'] + '/forgotpwdchange', data, API['HEADERS'])
					.success(function (response) {
						response = response || 'Password changed';
						console.log('Forgot comfirm password API: ' + response);
						Notification.show(response, 'success', 1);
						// Get basic user profile info
						return callback(response);

					}).error(function (error, status) {
						error = error || 'Request failed';
						console.log(error, status);
						Notification.show(error, 'danger', 1);
						return error_callback(error, status);
					});
			},

			forgotPassword: function(username, callback, error_callback) {
				//username user.email
				var data = {'Username': username};
				$http.post( API['URL_PATIENTS'] + '/requestforgotpwd', data)
					.success(function (response) {
						console.log('Forgot password API: ' + response);
						// Get basic user profile info
						return callback(response);

					}).error(function (error, status) {
						error = error || 'Request failed';
						console.log(error, status);
						Notification.show(error, 'danger', 1);
						return error_callback(error, status);
					});
			},

			// Service Agreement email
			serviceAgreementEmail: function(user, callback, error_callback){
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					}

				$http.post( API['URL_PATIENTS'] + '/emailserviceagreement', {}, {headers: headers})
					.success(function (msg) {
						Notification.show(msg, 'success', 1);
						return callback();
					}).error(function () {
						var error = 'Service Agreement email API error';
						Notification.show(error, 'danger', 1);
						return error_callback(error);
					});

			},

			// Onboarding health questions
			healthProfileQuestions: function(user, callback, error_callback){
				var authorizationData = localStorageService.get('authorizationData'),
					headers = {
						'Authorization': 'Bearer ' + authorizationData.token
					},
					data = [{
						'id': 1,
						'answerOptionId': user.medical_condition
						},
						{
						'id': 2,
						'answerOptionId': user.last_doctor_visit
					}];

				$http.post( API['URL_PATIENTS'] + '/' +  user.id + '/healthprofileqna', data, {headers: headers})
					.success(function (response) {
						var msg = 'Onboarding health questions API Success';
						return true;
					}).error(function () {
						var error = 'Onboarding health questions API error';
						console.log(error);
						return error_callback(error);
					});

			}
		};
	}])

	// User auth service
	.factory('Auth', ['localStorageService', 'UserService', function(localStorageService, UserService) {

		var accessLevels = routingConfig.accessLevels,
			userRoles = routingConfig.userRoles,
			currentUser = localStorageService.get('user') || { userName: '', role: userRoles.public };

		function changeUser(user) {
			angular.extend(currentUser, user);
			localStorageService.set('user', currentUser);
			return currentUser;
		}

		return {
			update: function(user, callback, error_callback, use_local, update_questions) {
				UserService.save(user, callback, error_callback, use_local);
				user = changeUser(user);
				this.user = user;
				if(update_questions){
					UserService.healthProfileQuestions(user, callback, error_callback);
				}
			},

			createAccount: function(user, callback, error_callback) {
				function saveHealthQuestions(user){
					UserService.healthProfileQuestions(user, callback, error_callback);
				}
				UserService.createAccount(user, saveHealthQuestions, error_callback);
				localStorageService.remove('tempUser');
			},
			setTempAccount: function(user, is_new, callback) {
				if(is_new){
					var data = [{
						'id': 1,
						'answerOptionId': user.medical_condition
						},
						{
						'id': 2,
						'answerOptionId': user.last_doctor_visit
					}];
					localStorageService.set('healthProfileQuestions', data);
				}
				localStorageService.set('tempUser', user);
				return callback();
			},
			getTempUser: function() {
				return localStorageService.get('tempUser');
			},

			address: function(address, user_id, address_id, method, callback, error_callback) {
				UserService.address(address, user_id, address_id, method, callback, error_callback);
			},
			authorize: function(accessLevel, role) {
					console.log('Current User', currentUser);
					if(role === undefined) {
						role = currentUser.role;
					}

					return accessLevel.bitMask & role.bitMask;
			},
			loginExpired: function() {
				var authData = localStorageService.get('authorizationData'),
					is_expired;

				if(authData === null){
					is_expired = 0
				}else{
					var actual_date = new Date(),
						login_date = new Date(authData.login_date),
						expires_in = authData.expires_in * 1000,
						timeDiff = Math.abs(actual_date.getTime() - login_date.getTime());
					if(isNaN(expires_in)){
						expires_in = 0;
						timeDiff = 1;
					}
					is_expired = timeDiff > expires_in;
				}
				return is_expired;
			},

			isLoggedIn: function(user) {
					if(user === undefined) {
						user = currentUser;
					}

					return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
			},
			// Set the selected user as current account of the app
			setCurrentAccount: function(ID, callback, error_callback) {
				//return UserService.getProfile(callback, error_callback, {}, 1, is_root);
				var that = this;
				function setUser(new_user){
					changeUser(new_user);
					that.user = new_user;
					return callback(new_user);
				}
				UserService.getFullProfile(ID, setUser, error_callback, {'role': {bitMask: 2, title: 'user'}});
			},
			// Check if the current user is the root account or a subaccount
			isRootAccount: function(user) {
				var authData = localStorageService.get('authorizationData');
				return user.id == authData.root_id;
			},
			register: function(user, callback, error_callback) {
				UserService.signup(user, callback, error_callback);
			},
			login: function(user, callback, error_callback) {
				var that = this;
				UserService.login(user, function(user_result) {
					console.log(currentUser);
					user_result = changeUser(user_result);
					that.user = user_result;
					callback(user_result);
				}, error_callback);
			},
			needLogin: function() {
				//UserService.loginExpiration();
			},
			logout: function(callback) {
				currentUser = {};
				// Clean all the user data on the client
				localStorageService.remove('authorizationData');
				var user = changeUser({
					userName: '',
					role: userRoles.public
				});
				this.user = user;
				callback();
			},
			getLoggedinPath: function () {
				var last_path = localStorageService.get('lastpath');
				if(last_path == null){
					return '/accounts-switcher';
				}
				var authData = localStorageService.get('authorizationData'),
					last_day = new Date(last_path.date),
					today = new Date(),
					one_day = (60 * 60 * 1000)*24;

				localStorageService.remove('lastpath');
				if(today - last_day < one_day && last_path.id == authData.root_id){
					return  last_path.path;
				}
				return '/accounts-switcher';
			},
			accessLevels: accessLevels,
			userRoles: userRoles,
			user: currentUser
		};
	}])

	// Service to detect 401
	.factory('authHttpResponseInterceptor',['$q','$location', 'localStorageService', 'Notification', function($q, $location, localStorageService, Notification){
		return {
			response: function(response){
				if (response.status === 401) {
					console.log("Response 401");
				}
				return response || $q.when(response);
			},
			responseError: function(rejection) {
				if (rejection.status === 401) {
					console.log("Response Error 401",rejection);
					Notification.hide(1);
					Notification.show('Session expired, please login again', 'danger', 1);
					var authData = localStorageService.get('authorizationData');
					localStorageService.set('lastpath',{
						id: authData.root_id,
						path: $location.path(),
						date: new Date()
					})
					$location.path('logout');
				}
				return $q.reject(rejection);
			}
		}
	}]);
