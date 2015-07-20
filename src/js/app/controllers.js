
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
			$rootScope.tutorialClass = (state_name.search('tutorial')==-1)?0:1;;
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

	.controller('HomeCtrl', ['$scope', 'Auth', 'ApiService', function($scope, Auth, ApiService){

		$scope.user = Auth.user;

		$scope.waiting = 1;
		ApiService.getSummary(
			function(summary) {
				console.log('summary', summary);

				$scope.allergyActive = (summary.allergies.length)?'active':'inactive';
				$scope.medicationsActive = (summary.medications.length)?'active':'inactive';
				$scope.conditionsActive = (summary.medicalConditions.length)?'active':'inactive';
				$scope.historyActive = (summary.medicalHistories.length)?'active':'inactive';
				$scope.healthActive = (summary.symptomNarrative.complaint != '')?'active':'inactive';
				$scope.socialActive = (summary.socialStatusNarrative != 'Marital status not recorded. He has not recorded smoking status. He has not recorded use of alcohol. He has not recorded use of tobacco. He has not recorded use of any drugs. ')?'active':'inactive';


				if(summary.medicalHistories.length){
					angular.forEach(summary.medicalHistories, function(item, key) {
						if(item.typeTxt == 'Past surgical history'){
							$scope.surgicalActive = 'active';
						}
					});
				}else{
					$scope.surgicalActive = 'inactive';
				}

				$scope.waiting = 0;
			},
			function(err){
				console.log(err);
			});

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
						$state.go('user.tutorial');
					}
				},
				function(error){
					$scope.waiting = 0;
				});
		};
	}])


/**
 * Tutorial
 */
	.controller('TutorialCtrl', ['$rootScope','$scope', '$state', '$location', 'Auth', function($rootScope, $scope, $state, $location, Auth){

		$rootScope.loggedin = 0;
		$scope.step = 'step-1';

		$scope.steps = [
			{
				img: '<img src="assets/img/logo-white.svg" alt="eHealthRecord logo">',
				title: 'Welcome to the SecondOpinionExpert eHealth Records app!',
				txt: "We've assembled a brief tutorial to show you the capabilities of this application."
			},
			{
				img: '<i class="fa fa-bar-chart"></i>',
				title: 'Measurements & History',
				txt: "Record health statistics, symptoms <br>and keep a record of your health history. Update on your mobile device with <br>a few clicks."
			},
			{
				img: '<i class="fa fa-share-square-o"></i>',
				title: 'Accounts & <br>Share',
				txt: "Create an accoount for yourself and family members. Securely sharing Health Summary with your doctor is just a few clicks away."
			},
			{
				img: '<i class="fa fa-user-md"></i>',
				title: 'Seek a <br>second opinion',
				txt: "Connect with our SOE desktop elemedicine platform for consultations with a top specialist nationwide.",
				hasBtn: 1
			}
		];

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
			var r = confirm("Are you sure want to Delete?");
			if (r == true) {
			    ApiService.delete(
					currentShortcut,
					$stateParams['id'],
					function(data) {
						$location.path($scope.itemData.type + '/' + $scope.itemData.shortcut);
					},
					function(err){"ERR", console.log(err) });
			}
			
			
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
		$scope.today = $filter('date')(new Date(), 'MM/dd/yyyy');
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
		$scope.fnGetImage = function(){
        if (document.getElementById("signature_sketch").toDataURL() == document.getElementById('blank').toDataURL()) {
            angular.element(document.getElementById("signatureData")).val('');
        } else {
            var image = document.getElementById("signature_sketch").toDataURL("image/png");
            image = image.replace('data:image/png;base64,', '');
            angular.element(document.getElementById("signatureData")).val(image);
        };     
        $scope.fnClearCanvas = function() {   
	        var myCanvas = document.getElementById("signature_sketch");
	        var ctx = myCanvas.getContext('2d');
	        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
	    }
   
    }

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
                    
                    if(item.expiryDate && new Date(item.expiryDate)>(new Date()))
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
                    id: item.id,
                    //note: item.note,
                    expiryDate: item.expiryDate
                    //expiryDate: item.expiryDate.toString()
                }
            //console.log(data); return false;
            ApiService.shared(
                $scope.type,
                1,
                function(data){
                    //$state.go('user.share.by-me');
                    console.log("share update success");
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
 			   .attr('style', 'width:'+ window.innerWidth +'px; height:'+ (window.innerHeight-113) +'px;');
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



