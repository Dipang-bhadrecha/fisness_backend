"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPSms = sendOTPSms;
exports.verifyOTPSms = verifyOTPSms;
exports.verifySmsService = verifySmsService;
const twilio_1 = __importDefault(require("twilio"));
const client = () => (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const SID = process.env.TWILIO_VERIFY_SERVICE_SID;
// Normalize Indian phone to E.164: digits only, then +91 + last 10 digits
function normalizePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    const ten = digits.length >= 10 ? digits.slice(-10) : digits;
    return `+91${ten}`;
}
// Called in requestOTP — sends OTP via Twilio
async function sendOTPSms(phone) {
    const to = normalizePhone(phone);
    await client().verify.v2.services(SID).verifications.create({
        to,
        channel: 'sms',
    });
    console.log(`📱 OTP sent via Twilio to ${to}`);
}
// Called in verifyOTP — checks code with Twilio
async function verifyOTPSms(phone, code) {
    const to = normalizePhone(phone);
    const codeTrimmed = String(code).trim().replace(/\s/g, '');
    // Dev bypass: accept test OTP 123456 for any phone when not in production
    if (process.env.NODE_ENV !== 'production' && codeTrimmed === '123456') {
        console.log(`🔓 Dev bypass: accepting test OTP for ${to}`);
        return true;
    }
    try {
        const result = await client().verify.v2.services(SID).verificationChecks.create({
            to,
            code: codeTrimmed,
        });
        console.log(`📱 Twilio verify result for ${to}: status=${result.status}`);
        return result.status === 'approved';
    }
    catch (err) {
        console.log(`📱 Twilio verify error for ${to}:`, err?.code ?? err?.status, err?.message);
        // Twilio returns 404 when code is invalid/expired — treat as verification failed
        if (err?.code === 404 || err?.status === 404)
            return false;
        throw err;
    }
}
async function verifySmsService() {
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
        throw new Error('Missing Twilio env vars');
    }
    console.log('📱 Twilio Verify SMS service ready');
}
//# sourceMappingURL=sms.service.js.map