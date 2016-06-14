'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function captureFundsAuthorizedThroughAnotherChannel(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var creditCard = new ApiContracts.CreditCardType();
	creditCard.setCardNumber('4242424242424242');
	creditCard.setExpirationDate('0822');
	creditCard.setCardCode('999');

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setCreditCard(creditCard);

	var orderDetails = new ApiContracts.OrderType();
	orderDetails.setInvoiceNumber('INV-12345');
	orderDetails.setDescription('Product Description');

	var transactionRequestType = new ApiContracts.TransactionRequestType();
	transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.CAPTUREONLYTRANSACTION);
	transactionRequestType.setPayment(paymentType);
	transactionRequestType.setAmount(utils.getRandomAmount());
	transactionRequestType.setAuthCode('ROHNFQ');
	transactionRequestType.setOrder(orderDetails);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setTransactionRequest(transactionRequestType);

	//pretty print request
	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		//pretty print response
		console.log(JSON.stringify(response, null, 2));

		if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK && 
			response.getTransactionResponse().getResponseCode() == '1'){
			console.log('Transaction ID: ' + response.getTransactionResponse().getTransId());
		}
		else{
			console.log('Result Code: ' + response.getMessages().getResultCode());
		}

		callback(response);
	});
}

if (require.main === module) {
	captureFundsAuthorizedThroughAnotherChannel(function(){
		console.log("captureFundsAuthorizedThroughAnotherChannel call complete.");
	});
}

module.exports.captureFundsAuthorizedThroughAnotherChannel = captureFundsAuthorizedThroughAnotherChannel;