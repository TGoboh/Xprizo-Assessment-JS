const chai = require('chai');
const nock = require('nock');
const axios = require('axios');
const expect = chai.expect;

// Base URL of the fictional API
const BASE_URL = "http://localhost:5000/api/v1/users/logout";

// Describing the test suite for user logout API
describe("User Logout API Tests", function () {

    // After each test, clean up nock interceptors
    afterEach(() => {
        nock.cleanAll();
    });

    // Test case for successful logout
    it("should successfully logout a valid user", async function () {
        // Mocking the response from the server
        const mockResponse = {
            message: "Logout successful"
        };

        // Nock intercepts the HTTP request to the specified URL and provides a mock response
        nock("http://localhost:5000")
            .post('/api/v1/users/logout')
            .matchHeader("Authorization", "Bearer valid_token")
            .reply(200, mockResponse);

        // Making the actual request using axios with a valid token
        const response = await axios.post(BASE_URL, {}, {
            headers: { Authorization: "Bearer valid_token" }
        });

        // Assertions to check if the status and response data are correct
        expect(response.status).to.equal(200);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for logout attempt without token
    it("should fail to logout without a token", async function () {
        const mockResponse = {
            message: "Authorization required"
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/logout')
            .reply(401, mockResponse);

        // Making the request without any token
        const response = await axios.post(BASE_URL);

        // Checking if the response code is 401 Unauthorized and the message is correct
        expect(response.status).to.equal(401);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for logout attempt with an invalid token
    it("should fail to logout with an invalid token", async function () {
        const mockResponse = {
            message: "Invalid token"
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/logout')
            .matchHeader("Authorization", "Bearer invalid_token")
            .reply(401, mockResponse);

        // Making the request with an invalid token
        const response = await axios.post(BASE_URL, {}, {
            headers: { Authorization: "Bearer invalid_token" }
        });

        // Assertions to check if the status code and response data are correct
        expect(response.status).to.equal(401);
        expect(response.data).to.deep.equal(mockResponse);
    });
});
