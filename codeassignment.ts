import bodyParser = require('body-parser');
import express = require('express');

const app = express()
const port = 5005;

// create account model
interface Account {
    id: number;
    name: string;
    availableCash: number; 
}

// create transaction model
interface Transaction {
    id: number;
    registeredTime: number;
    executedTime: number;
    success: boolean;
    cashAmount: number
    sourceAccount:  Account;
    destinationAccount: Account
}



const accounts: Account[] = [ // Hard coding two accounts
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

]

const alltransactions: Transaction[] = []

app.use(bodyParser.json())

/*
Design and implement a REST API that able to execute transaction between 
2 bank accounts (simple model defined below), to allow money exchange 
between them.*/

app.post('/bank/transactions', (req: any, res: any) => {
    const { srcAccountId, desAccountId, cashAmount, timeRegister} = req.body


    // Check if these accounts exist
    console.log('Received srcAccountId:', srcAccountId);
    console.log('Received desAccountId:', desAccountId);
    console.log('Accounts:', accounts);


    if (accounts[srcAccountId] == null || accounts[desAccountId] == null) {
        res.status(400).json({
            error: 'Either source account or destination is not existed'
        })
    }

    /* Negative cash balance on bank account is not allowed when executing, and the request should be rejected 
            with response of 400 and a reason text at least.
    */
        // if source accoutn as negative cash balance --> unable to make a transaction
    if (accounts[srcAccountId].availableCash <= 0) {
        res.status(400).json({ 
            error: 'Source account does not have enough balance to execute this transaction '
        })
    }

    if (accounts[srcAccountId].availableCash < cashAmount) {
        res.status(400).json({ 
            error: 'There is not enough money in your account to do this transaction'
        })
    }


    // if all the tests pass --> execute transactions

    accounts[srcAccountId].availableCash -= cashAmount
    accounts[desAccountId].availableCash += cashAmount

    const succesfulTransaction: Transaction = {
        id: Math.floor(Math.random() * 10000),
        registeredTime: Number(timeRegister), // convert date object to epoch
        executedTime: Number(new Date()), // get the current time when transaction is executed
        success: true,
        cashAmount,
        sourceAccount: accounts[srcAccountId],
        destinationAccount: accounts[desAccountId]
    }

    alltransactions.push(succesfulTransaction)

    /* Successful execution of request should response with 200 and include the 
            executed transaction model within response body */
    res.status(200).json(succesfulTransaction)
})


// List all transactions
app.get('/bank/transactions', (req: any, res: any) => {
    res.status(200).json(alltransactions)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });




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