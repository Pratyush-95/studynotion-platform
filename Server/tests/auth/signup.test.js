const request = require("supertest");
const app = require("../../app");

const bcrypt = require("bcrypt");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const {
    verifyOTP,
    deleteOTP,
} = require("../../utils/otpRedis");

const { validUser } = require("../helpers/testUser");

jest.mock("bcrypt");

jest.mock("../../models/User");
jest.mock("../../models/Profile");

jest.mock("../../utils/otpRedis", () => ({
    verifyOTP: jest.fn(),
    deleteOTP: jest.fn(),
}));

describe("Signup API", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 403 if required fields are missing", async () => {

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({
            firstName: "Pratyush",
            email: "test@gmail.com",
        });

    expect(res.statusCode).toBe(403);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("All fields are required");

});

test("should return 400 if passwords do not match", async () => {

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send({
            ...validUser,
            confirmPassword: "WrongPassword123",
        });

    expect(res.statusCode).toBe(400);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Passwords do not match");

});

test("should return 400 if user already exists", async () => {

    User.findOne.mockResolvedValue({
        email: validUser.email,
    });

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser);

    expect(res.statusCode).toBe(400);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("User already exists");

});

test("should return 400 if phone number is already registered", async () => {

    User.findOne.mockResolvedValue(null);

    Profile.find.mockResolvedValue([
        {
            contactNumber: "9876543210",
        },
    ]);

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser);

    expect(res.statusCode).toBe(400);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Phone number already registered with another account");

});

test("should return 400 if OTP is invalid", async () => {

    User.findOne.mockResolvedValue(null);

    Profile.find.mockResolvedValue([]);

    verifyOTP.mockResolvedValue(false);

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser);

    expect(res.statusCode).toBe(400);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Invalid or Expired OTP");

});

test("should return 500 if password hashing fails", async () => {

    User.findOne.mockResolvedValue(null);

    Profile.find.mockResolvedValue([]);

    verifyOTP.mockResolvedValue(true);

    bcrypt.hash.mockRejectedValue(
        new Error("Hash Error")
    );

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser);

    expect(res.statusCode).toBe(500);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Signup failed");

});

test("should return 500 if profile creation fails", async () => {

    User.findOne.mockResolvedValue(null);

    Profile.find.mockResolvedValue([]);

    verifyOTP.mockResolvedValue(true);

    bcrypt.hash.mockResolvedValue("hashedPassword");

    Profile.create.mockRejectedValue(
        new Error("Profile Error")
    );

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser);

    expect(res.statusCode).toBe(500);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Signup failed");

});

test("should return 500 if user creation fails", async () => {

    User.findOne.mockResolvedValue(null);

    Profile.find.mockResolvedValue([]);

    verifyOTP.mockResolvedValue(true);

    bcrypt.hash.mockResolvedValue("hashedPassword");

    Profile.create.mockResolvedValue({
        _id: "profile123",
    });

    User.create.mockRejectedValue(
        new Error("User Error")
    );

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser);

    expect(res.statusCode).toBe(500);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Signup failed");

});

test("should signup successfully", async () => {

    User.findOne.mockResolvedValue(null);

    Profile.find.mockResolvedValue([]);

    verifyOTP.mockResolvedValue(true);

    bcrypt.hash.mockResolvedValue("hashedPassword123");

    Profile.create.mockResolvedValue({
        _id: "profile123",
    });

    User.create.mockResolvedValue({
        _id: "user123",
        firstName: validUser.firstName,
        lastName: validUser.lastName,
        email: validUser.email,
        accountType: validUser.accountType,
        approved: true,
        approvalStatus: "Approved",
        additionalDetails: "profile123",
    });

    deleteOTP.mockResolvedValue(true);

    const res = await request(app)
        .post("/api/v1/auth/signup")
        .send(validUser);

    expect(res.statusCode).toBe(200);

    expect(res.body.success).toBe(true);

    expect(res.body.message)
        .toBe("Signup successful");

    expect(bcrypt.hash)
        .toHaveBeenCalledWith(validUser.password, 10);

    expect(Profile.create)
        .toHaveBeenCalledTimes(1);

    expect(User.create)
        .toHaveBeenCalledTimes(1);

    expect(deleteOTP)
        .toHaveBeenCalledWith(validUser.email);

});


});