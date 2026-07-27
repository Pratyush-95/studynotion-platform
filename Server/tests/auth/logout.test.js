const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { updateLogoutActivity } = require("../../utils/loginActivity");

jest.mock("../../models/User");
jest.mock("jsonwebtoken");

jest.mock("../../utils/loginActivity", () => ({
    updateLogoutActivity: jest.fn(),
}));

describe("Logout API", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 if token is missing", async () => {

        const res = await request(app)
            .post("/api/v1/auth/logout");

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message).toBe("Token Missing");

    });

    test("should return 401 if token is invalid", async () => {

        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid Token");
        });

        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Authorization", "Bearer invalid-token");

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("Token is invalid or expired");

    });

    test("should return 401 if user does not exist", async () => {

        jwt.verify.mockReturnValue({
            id: "123456789",
            email: "demo@gmail.com",
        });

        User.findById.mockResolvedValue(null);

        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Authorization", "Bearer valid-token");

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("User not found");

    });

    test("should logout successfully", async () => {

        const mockUser = {
            _id: "123456",
            refreshToken: "refresh-token",
            save: jest.fn().mockResolvedValue(true),
        };

        jwt.verify.mockReturnValue({
            id: mockUser._id,
            email: "demo@gmail.com",
        });

         User.findById
        .mockResolvedValueOnce(mockUser) // auth middleware
        .mockResolvedValueOnce(mockUser); // logout controller


        updateLogoutActivity.mockResolvedValue(true);

        const res = await request(app)
            .post("/api/v1/auth/logout")
            .set("Authorization", "Bearer valid-token");

        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);

        expect(res.body.message)
            .toBe("Logged out successfully.");

        expect(mockUser.refreshToken).toBeNull();

        expect(mockUser.save)
            .toHaveBeenCalledTimes(1);

        expect(updateLogoutActivity)
            .toHaveBeenCalledTimes(1);

    });

});