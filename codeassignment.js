"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var body_parser_1 = require("body-parser");
var express_1 = require("express");
var app = (0, express_1.default)();
var port = 3000;
var accounts = [
    {
        id: 1,
        name: "Joel Oslo",
        availableCash: 20000
    },
    {
        id: 2,
        name: "Thanh Halden",
        availableCash: 3000
    }
];
var alltransactions = [];
app.use(body_parser_1.default.json());
/*
Design and implement a REST API that able to execute transaction between
2 bank accounts (simple model defined below), to allow money exchange
between them.*/
app.post('/bank/transactions', function (req, res) {
    var _a = req.body, srcAccountId = _a.srcAccountId, desAccountId = _a.desAccountId, cashAmount = _a.cashAmount, timeRegister = _a.timeRegister;
    // Check if these accounts exist
    if (accounts[srcAccountId] == null || accounts[desAccountId] == null) {
        res.status(400).json({
            error: 'Either source account or destination is not existed'
        });
    }
    /* Negative cash balance on bank account is not allowed when executing, and the request should be rejected
            with response of 400 and a reason text at least.
    */
    // if source accoutn as negative cash balance --> unable to make a transaction
    if (accounts[srcAccountId].availableCash <= 0) {
        res.status(400).json({
            error: 'Source account does not have enough balance to execute this transaction '
        });
    }
    if (accounts[srcAccountId].availableCash < cashAmount) {
        res.status(400).json({
            error: 'There is not enough money in your account to do this transaction'
        });
    }
    // if all the tests pass --> execute transactions
    accounts[srcAccountId].availableCash -= cashAmount;
    accounts[desAccountId].availableCash += cashAmount;
    var succesfulTransaction = {
        id: Math.floor(Math.random() * 10000),
        registeredTime: Number(timeRegister),
        executedTime: Number(new Date()),
        success: true,
        cashAmount: cashAmount,
        sourceAccount: accounts[srcAccountId],
        destinationAccount: accounts[desAccountId]
    };
    alltransactions.push(succesfulTransaction);
    /* Successful execution of request should response with 200 and include the
            executed transaction model within response body */
    res.status(200).json(succesfulTransaction);
});
// List all transactions
app.get('/bank/transactions', function (req, res) {
    res.status(200).json(alltransactions);
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
/*
Design and implement a REST API that able to execute transaction between
2 bank accounts (simple model defined below), to allow money exchange
between them.
let moneyExchange = function (srcAccount: Account, desAccount: Account, cashAmount: number, timeRegister: Date): string {

    

     Negative cash balance on bank account is not allowed when executing, and the request should be rejected
            with response of 400 and a reason text at least.
    
    if (srcAccount.availableCash <= 0) {
        return "400! Your blance is not enough to execute this transaction";
    }

    else if (srcAccount.availableCash < cashAmount) {
        // send o JSON.text saying "Your balance is not enough to execute this transaction"
        return "400! There is not enough money in your account for doing this transaction"
    }

    else {
         Successful execution of request should response with 200 and include the
            executed transaction model within response body
            var currTransaction: Transaction = {
                id: Math.floor(Math.random() * 10000),
                registeredTime: Number(timeRegister), // convert date object to epoch
                executedTime: Number(new Date()), // get the current time when transaction is executed
                success: true,
                cashAmount: cashAmount,
                sourceAccount: srcAccount,
                destinationAccount: desAccount
            }

            srcAccount.availableCash -= cashAmount
            desAccount.availableCash += cashAmount

            // The bank accounts and transactions should be stored, you may choose what storage solution it might be (DB/file/etc.)

        return "200! Your transaction has been executed successfully";
        
    }

}
*/
//Consider structure of REST API url, in case you want to add more APIs for account/transaction management, or make change in future.
/* How to test the logic and API according to the requirements?
    - Write unit tests for transactions execution logic, input validating and database operations
    - Test different use cases/scenarios to see if the transactions are surely executed.
*/
/* This assignment only described simple scenario, can there be more complicated situations for production systems? What are they? How to tackle them?
    

    Yes, there are some usual cases that might happen in production:
        - Users do not exist. It is not possible to execute a transaction between 2 accounts when one of them does not exist. To handle this, we should check if the users are registered in database.
        - Concurrency issues: Handle concurrent transactions to ensure data consistency.
        - Rollbacks: Implement transaction rollbacks in case of failures to maintain data integrity.
        - Authorization and authentication: Add security layers to ensure only authorized users can perform transactions.
        - Scalability: handling large number of transactions and accounts.
        - Perfomance (ytelse): optimize database query. use cache when needed to improve service perfomance
*/ 
