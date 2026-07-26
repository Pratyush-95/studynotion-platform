const request = require("supertest");
const app = require("../../app");

const User = require("../../models/User");

const otpGenerator = require("otp-generator");
const mailSender = require("../../utils/mailSender");

const {
    saveOTP,
} = require("../../utils/otpRedis");

const {
    checkOtpCooldown,
    incrementOtpRequests,
    checkHourlyLimit,
    checkDailyLimit,
    checkIpOtpLimit,
    incrementIpOtpRequests,
} = require("../../utils/otpRateLimiter");

jest.mock("../../models/User");

jest.mock("otp-generator");

jest.mock("../../utils/mailSender");

jest.mock("../../utils/otpRedis", () => ({
    saveOTP: jest.fn(),
}));

jest.mock("../../utils/otpRateLimiter", () => ({
    checkOtpCooldown: jest.fn(),
    incrementOtpRequests: jest.fn(),
    checkHourlyLimit: jest.fn(),
    checkDailyLimit: jest.fn(),
    checkIpOtpLimit: jest.fn(),
    incrementIpOtpRequests: jest.fn(),
}));

describe("Send OTP API", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 400 if user already exists", async () => {

        User.findOne.mockResolvedValue({
            email: "test@gmail.com",
        });

        const res = await request(app)
            .post("/api/v1/auth/sendotp")
            .send({
                email: "test@gmail.com",
            });

        expect(res.statusCode).toBe(400);

        expect(res.body.success).toBe(false);

        expect(res.body.message)
            .toBe("User already registered");

    });

    test("should return 400 if OTP cooldown is active", async () => {

    User.findOne.mockResolvedValue(null);

    checkOtpCooldown.mockResolvedValue({
        blocked: true,
        ttl: 45,
    });

    const res = await request(app)
        .post("/api/v1/auth/sendotp")
        .send({
            email: "test@gmail.com",
        });

    expect(res.statusCode).toBe(400);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Please wait 45 seconds before requesting another OTP.");

});


test("should return 400 if OTP cooldown is active", async () => {

    User.findOne.mockResolvedValue(null);

    checkOtpCooldown.mockResolvedValue({
        blocked: true,
        ttl: 45,
    });

    const res = await request(app)
        .post("/api/v1/auth/sendotp")
        .send({
            email: "test@gmail.com",
        });

    expect(res.statusCode).toBe(400);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toBe("Please wait 45 seconds before requesting another OTP.");

});


test("should return 429 if hourly OTP limit is reached", async () => {

    User.findOne.mockResolvedValue(null);

    checkOtpCooldown.mockResolvedValue({
        blocked: false,
    });

    checkHourlyLimit.mockResolvedValue({
        blocked: true,
        ttl: 120,
    });

    const res = await request(app)
        .post("/api/v1/auth/sendotp")
        .send({
            email: "test@gmail.com",
        });

    expect(res.statusCode).toBe(429);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toContain("Too many OTP requests");

});


test("should return 429 if daily OTP limit is reached", async () => {

    User.findOne.mockResolvedValue(null);

    checkOtpCooldown.mockResolvedValue({
        blocked: false,
    });

    checkHourlyLimit.mockResolvedValue({
        blocked: false,
    });

    checkDailyLimit.mockResolvedValue({
        blocked: true,
        ttl: 7200, // 2 hours
    });

    const res = await request(app)
        .post("/api/v1/auth/sendotp")
        .send({
            email: "test@gmail.com",
        });

    expect(res.statusCode).toBe(429);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toContain("Too many OTP requests today");

});

test("should return 429 if IP OTP limit is reached", async () => {

    User.findOne.mockResolvedValue(null);

    checkOtpCooldown.mockResolvedValue({
        blocked: false,
    });

    checkHourlyLimit.mockResolvedValue({
        blocked: false,
    });

    checkDailyLimit.mockResolvedValue({
        blocked: false,
    });

    checkIpOtpLimit.mockResolvedValue({
        blocked: true,
        ttl: 120,
    });

    const res = await request(app)
        .post("/api/v1/auth/sendotp")
        .send({
            email: "test@gmail.com",
        });

    expect(res.statusCode).toBe(429);

    expect(res.body.success).toBe(false);

    expect(res.body.message)
        .toContain("Too many OTP requests from this IP address");

});

test("should send OTP successfully", async () => {

    User.findOne.mockResolvedValue(null);

    checkOtpCooldown.mockResolvedValue({
        blocked: false,
    });

    checkHourlyLimit.mockResolvedValue({
        blocked: false,
    });

    checkDailyLimit.mockResolvedValue({
        blocked: false,
    });

    checkIpOtpLimit.mockResolvedValue({
        blocked: false,
    });

    otpGenerator.generate.mockReturnValue("123456");

    saveOTP.mockResolvedValue(true);

    incrementOtpRequests.mockResolvedValue(true);

    incrementIpOtpRequests.mockResolvedValue(true);

    mailSender.mockResolvedValue(true);

    const res = await request(app)
        .post("/api/v1/auth/sendotp")
        .send({
            email: "test@gmail.com",
        });

    expect(res.statusCode).toBe(200);

    expect(res.body.success).toBe(true);

    expect(res.body.message)
        .toBe("OTP sent successfully");

    expect(otpGenerator.generate).toHaveBeenCalledTimes(1);

    expect(saveOTP).toHaveBeenCalledWith(
        "test@gmail.com",
        "123456"
    );

    expect(incrementOtpRequests).toHaveBeenCalledTimes(1);

    expect(incrementIpOtpRequests).toHaveBeenCalledTimes(1);

    expect(mailSender).toHaveBeenCalledTimes(1);

});


});