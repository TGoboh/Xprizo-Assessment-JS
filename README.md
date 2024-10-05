# Overview
This project tests the User Registration, User Login, View Account balance, Transfer funds, and Logout endpoints using Javascript mocha.
The test cases cover positive and negative scenarios, ensuring proper authentication, authorization, and error-handling validation.

# Assumptions
The API requires a valid JWT token for authorization, and it follows the Bearer token format.
The status codes returned are consistent with standard HTTP responses (200, 401, 403, and 404).

# File Structure
test_account_balance.js: Contains the test cases for the balance retrieval API, along with mocked responses.
test_transfer_funds.js: Contains the test cases for the balance retrieval API, along with mocked responses.
test_user_login.js: Contains the test cases for the balance retrieval API, along with mocked responses.
test_user_logout.js: Contains the test cases for the balance retrieval API, along with mocked responses.
test_user_registration.js: Contains the test cases for the balance retrieval API, along with mocked responses.

# How to run test files

- Download the project folder
- Run `npm install mocha chai nock axios`
- Run each test file with `mocha filename.js`
