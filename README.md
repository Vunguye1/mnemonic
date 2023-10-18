# mmemonic

# How to test the logic and API according to the requirements?
    - Write unit tests for transactions execution logic, input validating and database operations
    - Test different use cases/scenarios to see if the transactions are surely executed.


# This assignment only described simple scenario, can there be more complicated situations for production systems? What are they? How to tackle them?
    

    Yes, there are some usual cases that might happen in production:
        - Users do not exist. It is not possible to execute a transaction between 2 accounts when one of them does not exist. 
        To handle this, we should check if the users are registered in database.
        - Concurrency issues: Handle concurrent transactions to ensure data consistency.
        - Rollbacks: Implement transaction rollbacks in case of failures to maintain data integrity.
        - Authorization and authentication: Add security layers to ensure only authorized users can perform transactions.
        - Scalability: handling large number of transactions and accounts.
        - Perfomance (ytelse): optimize database query. Use cache when needed to improve service perfomance.
