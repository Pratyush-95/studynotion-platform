const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const { loginUser } = require("../helpers/testUser");
const {
    isLocked,
    isIpLocked,
    recordFailedAttempt,
    recordFailedIpAttempt,
    resetLoginAttempts,
    resetIpAttempts,
} = require("../../utils/loginRateLimiter");
const bcrypt = require("bcrypt");
const userMock = require("../mocks/userMock");
const mailSender = require("../../utils/mailSender");
const {
    isSecurityEmailSent,
    markSecurityEmailSent,
} = require("../../utils/securityEmailLimiter");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../utils/generateTokens");
const {
    updateLoginActivity,
} = require("../../utils/loginActivity");
const {
    clearSecurityEmailFlag,
} = require("../../utils/securityEmailLimiter");

// Mock User Model
jest.mock("../../models/User");
jest.mock("bcrypt");
jest.mock("../../utils/mailSender");
jest.mock("../../utils/loginRateLimiter", () => ({
    isLocked: jest.fn(),
    isIpLocked: jest.fn(),
    recordFailedAttempt: jest.fn(),
    recordFailedIpAttempt: jest.fn(),
    resetLoginAttempts: jest.fn(),
    resetIpAttempts: jest.fn(),
}));
jest.mock("../../utils/generateTokens", () => ({
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
}));
jest.mock("../../utils/loginActivity", () => ({
    updateLoginActivity: jest.fn(),
}));
jest.mock("../../utils/securityEmailLimiter", () => ({
    isSecurityEmailSent: jest.fn(),
    markSecurityEmailSent: jest.fn(),
    clearSecurityEmailFlag: jest.fn(),
}));

describe("Login API", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 401 if user is not registered", async () => {

        // Database me user nahi mila
        User.findOne.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null),
        });

        const res = await request(app)
            .post("/api/v1/auth/login")
            .send(loginUser);

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("User not registered with Us Please Sign Up to Continue");

    });


    test("should return 429 if account is locked", async () => {

    User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
            email: loginUser.email,
        }),
    });

    isLocked.mockResolvedValue({
        locked: true,
        ttl: 120,
    });

    const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginUser);

    expect(res.statusCode).toBe(429);
    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toContain("Too many failed login attempts");
});

test("should return 429 if IP address is locked", async () => {

    User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
            email: loginUser.email,
        }),
    });

    isLocked.mockResolvedValue({
        locked: false,
    });

    isIpLocked.mockResolvedValue({
        locked: true,
        ttl: 120,
    });

    const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginUser);

    expect(res.statusCode).toBe(429);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toContain("Too many failed login attempts from this IP Address");

});


test("should return 401 if password is incorrect", async () => {

    User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(userMock),
    });

    isLocked.mockResolvedValue({
        locked: false,
    });

    isIpLocked.mockResolvedValue({
        locked: false,
    });

    bcrypt.compare.mockResolvedValue(false);

    recordFailedAttempt.mockResolvedValue(1);

    recordFailedIpAttempt.mockResolvedValue(1);

    const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginUser);

    expect(res.statusCode).toBe(401);

    expect(res.body.success).toBe(false);

    expect(res.body.message).toBe("Invalid password");
});


test("should return warning after 6 failed login attempts", async () => {

    User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(userMock),
    });

    isLocked.mockResolvedValue({
        locked: false,
    });

    isIpLocked.mockResolvedValue({
        locked: false,
    });

    bcrypt.compare.mockResolvedValue(false);

    // 6th Attempt
    recordFailedAttempt.mockResolvedValue(6);
    recordFailedIpAttempt.mockResolvedValue(1);

    const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginUser);

    expect(res.statusCode).toBe(401);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Invalid password. Warning: 6/10 failed attempts.");

});

test("should lock account after 10 failed login attempts", async () => {

    User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(userMock),
    });

    isLocked.mockResolvedValue({
        locked: false,
    });

    isIpLocked.mockResolvedValue({
        locked: false,
    });

    bcrypt.compare.mockResolvedValue(false);

    // 10th Attempt
    recordFailedAttempt.mockResolvedValue(10);
    recordFailedIpAttempt.mockResolvedValue(1);

    isSecurityEmailSent.mockResolvedValue(false);

    mailSender.mockResolvedValue(true);

    markSecurityEmailSent.mockResolvedValue(true);

    const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginUser);

    expect(res.statusCode).toBe(429);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Too many failed login attempts. Your account has been locked for 10 minutes.");

     // Function Call Assertions
    expect(mailSender).toHaveBeenCalledTimes(1);
    expect(markSecurityEmailSent).toHaveBeenCalledTimes(1);

});


test("should return 403 if user account is inactive", async () => {

    User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
            ...userMock,
            active: false,
        }),
    });

    isLocked.mockResolvedValue({
        locked: false,
    });

    isIpLocked.mockResolvedValue({
        locked: false,
    });

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginUser);

    expect(res.statusCode).toBe(403);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe(
            "Your account has been deactivated by the administrator. Please contact support."
        );

});

test("should login successfully", async () => {

    const activeUser = {
        ...userMock,
        active: true,
        save: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(activeUser),
    });

    isLocked.mockResolvedValue({ locked: false });
    isIpLocked.mockResolvedValue({ locked: false });

    bcrypt.compare.mockResolvedValue(true);

    resetLoginAttempts.mockResolvedValue(true);
    resetIpAttempts.mockResolvedValue(true);

    clearSecurityEmailFlag.mockResolvedValue(true);

    updateLoginActivity.mockResolvedValue(true);

    generateAccessToken.mockReturnValue("access-token");
    generateRefreshToken.mockReturnValue("refresh-token");

    const res = await request(app)
        .post("/api/v1/auth/login")
        .send(loginUser);

    expect(res.statusCode).toBe(200);

    expect(res.body.success).toBe(true);

    expect(res.body.message).toBe("Login successful");

    expect(res.body.token).toBe("access-token");

    expect(activeUser.save).toHaveBeenCalledTimes(1);

    expect(resetLoginAttempts).toHaveBeenCalledTimes(1);

    expect(resetIpAttempts).toHaveBeenCalledTimes(1);

    expect(clearSecurityEmailFlag).toHaveBeenCalledTimes(1);

    expect(updateLoginActivity).toHaveBeenCalledTimes(1);

});

});