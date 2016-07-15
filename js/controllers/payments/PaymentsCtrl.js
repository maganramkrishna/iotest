define(function () {
	'use strict';
	
	function ctrl($scope, $state, $stateParams, $timeout, $ionicModal, $ionicLoading, PaymentService, UserService, stripe, $ionicHistory) {
		$scope.card = {
			// isDefault:true
		};
		$scope.bank = {};
		$scope.isDeleting = false;
		console.log("BACKVIEW", $ionicHistory.backView());
		$scope.init = function(){
			$scope.isDeleting = false;
			$scope.card = {};
			PaymentService.getPayments(window.localStorage.getItem('userId'), function(err, result){
				$scope.paymentMethods = result ? result.data : [];
			});

			PaymentService.getRecipient(function(err, result){
				$scope.recipient = result ? result.data : [];
			});

			UserService.getCustomer(window.localStorage.getItem('userId'), function(err, customer){
				$scope.customer = !err && customer.data.length > 0 ? customer.data[0] :  null;
				console.log('customer', $scope.customer);
			});
		};		
		$scope.$watch('card.exp_year', function(newVal, oldVal){
			if(newVal && String(newVal).length > 3 && (new Date()).getFullYear() < newVal) {
				var elem = angular.element(document.querySelector('#cvc'));
				if(elem[0]) 
					elem[0].focus();
			}
		});
		$scope.$watch('card.exp_month', function(newVal, oldVal){
			if(newVal && String(newVal).length > 1) {
				var elem = angular.element(document.querySelector('#expYear'));
				if(elem[0]) 
					elem[0].focus();
			}
		});
		$scope.saveCard = function() {
			if(!$scope.card) {
				$ionicLoading.show({
					template: err.message,
					duration: 3000
				});
				return;
			}
			$ionicLoading.show({
				template: "Adding credit card information"
			});
			stripe.card.createToken($scope.card)
				.then(function(tokenResponse){
					if(!$scope.customer) {
						PaymentService.createCustomer(tokenResponse.id, function(err, customerResponse){
							console.log(err, customerResponse);
							$ionicLoading.show({
								template: err ? err.message : "Card created",
								duration: 3000
							});
							$scope.init();
						});
					} else {
						PaymentService.createCard(tokenResponse.id, function(err, cardResult) {
							$ionicLoading.show({
								template: err ? err.message : "Card created",
								duration: 3000
							});
							$scope.init();
						});
					}
				})
				.catch(function(err){
					$ionicLoading.show({
						template: err.message,
						duration: 3000
					});
				});
		};

		$scope.deleteCard = function(cardId){
			PaymentService.deleteCard(cardId, function(err, deleteResult){
				$ionicLoading.show({
					template: err ? err.message : "Card deleted successfully",
					duration: 3000
				});
				$scope.init();
			});
		};

		$scope.deleteRecipient = function() {
			PaymentService.deleteRecipient(function(err, deleteResult){
				$ionicLoading.show({
					template: err ? err.message : "Bank deleted successfully",
					duration: 3000
				});
				$scope.init();
			});
		};

		$scope.saveBank = function() {
			if(!$scope.bank.account_holder_name) {
				$ionicLoading.show({
					template: "Please add your full legal name",
					duration: 3000
				});
				return;
			}
			stripe.bankAccount.createToken({
			  country: 'US',
			  currency: 'USD',
			  routing_number: $scope.bank.routing_number,
			  account_number: $scope.bank.account_number,
			  account_holder_name: $scope.bank.account_holder_name,
			  account_holder_type: 'individual'
			}, function(status, response){
				if(status === 200) {
					$ionicLoading.show({
						template: "Adding bank information"
					});
					
					PaymentService.createRecipient($scope.bank.account_number,$scope.bank.routing_number, $scope.bank.account_holder_name, $scope.bank.tax_id, function(err, bankResult){
						$ionicLoading.show({
							template: err && err.data && err.data.stack ? err.data.stack.split('\n')[0] : "Bank added successfully",
							duration: 3000
						});
						$scope.init();
						$ionicHistory.goBack(-1);
					});
				} else {
					$ionicLoading.show({
						template: response.error ? response.error.message : "Something went wrong while adding your bank information.",
						duration: 3000
					});
				}
			});
		};

		$scope.toggleDelete = function() {
			console.log($scope.isDeleting);
			$scope.isDeleting = $scope.isDeleting === true ? false : true;
		};

		// Initialize
		$scope.init();
		$scope.selection = $stateParams.state || 'cc';
	}

	ctrl.$inject = ['$scope', '$state', '$stateParams', '$timeout', '$ionicModal', '$ionicLoading', 'PaymentService', 'UserService', 'stripe', '$ionicHistory'];
	return ctrl;

});
