(function(exports){
    var config = {

        /* List all the roles you wish to use in the app
        * You have a max of 31 before the bit shift pushes the accompanying integer out of
        * the memory footprint for an integer
        */
        roles :[
            'public',
            'user',
            'admin'],

        /*
        Build out all the access levels you want referencing the roles listed above
        You can use the "*" symbol to represent access to all roles.

        The left-hand side specifies the name of the access level, and the right-hand side
        specifies what user roles have access to that access level. E.g. users with user role
        'user' and 'admin' have access to the access level 'user'.
         */
        accessLevels : {
            'public' : "*",
            'anon': ['public'],
            'user' : ['user', 'admin'],
            'admin': ['admin']
        }

    }

    exports.userRoles = buildRoles(config.roles);
    exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);

    /*
        Method to build a distinct bit mask for each role
        It starts off with "1" and shifts the bit to the left for each element in the
        roles array parameter
     */

    function buildRoles(roles){

        var bitMask = "01";
        var userRoles = {};

        for(var role in roles){
            var intCode = parseInt(bitMask, 2);
            userRoles[roles[role]] = {
                bitMask: intCode,
                title: roles[role]
            };
            bitMask = (intCode << 1 ).toString(2)
        }

        return userRoles;
    }

    /*
    This method builds access level bit masks based on the accessLevelDeclaration parameter which must
    contain an array for each access level containing the allowed user roles.
     */
    function buildAccessLevels(accessLevelDeclarations, userRoles){

        var accessLevels = {};
        for(var level in accessLevelDeclarations){

            if(typeof accessLevelDeclarations[level] == 'string'){
                if(accessLevelDeclarations[level] == '*'){

                    var resultBitMask = '';

                    for( var role in userRoles){
                        resultBitMask += "1"
                    }
                    //accessLevels[level] = parseInt(resultBitMask, 2);
                    accessLevels[level] = {
                        bitMask: parseInt(resultBitMask, 2)
                    };
                }
                else console.log("Access Control Error: Could not parse '" + accessLevelDeclarations[level] + "' as access definition for level '" + level + "'")

            }
            else {

                var resultBitMask = 0;
                for(var role in accessLevelDeclarations[level]){
                    if(userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
                        resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[level][role]].bitMask
                    else console.log("Access Control Error: Could not find role '" + accessLevelDeclarations[level][role] + "' in registered roles while building access for '" + level + "'")
                }
                accessLevels[level] = {
                    bitMask: resultBitMask
                };
            }
        }

        return accessLevels;
    }

})(typeof exports === 'undefined' ? this['routingConfig'] = {} : exports);
'use strict';

var app = angular.module('PHR', [
		// Angular extensions
		'ngAnimate',
		'ngRoute',
		'ngAria',
		'ngTouch',
		// Angular plugins
		'ui.router',
		'mobile-angular-ui',
		'LocalStorageModule',
		'highcharts-ng',
		// Custom apps modules
		'appServices',
		'appControllers',
		'appDirectives',
		'appFilters'
	])

	.constant('API', {
		'URL': "http://uat.secondopinionexpert.com/phrbeta",
		'URL_PATIENTS': "http://uat.secondopinionexpert.com/phrbeta/api/pt/patients",
		'HEADERS': { "Content-Type": "application/x-www-form-urlencoded" }
	})

	.constant('RELATIONSHIPS', [
		{name:'Relationship to you', is_disabled: 1},
		{name:'Self'},
		{name:'Spouse'},
		{name:'Son'},
		{name:'Daughter'},
		{name:'Living Partner'},
		{name:'Father'},
		{name:'Mother'},
		{name:'Brother'},
		{name:'Sister'},
		{name:'Uncle'},
		{name:'Aunt'},
		{name:'Cousin'},
		{name:'Caretaker'},
		{name:'Friend'},
		{name:'Grandfather'},
		{name:'Grandmother'},
		{name:'Legal Guardian'},
		{name:'Other'}
	])

	.constant('ADDRESS', {
		'COUNTRIES':  [
			{name:'Country', is_disabled: 1},
			{name:'United States'},
			{name:'Afghanistan'},
			{name:'Aland Islands'},
			{name:'Albania'},
			{name:'Algeria'},
			{name:'American Samoa'},
			{name:'Andorra'},
			{name:'Angola'},
			{name:'Anguilla'},
			{name:'Antarctica'},
			{name:'Antigua and Barbuda'},
			{name:'Argentina'},
			{name:'Armenia'},
			{name:'Aruba'},
			{name:'Australia'},
			{name:'Austria'},
			{name:'Azerbaijan'},
			{name:'Bahamas'},
			{name:'Bahrain'},
			{name:'Bangladesh'},
			{name:'Barbados'},
			{name:'Belarus'},
			{name:'Belgium'},
			{name:'Belize'},
			{name:'Benin'},
			{name:'Bermuda'},
			{name:'Bhutan'},
			{name:'Bolivia, Plurinational State of'},
			{name:'Bonaire, Sint Eustatius and Saba'},
			{name:'Bosnia and Herzegovina'},
			{name:'Botswana'},
			{name:'Bouvet Island'},
			{name:'Brazil'},
			{name:'British Indian Ocean Territory'},
			{name:'Brunei Darussalam'},
			{name:'Bulgaria'},
			{name:'Burkina Faso'},
			{name:'Burundi'},
			{name:'Cambodia'},
			{name:'Cameroon'},
			{name:'Canada'},
			{name:'Cape Verde'},
			{name:'Cape Verde'},
			{name:'Cayman Islands'},
			{name:'Central African Republic'},
			{name:'Chad'},
			{name:'Chile'},
			{name:'China'},
			{name:'Christmas Island'},
			{name:'Cocos (Keeling) Islands'},
			{name:'Colombia'},
			{name:'Comoros'},
			{name:'Congo'},
			{name:'Congo, The Democratic Republic of the'},
			{name:'Cook Islands'},
			{name:'Costa Rica'},
			{name:'Cote d\'Ivoire'},
			{name:'Croatia'},
			{name:'Cuba'},
			{name:'Curacao'},
			{name:'Cyprus'},
			{name:'Czech Republic'},
			{name:'Denmark'},
			{name:'Djibouti'},
			{name:'Dominica'},
			{name:'Dominican Republic'},
			{name:'Ecuador'},
			{name:'Egypt'},
			{name:'El Salvador'},
			{name:'Equatorial Guinea'},
			{name:'Eritrea'},
			{name:'Estonia'},
			{name:'Ethiopia'},
			{name:'Falkland Islands (Malvinas)'},
			{name:'Faroe Islands'},
			{name:'Fiji'},
			{name:'Finland'},
			{name:'France'},
			{name:'French Guiana'},
			{name:'French Polynesia'},
			{name:'French Southern Territories'},
			{name:'Gabon'},
			{name:'Gambia'},
			{name:'Georgia'},
			{name:'Germany'},
			{name:'Ghana'},
			{name:'Gibraltar'},
			{name:'Greece'},
			{name:'Greenland'},
			{name:'Grenada'},
			{name:'Guadeloupe'},
			{name:'Guam'},
			{name:'Guatemala'},
			{name:'Guernsey'},
			{name:'Guinea'},
			{name:'Guinea-Bissau'},
			{name:'Guyana'},
			{name:'Haiti'},
			{name:'Heard Island and McDonald Islands'},
			{name:'Holy See (Vatican City State)'},
			{name:'Honduras'},
			{name:'Hong Kong'},
			{name:'Hungary'},
			{name:'Iceland'},
			{name:'India'},
			{name:'Indonesia'},
			{name:'Iran, Islamic Republic of'},
			{name:'Iraq'},
			{name:'Ireland'},
			{name:'Isle of Man'},
			{name:'Israel'},
			{name:'Italy'},
			{name:'Jamaica'},
			{name:'Japan'},
			{name:'Jersey'},
			{name:'Jordan'},
			{name:'Kazakhstan'},
			{name:'Kenya'},
			{name:'Kiribati'},
			{name:'Korea, Democratic People\'s Republic of'},
			{name:'Korea, Republic of'},
			{name:'Kuwait'},
			{name:'Kyrgyzstan'},
			{name:'Lao People\'s Democratic Republic'},
			{name:'Latvia'},
			{name:'Lebanon'},
			{name:'Lesotho'},
			{name:'Liberia'},
			{name:'Libyan Arab Jamahiriya'},
			{name:'Liechtenstein'},
			{name:'Lithuania'},
			{name:'Luxembourg'},
			{name:'Macao'},
			{name:'Macedonia, The former Yugoslav Republic of'},
			{name:'Madagascar'},
			{name:'Malawi'},
			{name:'Malaysia'},
			{name:'Maldives'},
			{name:'Mali'},
			{name:'Malta'},
			{name:'Marshall Islands'},
			{name:'Martinique'},
			{name:'Mauritania'},
			{name:'Mauritius'},
			{name:'Mayotte'},
			{name:'Mexico'},
			{name:'Micronesia, Federated States of'},
			{name:'Moldova, Republic of'},
			{name:'Monaco'},
			{name:'Mongolia'},
			{name:'Montenegro'},
			{name:'Montserrat'},
			{name:'Morocco'},
			{name:'Mozambique'},
			{name:'Myanmar'},
			{name:'Namibia'},
			{name:'Nauru'},
			{name:'Nepal'},
			{name:'Netherlands'},
			{name:'New Caledonia'},
			{name:'New Zealand'},
			{name:'Nicaragua'},
			{name:'Niger'},
			{name:'Nigeria'},
			{name:'Niue'},
			{name:'Norfolk Island'},
			{name:'Northern Mariana Islands'},
			{name:'Norway'},
			{name:'Oman'},
			{name:'Pakistan'},
			{name:'Palau'},
			{name:'Palestinian Territory, Occupied'},
			{name:'Panama'},
			{name:'Papua New Guinea'},
			{name:'Paraguay'},
			{name:'Peru'},
			{name:'Philippines'},
			{name:'Pitcairn'},
			{name:'Poland'},
			{name:'Portugal'},
			{name:'Puerto Rico'},
			{name:'Qatar'},
			{name:'Reunion'},
			{name:'Romania'},
			{name:'Russian Federation'},
			{name:'Rwanda'},
			{name:'Saint Barthelemy'},
			{name:'Saint Helena, Ascension and Tristan Da Cunha'},
			{name:'Saint Kitts and Nevis'},
			{name:'Saint Lucia'},
			{name:'Saint Martin (French Part)'},
			{name:'Saint Pierre and Miquelon'},
			{name:'Saint Vincent and The Grenadines'},
			{name:'Samoa'},
			{name:'San Marino'},
			{name:'Sao Tome and Principe'},
			{name:'Saudi Arabia'},
			{name:'Senegal'},
			{name:'Serbia'},
			{name:'Seychelles'},
			{name:'Sierra Leone'},
			{name:'Singapore'},
			{name:'Sint Maarten (Dutch Part)'},
			{name:'Slovakia'},
			{name:'Slovenia'},
			{name:'Solomon Islands'},
			{name:'Somalia'},
			{name:'South Africa'},
			{name:'South Georgia and The South Sandwich Islands'},
			{name:'South Sudan'},
			{name:'Spain'},
			{name:'Sri Lanka'},
			{name:'Sudan'},
			{name:'Suriname'},
			{name:'Svalbard and Jan Mayen'},
			{name:'Swaziland'},
			{name:'Sweden'},
			{name:'Switzerland'},
			{name:'Syrian Arab Republic'},
			{name:'Taiwan, Province of China'},
			{name:'Tajikistan'},
			{name:'Tanzania, United Republic of'},
			{name:'Thailand'},
			{name:'Timor-Leste'},
			{name:'Togo'},
			{name:'Tokelau'},
			{name:'Tonga'},
			{name:'Trinidad and Tobago'},
			{name:'Tunisia'},
			{name:'Turkey'},
			{name:'Turkmenistan'},
			{name:'Turks and Caicos Islands'},
			{name:'Tuvalu'},
			{name:'Uganda'},
			{name:'Ukraine'},
			{name:'United Arab Emirates'},
			{name:'United Kingdom'},
			{name:'United States Minor Outlying Islands'},
			{name:'Uruguay'},
			{name:'Uzbekistan'},
			{name:'Vanuatu'},
			{name:'Venezuela, Bolivarian Republic of'},
			{name:'Viet Nam'},
			{name:'Virgin Islands, British'},
			{name:'Virgin Islands, U.S.'},
			{name:'Wallis and Futuna'},
			{name:'Western Sahara'},
			{name:'Yemen'},
			{name:'Zambia'},
			{name:'Zimbabwe'}
		],
		'STATES': [
			{name:'State', is_disabled: 1},
			{name:'Alabama'},
			{name:'Alaska'},
			{name:'Arizona'},
			{name:'Arkansas'},
			{name:'California'},
			{name:'Colorado'},
			{name:'Connecticut'},
			{name:'Delaware'},
			{name:'District of Columbia'},
			{name:'Florida'},
			{name:'Georgia'},
			{name:'Hawaii'},
			{name:'Idaho'},
			{name:'Illinois'},
			{name:'Indiana'},
			{name:'Iowa'},
			{name:'Kansas'},
			{name:'Kentucky'},
			{name:'Louisiana'},
			{name:'Maine'},
			{name:'Maryland'},
			{name:'Massachusetts'},
			{name:'Michigan'},
			{name:'Minnesota'},
			{name:'Mississippi'},
			{name:'Missouri'},
			{name:'Montana'},
			{name:'Nebraska'},
			{name:'Nevada'},
			{name:'New Hampshire'},
			{name:'New Jersey'},
			{name:'New Mexico'},
			{name:'New York'},
			{name:'North Carolina'},
			{name:'North Dakota'},
			{name:'Ohio'},
			{name:'Oklahoma'},
			{name:'Pennsylvania'},
			{name:'Rhode Island'},
			{name:'South Carolina'},
			{name:'South Dakota'},
			{name:'Tennessee'},
			{name:'Texas'},
			{name:'Utah'},
			{name:'Vermont'},
			{name:'Virginia'},
			{name:'Washington'},
			{name:'West Virginia'},
			{name:'Wisconsin'},
			{name:'Wyoming'},
		]
	})

	.config(['$sceDelegateProvider', '$routeProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'API', function ($sceDelegateProvider, $routeProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, API) {
		$sceDelegateProvider.resourceUrlWhitelist([
			'self',
			'http://soeweb1.cloudapp.net/**',
			'http://uat.secondopinionexpert.com/**'
		]);

		//Http Intercpetor to check auth failures for xhr requests
    	$httpProvider.interceptors.push('authHttpResponseInterceptor');

		var access = routingConfig.accessLevels,
			//VIEWS
			folders = [
				'views',
				'sign-up',
				'measurements',
				'histories',
				'summaries',
				'profile',
				'documents',
				'common',
				'share',
			];

		// Anonymous routes
		$stateProvider
			.state('anon', {
				abstract: true,
				template: "<div ui-view/>",
				data: {
					access: access.anon
				}
			})
			.state('anon.indexdefault', {
				url: '',
				templateUrl: folders[0] + '/index.html'
			})
			.state('anon.index', {
				url: '/',
				templateUrl: folders[0] + '/index.html'
			})
			.state('anon.login', {
				url: '/login',
				templateUrl: folders[0] + '/login.html',
				controller: 'LoginCtrl'
			})
			.state('anon.register', {
				url: '/sign-up',
				templateUrl: folders[0] + '/' + folders[1] + '/sign-up.html',
				controller: 'SignupCtrl'
			})

			.state('anon.thanks', {
				url: '/sign-up-thanks',
				templateUrl: folders[0] + '/' + folders[1] + '/thanks.html'
			})

			.state('anon.signupconfirmation', {
				url: '/sign-up-confirmation/:token',
				templateUrl: folders[0] + '/' + folders[1] + '/sign-up-confirmation.html',
				controller: 'SignupConfirmationCtrl'
			})

			.state('anon.forgotpassword', {
				url: '/forgot-password',
				templateUrl: folders[0] + '/forgot-password.html',
				controller: 'ForgotPasswordCtrl'
			})
			.state('anon.forgotpasswordconfirmation', {
				url: '/forgot-password-confirmation/:token',
				templateUrl: folders[0] + '/forgot-password-confirmation.html',
				controller: 'ForgotPasswordConfirmationCtrl'
			})
			;

		// Regular user routes
		$stateProvider
			.state('user', {
				abstract: true,
				template: "<ui-view/>",
				data: {
					access: access.user
				}
			})
			.state('user.accounts', {
				url: '/accounts',
				templateUrl: folders[0] + '/' + folders[7] + '/accounts.html',
				controller: 'AccountsCtrl',
				data: {
					isSignUp: 0,
					loggedin: 1
				}
			})
			.state('user.accounts-switcher', {
				url: '/accounts-switcher',
				templateUrl: folders[0] + '/' + folders[7] + '/accounts.html',
				controller: 'AccountsCtrl',
				data: {
					isSignUp: 1,
					loggedin: 0
				}
			})
			.state('user.add-a-person', {
				url: '/add-a-person',
				templateUrl: folders[0] + '/' + folders[7] + '/add-a-person.html',
				controller: 'AccountsCtrl'
			})
			.state('user.home', {
				url: '/home',
				templateUrl: folders[0] + '/home.html',
				controller: 'HomeCtrl'
			})
			.state('user.logout', {
				url: '/logout',
				templateUrl: folders[0] + '/index.html',
				controller: 'LogoutCtrl'
			})
			.state('user.changepassword', {
				url: '/change-password',
				templateUrl: folders[0] + '/change-password.html',
				controller: 'ChangePasswordCtrl'
			})

			/**
			 * Personal Info
			 */
			.state('user.signup', {
				abstract: true,
				url: '/' + folders[1],
				template: "<div ui-view/>",
			})
			.state('user.signup.terms', {
				url: '/terms',
				templateUrl: folders[0] + '/' + folders[1] + '/terms.html',
				controller: 'TermsCtrl'
			})
			.state('user.signup.sign', {
				url: '/sign',
				templateUrl: folders[0] + '/' + folders[1] + '/sign.html',
				controller: 'SignCtrl'
			})
			.state('user.signup.basic-information', {
				url: '/basic-information',
				templateUrl: folders[0] + '/' + folders[1] + '/basic-information.html',
				controller: 'BasicInformationCtrl',
				data: {
					is_add_account: 0,
					isSignUp: 1
				}
			})
			.state('user.signup.basic-question', {
                url: '/basic-question',
                templateUrl: folders[0] + '/' + folders[1] + '/basic-question.html',
                controller: 'BasicQuestionCtrl',
                data: {
                    is_add_account: 0,
                    isSignUp: 1
                }
            })
            /*
			.state('user.signup.personal-info', {
				url: '/personal-info',
				templateUrl: folders[0] + '/' + folders[1] + '/personal-info.html',
				controller: 'PersonalInfoCtrl',
				data: {
					is_add_account: 0,
					isSignUp: 1
				}
			})*/
			.state('user.signup.work-address', {
				url: '/work-address',
				templateUrl: folders[0] + '/' + folders[1] + '/work-address.html',
				controller: 'AddressCtrl'
			})
			.state('user.signup.home-address', {
				url: '/home-address',
				templateUrl: folders[0] + '/' + folders[1] + '/home-address.html',
				controller: 'AddressCtrl'
			})
			.state('user.signup.contact-info', {
				url: '/contact-info',
				templateUrl: folders[0] + '/' + folders[1] + '/contact-info.html',
				controller: 'ContactInfoCtrl',
				data: {
					is_add_account: 0
				}
			})

			// Add account
			.state('user.add-account', {
				abstract: true,
				url: '/add-account',
				template: "<div ui-view/>",
			})
			.state('user.add-account.basic-information', {
				url: '/basic-information',
				templateUrl: folders[0] + '/' + folders[1] + '/basic-information.html',
				controller: 'BasicInformationCtrl',
				data: {
					is_add_account: 1
				}
			})
			.state('user.add-account.basic-question', {
                url: '/basic-question',
                templateUrl: folders[0] + '/' + folders[1] + '/basic-question.html',
                controller: 'BasicQuestionCtrl',
                data: {
                    is_add_account: 1,

                }
            })
            /*
			.state('user.add-account.personal-info', {
				url: '/personal-info',
				templateUrl: folders[0] + '/' + folders[1] + '/personal-info.html',
				controller: 'PersonalInfoCtrl',
				data: {
					is_add_account: 1
				}
			})*/
			.state('user.add-account.contact-info', {
				url: '/contact-info',
				templateUrl: folders[0] + '/' + folders[1] + '/contact-info.html',
				controller: 'ContactInfoCtrl',
				data: {
					is_add_account: 1
				}
			})

			// Select what do you want to measure
			.state('user.signup.measurements', {
				url: '/measurements',
				templateUrl: folders[0] + '/' + folders[1] + '/measurements.html',
				controller: 'MeasurementsCtrl'
			})
			.state('user.signup.physician', {
				url: '/physician',
				templateUrl: folders[0] + '/' + folders[1] + '/physician.html',
				controller: 'PhysicianCtrl'
			})

			.state('user.profile', {
				abstract: true,
				url: '/' + folders[5],
				template: "<div ui-view/>",
			})

			.state('user.profile.personal-info', {
				url: '/personal-info',
				templateUrl: folders[0] + '/' + folders[1] + '/personal-info.html',
				controller: 'PersonalInfoCtrl',
				
			})
			.state('user.profile.work-address', {
				url: '/work-address',
				templateUrl: folders[0] + '/' + folders[1] + '/work-address.html',
				controller: 'AddressCtrl'
			})
			.state('user.profile.home-address', {
				url: '/home-address',
				templateUrl: folders[0] + '/' + folders[1] + '/home-address.html',
				controller: 'AddressCtrl'
			})
			.state('user.profile.contact-info', {
				url: '/contact-info',
				templateUrl: folders[0] + '/' + folders[1] + '/contact-info.html',
				controller: 'ContactInfoCtrl',
				data: {
					is_add_account: 0
				}
			})

			/**
			 * Measurements
			 */
			.state('user.measurements', {
				abstract: true,
				url: '/' + folders[2],
				template: "<div ui-view/>",
			})
			// Body Systems
			.state('user.measurements.bodySystems', {
				url: '/health-status',
				templateUrl: folders[0] + '/' + folders[2] + '/body-systems/body-systems.html',
				controller: 'BodySystemsCtrl'
			})

			// Allergies
			.state('user.measurements.allergies', {
				url: '/allergies',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Allergies',
					'item': 'Allergy',
					'shortcut': 'allergies',
					'shortcutSingle': 'allergy',
					'type': folders[2],
					'icon': 'fa-warning'
				}
			})
			.state('user.measurements.allergies-create', {
				url: '/allergy',
				templateUrl: folders[0] + '/' + folders[2] + '/allergies/create.html',
				controller: 'AllergyCreateCtrl',
				data: {
					'items': 'Allergies',
					'item': 'Allergy',
					'shortcut': 'allergies',
					'shortcutSingle': 'allergy',
					'type': 'measurements'
				}

			})
			.state('user.measurements.allergies-edit', {
				url: '/allergy/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'AllergyEditCtrl',
				data: {
					'items': 'Allergies',
					'item': 'Allergy',
					'shortcut': 'allergies',
					'shortcutSingle': 'allergy',
					'type': 'measurements'
				}
			})
			.state('user.measurements.allergies-view', {
				url: '/allergy/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Allergies',
					'item': 'Allergy',
					'shortcut': 'allergies',
					'shortcutSingle': 'allergy',
					'type': 'measurements'
				}
			})

			// Sleep
			.state('user.measurements.sleep', {
				url: '/sleeps',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Sleep',
					'item': 'Sleep',
					'shortcut': 'sleeps',
					'shortcutSingle': 'sleep',
					'type': folders[2],
					'icon': 'fa-moon-o'
				}
			})
			.state('user.measurements.sleep-create', {
				url: '/sleep',
				templateUrl: folders[0] + '/' + folders[2] + '/sleeps/create.html',
				controller: 'SleepEditCtrl',
				data: {
					'items': 'Sleep',
					'item': 'Sleep',
					'shortcut': 'sleeps',
					'shortcutSingle': 'sleep',
					'type': 'measurements'
				}

			})
			.state('user.measurements.sleep-edit', {
				url: '/sleep/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'SleepEditCtrl',
				data: {
					'items': 'Sleep',
					'item': 'Sleep',
					'shortcut': 'sleeps',
					'shortcutSingle': 'sleep',
					'type': 'measurements'
				}
			})
			.state('user.measurements.sleep-view', {
				url: '/sleep/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Sleep',
					'item': 'Sleep',
					'shortcut': 'sleeps',
					'shortcutSingle': 'sleep',
					'type': 'measurements'
				}
			})

			// Exercises
			.state('user.measurements.exercises', {
				url: '/exercises',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Exercises',
					'item': 'Exercise',
					'shortcut': 'exercises',
					'shortcutSingle': 'exercise',
					'type': folders[2],
					'icon': 'fa-rocket'
				}
			})
			.state('user.measurements.exercises-create', {
				url: '/exercise',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'Exercises',
					'item': 'Exercise',
					'shortcut': 'exercises',
					'shortcutSingle': 'exercise',
					'type': 'measurements'
				}
			})
			.state('user.measurements.exercises-edit', {
				url: '/exercise/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'ExercisesEditCtrl',
				data: {
					'items': 'Exercises',
					'item': 'Exercise',
					'shortcut': 'exercises',
					'shortcutSingle': 'exercise',
					'type': 'measurements'
				}
			})
			.state('user.measurements.exercises-view', {
				url: '/exercise/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Exercises',
					'item': 'Exercise',
					'shortcut': 'exercises',
					'shortcutSingle': 'exercise',
					'type': 'measurements'
				}
			})

			// Bathroom
			.state('user.measurements.bathroom', {
				url: '/bathrooms',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Bathrooms',
					'item': 'Bathroom',
					'shortcut': 'bathrooms',
					'shortcutSingle': 'bathroom',
					'type': folders[2],
					'icon': 'fa-bomb'
				}
			})
			.state('user.measurements.bathroom-create', {
				url: '/bathroom',
				templateUrl: folders[0] + '/' + folders[2] + '/bathrooms/create.html',
				controller: 'BathroomEditCtrl',
				data: {
					'items': 'Bathrooms',
					'item': 'Bathroom',
					'shortcut': 'bathrooms',
					'shortcutSingle': 'bathroom',
					'type': 'measurements'
				}
			})
			.state('user.measurements.bathroom-edit', {
				url: '/bathroom/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'BathroomEditCtrl',
				data: {
					'items': 'Bathrooms',
					'item': 'Bathroom',
					'shortcut': 'bathrooms',
					'shortcutSingle': 'bathroom',
					'type': 'measurements'
				}
			})
			.state('user.measurements.bathroom-view', {
				url: '/bathroom/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Bathrooms',
					'item': 'Bathroom',
					'shortcut': 'bathrooms',
					'shortcutSingle': 'bathroom',
					'type': 'measurements'
				}
			})

			// Food&Drinks
			.state('user.measurements.foodsdrinks', {
				url: '/foodsdrinks',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Foods & Drinks',
					'item': 'Food & Drink',
					'shortcut': 'foodsdrinks',
					'shortcutSingle': 'fooddrink',
					'type': folders[2],
					'icon': 'fa-cutlery'
				}
			})
			.state('user.measurements.foodsdrinks-create', {
				url: '/fooddrink',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'Foods & Drinks',
					'item': 'Food &  Drink',
					'shortcut': 'foodsdrinks',
					'shortcutSingle': 'fooddrink',
					'type': 'measurements'
				}
			})
			.state('user.measurements.foodsdrinks-edit', {
				url: '/fooddrink/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'FoodsdrinksEditCtrl',
				data: {
					'items': 'Foods & Drinks',
					'item': 'Food & Drink',
					'shortcut': 'foodsdrinks',
					'shortcutSingle': 'fooddrink',
					'type': 'measurements'
				}
			})

			.state('user.measurements.foodsdrinks-view', {
				url: '/fooddrink/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Foods &  Drinks',
					'item': 'Food &  Drink',
					'shortcut': 'foodsdrinks',
					'shortcutSingle': 'fooddrink',
					'type': 'measurements'
				}
			})

			// immunizations
			.state('user.measurements.immunizations', {
				url: '/immunizations',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Immunizations',
					'item': 'Immunization',
					'shortcut': 'immunizations',
					'shortcutSingle': 'immunization',
					'type': folders[2],
					'icon': 'fa-shield'
				}
			})
			.state('user.measurements.immunizations-create', {
				url: '/immunization',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'Immunizations',
					'item': 'Immunization',
					'shortcut': 'immunizations',
					'shortcutSingle': 'immunization',
					'type': 'measurements'
				}
			})
			.state('user.measurements.immunizations-edit', {
				url: '/immunization/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'immunizationsEditCtrl',
				data: {
					'items': 'Immunizations',
					'item': 'Immunization',
					'shortcut': 'immunizations',
					'shortcutSingle': 'immunization',
					'type': 'measurements'
				}
			})
			.state('user.measurements.immunizations-view', {
				url: '/immunization/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Immunizations',
					'item': 'Immunization',
					'shortcut': 'immunizations',
					'shortcutSingle': 'immunization',
					'type': 'measurements'
				}
			})

			// Medications
			.state('user.measurements.medications', {
				url: '/medications',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Medications',
					'item': 'Medication',
					'shortcut': 'medications',
					'shortcutSingle': 'medication',
					'type': folders[2],
					'icon': 'fa-medkit'
				}
			})
			.state('user.measurements.medications-create', {
				url: '/medication',
				templateUrl: folders[0] + '/' + folders[2] + '/medications/create.html',
				controller: 'MedicationCreateCtrl',
				data: {
					'items': 'Medications',
					'item': 'Medication',
					'shortcut': 'medications',
					'shortcutSingle': 'medication',
					'type': 'measurements'
				}
			})
			.state('user.measurements.medications-edit', {
				url: '/medication/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'MedicationsEditCtrl',
				data: {
					'items': 'Medications',
					'item': 'Medication',
					'shortcut': 'medications',
					'shortcutSingle': 'medication',
					'type': 'measurements'
				}
			})
			.state('user.measurements.medications-view', {
				url: '/medication/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Medications',
					'item': 'Medication',
					'shortcut': 'medications',
					'shortcutSingle': 'medication',
					'type': 'measurements'
				}
			})

			// Heights
			.state('user.measurements.heights', {
				url: '/heights',
				templateUrl: folders[0] + '/' + folders[2] + '/heights/list.html',
				controller: 'HeightsCtrl'
			})
			.state('user.measurements.heights-view', {
				url: '/heights/:id',
				templateUrl: folders[0] + '/' + folders[2] + '/heights/view.html',
				controller: 'HeightsViewCtrl'
			})
			.state('user.measurements.heights-edit', {
				url: '/heights/:id/edit',
				templateUrl: folders[0] + '/' + folders[2] + '/heights/edit.html',
				controller: 'HeightsEditCtrl'
			})
			.state('user.measurements.heights-create', {
				url: '/height',
				templateUrl: folders[0] + '/' + folders[2] + '/heights/create.html',
				controller: 'HeightsCreateCtrl'
			})

			// Weights
			.state('user.measurements.weights', {
				url: '/weights',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Weight',
					'item': 'Weight',
					'shortcut': 'weights',
					'shortcutSingle': 'weight',
					'type': folders[2],
					'icon': 'fa-dashboard'/*,
					'hasChart': 1*/
				}
			})
			.state('user.measurements.weights-create', {
				url: '/weight',
				templateUrl: folders[0] + '/' + folders[2] + '/weights/create.html',
				controller: 'WeightsEditCtrl',
				data: {
					'items': 'Weights',
					'item': 'Weight',
					'shortcut': 'weights',
					'shortcutSingle': 'weight',
					'type': folders[2]
				}
			})
			.state('user.measurements.weights-edit', {
				url: '/weight/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'WeightsEditCtrl',
				data: {
					'items': 'Weights',
					'item': 'Weight',
					'shortcut': 'weights',
					'shortcutSingle': 'weight',
					'type': folders[2]
				}

			})
			.state('user.measurements.weights-view', {
				url: '/weight/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Weights',
					'item': 'Weight',
					'shortcut': 'weights',
					'shortcutSingle': 'weight',
					'type': folders[2]
				}
			})

			// VisionRx
			.state('user.measurements.visionrx', {
				url: '/visionrxs',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'VisionRx',
					'item': 'VisionRx',
					'shortcut': 'visionrxs',
					'shortcutSingle': 'visionrx',
					'type': folders[2],
					'icon': 'fa-eye'
				}
			})
			.state('user.measurements.visionrx-create', {
				url: '/visionrx',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'VisionRx',
					'item': 'VisionRx',
					'shortcut': 'visionrxs',
					'shortcutSingle': 'visionrx',
					'type': 'measurements'
				}

			})
			.state('user.measurements.visionrx-edit', {
				url: '/visionrx/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'ItemEditCtrl',
				data: {
					'items': 'VisionRx',
					'item': 'VisionRx',
					'shortcut': 'visionrxs',
					'shortcutSingle': 'visionrx',
					'type': 'measurements'
				}
			})
			.state('user.measurements.visionrx-view', {
				url: '/visionrx/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'VisionRx',
					'item': 'VisionRx',
					'shortcut': 'visionrxs',
					'shortcutSingle': 'visionrx',
					'type': 'measurements'
				}
			})

			// Natural supplements
			.state('user.measurements.naturalSupplements', {
				url: '/natural-supplements',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Natural supplements',
					'item': 'Supplement',
					'shortcut': 'natural-supplements',
					'shortcutSingle': 'natural-supplement',
					'type': folders[2],
					'icon': 'fa-coffee'
				}
			})
			.state('user.measurements.naturalSupplements-create', {
				url: '/natural-supplement',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'Natural supplements',
					'item': 'Natural supplements',
					'shortcut': 'natural-supplements',
					'shortcutSingle': 'natural-supplement',
					'type': 'measurements'
				}

			})
			.state('user.measurements.naturalSupplements-edit', {
				url: '/natural-supplement/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'NaturalSupplementsEditCtrl',
				data: {
					'items': 'Natural supplements',
					'item': 'Natural supplements',
					'shortcut': 'natural-supplements',
					'shortcutSingle': 'natural-supplement',
					'type': 'measurements'
				}
			})
			.state('user.measurements.naturalSupplements-view', {
				url: '/natural-supplement/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Natural supplements',
					'item': 'Natural supplements',
					'shortcut': 'natural-supplements',
					'shortcutSingle': 'natural-supplement',
					'type': 'measurements'
				}
			})

			/**
			 * Histories
			 */
			.state('user.histories', {
				abstract: true,
				url: '/' + folders[3],
				template: "<div ui-view/>",
			})

			// Procedures
			.state('user.histories.procedures', {
				url: '/procedures',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Procedures',
					'item': 'Procedure',
					'shortcut': 'procedures',
					'shortcutSingle': 'procedure',
					'type': folders[3],
					'icon': 'fa-stethoscope'
				}
			})
			.state('user.histories.procedures-create', {
				url: '/procedure',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'Procedures',
					'item': 'Procedure',
					'shortcut': 'procedures',
					'shortcutSingle': 'procedure',
					'type': folders[3]
				}
			})
			.state('user.histories.procedures-edit', {
				url: '/procedure/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'ProceduresEditCtrl',
				data: {
					'items': 'Procedures',
					'item': 'Procedure',
					'shortcut': 'procedures',
					'shortcutSingle': 'procedure',
					'type': folders[3]
				}
			})
			.state('user.histories.procedures-view', {
				url: '/procedure/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Procedures',
					'item': 'Procedure',
					'shortcut': 'procedures',
					'shortcutSingle': 'procedure',
					'type': folders[3]
				}
			})

			// Conditions
			.state('user.histories.conditions', {
				url: '/conditions',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Conditions',
					'item': 'Condition',
					'apiShortcut': 'mc',
					'shortcut': 'conditions',
					'shortcutSingle': 'condition',
					'type': folders[3],
					'icon': 'fa-flag'
				}
			})
			.state('user.histories.conditions-create', {
				url: '/condition',
				templateUrl: folders[0] + '/' + folders[3] + '/conditions/create.html',
				controller: 'ConditionCreateCtrl',
				data: {
					'items': 'Conditions',
					'item': 'Condition',
					'apiShortcut': 'mc',
					'shortcut': 'conditions',
					'shortcutSingle': 'condition',
					'placeholder': 'Enter a past or present condition',
					'type': folders[3]
				}
			})
			.state('user.histories.conditions-edit', {
				url: '/condition/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'ConditionsEditCtrl',
				data: {
					'items': 'Conditions',
					'item': 'Condition',
					'apiShortcut': 'mc',
					'shortcut': 'conditions',
					'shortcutSingle': 'condition',
					'type': folders[3]
				}
			})
			.state('user.histories.conditions-view', {
				url: '/condition/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Conditions',
					'item': 'Condition',
					'apiShortcut': 'mc',
					'shortcut': 'conditions',
					'shortcutSingle': 'condition',
					'type': folders[3]
				}
			})

			// Past Family History
			.state('user.histories.family', {
				url: '/family-histories',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Family history',
					'item': 'Family history',
					'apiShortcut': 'mc',
					'shortcut': 'family-histories',
					'shortcutSingle': 'family-history',
					'type': folders[3],
					'icon': 'fa-users'
				}
			})
			.state('user.histories.family-create', {
				url: '/family-history',
				templateUrl: folders[0] + '/' + folders[3] + '/family-histories/create.html',
				controller: 'FamilyCreateCtrl',
				data: {
					'items': 'Family history',
					'item': 'Family history',
					'apiShortcut': 'mc',
					'shortcut': 'family-histories',
					'shortcutSingle': 'family-history',
					'placeholder': 'Enter a past family history',
					'type': folders[3]
				}
			})
			.state('user.histories.family-edit', {
				url: '/family-history/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'ConditionsEditCtrl',
				data: {
					'items': 'Family history',
					'item': 'Family history',
					'apiShortcut': 'mc',
					'shortcut': 'family-histories',
					'shortcutSingle': 'family-history',
					'type': folders[3]
				}
			})
			.state('user.histories.family-view', {
				url: '/family-history/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Family history',
					'item': 'Family history',
					'apiShortcut': 'mc',
					'shortcut': 'family-histories',
					'shortcutSingle': 'family-history',
					'type': folders[3]
				}
			})

			// Past Surgical History
			.state('user.histories.surgical', {
				url: '/surgical-histories',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Surgical history',
					'item': 'Surgical history',
					'apiShortcut': 'mh',
					'shortcut': 'surgical-histories',
					'shortcutSingle': 'surgical-history',
					'type': folders[3],
					'icon': 'fa-stethoscope'
				}
			})
			.state('user.histories.surgical-create', {
				url: '/surgical-history',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'Surgical history',
					'item': 'Surgical history',
					'apiShortcut': 'mh',
					'shortcut': 'surgical-histories',
					'shortcutSingle': 'surgical-history',
					'placeholder': 'Enter a past surgical history',
					'type': folders[3]
				}
			})
			.state('user.histories.surgical-edit', {
				url: '/surgical-history/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'ConditionsEditCtrl',
				data: {
					'items': 'Surgical history',
					'item': 'Surgical history',
					'apiShortcut': 'mh',
					'shortcut': 'surgical-histories',
					'shortcutSingle': 'surgical-history',
					'type': folders[3]
				}
			})
			.state('user.histories.surgical-view', {
				url: '/surgical-history/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Family history',
					'item': 'Family history',
					'apiShortcut': 'mh',
					'shortcut': 'surgical-histories',
					'shortcutSingle': 'surgical-history',
					'type': folders[3]
				}
			})

			// Social history
			.state('user.histories.socialHistory', {
				url: '/social-history',
				templateUrl: folders[0] + '/' + folders[3] + '/social-history/edit.html',
				controller: 'SocialHistoryCtrl'
			})

			// Lab Results
			.state('user.histories.labresults', {
				url: '/lab-results',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Laboratory test results',
					'item': 'Laboratory test result',
					'shortcut': 'lab-results',
					'shortcutSingle': 'lab-result',
					'type': folders[3],
					'icon': 'fa-flask'
				}
			})
			.state('user.histories.labresults-create', {
				url: '/lab-result',
				templateUrl: folders[0] + '/' + folders[7] + '/create.html',
				controller: 'ItemCreateCtrl',
				data: {
					'items': 'Laboratory test results',
					'item': 'Laboratory test result',
					'shortcut': 'lab-results',
					'shortcutSingle': 'lab-result',
					'type': folders[3]
				}
			})
			.state('user.histories.labresults-edit', {
				url: '/lab-result/:id/edit',
				templateUrl: folders[0] + '/' + folders[7] + '/edit.html',
				controller: 'LabresultsEditCtrl',
				data: {
					'items': 'Laboratory test results',
					'item': 'Laboratory test result',
					'shortcut': 'lab-results',
					'shortcutSingle': 'lab-result',
					'type': folders[3]
				}
			})
			.state('user.histories.labresults-view', {
				url: '/lab-result/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/view.html',
				controller: 'ItemViewCtrl',
				data: {
					'items': 'Laboratory test results',
					'item': 'Laboratory test result',
					'shortcut': 'lab-results',
					'shortcutSingle': 'lab-result',
					'type': folders[3]
				}
			})

			/**
			 * Summaries
			 */
			.state('user.health-summary', {
				abstract: true,
				url: '/health-summary',
				template: "<div ui-view/>",
			})
			.state('user.health-summary.view', {
				url: '/view',
				templateUrl: folders[0] + '/' + folders[4] + '/view.html',
				controller: 'SummariesViewCrtl'
			})

			/**
			 * Share
			 */
			.state('user.share', {
				abstract: true,
				url: '/share',
				template: "<div ui-view/>",
			})
			.state('user.share.send', {
				url: '/send',
				templateUrl: folders[0] + '/' + folders[8] + '/share.html',
				controller: 'ShareCrtl'
			})
			.state('user.share.by-me', {
				url: '/shared-by-me',
				templateUrl: folders[0] + '/' + folders[8] + '/shared.html',
				controller: 'SharedCrtl',
				data: {
					'title' : 'Shared By Me',
					type: 'byMe'

				}
			})
            .state('user.share.detail-by-me', {
                url: '/shared-by-me/:id',
                templateUrl: folders[0] + '/' + folders[8] + '/shareddetail.html',
                controller: 'SharedDetailCrtl',
                data: {
                    'type': 'byMe',
                    
                    'backurl' : '#/share/shared-by-me'
                }
            })
            .state('user.share.detail-with-me', {
                url: '/shared-with-me/:id',
                templateUrl: folders[0] + '/' + folders[8] + '/shareddetail.html',
                controller: 'SharedDetailCrtl',
                data: {
                    'type': 'withMe',
                    'backurl' : '#/share/shared-with-me'
                }
            })
			.state('user.share.with-me', {
				url: '/shared-with-me',
				templateUrl: folders[0] + '/' + folders[8] + '/shared.html',
				controller: 'SharedCrtl',
				data: {
					type: 'withMe',
					'title' : 'Shared With Me',
					'items': 'Allergies',
					'item': 'Allergy',
					'shortcut': 'allergies',
					'shortcutSingle': 'allergy',
					'icon': 'fa-warning'
				}
			})

			/**
			 * Documents
			 */
			.state('user.documents', {
				abstract: true,
				url: '/' + folders[6],
				template: "<div ui-view/>",
			})
			.state('user.documents.list', {
				url: '/list',
				templateUrl: folders[0] + '/' + folders[7] + '/list.html',
				controller: 'ItemsCtrl',
				data: {
					'items': 'Documents',
					'item': 'Documents',
					'apiShortcut': 'docsvault',
					'shortcutSingle': 'item',
					'type': folders[6],
					'icon': 'fa-arrow-circle-o-down',
					'download': true
				}
			})
			.state('user.documents.item-view', {
				url: '/item/:id',
				templateUrl: folders[0] + '/' + folders[7] + '/iframe.html',
				controller: 'DocumentsViewCrtl'
			})
			.state('user.documents.item', {
				url: '/item',
				templateUrl: folders[0] + '/' + folders[6] + '/upload.html',
				controller: 'DocumentsUploadCrtl'
			})



			// Admin routes
			.state('admin', {
				abstract: true,
				template: "<ui-view/>",
				data: {
					access: access.admin
				}
			});

		$urlRouterProvider.otherwise('/404');


	}]);

/* Controllers */

var appControllers = angular.module('appControllers', ['appServices', 'appFilters']);


appControllers
	.controller('MainController', ['$rootScope', '$state', '$location', 'Auth', function($rootScope, $state, $location, Auth) {

		$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			var state_name = toState.name;
			$rootScope.fromState = fromState;
			$rootScope.loading = 1;
			$rootScope.hasBottomBar = 0;
			$rootScope.isSignUp = (state_name.search('signup')==-1)?0:1;
			$rootScope.requireLogin = (state_name.search('user')==-1)?0:1;

			console.log($rootScope.requireLogin, Auth.loginExpired());

			if($rootScope.requireLogin){
				if(Auth.loginExpired()) {
					if(!$state.$current.data){
						event.preventDefault();
						Auth.logout(function() {
							$location.path('logout');
						});
					} else {
						Auth.needLogin();
					}
				}
			}

			if(!('data' in toState && 'access' in toState['data'])) {
				$rootScope.error = 'Access undefined for this state';
				event.preventDefault();
			} else if (!Auth.authorize(toState.data.access)) {
				$rootScope.error = 'Seems like you tried accessing a route you don\'t have access to...';
				event.preventDefault();
				if(fromState.url === '^') {
					if(Auth.isLoggedIn()) {
						$state.go('user.home');
					} else {
						$rootScope.error = null;
						$state.go('anon.login');
					}
				}
			}

			console.log('Going to ' + state_name);
		});

		$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

			console.log('Route Changed');
			if(!$rootScope.loaded){
				$rootScope.loaded = 1;
			}
			$rootScope.loading = 0;
			if(Auth.isLoggedIn()) {
				$rootScope.loggedin = 1;
				$rootScope.bodyClass = toState.name;
			}else{
				$rootScope.loggedin = 0;
				$rootScope.bodyClass = 'not-logged';
			}
			// Cancel link
			$rootScope.cancel_link = ($rootScope.loggedin)?'#/home':'#/';
		});

	}])

	.controller('LogoutCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth){
		Auth.logout(function() {
			$state.go('anon.index');
		});
	}])

	// Accounts switcher page
	.controller('AccountsCtrl', ['$rootScope', '$scope', '$state', 'UserService', 'Auth', function($rootScope, $scope, $state, UserService, Auth){
		$rootScope.isSignUp = $state.current.data.isSignUp;
		$rootScope.loggedin = $state.current.data.loggedin;
		$scope.waiting = 1;
		UserService.getAccounts(
			function (accounts) {
				if(accounts.length > 1){
					$scope.accounts = accounts;
					$scope.waiting = 0;
					$rootScope.loggedin = 1;
					$rootScope.hide_switch = 0;
				}else{
					$rootScope.hide_switch = 1;
					$scope.submitForm(Auth.user.id);
				}
			});

		$scope.submitForm = function(id) {
			if(typeof id != 'number'){
				id = $scope.account;
			}


			Auth.setCurrentAccount(
				id,
				function () {
					$state.go('user.home');
				},
				function(error){
					console.log(error);
				});
		};

	}])

	.controller('HomeCtrl', ['$scope', '$timeout', '$location', 'Auth', 'ApiService', 'Notification', function($scope, $timeout, $location, Auth, ApiService, Notification){

		var today = new Date(),
			//items = ['bodysystems', 'naturalsupplements', 'medications', 'weights', 'foodsdrinks', 'exercises'],
			items = ['bodysystems', 'medications'],
			cards = [];

		$scope.user = Auth.user;

		today = today.toDateString();

		/*ApiService.get('home', 1, function(data) {

			if(typeof data === 'undefined'){
				data = {}
				cards = items;
				for (var i = cards.length - 1; i >= 0; i--) {
					$scope[cards[i]] = {};
					$scope[cards[i]].show = 1;
				};

				// Nothing is done we have to show the cards
				$scope.allDone = 0;
			}else{

				for (var i = items.length - 1; i >= 0; i--) {
					var item = items[i];
					if(typeof data[item] !== 'undefined') {

						if(data[item].date != today){
							// If at least the are is one card to show
							$scope.allDone = 0;
							cards[cards.length] = item;
							$scope[item] = {};
							$scope[item].show = 1;
						}
						/*data[item] = {};
						data[item].date = data[item].date;* /
					}else{
						cards[cards.length] = item;
						$scope[item] = {};
						$scope[item].show = 1;
						// If at least the are is one card to show
						$scope.allDone = 0;
					}
				}
			}
			$scope.collection = data;
			if(!cards.length) {
				// There is no cards to show
				$scope.allDone = 1;
			}

		},function(err){"ERR", console.log(err) });

		$scope.submitForm = function(box_data) {
			var dateSaved = (box_data[1])?today:box_data[2];

			if(dateSaved === '') {
				//dateSaved = new Date(Date.now() - 24*60*60*1000);
				dateSaved = new Date();
				dateSaved = dateSaved.toDateString();
			}

			$scope.collection[box_data[0]] = {
				date: (box_data[1])?today:dateSaved
			}

			ApiService.save(
				'home',
				1,
				$scope.collection,
				function(data){

					if(box_data[1]){
						$location.path('measurements/' + box_data[2]);
					}else{
						$scope[box_data[0]].flipped = 'flipped';
						$timeout(function(){
							$scope[box_data[0]].show = 0;
							var index = cards.indexOf(box_data[0]);
							if(index != -1){
								cards.splice(index, 1);
							}
							if(!cards.length) {
								// There is no cards to show
								Notification.show('Thanks ' + $scope.user.firstName + ', that is all for now.', 'success', 1);
							}
						}, 500);
					}
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
		*/
		$scope.allDone = 1;

	}])

/**
 * SIGN UP CONTROLLERS
 */
	.controller('SignCtrl', ['$scope', '$state', 'Auth', function($scope, $state, Auth){

		$scope.user = Auth.user;
		$scope.user['sign_name'] = '';
		$scope.submitForm = function() {
			Auth.update($scope.user, function() {
				$state.go('user.signup.basic-information');
			});
		};
	}])

	.controller('BasicInformationCtrl', ['$scope', '$state', '$filter', 'Auth', 'RELATIONSHIPS', function($scope, $state, $filter, Auth, RELATIONSHIPS){
		$scope.is_add_account = $state.current.data.is_add_account;
        $scope.isSignUp = $state.current.data.isSignUp;
        console.log($state.current.data);
		$scope.user = ($scope.is_add_account)?{}:Auth.user;

		$scope['genders'] = [
			{name:'Gender', is_disabled: 1},
			{name:'Male'},
			{name:'Female'}
		];
		$scope.salutations = [
            {name:'Salutation', is_disabled: 1},
            {name:'Mr.'},
            {name:'Mrs.'},
            {name:'Mis.'},
            {name:'Miss'},
            {name:'Dr.'},
            {name:'Prof.'},
            {name:'Rev.'},
            {name:'Other'}
        ];

        $scope.suffixes = [
            {name:'Suffix', is_disabled: 1},
            {name:'I'},
            {name:'II'},
            {name:'III'},
            {name:'Jr'},
            {name:'Sr.'},
            {name:'Esq.'}
        ];

        $scope.MaritalStatuses = [
            {name:'Marital Status', is_disabled: 1},
            {name:'Single'},
            {name:'Married'},
            {name:'Separated'},
            {name:'Widowed'},
            {name:'Divorced'}
        ];
		// Set Max date for birthday datepicker
		$scope.maxDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		$scope['relationships'] = RELATIONSHIPS.slice();
		$scope.user = ($scope.is_add_account)?{}:Auth.user;
        $scope.user.dob = new Date($scope.user.dob);
        $scope.user.gender = $scope.genders[$scope.user.gender];
		if($scope.is_add_account){
			// Remove "Self" from the list
			$scope['relationships'].splice(1,1);
		}
		if($scope.isSignUp || $scope.is_add_account){
            $scope.btn = 'Continue';
            $scope.user.salutation = $scope.salutations[0],
            $scope.user.suffix = $scope.suffixes[0];
            $scope.user.maritalStatus = $scope.MaritalStatuses[0];
        }else{
            $scope.btn = 'Save';
            $scope.user.salutation = $scope.salutations[$scope.user.salutation];
            $scope.user.suffix = $scope.suffixes[$scope.user.suffix];

            $scope.user.maritalStatus = $scope.MaritalStatuses[$scope.user.maritalStatus];
            // TODO: Once the API is ready replace the line below with line above
            //$scope.user.maritalStatus = $scope.MaritalStatuses[0];
 
        }
		$scope.user.gender = $scope.genders[0];
		$scope.user.relationship = $scope.relationships[0];

		$scope.submitForm = function() {
			var data = angular.extend({}, $scope.user);
			data.maritalStatus = $scope.MaritalStatuses.indexOf($scope.user.maritalStatus);
			data.salutation = $scope.salutations.indexOf($scope.user.salutation);
			data.suffix = $scope.suffixes.indexOf($scope.user.suffix);
			data.gender = $scope.genders.indexOf($scope.user.gender);
			data.relationship = $scope.relationships.indexOf($scope.user.relationship);
			if($scope.is_add_account){
				Auth.setTempAccount(
					data,
					1,
					function() {
						$state.go('user.add-account.basic-question');
					}
				);

			}else{
				var data = angular.extend({}, $scope.user);
                data.maritalStatus = $scope.MaritalStatuses.indexOf($scope.user.maritalStatus);
                data.salutation = $scope.salutations.indexOf($scope.user.salutation);
                data.suffix = $scope.suffixes.indexOf($scope.user.suffix);
                data.gender = $scope.genders.indexOf($scope.user.gender);
                data.relationship = $scope.relationships.indexOf($scope.user.relationship);
				Auth.update(
					data,
					function() {
						$state.go('user.signup.basic-question');
					},
					function(error){
						console.log(error);
					},
					1,
					1
				);
			}
		};
		$scope.$watch(
            "user.gender",
            function( newValue, oldValue ) {
                $scope.relationshipform.sel_gender.$setValidity("selgender",$scope.genders.indexOf($scope.user.gender)>0);
            }
        );
		$scope.relationshipSelected = function() {
			var is_self = $scope.user.relationship.name == 'Self';
			$scope.is_self = is_self;
			$scope.is_not_self = !is_self;
			$scope.patient_selected = 1;
		};

		$scope.submitLink = $scope.submitForm;

	}])
	.controller('BasicQuestionCtrl', ['$rootScope', '$state', '$filter', 'Auth', function($scope, $state, $filter, Auth){
        $scope.is_add_account = $state.current.data.is_add_account;
        $scope.isSignUp = $state.current.data.isSignUp;

        $scope.user = ($scope.is_add_account)?Auth.getTempUser():Auth.user;
        if($scope.isSignUp || $scope.is_add_account){
            $scope.btn = 'Continue';

        }else{
            $scope.btn = 'Save';

        }

        $scope.submitForm = function() {

            if($scope.is_add_account){
                Auth.setTempAccount(
                    $scope.user,
                    0,
                    function() {
                        $state.go('user.add-account.contact-info');
                    }
                );

            }else{
                var data = angular.extend({}, $scope.user);


                Auth.update(
                    data,
                    function() {
                        if($scope.isSignUp){
                            $state.go('user.signup.home-address');
                        }else{
                            $state.go('user.home');
                        }
                    },
                    function(error){
                        console.log(error);
                    },
                    $scope.isSignUp
                );
            }
        };

        $scope.submitLink = $scope.submitForm;

    }])
	.controller('PersonalInfoCtrl', ['$rootScope', '$state', '$filter', 'Auth', function($scope, $state, $filter, Auth){
	
		$scope.genders = [
			{name:'Gender', is_disabled: 1},
			{name:'Male'},
			{name:'Female'}
		];

		$scope.salutations = [
			{name:'Salutation', is_disabled: 1},
			{name:'Mr.'},
			{name:'Mrs.'},
			{name:'Mis.'},
			{name:'Miss'},
			{name:'Dr.'},
			{name:'Prof.'},
			{name:'Rev.'},
			{name:'Other'}
		];

		$scope.suffixes = [
			{name:'Suffix', is_disabled: 1},
			{name:'I'},
			{name:'II'},
			{name:'III'},
			{name:'Jr'},
			{name:'Sr.'},
			{name:'Esq.'}
		];

		$scope.MaritalStatuses = [
			{name:'Marital Status', is_disabled: 1},
			{name:'Single'},
			{name:'Married'},
			{name:'Separated'},
			{name:'Widowed'},
			{name:'Divorced'}
		];

		// Set Max date for birthday datepicker
		$scope.maxDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		$scope.user = Auth.user;
		
		
		
		$scope.btn = 'Save';
		//console.log($scope.user); return;

		$scope.usersuffix = ($scope.user.suffix>0)?$scope.suffixes[$scope.user.suffix]:$scope.suffixes[0];
		$scope.usergender = ($scope.user.gender>0)?$scope.genders[$scope.user.gender]:$scope.genders[0];
		//$scope.user.maritalStatus = $scope.MaritalStatuses[$scope.user.maritalStatus];
		// TODO: Once the API is ready replace the line below with line above
		$scope.userMaritalStatus = ($scope.user.maritalStatus>0)?$scope.MaritalStatuses[$scope.user.maritalStatus]:$scope.MaritalStatuses[0];
		$scope.usersalutation = ($scope.user.salutation>0)?$scope.salutations[$scope.user.salutation]:$scope.salutations[0];
		$scope.userdob = new Date($scope.user.dob);
		
		var usrsuffix = $scope.usersuffix;

		var usrsal = $scope.usersalutation;
		var usrmarital = $scope.userMaritalStatus;
		var usrgender = $scope.usergender;
		
		$scope.selsfx = function(dattrs) {
			usrsuffix = dattrs;
		};
		$scope.selsal = function(dattrs){
			usrsal = dattrs;
		};
		$scope.selgender = function(dattrs){
			usrgender = dattrs;
		};
		$scope.selmarital = function(dattrs){
			usrmarital = dattrs;
			console.log(userMaritalStatus);
		}
		$scope.submitForm = function() {
			
				var data = angular.extend({}, $scope.user);
				
				
				data.maritalStatus = $scope.MaritalStatuses.indexOf(usrmarital);
				data.salutation = $scope.salutations.indexOf(usrsal);
				data.suffix = $scope.suffixes.indexOf(usrsuffix);
				data.gender = $scope.genders.indexOf(usrgender);

				Auth.update(
					data,
					function() {
						if($scope.isSignUp){
							$state.go('user.signup.work-address');
						}else{
							$state.go('user.home');
						}
					},
					function(error){
						console.log(error);
					},
					0
				);
			
		};

		$scope.submitLink = $scope.submitForm;

	}])

	.controller('AddressCtrl', ['$rootScope', '$location', '$state', 'Auth', 'ADDRESS', function($scope, $location, $state, Auth, ADDRESS){
		var current_state = $state.current.name,
			address_method = {},
			is_home_address = current_state.search('home-address') != -1;

		if(is_home_address){
			address_method = {
				address: 'homeAddress'
			};
		}else{
			address_method = {
				address: 'workAddress'
			};
		}

		$scope['countries'] = ADDRESS.COUNTRIES;
		$scope['states'] = ADDRESS.STATES;
		$scope.user = Auth.user;

		var	address_null = !angular.isObject($scope.user[address_method.address]);

		if(address_null) {
			$scope.user[address_method.address] = {
				type: (is_home_address)?1:2
			};
			address_method['id'] = 0;
			address_method['method'] = 'post';
		}else{
			address_method['id'] = $scope.user[address_method.address].id;
			address_method['method'] = 'put';
		}

		if(current_state.search('profile') != -1){
			$scope.btn = 'Save';
			$scope.isSignUp = 0;
			if(address_null) {
				$scope.user[address_method.address].state = $scope.states[0];
				$scope.user[address_method.address].country = $scope.countries[0];
			}else{
				$scope.user[address_method.address].state = $scope.states[$scope.user[address_method.address].stateId];
				$scope.user[address_method.address].country = $scope.countries[$scope.user[address_method.address].countryId];
			}
		}else{
			$scope.btn = 'Continue';
			$scope.isSignUp = 1;
			$scope.user[address_method.address].state = $scope.states[0];
			$scope.user[address_method.address].country = $scope.countries[0];
		}

		$scope.submitForm = function() {
			//var address = $scope.user[address_method.address];
			var address = {
				stateId: $scope['states'].indexOf($scope.user[address_method.address].state),
				countryId: $scope['countries'].indexOf($scope.user[address_method.address].country),
				country: $scope.user[address_method.address].country.name,
				stateId: $scope['states'].indexOf($scope.user[address_method.address].state),
				state: $scope.user[address_method.address].state.name,
				line1: $scope.user[address_method.address].line1,
				line2: $scope.user[address_method.address].line2,
				city: $scope.user[address_method.address].city,
				zip: $scope.user[address_method.address].zip,
				type: $scope.user[address_method.address].type,
				otherState: null
			}

			// Update user address through API
			Auth.address(
				address,
				$scope.user.id,
				address_method.id,
				address_method.method,
				function(response) {
					// Change the page
					var new_state;
					if($scope.isSignUp){
						new_state = (is_home_address)?'user.signup.contact-info':'user.signup.home-address';
					}else{
						new_state = 'user.home';
					}
					$state.go(new_state);

					$scope.user[address_method.address] = response;
					// Updates local user data
					Auth.update(
						$scope.user,
						function(response) {
							console.log(response);
						},
						function(error){
							console.log(error);
						},
						$scope.isSignUp
					);
				},
				function(error){
					console.log(error);
				}
			);
		};

		$scope.submitLink = $scope.submitForm;

	}])

	.controller('ContactInfoCtrl', ['$rootScope', '$state', 'Auth', function($scope, $state, Auth){

		$scope.is_add_account = $state.current.data.is_add_account;

		$scope.user = ($scope.is_add_account)?Auth.getTempUser():Auth.user;
		console.log(Auth);
		$scope.disabledMail = Auth.isRootAccount($scope.user);


		if($state.is('user.profile.contact-info') || $state.is('user.add-account.contact-info')){
			$scope.btn = 'Save';
			$scope.isSignUp = 0;
		}else{
			$scope.btn = 'Continue';
			$scope.isSignUp = 1;
		}
		if($scope.isSignUp == 1)
		{
			$scope.user.primaryEmail =$scope.user.userName;
		}
		console.log($scope.user);
		$scope.submitForm = function() {
			if($scope.is_add_account){
				Auth.createAccount(
					$scope.user,
					1,
					function() {
						$scope.hide_switch = 0;
						$state.go('user.home');
					},
					function(error){
						console.log(error);
					}
				);
			}else{
				Auth.update(
					$scope.user,
					function() {
						$state.go('user.home');
					},
					function(error){
						console.log(error);
					},
					0
				);
			}
		};

		$scope.submitLink = $scope.submitForm;
	}])

	.controller('MeasurementsCtrl', ['$scope', 'Auth', function($scope, Auth){

		$scope.user = Auth.user;
		$scope.submitForm = function() {
			Auth.update($scope.user, function() {
				$state.go('user.home');
			});
		};

		$scope.submitLink = $scope.submitForm;
	}])

	.controller('SignupCtrl', ['$scope', 'Auth', function($scope, Auth){
		$scope.user = {};

		$scope.submitForm = function() {

			$scope.waiting = 1;
			$scope.showError = 0;
			// TODO: remove the line below when back-end fix that (PHR-238)
			$scope.user.email_verify = $scope.user.email;
			Auth.register(
				$scope.user,
				function(){
					$scope.waiting = 0;
					$scope.formSuccess = 1;
				},
				function(error, status){
					$scope.waiting = 0;
					$scope.showError = 1;
				});
		};
	}])

	.controller('SignupConfirmationCtrl', ['$scope', '$timeout', '$stateParams', '$state', 'UserService', function($scope, $timeout, $stateParams, $state, UserService){

		$scope.confirmation_code = $stateParams["token"];
		$scope.submitForm = function() {
			$scope.waiting = 1;
			UserService.confirmEmail(
				$scope.confirmation_code,
				function(data){
					$scope.waiting = 0;
					$timeout(function(){
						$state.go('anon.login');
					}, 2500);
				},
				function(error){
					$scope.waiting = 0;
				});
		};
	}])

	.controller('TermsCtrl', ['$scope', '$state', 'Auth', 'UserService', function($scope, $state, Auth, UserService){

		$scope.user = Auth.user;
		$scope.submitForm = function() {
			UserService.acceptTerms(
				$scope.user,
				function(data){
					$state.go('user.signup.basic-information');
				},
				function(error){
					console.log('error: ' + error);
				});
		};
		$scope.sendEmail = function() {
			UserService.serviceAgreementEmail(
				$scope.user,
				function(data){
					console.log('Service Agreement email sent');
				},
				function(error){
					console.log(error);
				});
		};
	}])

	.controller('LoginCtrl', ['$scope', '$state', '$location', 'Auth', function($scope, $state, $location, Auth){
		$scope.is_login_page = 1;
		$scope.user = {};
		$scope.submitForm = function() {
			$scope.waiting = 1;
			Auth.login(
				$scope.user,
				function(data){
					$scope.waiting = 0;
					if(data.tncCompleted){
						$location.path(Auth.getLoggedinPath());
					}else{
						$state.go('user.signup.terms');
					}
				},
				function(error){
					$scope.waiting = 0;
				});
		};
	}])

/**
 * Default controllers to create and handle items
 */
	.controller('ItemsCtrl', ['$scope', '$state', '$filter', 'ApiService', function($scope, $state, $filter, ApiService){
		$scope.itemData = $state.current.data;
		$scope.waiting = 1;

		$scope.FileTypes = [
			{ color:'#FCC475', value:1, name:'CTScan' },
			{ color:'#65CBA5', value:2, name:'LabReport' },
			{ color:'#FB6FBD', value:3, name:'Imaging' },
			{ color:'#3C9EDC', value:4, name:'MedicalReport' },
			{ color:'#FF846E', value:5, name:'MRI' },
			{ color:'#908DD7', value:6, name:'XRay' },
			{ color:'#35A77C', value:100, name:'Other' },
			{ color:'#D84968', value:101, name:'ConsultReport' },
			{ color:'#1878B6', value:102, name:'PandA' },
			{ color:'#E8A648', value:103, name:'StatusReport' }
		];

		var currentShortcut = (typeof $scope.itemData.apiShortcut == 'undefined')?$scope.itemData.shortcut.replace(/-/g, ''):$scope.itemData.apiShortcut;

		// Update chart with data from the server
		$scope.updateChart = function(period, data) {
			chartData = {
				categories: [],
				series: [],
				unit: '',
				period: ''
			};
			$scope.chartConfig.loading = true;

			var chartJson;
			if(period === 'day'){
				chartJson = data;
			}else{
				// TODO API call to get the data
			}

			angular.forEach(chartJson, function(item, key) {
				var date = $filter('date')(item.date, 'EEE d');
				date = date.split(' ');
				date = '<span class="chart-day-name">' + date[0] + '</span><span class="chart-day-num">' + date[1] + '</span>';
				this.categories.push(date);
				this.series.push(Number(item[$scope.itemData.shortcutSingle]));
			}, chartData);
			chartData.categories.unshift('<span class="chart-day-name"></span><span class="chart-day-num"></span>');
			chartData.categories.push('<span class="chart-day-name"></span><span class="chart-day-num"></span>');
			chartData.series.unshift(0);
			chartData.series.push(0);
			console.log(chartData)
			$scope.chartConfig.options.xAxis.categories = chartData.categories;
			$scope.chartConfig.options.xAxis.max = chartData.categories.length - 2;
			$scope.chartConfig.series[0].data = chartData.series;
			$scope.chartConfig.loading = false;
		}

		function setChart(data) {
			// Show chart
			var chartData = {};


			$scope.chartConfig = {
				options: {
					credits: false,
					chart: {
						type: 'line',
						spacingRight: 0,
						spacingLeft: 0,
						style: {fontFamily: "'roboto', sans-serif"},
						spacingBottom: 45
					},
					legend: {
						enabled: false
					},
					plotOptions: {
						area: {
							fillColor: '#77D6E7',
							fillOpacity: 1,
							lineColor: '#25A3CA',
							lineWidth: 4,
							marker: {
								fillColor: '#303C4B',
								height: 12,
								lineWidth: 3,
								symbol: 'circle',
								width: 12
							},
							threshold: null
						}
					},
					title: {
						text: null,
						x: 0
					},
					tooltip: {
						backgroundColor: '#303C4B',
						borderRadius: 10,
						borderWidth: 0,
						formatter: function () {
									return this.y + 'lbs';
								},
						shadow: false,
						style: {
							color: '#fff',
							fontSize: '22px',
							padding: '10px 15px',
							fontFamily: "'roboto', sans-serif"
						}
					},
					xAxis: {
						title: {
							text: '<span class="chart-xAxis-title">October 2014</span>',
							offset: 0,
							useHTML: true
						},
						//categories: chartData.categories,
						labels: {
							formatter: function () {
								return '<span class="chart-day">' + this.value + '</span>';
							},
							y: 18,
							useHTML: true
						},
						maxPadding: 0,
						minPadding: 0,
						min: 1,
						//max: 5,
						endOnTick: true,
						startOnTick: true,
						tickColor: '#4D5966',
						tickWidth: 1,
						offset: 31
					},
					yAxis: {
						gridLineWidth: 0,
						labels: {
							enabled: false
						},
						title: {
							text: null
						}
					}
				},
				series: [{
					type: 'area',
					//data: chartData.series
				}],
				loading: true
			}
			$scope.updateChart('day', data);
		}

		// Get data for the list
		ApiService.list(
			currentShortcut,
			function(data) {
				function setName(data){
					angular.forEach(data, function(item, key) {
						item.name = $filter('date')(item.date, 'MMMM dd, yyyy');
					});
				}

				switch(currentShortcut){
					case 'weights':
						setName(data);
						break;
				}

				// (itemData.shortcut == 'conditions' && item.relationship == 1) || (itemData.shortcut == 'family-histories' && item.relationship != 1)|| (itemData.shortcut != 'conditions' && itemData.shortcut != 'family-histories')
				var shortcut = $scope.itemData.shortcut;
				console.log('data: ', data);
				if(shortcut == 'conditions' || shortcut == 'family-histories'){
					var new_data = {};
					angular.forEach(data, function(item, key) {
						console.log(item, key);
						if(shortcut == 'conditions'){
							if(item.relationship == 1){
								new_data[key] = item;
							}
						}else{
							if(item.relationship != 1){
								new_data[key] = item;
							}
						}
					});
					data = (Object.getOwnPropertyNames(new_data).length === 0)?undefined:new_data;
				}
				console.log('data: ', data);

				$scope.collection = data;
				$scope.waiting = 0;

				if($scope.itemData.hasChart && data !== 'undefined'){
					setChart(data);
				}

			},
			function(err){"ERR", console.log(err) });
	}])

	.controller('ItemCreateCtrl', ['$scope', '$state', '$location', 'ApiService', function($scope, $state, $location, ApiService){
		$scope.itemData = $state.current.data;

		if(typeof $scope.itemData.placeholder === 'undefined'){
			$scope.itemData.placeholder = 'Enter ' + $scope.itemData.item;
		}

		$scope.collection = {};
		var currentShortcut = (typeof $scope.itemData.apiShortcut == 'undefined')?$scope.itemData.shortcut.replace(/-/g, ''):$scope.itemData.apiShortcut;
		$scope.submitForm = function() {
			ApiService.create(
				currentShortcut,
				$scope.collection,
				function(data){
					$location.path($scope.itemData.type + '/' + $scope.itemData.shortcutSingle + '/' + data['id']);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])

	.controller('ItemEditCtrl', ['$scope', '$stateParams', '$location', 'ApiService', '$state', function($scope, $stateParams, $location, ApiService, $state){

		$scope.itemData = $state.current.data;
		$scope.itemData['id'] = $stateParams['id'];
		var currentShortcut = (typeof $scope.itemData.apiShortcut == 'undefined')?$scope.itemData.shortcut.replace(/-/g, ''):$scope.itemData.apiShortcut;
		ApiService.get(
			currentShortcut,
			$stateParams['id'],
			function(data) {
				$scope.collection = data;
			},
			function(err){"ERR", console.log(err) }
		);

		$scope.submitForm = function() {
			ApiService.save(
				currentShortcut,
				$scope.collection.id,
				$scope.collection,
				function(data){
					$location.path($scope.itemData.type + '/' + $scope.itemData.shortcutSingle + '/'+ $stateParams['id']);
				},
				function(err){"ERR", console.log(err) }
			);
		};

		$scope.submitLink = $scope.submitForm;

	}])

	.controller('ItemViewCtrl', ['$scope', '$state', '$location', '$stateParams', 'ApiService' ,function($scope, $state, $location, $stateParams, ApiService){

		$scope.itemData = $state.current.data;
		var currentShortcut = (typeof $scope.itemData.apiShortcut == 'undefined')?$scope.itemData.shortcut.replace(/-/g, ''):$scope.itemData.apiShortcut;

		ApiService.get(
			currentShortcut,
			$stateParams['id'],
			function(data) {
				$scope.collection = data;
			},
			function(err){"ERR", console.log(err) }
		);

		$scope.deleteItem = function (){
			ApiService.delete(
				currentShortcut,
				$stateParams['id'],
				function(data) {
					$location.path($scope.itemData.type + '/' + $scope.itemData.shortcut);
				},
				function(err){"ERR", console.log(err) });

		}
	}])

/**
 * Body systems controller
 */
	.controller('BodySystemsCtrl', ['$scope', '$state', 'ApiService', function($scope, $state, ApiService){
		$scope.bodysystems = {};

		// Get body symptoms
		ApiService.get(
			'bodysymptoms',
			1,
			function(bodysystems, is_first_time) {
				angular.forEach(bodysystems, function(value, key){
					if(typeof $scope.bodysystems[value.systemName.toLowerCase()] == 'undefined'){
					 	$scope.bodysystems[value.systemName.toLowerCase()] = {};
					 	if(!is_first_time){
					 		$scope.bodysystems[value.systemName.toLowerCase()]['none_' + value.systemName.toLowerCase()] = {'isSelected': true};
					 	}
					}
					$scope.bodysystems[value.systemName.toLowerCase()][value.id] = value;

					if(value.isSelected || is_first_time){
						$scope.bodysystems[value.systemName.toLowerCase()]['none_' + value.systemName.toLowerCase()] = {'isSelected': false};
					}
				});
			},
			function(err){"ERR", console.log(err) }
		);

		// Check if there is at least one item selected per symptoms
		$scope.checkEmptySection = function(section) {
			var values = $scope.bodysystems[section];
			for (index in values) {
				if (values[index]) {
					return false;
				}
			}
			return true;
		}

		// Uncheck all the symptoms when "none of above" is checked
		$scope.unselectAll = function(item) {
			if(!!$scope.bodysystems[item]['none_' + item].isSelected){
				angular.forEach($scope.bodysystems[item], function(value, key, obj){
					if(key != 'none_' + item){
						obj[key].isSelected = false;
					}
				})

			}
		}

		// Uncheck "none of above" if there is any symptoms selected
		$scope.unselectNone = function(item, item_none) {
			if(!!$scope.bodysystems[item_none][item].isSelected){
				$scope.bodysystems[item_none]['none_' + item_none].isSelected = false;
			}
		}

		// Submit form to the server
		$scope.submitForm = function() {
			var bodysystems = [];
			angular.forEach($scope.bodysystems, function(child, key){
				angular.forEach(child, function(value, key){
					if(key.search('none_')==-1){
						bodysystems[bodysystems.length] = value;
					}
				});
			});
			console.log(bodysystems);
			ApiService.save(
				'bodysymptoms',
				1,
				bodysystems,
				function(data){
					$state.go('user.home');
				},
				function(err){"ERR", console.log(err) }
			);
		};

		$scope.submitLink = $scope.submitForm;
	}])
/**
 * Allergy Create controller
 */
    .controller('AllergyCreateCtrl', ['$scope', '$state', '$stateParams', '$location', 'ApiService', function($scope, $state, $stateParams, $location, ApiService){

        $scope.itemData = $state.current.data;

        $scope.type = [
            {name:'Type', is_disabled: 1},
            {name:'Drug'},
            {name:'Food'},
            {name:'Environment'}
        ];
        /*
        ApiService.get(
            'allergies',
            $stateParams['id'],
            function(allergy) {
                $scope.allergy = allergy;

                if(typeof allergy.type === 'undefined'){
                    $scope.allergy.type = $scope.type[0];
                }else{
                    allergy.type = (allergy.type==4)?0:allergy.type;
                    $scope.allergy.type = $scope.type[allergy.type];
                    $scope.allergy.startDate = new Date(allergy.startDate);
                }
            },
            function(err){"ERR", console.log(err) }
        );
        */

        $scope.allergy = {};
        $scope.allergy.type = $scope.type[0];
        //$scope.allergy.type = $scope.type.indexOf($scope.type[0]);

        $scope.submitForm = function() {
            $scope.allergy.type = $scope.type.indexOf($scope.allergy.type);

            ApiService.create(
                'allergies',
                $scope.allergy,
                function(data){
                   $location.path($scope.itemData.type + '/' + $scope.itemData.shortcutSingle + '/' + data['id']);
                },
                function(err){"ERR", console.log(err) });
        };
        $scope.$watch(
            "allergy.type",
            function( newValue, oldValue ) {
                $scope.allergyform.allergy_type.$setValidity("selgender",$scope.type.indexOf(newValue)>0);
            }
        );
        $scope.submitLink = $scope.submitForm;
    }])
/**
 * Allergy edit controller
 */
	.controller('AllergyEditCtrl', ['$scope', '$state', '$stateParams', '$location', 'ApiService', function($scope, $state, $stateParams, $location, ApiService){

		$scope.itemData = $state.current.data;

		$scope.type = [
			{name:'Type', is_disabled: 1},
			{name:'Drug'},
			{name:'Food'},
			{name:'Environment'}
		];

		ApiService.get(
			'allergies',
			$stateParams['id'],
			function(allergy) {
				$scope.allergy = allergy;

				if(typeof allergy.type === 'undefined'){
					$scope.allergy.type = $scope.type[0];
				}else{
					allergy.type = (allergy.type==4)?0:allergy.type;
					$scope.allergy.type = $scope.type[allergy.type];
					$scope.allergy.startDate = new Date(allergy.startDate);
				}
			},
			function(err){"ERR", console.log(err) }
		);

		$scope.submitForm = function() {
			var allergy = {
				'name': $scope.allergy.name,
				'startDate': $scope.allergy.startDate
			};
			allergy.type = $scope.type.indexOf($scope.allergy.type);

			ApiService.save(
				'allergies',
				$scope.allergy.id,
				allergy,
				function(data){
					$location.path('measurements/allergy/' + $stateParams['id']);
				},
				function(err){"ERR", console.log(err) }
			);
		};

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Sleep edit controller
 */
	.controller('SleepEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', function($scope, $state, $stateParams, $filter, $location, ApiService){

		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		// Set max date for datepicker
		$scope.startedMax = $filter('date')(new Date(), 'yyyy-MM-dd');

		ApiService.get('sleeps', $stateParams['id'], function(sleep) {
			if(typeof sleep === 'undefined'){
				$scope.sleep = {};
				// Set default sleep hours
				$scope.sleep.hours = 8;
				// Set default date as yesterday
				$scope.sleep.started = (function(d){ d.setDate(d.getDate()-1); return d})(new Date);
			}else{
				$scope.sleep = sleep;
				$scope.sleep.started = new Date($scope.sleep.started);
				$scope.faceClass = $scope.sleep.quality;
			}
		},function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			// Use the date entered to save the name
			$scope.sleep.name = $filter('date')($scope.sleep.started, 'MMMM dd, yyyy');
			if(!$scope.sleep.id){
				$scope.sleep.id = 0;
			}

			ApiService.save(
				'sleeps',
				$scope.sleep.id,
				$scope.sleep,
				function(data){
					$location.path('measurements/sleep/' + data.id);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.setDefault = function (className) {
			$scope.faceClass = className;
		}

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Bathroom edit controller
 */
	.controller('BathroomEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', function($scope, $state, $stateParams, $filter, $location, ApiService){

		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.urine_color = ['Clear', 'Light yellow', 'Dark yellow', 'Light red', 'Red', 'Other'];
		$scope.bowel_color = ['Brown', 'Black', 'Grey', 'Other'];

		// Set max date for datepicker
		$scope.datetimeMax = $filter('date')((function(d){ d.setDate(d.getDate()+1); return d})(new Date), 'yyyy-MM-dd');

		ApiService.get('bathrooms', $stateParams['id'], function(bathroom) {
			if(typeof bathroom === 'undefined'){
				$scope.bathroom = {};
				// Set default bathrooms items
				$scope.bathroom.urine_color = $scope.urine_color[1];
				$scope.bathroom.bowel_color = $scope.bowel_color[0];
				$scope.bathroom.consistency = $scope.bathroom.bowel_odor = 50;

				$scope.bathroom.urine = $scope.bathroom.bowel = 'no';

				// Set default date as tomorrow
				$scope.bathroom.datetime = new Date();
			}else{
				$scope.bathroom = bathroom;
				$scope.bathroom.datetime = new Date($scope.bathroom.datetime);
			}
			// Set default/loaded value to the slider
			$scope.bathroom.urine_color_num = $scope.urine_color.indexOf($scope.bathroom.urine_color);
			$scope.bathroom.bowel_color_num = $scope.bowel_color.indexOf($scope.bathroom.bowel_color);

		},function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			// Use the date entered to save the name
			$scope.bathroom.name = $filter('date')($scope.bathroom.datetime, 'MMMM dd, yyyy');
			if(!$scope.bathroom.id){
				$scope.bathroom.id = 0;
			}

			ApiService.save(
				'bathrooms',
				$scope.bathroom.id,
				$scope.bathroom,
				function(data){
					$location.path('measurements/bathroom/' + data.id);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.sliderChange = function (item) {
			// Set label value for slider
			$scope.bathroom[item] = $scope[item][$scope.bathroom[item + '_num']];
		}

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Exercise edit contreoller
 */
	.controller('ExercisesEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', function($scope, $state, $stateParams, $filter, $location, ApiService){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.units = [
			{name:'Units', is_disabled: 1},
			{name:'Miles'},
			{name:'Kilometers'},
			{name:'Reps'}
		];

		$scope.times = [
			{name: 'Time of day', is_disabled: 1},
			{name: 'Early morning'},
			{name: 'Morning'},
			{name: 'Lunchtime'},
			{name: 'Afternoon'},
			{name: 'Evening'},
			{name: 'Night time'},
			{name: 'Varies'}
		];

		ApiService.get('exercises', $stateParams['id'], function(exercise) {
			$scope.exercise = exercise;
			if(typeof exercise.time === 'undefined'){
				$scope.exercise.time = $scope.times[0];
			 	$scope.exercise.units = $scope.units[0];
			}else{
			  	var time = $filter('filter')($scope.times, exercise.time, true),
				  	units = $filter('filter')($scope.units, exercise.units, true);
				$scope.exercise.time = time[0];
				$scope.exercise.units = units[0];
			}
		  },function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			ApiService.save(
				'exercises',
				$scope.exercise.id,
				$scope.exercise,
				function(data){
					$location.path('measurements/exercise/' + $stateParams['id']);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])


/**
 * Medications edit controller
 */
 	.controller('MedicationCreateCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', 'Notification', function($scope, $state, $stateParams, $filter, $location, ApiService, Notification){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.frequency = [
			{name:'Frequency', is_disabled: 1},
			{name:'Not Specified'},
			{name:'One time daily'},
			{name:'Two times daily'},
			{name:'Three times daily'},
			{name:'Four times daily'},
			{name:'At bedtime'},
			{name:'Evening or afternoon'},
			{name:'Every 1 hour'},
			{name:'Every 2 hours'},
			{name:'Every 3 hours'},
			{name:'Every 4 hours'},
			{name:'Every 5 hours'},
			{name:'Every 6 hours'},
			{name:'Every 7 hours'},
			{name:'Every 8 hours'},
			{name:'Every 12 hours'},
			{name:'Every morning'},
			{name:'Every afternoon'},
			{name:'Every evening'},
			{name:'Every night'},
			{name:'Every night at bedtime'}
		];

		/*
		ApiService.get(
			'medications',
			$stateParams['id'],
			function(medication) {
				$scope.medication = medication;

				if(typeof medication.frequency === 'undefined'){
					$scope.medication.frequency = $scope.frequency[0];
				}else{
					//medication.dosage = (medication.dosage==-1)?'':medication.dosage;
					medication.frequency = (medication.frequency==21)?0:medication.frequency;
					$scope.medication.frequency = $scope.frequency[medication.frequency];
					$scope.medication.startDate = new Date(medication.startDate);
					$scope.medication.endDate = new Date(medication.endDate);
				}

				$scope.minDate = $scope.medication.startDate;
			},
			function(err){"ERR", console.log(err) });
		*/
		$scope.medication = {};
		$scope.medication.name = "";
		$scope.medication.frequency = $scope.frequency[0];
		$scope.medication.dosage = "";
		//$scope.medication.startDate = new Date();
		//$scope.medication.endDate = new Date();

		$scope.submitForm = function() {
			if($scope.medication.startDate && $scope.medication.endDate)
			{
				if($scope.medication.endDate.getTime() < $scope.medication.startDate.getTime()){
					Notification.show('Start date can\'t be greater than end date', 'danger', 1);
					return;
				}
			}
			else
			{
				if($scope.medication.endDate)
				{
					Notification.show('Plz select Start date', 'danger', 1);
					return;
				}
				else
				{
					if($scope.medication.startDate)
					{
						Notification.show('Plz select End date', 'danger', 1);
						return;
					}
				}
			}
			var medication = {
				'name': $scope.medication.name,
				'dosage': $scope.medication.dosage,
				'startDate': $scope.medication.startDate,
				'endDate': $scope.medication.endDate
			};
			if($scope.frequency.indexOf($scope.medication.frequency)>0)
				medication.frequency = $scope.frequency.indexOf($scope.medication.frequency)-1;
			else
				medication.frequency = 0;
			//console.log(medication); return false;
			ApiService.create(
				'medications',
				medication,
				function(data){
					$state.go('user.measurements.medications');
					//$location.path('/medications');
				},
				function(err){"ERR", console.log(err) });
			
			/*
			ApiService.create(
				'medications',
				$scope.medication.id,
				medication,
				function(data){
			  		$location.path('measurements/medication/' + $stateParams['id']);
			  	},
				function(err){"ERR", console.log(err) });*/
		};

		$scope.submitLink = $scope.submitForm;
	}])

	.controller('MedicationsEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', 'Notification', function($scope, $state, $stateParams, $filter, $location, ApiService, Notification){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.frequency = [
			{name:'Frequency', is_disabled: 1},
			{name:'Not Specified'},
			{name:'One time daily'},
			{name:'Two times daily'},
			{name:'Three times daily'},
			{name:'Four times daily'},
			{name:'At bedtime'},
			{name:'Evening or afternoon'},
			{name:'Every 1 hour'},
			{name:'Every 2 hours'},
			{name:'Every 3 hours'},
			{name:'Every 4 hours'},
			{name:'Every 5 hours'},
			{name:'Every 6 hours'},
			{name:'Every 7 hours'},
			{name:'Every 8 hours'},
			{name:'Every 12 hours'},
			{name:'Every morning'},
			{name:'Every afternoon'},
			{name:'Every evening'},
			{name:'Every night'},
			{name:'Every night at bedtime'}
		];

		ApiService.get(
			'medications',
			$stateParams['id'],
			function(medication) {
				$scope.medication = medication;

				if(typeof medication.frequency === 'undefined'){
					$scope.medication.frequency = $scope.frequency[0];
				}else{
					//medication.dosage = (medication.dosage==-1)?'':medication.dosage;
					medication.frequency = (medication.frequency==21)?0:medication.frequency;
					$scope.medication.frequency = $scope.frequency[medication.frequency];
					$scope.medication.startDate = new Date(medication.startDate);
					$scope.medication.endDate = new Date(medication.endDate);
				}

				$scope.minDate = $scope.medication.startDate;
			},
			function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {

			if($scope.medication.endDate.getTime() < $scope.medication.startDate.getTime()){
				Notification.show('Start date can\'t be greater than end date', 'danger', 1);
				return;
			}

			var medication = {
				'name': $scope.medication.name,
				'dosage': $scope.medication.dosage,
				'startDate': $scope.medication.startDate,
				'endDate': $scope.medication.endDate
			};
			medication.frequency = $scope.frequency.indexOf($scope.medication.frequency) - 1;
			ApiService.save(
				'medications',
				$scope.medication.id,
				medication,
				function(data){
			  		$location.path('measurements/medication/' + $stateParams['id']);
			  	},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Food & drinks edit controller
 */
 	.controller('FoodsdrinksEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', function($scope, $state, $stateParams, $filter, $location, ApiService){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.meals = [
			{name: 'Meal', is_disabled: 1},
			{name: 'Breakfast'},
			{name: 'Dinner'},
			{name: 'Lunch'},
			{name: 'Snack'}
		];

		ApiService.get('foodsdrinks', $stateParams['id'], function(fooddrink) {
			$scope.fooddrink = fooddrink;
			if(typeof fooddrink.meal === 'undefined'){
			  $scope.fooddrink.meal = $scope.meals[0];
			}else{
			  var meals = $filter('filter')($scope.meals, fooddrink.meal, true);
			  $scope.fooddrink.meal = meals[0];
			}
		  },function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			ApiService.save(
				'foodsdrinks',
				$scope.fooddrink.id,
				$scope.fooddrink,
			 	function(data){
			 		$location.path('measurements/fooddrink/' + $stateParams['id']);
			 	},
			  	function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Natural Supplements edit controller
 */
	.controller('NaturalSupplementsEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', function($scope, $state, $stateParams, $filter, $location, ApiService){

		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.units = [
			{name:'Units', is_disabled: 1},
			{name:'cfu/mo'},
			{name:'iu'},
			{name:'mcg'},
			{name:'meq'},
			{name:'meq/ml'},
			{name:'mg'},
			{name:'mg/ml'},
			{name:'ml'},
			{name:'%'},
			{name:'unt'},
			{name:'unt/ml'}
		];

		$scope.dosages = [
			{name:'How Taken', is_disabled: 1},
			{name:'by injection'},
			{name:'my mouth'},
			{name:'in the ear'},
			{name:'in the eye'},
			{name:'in the nose'},
			{name:'inhaled'},
			{name:'rectal'},
			{name:'through a feeding tube'},
			{name:'through an intravenous line (IV)'},
			{name:'through the skin'},
			{name:'under the tongue'},
			{name:'vaginal'}
		];

		ApiService.get('naturalsupplements', $stateParams['id'], function(naturalsupplements) {
			$scope.naturalsupplements = naturalsupplements;
			if(typeof naturalsupplements.units === 'undefined'){
				$scope.naturalsupplements.units = $scope.units[0];
				$scope.naturalsupplements.dosages = $scope.dosages[0];
			}else{
			  	var units = $filter('filter')($scope.units, naturalsupplements.units, true),
					dosages = $filter('filter')($scope.dosages, naturalsupplements.dosages, true);
				$scope.naturalsupplements.units = units[0];
				$scope.naturalsupplements.dosages = dosages[0];
			}
		  },function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			ApiService.save(
				'naturalsupplements',
				$scope.naturalsupplements.id,
				$scope.naturalsupplements,
				function(data){
					$location.path('measurements/natural-supplement/' + $stateParams['id']);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Immunizations edit controller
 */
	.controller('immunizationsEditCtrl', ['$scope', '$state', '$stateParams', '$location', 'ApiService', function($scope, $state, $stateParams, $location, ApiService){

		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		ApiService.get('immunizations', $stateParams['id'], function(immunization) {

			$scope.immunization = immunization;
			if(typeof immunization.number_in_series_n === 'undefined'){
				$scope.immunization.number_in_series_n = '0';
				$scope.immunization.number_in_series_s = '1';
			}
		  },function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			ApiService.save(
				'immunizations',
				$scope.immunization.id,
				$scope.immunization,
				function(data){
					$location.path('measurements/immunization/' + $stateParams['id']);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	 }])

/**
 * WEIGHT CONTROLLERS
 */
	.controller('WeightsEditCtrl', ['$scope', '$timeout', '$state', '$stateParams', '$location', 'ApiService', function($scope, $timeout, $state, $stateParams, $location, ApiService){

		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.units = [
			'lbs',
			'kg',
		];

		ApiService.get('weights', $stateParams['id'], function(weight) {
			if(typeof weight === 'undefined'){
				$scope.weight = {};
				var today = new Date();

				$scope.weight.date = today;
				$scope.weight.time = today.getHours() + ':' + today.getMinutes();
				$scope.weight.unit = $scope.units[0];
			}else{
				$scope.weight = weight;
				$timeout(function(){
					var input = document.getElementById('knob-input');
					if ('createEvent' in document) {
						var evt = document.createEvent('HTMLEvents');
						evt.initEvent('change', false, true);
						input.dispatchEvent(evt);
					} else {
						input.fireEvent('onchange');
					}
				}, 250);
			  }
			},function(err){"ERR", console.log(err) });


		$scope.submitForm = function() {
			$scope.weight.weight = document.getElementById('knob-input').value;
			ApiService.save(
				'weights',
				$scope.weight.id,
				$scope.weight,
				function(data){
					$location.path('measurements/weight/' + data.id);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * HEIGHT CONTROLLERS
 * TODO: implement weight version to height
 */
	.controller('HeightsCtrl', ['$scope', 'ApiService', function($scope, ApiService){
		ApiService.list('heights', function(heights) {
			$scope.heights = heights;
		});
	}])

	.controller('HeightsCreateCtrl', ['$scope', '$location', 'ApiService', function($scope, $location, ApiService){

		$scope.height = {};
		$scope.submitForm = function() {
			$scope.height.date = new Date();
			$scope.height.time = $scope.height.date.getHours()+":"+$scope.height.date.getMinutes();

			ApiService.save(
				'heights',
				$scope.height.id,
				$scope.height,
				function(data){
					$location.path('measurements/heights');
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;

		$scope.changeKnob = function(id, type) {
		 	$scope.height.height = document.getElementById(id).value;
			$scope.height.unit = type;
		}

	}])

	.controller('HeightsEditCtrl', ['$timeout', '$scope', '$route', '$stateParams', '$location', 'ApiService', function($timeout, $scope, $route, $stateParams, $location, ApiService){

		$scope.units = [
			'ft',
			'cm',
			'in'
		];

		$scope.data = {}

		ApiService.get('heights', $stateParams['id'], function(height) {
			$scope.height = height;
			if (height.unit=="in") {
				$scope.data.in_type = true;
			} else if (height.unit == 'ft') {
				$scope.data.ft_type = true;
			}

			$timeout(function(){
				var input1 = document.getElementById("knob-input-ft"),
					input2 = document.getElementById("knob-input-in");
				if ("createEvent" in document) {
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("change", false, true);
					input1.dispatchEvent(evt);
					input2.dispatchEvent(evt);
				} else {
					input1.fireEvent("onchange");
					input2.fireEvent("onchange");
				}
			  });
		  },
		  function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			if ($scope.height.unit=="ft") {
				$scope.height.height = document.getElementById("knob-input-ft").value;
			} else if ($scope.height.unit=="in") {
				$scope.height.height = document.getElementById("knob-input-in").value;
			}

			ApiService.save(
				'heights',
				$scope.height.id,
				$scope.height,
				function(data){
					$location.path('measurements/heights/' + $stateParams['id']);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;

	}])

	.controller('HeightsViewCtrl', ['$scope', '$stateParams', 'ApiService', function($scope, $stateParams, ApiService){
		ApiService.get(
			'heights',
			$stateParams['id'],
			function(height) {
				$scope.height = height;
			},
			function(err){"ERR", console.log(err) });
	 }])

/**
 * lab results edit controller
 */
	.controller('LabresultsEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', function($scope, $state, $stateParams, $filter, $location, ApiService){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.status = [
			{name:'Status', is_disabled: 1},
			{name:'complete'},
			{name:'patient refused test'},
			{name:'pending'},
			{name:'quantity not sufficient'}
		];

		ApiService.get('labresults', $stateParams['id'], function(labresult) {
			$scope.labresult = labresult;
			if(typeof labresult.status === 'undefined'){
				$scope.labresult.status = $scope.status[0];
			}else{
				var status = $filter('filter')($scope.status, labresult.status, true);
				$scope.labresult.status = status[0];
			}
		  },function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			ApiService.save(
				'labresults',
				$scope.labresult.id,
				$scope.labresult,
				function(data){
					$location.path('histories/lab-result/' + $stateParams['id']);
				},
				function(err){"ERR", console.log(err) });
		};
		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Procedures edit controller
 */
	.controller('ProceduresEditCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', function($scope, $state, $stateParams, $filter, $location, ApiService){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.status = [
			{name:'Status', is_disabled: 1},
			{name:'Current'},
			{name:'Intermittent'},
			{name:'Past'}
		];

		ApiService.get('procedures', $stateParams['id'], function(procedure) {
			$scope.procedure = procedure;
			if(typeof procedure.status === 'undefined'){
			  $scope.procedure.status = $scope.status[0];
			}else{
			  var status = $filter('filter')($scope.status, procedure.status, true);
			  $scope.procedure.status = status[0];
			}
		  },function(err){"ERR", console.log(err) });

		$scope.submitForm = function() {
			ApiService.save(
				'procedures',
				$scope.procedure.id,
				$scope.procedure,
				function(data){
					$location.path('histories/procedure/' + $stateParams['id']);
				},
				function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])
// Family Create Controller

	.controller('FamilyCreateCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', 'Auth', 'RELATIONSHIPS', function($rootScope, $scope, $state, $stateParams, $filter, $location, ApiService, Auth, RELATIONSHIPS){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.status = [
			{name:'Status', is_disabled: 1},
			{name:'None'},
			{name:'Inactive'},
			{name:'Active'},
			{name:'Resolved'},
			{name:'Remission'}
		];

		$scope.onset = [
			{name:'Onset', is_disabled: 1},
			{name:'1-2 weeks ago'},
			{name:'1-3 months ago'},
			{name:'4-6 months ago'},
			{name:'6-12 months ago'},
			{name:'1 year ago'},
			{name:'2 years ago'},
			{name:'3-5 years ago'},
			{name:'5-7 years ago'},
			{name:'7-10 years ago'},
			{name:'More than 10 years ago'}
		];
		$scope.relationships = [
			{name:'Relationship to you', is_disabled: 1},
			{name:"Father"},
			{name:"Mother"},
			{name:"Brother"},
			{name:"Sister"},
			{name:"GrandFather"},
			{name:"GrandMother"}
		];
		// Clone relationship constant
		//$scope.relationships = RELATIONSHIPS.slice();
		// Remove "Self" from the list
		//$scope.relationships.splice(1,1);
		$scope.conditions = {};
		//$scope.conditions.status = $scope.status[0];
		//$scope.conditions.onset = $scope.onset[0];
		$scope.conditions.relationship = $scope.relationships[0];
		

		$scope.submitForm = function() {
				
				var conditions = {
					'name': $scope.conditions.name,
					'relationship': (typeof $scope.conditions.relationship === 'undefined')?Auth.user.relationship:$scope.relationships.indexOf($scope.conditions.relationship)

				};
				if(conditions.relationship < 5) 
					conditions.relationship += 5;
				else
					conditions.relationship += 10;

				
				/*
				conditions.onset = $scope.onset.indexOf($scope.conditions.onset);
				conditions.status = $scope.status.indexOf($scope.conditions.status);
				if(conditions.status > 0){
					conditions.status -= 1;
				}
				*/
				ApiService.create(
				 	'mc',				
					conditions,

				 	function(data){
				 		$location.path('histories/family-histories');
				  	},
				 	function(err){"ERR", console.log(err) },
				 	'Family history');
		};

		$scope.$watch(
            "conditions.relationship",
            function( newValue, oldValue ) {
                $scope.familyform.reltype.$setValidity("selgender",$scope.relationships.indexOf($scope.conditions.relationship)>0);
            }
        );
		$scope.submitLink = $scope.submitForm;
	}])
// Condition Create Controller

.controller('ConditionCreateCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', 'Auth', 'RELATIONSHIPS', function($rootScope, $scope, $state, $stateParams, $filter, $location, ApiService, Auth, RELATIONSHIPS){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.status = [
			{name:'Status', is_disabled: 1},
			{name:'None'},
			{name:'Inactive'},
			{name:'Active'},
			{name:'Resolved'},
			{name:'Remission'}
		];

		$scope.onset = [
			{name:'Onset', is_disabled: 1},
			{name:'1-2 weeks ago'},
			{name:'1-3 months ago'},
			{name:'4-6 months ago'},
			{name:'6-12 months ago'},
			{name:'1 year ago'},
			{name:'2 years ago'},
			{name:'3-5 years ago'},
			{name:'5-7 years ago'},
			{name:'7-10 years ago'},
			{name:'More than 10 years ago'}
		];
		
		$scope.conditions = {};
		$scope.conditions.status = $scope.status[0];
		$scope.conditions.onset = $scope.onset[0];	

		$scope.submitForm = function() {
			
				var conditions = {
					'name': $scope.conditions.name,
				};
				conditions.relationship = 1;
				conditions.onset = $scope.onset.indexOf($scope.conditions.onset);
				conditions.status = $scope.status.indexOf($scope.conditions.status);

				if(conditions.status > 0){
					conditions.status -= 1;
				}
				
				ApiService.create(
				 	'mc',				
					conditions,

				 	function(data){
				 		$location.path('histories/conditions');
				  	},
				 	function(err){"ERR", console.log(err) },
				 	'Condition history');
		};

		$scope.submitLink = $scope.submitForm;
	}])
/**
 * Conditions edit controller
 */
	.controller('ConditionsEditCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$filter', '$location', 'ApiService', 'Auth', 'RELATIONSHIPS', function($rootScope, $scope, $state, $stateParams, $filter, $location, ApiService, Auth, RELATIONSHIPS){
		$scope.itemData = $state.current.data;
		$scope.itemData.id = $stateParams['id'];

		$scope.status = [
			{name:'Status', is_disabled: 1},
			{name:'None'},
			{name:'Inactive'},
			{name:'Active'},
			{name:'Resolved'},
			{name:'Remission'}
		];

		$scope.onset = [
			{name:'Onset', is_disabled: 1},
			{name:'1-2 weeks ago'},
			{name:'1-3 months ago'},
			{name:'4-6 months ago'},
			{name:'6-12 months ago'},
			{name:'1 year ago'},
			{name:'2 years ago'},
			{name:'3-5 years ago'},
			{name:'5-7 years ago'},
			{name:'7-10 years ago'},
			{name:'More than 10 years ago'}
		];
		// Clone relationship constant

		$scope.relationships = RELATIONSHIPS.slice();
		// Remove "Self" from the list
		$scope.relationships.splice(1,1);

		var apiShortcut = $scope.itemData.apiShortcut,
			isNotSurgical;
		if($scope.itemData.shortcutSingle == 'family-history')
			$scope.relationships = [
				{name:'Relationship to you', is_disabled: 1},
				{name:"Father"},
				{name:"Mother"},
				{name:"Brother"},
				{name:"Sister"},
				{name:"GrandFather"},
				{name:"GrandMother"}
			];
		ApiService.get(
			apiShortcut,
			$stateParams['id'],
			function(conditions) {
				$scope.conditions = conditions;
				var current_name = $rootScope.fromState.name,
					isNew = current_name === 'user.histories.family-create';

				isNotSurgical = current_name.search('surgical') == -1;

				if(isNotSurgical){
					if(isNew){
						$scope.conditions.status = $scope.status[0];
						$scope.conditions.onset = $scope.onset[0];
						$scope.conditions.relationship = $scope.relationships[0];
					}else{
						//conditions.status = (conditions.status==0)?0:conditions.status;
						$scope.conditions.status = $scope.status[conditions.status+1];
						conditions.onset = (conditions.onset==0)?0:conditions.onset;
						$scope.conditions.onset = $scope.onset[conditions.onset];

						if($scope.itemData.shortcut != 'conditions'){
							if(conditions.relationship>14)
								$scope.conditions.relationship = $scope.relationships[conditions.relationship-10];
							else
								$scope.conditions.relationship = $scope.relationships[conditions.relationship-5];
						}
					}
				}
			},
			function(err){"ERR", console.log(err) }
		);

		$scope.submitForm = function() {
			if(isNotSurgical){
				var conditions = {
					'name': $scope.conditions.name,
					'relationship': (typeof $scope.conditions.relationship === 'undefined')?Auth.user.relationship:$scope.relationships.indexOf($scope.conditions.relationship)
				};
				if(conditions.relationship < 5) 
					conditions.relationship += 5;
				else
					conditions.relationship += 10;
				conditions.onset = $scope.onset.indexOf($scope.conditions.onset);
				conditions.status = $scope.status.indexOf($scope.conditions.status);
				if(conditions.status > 0){
					conditions.status -= 1;
				}
			}else{
				var conditions = {
					'name': $scope.conditions.name,
					'type': 2
				}
			}
			ApiService.save(
			 	apiShortcut,
				$scope.conditions.id,
				conditions,
			 	function(data){
			 		$location.path('histories/' + $scope.itemData.shortcutSingle + '/' + $stateParams['id']);
			  	},
			 	function(err){"ERR", console.log(err) });
		};

		$scope.submitLink = $scope.submitForm;
	}])

/**
 * Social history controller
 */
	.controller('SocialHistoryCtrl', ['$scope', '$state', 'ApiService', function($scope, $state, ApiService){
		$scope.socialstatus = {};
		$scope.MaritalStatus = [
			{name:'Marital Status', is_disabled: 1},
			{name:'Single'},
			{name:'Married'},
			{name:'Separated'},
			{name:'Widowed'},
			{name:'Divorced'}
		];

		// Get Social status
		ApiService.get(
			'socialstatus',
			1,
			function(socialstatus, is_first_time) {
				if(is_first_time){
					$scope.socialstatus[10] = $scope.MaritalStatus[0];
				}else{
					//[{"id":1,"answer":"2","createdDate":"2015-01-06T09:55:23.03","lastModifiedDate":"2015-01-06T09:55:23.03"},{"id":2,"answer":"1","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":3,"answer":"2","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":4,"answer":"2","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":5,"answer":"2","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":6,"answer":"2","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":7,"answer":"nop","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":8,"answer":"1","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":9,"answer":"2","createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"},{"id":10,"answer":null,"createdDate":"2015-01-06T09:55:23.033","lastModifiedDate":"2015-01-06T09:55:23.033"}]
					for (var i = socialstatus.length - 1; i >= 0; i--) {
						var id = socialstatus[i]['id'],
							value = socialstatus[i]['answer'];

						value = (id==10)?$scope.MaritalStatus[value]:value;

						$scope.socialstatus[id] = value;
					};
				}
			},
			function(err){"ERR", console.log(err) }
		);


		// Submit form to the server
		$scope.submitForm = function() {
			var socialstatus = [];

			angular.forEach($scope.socialstatus, function(value, key){
				var val = (angular.isObject(value))?$scope.MaritalStatus.indexOf($scope.socialstatus[10]):value;
				socialstatus[socialstatus.length] = {
					'id': key,
					'answer': val
				}
			});

			console.log(socialstatus);
			ApiService.save(
				'socialstatus',
				1,
				socialstatus,
				function(data){
					$state.go('user.home');
				},
				function(err){"ERR", console.log(err) }
			);
		};

		$scope.submitLink = $scope.submitForm;
	}])
/**
 * Summaries
 */
	.controller('SummariesViewCrtl', ['$scope', '$route', 'ApiService', function($scope, $route, ApiService){
		$scope.waiting = 1;
		ApiService.getSummary(
			function(summary) {
				console.log('summary', summary);
				$scope.waiting = 0;

				$scope.person =  (summary.patient.gender == '1')?'He':'She';
				$scope.summary = summary;
				// Get exact age
				var today = new Date(),
					dob = new Date(summary.patient.dob),
					month = dob.getMonth(),
					day = dob.getDate(),
					age = today.getFullYear() - dob.getFullYear();
				if(today.getMonth() < month || (today.getMonth()==month && today.getDate()<day)){age--;}

				$scope.age = age;
			},
			function(err){
				console.log(err);
			});
	}])
/**
 * Share
 */
	.controller('ShareCrtl', ['$scope', '$state', '$filter', 'ApiService', 'UserService', function($scope, $state, $filter, ApiService, UserService){
		$scope.waiting = 1;
		// Min date for expiration day cant be in the past
		$scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
		$scope.shareData = {};
		$scope.user = {};

		// Check if there are associated accounts and add the dropdown
		UserService.getAccounts(
			function (accounts) {
				$scope.accounts_original = accounts
				if(accounts.length > 1){
					$scope.accounts = [{'name':'Choose an account to share', is_disabled: 1}];
					angular.forEach(accounts, function(item, key) {
						$scope.accounts[key + 1] = {
							'name': item.firstName + ' ' + item.lastName
						};
					});
					$scope.user.account = $scope.accounts[0];
				}else{
					$scope.accounts = 0;
				}
				$scope.waiting = 0;

				$scope.$watch(
		            "user.account",
		            function( newValue, oldValue ) {
		            	console.log("asdfasdfasdf");
		            	console.log($scope.share_form.share_account);
		            	if($scope.share_form.share_account)
		                	$scope.share_form.share_account.$setValidity("selgender",$scope.accounts.indexOf(newValue)>0);
		            }
		        );
				
			});

		// Submit form to the server
		$scope.submitForm = function() {
			var ID = 0;

			if($scope.user.account){
				ID = $scope.accounts_original[$scope.accounts.indexOf($scope.user.account) - 1].id;
			}
			ApiService.share(
				$scope.shareData,
				ID,
				function(data){
					$state.go('user.home');
				},
				function(err){"ERR", console.log(err) }
			);
		};
		
		//console.log($scope);  console.log($scope.share_form);  return false;

        $scope.submitLink = $scope.submitForm;
	}])
	//Get shared by me
	.controller('SharedCrtl', ['$scope', '$state', '$filter', 'ApiService', function($scope, $state, $filter, ApiService){
		// Min date for expiration day cant be in the past
        console.log($state.current);
        $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.waiting = 1;
        $scope.type = $state.current.data.type;
        // Page title
        $scope.title = ($scope.type=='byMe')?'Shared By Me':'Shared With Me';
        // Set table order
        $scope.predicate = 'sharedDate';
        $scope.hstate = $state.current;
        ApiService.shared(
            $scope.type,
            0,
            function(data){
                angular.forEach(data, function(item, key) {
                    data[key].key = key;
                   
                    data[key].expiryDate = new Date(item.expiryDate);
                   	
                    data[key].updateItems = function(key){
                        $scope.updateItems(key)
                    };
                    data[key].editItem = function(key, editMode){
                        $scope.editItem(key, editMode);
                    };
                });

                $scope.collection = (data.length)?data:0;

                $scope.shared = (data.length)?data:0;
                $scope.waiting = 0;
            },
            function(err){"ERR", console.log(err) }
        );


	}])
    .controller('SharedDetailCrtl', ['$scope', '$state', '$filter', 'ApiService', '$stateParams', function($scope, $state, $filter, ApiService, $stateParams){
        // Min date for expiration day cant be in the past
        
        $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.waiting = 1;
        $scope.type = $state.current.data.type;
        // Page title
        $scope.title = ($scope.type=='byMe')?'Shared By Me':'Shared With Me';
        // Set table order
        $scope.predicate = 'sharedDate';
        $scope.backurl = $state.current.data.backurl;
        ApiService.shared(
            $scope.type,
            0,
            function(data){

                angular.forEach(data, function(item, key) {
                    data[key].key = key;
                    
                    if(item.expiryDate && item.expiryDate>(new Date()))
                    	data[key].expiryDate = new Date(item.expiryDate);
                   	else
                   		data[key].expiryDate = new Date();	
                   
                    data[key].updateItems = function(key){
                        $scope.updateItems(key)
                    };
                    data[key].editItem = function(key, editMode){
                        $scope.editItem(key, editMode);
                    };
                });


                $scope.collection = data[$stateParams['id']];
                var showdata = [data[$stateParams['id']]];
                $scope.shared = showdata;
                $scope.waiting = 0;
            },
            function(err){"ERR", console.log(err) }
        );

        $scope.sortTable = function(order) {
            $scope.predicate = order;
            $scope.reverse= !$scope.reverse;
        };

        // toggle edit mode
        $scope.editItem = function(key, editMode) {
            $scope.shared[key].editMode = editMode;
        }

        $scope.updateItems = function(key) {
        	
            $scope.editItem(key, 0);
            var item = $scope.shared[key],
                data = {
                    id: item.senderNotes[0].id,
                    note: item.note,
                    //expiryDate: item.expiryDate
                    expiryDate: item.expiryDate.toString()
                }
            //console.log(data); return false;
            ApiService.shared(
                $scope.type,
                1,
                function(data){
                    $state.go('user.home');
                },
                function(err){
                    console.log(err)
                },
                data
            );
        };
    }])

/**
 * Docs
 */
	.controller('DocumentsViewCrtl', ['$scope', '$route', '$stateParams', 'ApiService', function($scope, $route, $stateParams, ApiService){
		ApiService.list('docsvault', function(documents) {
			var documentData = documents.filter(function(obj) {
				return obj.id == $stateParams['id'];
			});
			if(documentData[0].type !=1 && documentData[0].type !=5 && documentData[0].type !=6)
            {
        	    $scope.waiting = 1;
    	        var ref = window.open(documentData[0].linkId,"_blank","location=no,enableViewportScale=yes,toolbarposition=top");
	            ref.addEventListener("exit",function(){ window.history.back()});
                $scope.documentData = documentData[0];

            }
            else
            {
			   $scope.documentData = documentData[0];
   				var iframe = angular.element('<iframe>')
    			.attr('src', $scope.documentData.linkId)
 			   .attr('style', 'width:'+ window.innerWidth +'px; height:'+ (window.innerHeight-100) +'px;');
                angular.element( document.getElementsByClassName('scrollable-content') ).append( iframe ).attr("height",(window.innerHeight-38)+"px;");}
			},function(err){"ERR", console.log(err) });
	}])


	.controller('ChangePasswordCtrl', ['$scope', 'Auth', 'UserService', function($scope, Auth, UserService){

		$scope.submitForm = function() {
			console.log($scope.data)
			UserService.changePassword(
				$scope.data,
				function(user){
					$state.go('user.home');
				},
				function(error){
					console.log(error);
				}
			);
		};

		$scope.submitLink = $scope.submitForm;
	}])

	.controller('PhysicianCtrl', ['$scope', '$route', '$stateParams', 'ApiService', 'Auth', function($scope, $route, $stateParams, ApiService, Auth) {

		$scope.data = {};
		$scope.data.practice = Auth.user.practice;

		$scope.checkCode = function() {
			ApiService.get(
				'practices',
				$scope.data.code,
				function(data){
					$scope.data.practice = data;
				},
				function(err){"ERR", console.log(err) }
			);
		};

		$scope.submitLink = function() {
			Auth.user.practice = $scope.data.practice;
			Auth.update(
				Auth.user,
				function(data){
					console.log(data);
				},
				function(err){"ERR", console.log(err) }
			);
		};
	}])

/**
 * Forgot password controller
 */
	.controller('ForgotPasswordCtrl', ['$scope', 'UserService', function($scope, UserService) {

		$scope.submitForm = function() {
			$scope.waiting = 1;
			UserService.forgotPassword(
				$scope.email,
			  	function(msg){
			  		$scope.waiting = 0;
			  		$scope.msg = msg;
					$scope.formSuccess = 1;
			  	},
			  	function(){
			  		$scope.waiting = 0;
			  	}
			);
		};
	}])

/**
 * Forgot password comfirmation controller
 */
 	.controller('ForgotPasswordConfirmationCtrl', ['$scope', '$stateParams', '$state', 'UserService', function($scope, $stateParams, $state, UserService) {

		$scope.data = {
			'token': $stateParams['token']
		};

		$scope.submitForm = function() {
			$scope.waiting = 1;
			UserService.forgotChangePassword(
				$scope.data,
				function(user){
					$scope.waiting = 0;
					$state.go('anon.login');
				},
				function(error){
					$scope.waiting = 0;
					console.log(error);
				}
			);
		};
	}]);





/* Directives */

var appDirectives = angular.module('appDirectives', []);

appDirectives
	/**
	 * Used for the knob plugin for weight page
	 */
	.directive('knob', function(){
		function link(scope, element, attrs) {

			Ui.knob = function() {};

			Ui.knob.prototype = Object.create(Ui.prototype);

			Ui.knob.prototype.createElement = function() {
				Ui.prototype.createElement.apply(this, arguments);
				this.addComponent(new Ui.Arc({
					arcWidth: 18
				}));

				this.addComponent(new Ui.Text());

				this.addComponent(new Ui.Pointer(this.merge(this.options, {
						type: 'Circle',
						pointerWidth: 28,
						offset: -45
					})));

				this.merge(this.options, {arcWidth: 18});
				var arc = new Ui.El.Arc(this.options);
				arc.setAngle(this.options.anglerange);
				this.el.node.appendChild(arc.node);
				this.el.node.setAttribute('class', 'knob');
			};
			new Knob(element[0], new Ui.knob());

		}
		return {
			restrict: 'A',
			link: link
		};
	})

	// Handle bottom bar visibiity
	.directive('bottombar', ['$rootScope', function($rootScope){
		function link(scope, element, attrs) {
			$rootScope.hasBottomBar = true;
		}
		return {
			restrict: 'A',
			link: link
		};
	}])

	.directive("passwordVerify", function() {
		return {
			require: "ngModel",
			scope: {
				passwordVerify: '='
			},
			link: function(scope, element, attrs, ctrl) {
				scope.$watch(function() {
						var combined;

						if (scope.passwordVerify || ctrl.$viewValue) {
							 combined = scope.passwordVerify + '_' + ctrl.$viewValue;
						}
						return combined;
				}, function(value) {
						if (value) {
								ctrl.$parsers.unshift(function(viewValue) {
										var origin = scope.passwordVerify;
										if (origin !== viewValue) {
												ctrl.$setValidity("passwordVerify", false);
												return undefined;
										} else {
												ctrl.$setValidity("passwordVerify", true);
												return viewValue;
										}
								});
						}
				});
			}
		};
	})

	/**
	 * Directive to make disable the options disable on dropdowns
	 */
	.directive('optionsDisabled', ['$parse', function($parse) {
		var disableOptions = function(scope, attr, element, data, fnDisableIfTrue) {
				// refresh the disabled options in the select element.
				var options = element.find('option');
				for(var pos= 0,index=0;pos<options.length;pos++){
						var elem = angular.element(options[pos]);
						if(elem.val()!=''){
								var locals = {};
								locals[attr] = data[index];
								elem.attr('disabled', fnDisableIfTrue(scope, locals));
								index++;
						}
				}
		};
		return {
				priority: 0,
				require: 'ngModel',
				link: function(scope, iElement, iAttrs, ctrl) {
						// parse expression and build array of disabled options
						var expElements = iAttrs.optionsDisabled.match(/^\s*(.+)\s+for\s+(.+)\s+in\s+(.+)?\s*/),
								attrToWatch = expElements[3],
								fnDisableIfTrue = $parse(expElements[1]);
						scope.$watch(attrToWatch, function(newValue, oldValue) {
								if(newValue)
										disableOptions(scope, expElements[2], iElement,
												newValue, fnDisableIfTrue);
						}, true);
						// handle model updates properly
						scope.$watch(iAttrs.ngModel, function(newValue, oldValue) {
								var disOptions = $parse(attrToWatch)(scope);
								if(newValue)
										disableOptions(scope, expElements[2], iElement,
												disOptions, fnDisableIfTrue);
						});
				}
		};
	}])


	/**
	 * @ngdoc directive
	 * @name ngDomEvents.directive:domOnCreate
	 * @description
	 * # domOnCreate
	 */
	.directive('domOnCreate', ['$parse', '$timeout', function($parse, $timeout) {
		return {
			link: function postLink(scope, element, attrs) {
				// wrap in a timeout to allow directives to link scope callbacks
				$timeout(function() {
					if (attrs.domOnCreate) {
						$parse(attrs.domOnCreate)(scope);
					}
				});
			}
		};
	}])
	/**
	 * @ngdoc directive
	 * @name ngDomEvents.directive:domOnDestroy
	 * @description
	 * # domOnDestroy
	 */
	.directive('domOnDestroy', ['$parse', function($parse) {
		return {
			link: function postLink(scope, element, attrs) {
				var destroyHandler;
				if (attrs.domOnDestroy) {
					destroyHandler = $parse(attrs.domOnDestroy);
					element.on('$destroy', function() {
						console.log('removed')
						destroyHandler(scope);
					});
				}
			}
		};
	}])

	/**
	 * Directive used on the loggedin homepage for showing the cards
	 */
	.directive('cards', ['$window', '$timeout', function($window, $timeout) {
		function link(scope, element, attrs) {
			function vAlign() {
				var height = element.prop('offsetHeight'),
					padding = (height - 278)/2;

				element.children().css({
					'padding-bottom': padding +'px',
					'padding-top': padding +'px'
				});
			}
			angular.element($window).bind('resize', function () {
				vAlign();
			});

			$timeout(function(){
				vAlign();
				element.css('opacity', 1);
			},500);
		}
		return {
			restrict: 'A',
			link: link
		}
	}])


	// Show loader spinner on ajax request on the header
	.directive('navbarajaxloader', ['$http' , function ($http) {
		function link(scope, element, attrs) {
			var $element = angular.element(element);
			scope.isLoading = function () {
				var pending = $http.pendingRequests;
				if(pending.length > 0) {
					// Check if the request is not for a template/token/profile
					//pending = (pending[0].url.search(/.html|token|profile/) != -1)?0:1;
					pending = (pending[0].method == "GET")?0:1;
				}else{
					pending = 0;
				}
				return pending;
			};

			scope.$watch(scope.isLoading, function (value) {
				if (value && !scope.loading) {
					$element.addClass('loading');
				} else {
					$element.removeClass('loading');
				}
			});
		}
		return {
			restrict: 'A',
			link: link
		}
	}]);


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
					else
						data['startDate'] = new Date(data['startDate'].getTime() + 12*60*60000);
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

				data['expiryDate'] = new Date(data['expiryDate'].getTime() + 24*60*60000-1);
				
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

/* Filters */

var appFilters = angular.module('appFilters', []);


appFilters
	.filter('splitTxt', function() {
		return function(str) {
			str = str.replace(/_/g,' ');
			return (str.search('none')===-1)?str:'none';
		};
	})
  // Searches for an object which match the parameters into an array.
  .filter('getByProperty', function() {
  return function(arr, property, value) {
    var i=0, len=arr.length;
    for (; i<len; i++) {
      if (+arr[i][property] == +value) {
        return arr[i];
      }
    }
    return null;
  }
});