const chai = require('chai');
const nock = require('nock');
const axios = require('axios');
const expect = chai.expect;

// Base URL of the fictional API
const BASE_URL = "http://localhost:5000/api/v1/users/login";

// Describing the test suite for user login API
describe("User Login API Tests", function () {

    // Clean up Nock interceptors after each test
    afterEach(() => {
        nock.cleanAll();
    });

    // Test case for successful login
    it("should successfully login with valid credentials", async function () {
        const mockResponse = {
            message: "Bearer eyJowiwnbwcibyuYtt78786667987rfghhjHtutdRdr6EDFFFffagahahaq"
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/login')
            .reply(200, mockResponse);

        const data = {
            username: "testUser",
            password: "testPassword"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(200);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for incorrect username
    it("should fail to login with incorrect username", async function () {
        const mockResponse = {
            error: "Invalid credentials"
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/login')
            .reply(401, mockResponse);

        const data = {
            username: "invalidUser",
            password: "testPassword"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(401);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for incorrect password
    it("should fail to login with incorrect password", async function () {
        const mockResponse = {
            error: "Invalid credentials"
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/login')
            .reply(401, mockResponse);

        const data = {
            username: "testUser",
            password: "wrongPassword"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(401);
        expect(response.data).to.deep.equal(mockResponse);
    });

    // Test case for missing password
    it("should fail to login when password is missing", async function () {
        const mockResponse = {
            error: "Password field missing"
        };

        nock("http://localhost:5000")
            .post('/api/v1/users/login')
            .reply(400, mockResponse);

        const data = {
            username: "testUser"
        };

        const response = await axios.post(BASE_URL, data);

        expect(response.status).to.equal(400);
        expect(response.data).to.deep.equal(mockResponse);
    });
});
