const chai = require('chai');
const nock = require('nock');
const axios = require('axios');
const expect = chai.expect;

// Base URL of the fictional API
const BASE_URL = "http://localhost:5000/api/v1/accounts/transfer";

// Describing the test suite for fund transfer API
describe("Fund Transfer API Tests", function () {

    // Clean up Nock interceptors after each test
    afterEach(() => {
        nock.cleanAll();
    });

    // Test case for successful fund transfer
    it("should successfully transfer funds between valid accounts with sufficient balance", async function () {
        const mockResponse = {
            message: "Transfer successful"
        };

        nock("http://localhost:5000")
            .post('/api/v1/accounts/transfer')
            .reply(200, mockResponse);

        const data = {
            from_account_id: 12345,
            to_account_id: 67890,
            amount: 100.50
        };

        const headers = { Authorization: "Bearer valid_token" };

        const response = await axios.post(BASE_URL, data, { headers });

        expect(response.status).to.equal(200);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for transfer failure due to insufficient funds
    it("should fail to transfer funds due to insufficient balance", async function () {
        const mockResponse = {
            message: "Insufficient funds"
        };

        nock("http://localhost:5000")
            .post('/api/v1/accounts/transfer')
            .reply(400, mockResponse);

        const data = {
            from_account_id: 12345,
            to_account_id: 67890,
            amount: 1000.00
        };

        const headers = { Authorization: "Bearer valid_token" };

        const response = await axios.post(BASE_URL, data, { headers });

        expect(response.status).to.equal(400);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for unauthorized access due to missing token
    it("should fail to transfer funds due to unauthorized access (missing token)", async function () {
        const mockResponse = {
            message: "Authorization required"
        };

        nock("http://localhost:5000")
            .post('/api/v1/accounts/transfer')
            .reply(401, mockResponse);

        const data = {
            from_account_id: 12345,
            to_account_id: 67890,
            amount: 100.50
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(401);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for transfer attempt with a non-existent account
    it("should fail to transfer funds due to non-existent from account", async function () {
        const mockResponse = {
            message: "Account not found"
        };

        nock("http://localhost:5000")
            .post('/api/v1/accounts/transfer')
            .reply(404, mockResponse);

        const data = {
            from_account_id: 99999,
            to_account_id: 67890,
            amount: 50.00
        };

        const headers = { Authorization: "Bearer valid_token" };

        const response = await axios.post(BASE_URL, data, { headers });

        expect(response.status).to.equal(404);
        expect(response.data).to.deep.equal(mockResponse);
    });
});
