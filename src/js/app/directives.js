
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
	/**
	 * Directive used for signature drawing
	 */
	.directive("drawing", function(){
	  return {
	    restrict: "A",
	    link: function(scope, element){
	      var ctx = element[0].getContext('2d');
	      
	      // variable that decides if something should be drawn on mousemove
	      var drawing = false;
	      
	      // the last coordinates before the current move
	      var lastX;
	      var lastY;
	      
	      var flag = false;
	      var canvas = document.getElementById("signature_sketch");
	      canvas.addEventListener('touchstart', function(event){
	      	console.log(event);
	      	
		        lastX = event.touches[0].pageX - canvas.offsetLeft;
	            lastY =  event.touches[0].pageY - event.target.offsetTop + event.target.fastClickScrollParent.fastClickLastScrollTop -53;

		        // begins new line
		        ctx.beginPath();
		        
		        drawing = true;

	    	
	    	event.preventDefault();
	      },false);
	      canvas.addEventListener('mousedown', function(event){
	      		
		      	event.preventDefault();
		        if(event.offsetX!==undefined){
		          lastX = event.offsetX;
		          lastY = event.offsetY;
		        } else {
		          lastX = event.layerX - event.currentTarget.offsetLeft;
		          lastY = event.layerY - event.currentTarget.offsetTop;
		        }
		        
		        // begins new line
		        ctx.beginPath();
		        
		        drawing = true;
	      },false);
	      
	      canvas.addEventListener('touchmove', function(event){
	      	
	      	if(drawing){
	          // get current mouse position
	           
	            currentX = event.touches[0].pageX - canvas.offsetLeft;
	            currentY =  event.touches[0].pageY - event.target.offsetTop + event.target.fastClickScrollParent.fastClickLastScrollTop -53;
	          
	          
	          draw(lastX, lastY, currentX, currentY);
	          
	          // set current coordinates to last one
	          lastX = currentX;
	          lastY = currentY;
	        }
	        event.stopImmediatePropagation();
	        event.preventDefault();
	      },false);
	      canvas.addEventListener('mousemove', function(event){
	        if(drawing){
	          // get current mouse position
	          if(event.offsetX!==undefined){
	            currentX = event.offsetX;
	            currentY = event.offsetY;
	          } else {
	            currentX = event.layerX - event.currentTarget.offsetLeft;
	            currentY = event.layerY - event.currentTarget.offsetTop;
	          }
	          
	          draw(lastX, lastY, currentX, currentY);
	          
	          // set current coordinates to last one
	          lastX = currentX;
	          lastY = currentY;
	        }
	        
	      },false);
	       
	     
	      canvas.addEventListener('mouseup', function(event){
	        // stop drawing
	        drawing = false;
	      },false);
	      element.bind('mouseout', function(event){
	        // stop drawing
	        drawing = false;
	      });
	      element.bind('touchend', function(event){
	        // stop drawing
	        event.preventDefault();
	        drawing = false;
	      });
	      element.bind('touchcancel', function(event){
	        // stop drawing
	        drawing = false;
	      });  
	      // canvas reset
	      function reset(){
	       element[0].width = element[0].width; 
	      }
	      
	      function draw(lX, lY, cX, cY){
	        // line from
	        ctx.moveTo(lX,lY);
	        // to
	        ctx.lineTo(cX,cY);
	        // color
	        ctx.lineWidth = 3;
	        ctx.strokeStyle = "#000";
	        // draw it
	        ctx.stroke();
	      }
	    }
	  };
	})

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
	}

	]);


