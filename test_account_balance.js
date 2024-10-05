const chai = require('chai');
const nock = require('nock');
const axios = require('axios');
const expect = chai.expect;

// Base URL of the fictional API
const BASE_URL = "http://localhost:5000/api/v1";

// Describing the test suite for account balance API
describe("View Account Balance API Tests", function () {

    // Clean up Nock interceptors after each test
    afterEach(() => {
        nock.cleanAll();
    });

    // Test case for retrieving account balance with a valid token
    it("should successfully retrieve the account balance with a valid token", async function () {
        const mockResponse = {
            balance: 1000.50
        };

        nock("http://localhost:5000")
            .get('/api/v1/accounts/12345/balance')
            .reply(200, mockResponse);

        const headers = { Authorization: "Bearer valid_token" };

        const response = await axios.get(`${BASE_URL}/accounts/12345/balance`, { headers });

        expect(response.status).to.equal(200);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for failure due to invalid token
    it("should fail to retrieve the account balance with an invalid token", async function () {
        const mockResponse = {
            error: "Invalid token"
        };

        nock("http://localhost:5000")
            .get('/api/v1/accounts/12345/balance')
            .reply(401, mockResponse);

        const headers = { Authorization: "Bearer invalid_token" };

        const response = await axios.get(`${BASE_URL}/accounts/12345/balance`, { headers });

        expect(response.status).to.equal(401);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for access to another user's account balance
    it("should deny access to another user's account balance", async function () {
        const mockResponse = {
            error: "Access denied"
        };

        nock("http://localhost:5000")
            .get('/api/v1/accounts/12345/balance')
            .reply(403, mockResponse);

        const headers = { Authorization: "Bearer valid_token_for_different_user" };

        const response = await axios.get(`${BASE_URL}/accounts/12345/balance`, { headers });

        expect(response.status).to.equal(403);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for accessing a non-existing account
    it("should fail to retrieve account balance for a non-existing account", async function () {
        const mockResponse = {
            error: "Account not found"
        };

        nock("http://localhost:5000")
            .get('/api/v1/accounts/99999/balance')
            .reply(404, mockResponse);

        const headers = { Authorization: "Bearer valid_token" };

        const response = await axios.get(`${BASE_URL}/accounts/99999/balance`, { headers });

        expect(response.status).to.equal(404);
        expect(response.data).to.deep.equal(mockResponse);
    });
});
