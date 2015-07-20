'use strict';

var app = angular.module('PHR', [
		// Angular extensions
		'ngAnimate',
		'ngRoute',
		'ngAria',
		'ngTouch',
		'ngSanitize',
		// Angular plugins
		'ui.router',
		'mobile-angular-ui',
		'LocalStorageModule',
		'angular-carousel',
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
				'share'
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
			 * Tutorial
			 */
			.state('user.tutorial', {
				url: '/tutorial',
				templateUrl: folders[0] + '/tutorial/tutorial.html',
				controller: 'TutorialCtrl'
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
					'items': 'Surgical history',
					'item': 'Surgical history',
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