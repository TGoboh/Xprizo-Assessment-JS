const chai = require('chai');
const nock = require('nock');
const axios = require('axios');
const expect = chai.expect;

// Base URL of the fictional API
const BASE_URL = "http://localhost:5000/api/v1/users/register";

// Describing the test suite for user registration API
describe("User Registration API Tests", function () {

    // After each test, clean up nock interceptors
    afterEach(() => {
        nock.cleanAll();
    });

    // Test case for successful registration
    it("should successfully register a user with valid inputs", async function () {
        // Mocking the response from the server
        const mockResponse = {
            message: "User registered successfully."
        };

        // Nock intercepts the HTTP request to the specified URL and provides a mock response
        nock("http://localhost:5000")
            .post('/api/v1/users/register')
            .reply(201, mockResponse);

        // Data to be sent in the POST request
        const data = {
            username: "validUser",
            password: "StrongPassword123!",
            email: "validuser@example.com",
            phone: "1234567890"
        };

        // Making the actual request using axios
        const response = await axios.post(BASE_URL, data);

        // Assertions to check if the status and response data are correct
        expect(response.status).to.equal(201);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for missing required fields
    it("should return an error when required fields are missing", async function () {
        const mockResponse = {
            error: "Missing required fields."
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/register')
            .reply(400, mockResponse);

        // Sending a request without the email field
        const data = {
            username: "missingEmailUser",
            password: "StrongPassword123!",
            phone: "1234567890"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(400);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case when the username already exists
    it("should return an error when username already exists", async function () {
        const mockResponse = {
            error: "Username already exist."
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/register')
            .reply(409, mockResponse);

        // Request with an already existing username
        const data = {
            username: "existingUser",
            password: "StrongPassword123!",
            email: "newuser@example.com",
            phone: "0987654321"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(409);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case when the email already exists
    it("should return an error when email already exists", async function () {
        const mockResponse = {
            error: "Email already exists."
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/register')
            .reply(409, mockResponse);

        // Request with an already existing email
        const data = {
            username: "newUser",
            password: "StrongPassword123!",
            email: "existinguser@example.com",
            phone: "1234567890"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(409);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for SQL injection attempt
    it("should return an error for SQL injection attempt in username", async function () {
        const mockResponse = {
            error: "Invalid input."
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/register')
            .reply(400, mockResponse);

        // Request with a username attempting SQL injection
        const data = {
            username: "'; DROP TABLE users;--",
            password: "Test@1234",
            email: "sqlinjection@example.com",
            phone: "1234567890"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(400);
        expect(response.data).to.deep.equal(mockResponse);
    });
});
