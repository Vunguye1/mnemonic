"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
var port = 5005;
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
app.use(bodyParser.json());
/*
Design and implement a REST API that able to execute transaction between
2 bank accounts (simple model defined below), to allow money exchange
between them.*/
app.post('/bank/transactions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, srcAccountId, desAccountId, cashAmount, timeRegister, currTransaction;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, srcAccountId = _a.srcAccountId, desAccountId = _a.desAccountId, cashAmount = _a.cashAmount, timeRegister = _a.timeRegister;
                // Check if these accounts exist
                console.log('Accounts:', accounts);
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
                return [4 /*yield*/, PerformTransaction(srcAccountId, desAccountId, cashAmount, timeRegister)
                    /* Successful execution of request should response with 200 and include the
                            executed transaction model within response body */
                ];
            case 1:
                currTransaction = _b.sent();
                /* Successful execution of request should response with 200 and include the
                        executed transaction model within response body */
                res.status(200).json(currTransaction);
                return [2 /*return*/];
        }
    });
}); });
function PerformTransaction(srcAccountId, desAccountId, cashAmount, timeRegister) {
    return __awaiter(this, void 0, void 0, function () {
        var succesfulTransaction;
        return __generator(this, function (_a) {
            accounts[srcAccountId].availableCash -= cashAmount;
            accounts[desAccountId].availableCash += cashAmount;
            succesfulTransaction = {
                id: Math.floor(Math.random() * 10000),
                registeredTime: Number(timeRegister),
                executedTime: Number(new Date()),
                success: true,
                cashAmount: cashAmount,
                sourceAccount: accounts[srcAccountId],
                destinationAccount: accounts[desAccountId]
            };
            alltransactions.push(succesfulTransaction); // push to our transaction list to list all executed transactions
            return [2 /*return*/, succesfulTransaction];
        });
    });
}
// List all transactions
app.get('/bank/transactions', function (req, res) {
    res.status(200).json(alltransactions);
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
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
        - Perfomance (ytelse): optimize database query. Use cache when needed to improve service perfomance.
*/ 
