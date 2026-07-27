const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Change Password API", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 if token is missing", async () => {

        const res = await request(app)
            .post("/api/v1/auth/changepassword");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Token Missing");

    });

    test("should return 404 if user not found", async () => {

        jwt.verify.mockReturnValue({
            id: "123456",
            email: "test@gmail.com",
        });

        User.findById
            .mockResolvedValueOnce({
                _id: "123456",
            }) // auth middleware
            .mockResolvedValueOnce(null); // controller

        const res = await request(app)
            .post("/api/v1/auth/changepassword")
            .set("Authorization", "Bearer valid-token")
            .send({
                oldPassword: "Old123",
                newPassword: "New123",
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("User not found");

    });

    test("should return 400 if required fields are missing", async () => {

        const mockUser = {
            _id: "123456",
        };

        jwt.verify.mockReturnValue({
            id: mockUser._id,
            email: "test@gmail.com",
        });

        User.findById
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockUser);

        const res = await request(app)
            .post("/api/v1/auth/changepassword")
            .set("Authorization", "Bearer valid-token")
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("All fields are required");

    });

    test("should return 401 if old password is incorrect", async () => {

        const mockUser = {
            _id: "123456",
            password: "hashed-password",
        };

        jwt.verify.mockReturnValue({
            id: mockUser._id,
            email: "test@gmail.com",
        });

        User.findById
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockUser);

        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
            .post("/api/v1/auth/changepassword")
            .set("Authorization", "Bearer valid-token")
            .send({
                oldPassword: "wrong-password",
                newPassword: "new-password",
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Incorrect old password");

    });

    test("should change password successfully", async () => {

        const mockUser = {
            _id: "123456",
            password: "hashed-password",
        };

        jwt.verify.mockReturnValue({
            id: mockUser._id,
            email: "test@gmail.com",
        });

        User.findById
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockUser);

        bcrypt.compare.mockResolvedValue(true);

        bcrypt.hash.mockResolvedValue("new-hashed-password");

        User.findByIdAndUpdate.mockResolvedValue(true);

        const res = await request(app)
            .post("/api/v1/auth/changepassword")
            .set("Authorization", "Bearer valid-token")
            .send({
                oldPassword: "old-password",
                newPassword: "new-password",
            });

        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);

        expect(res.body.message)
            .toBe("Password updated successfully");

        expect(bcrypt.hash)
            .toHaveBeenCalledTimes(1);

        expect(User.findByIdAndUpdate)
            .toHaveBeenCalledTimes(1);

    });

});