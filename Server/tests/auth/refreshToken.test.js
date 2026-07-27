const request = require("supertest");
const app = require("../../app");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const userMock = require("../mocks/userMock");

const {
    generateAccessToken,
} = require("../../utils/generateTokens");

jest.mock("jsonwebtoken");
jest.mock("../../models/User");

jest.mock("../../utils/generateTokens", () => ({
    generateAccessToken: jest.fn(),
}));

describe("Refresh Token API", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 if refresh token is missing", async () => {

        const res = await request(app)
            .post("/api/v1/auth/refresh-token");

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("Refresh Token Missing");

    });

    test("should return 401 if refresh token is expired", async () => {

        jwt.verify.mockImplementation(() => {
            throw new Error("Token Expired");
        });

        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", "refreshToken=expired-token");

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("Refresh Token Expired");

    });

    test("should return 401 if user does not exist", async () => {

        jwt.verify.mockReturnValue({
            id: userMock._id,
        });

        User.findById.mockResolvedValue(null);

        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", "refreshToken=valid-token");

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("User not found");

    });

    test("should return 401 if refresh token does not match", async () => {

        jwt.verify.mockReturnValue({
            id: userMock._id,
        });

        User.findById.mockResolvedValue({
            ...userMock,
            refreshToken: "another-refresh-token",
        });

        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", "refreshToken=current-refresh-token");

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("Invalid Refresh Token");

    });

    test("should generate new access token successfully", async () => {

        jwt.verify.mockReturnValue({
            id: userMock._id,
        });

        User.findById.mockResolvedValue({
            ...userMock,
            refreshToken: "refresh-token",
        });

        generateAccessToken.mockReturnValue("new-access-token");

        const res = await request(app)
            .post("/api/v1/auth/refresh-token")
            .set("Cookie", "refreshToken=refresh-token");

        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);

        expect(res.body.token)
            .toBe("new-access-token");

        expect(res.body.message)
            .toBe("Access Token Refreshed");

        expect(generateAccessToken)
            .toHaveBeenCalledTimes(1);

    });

});
