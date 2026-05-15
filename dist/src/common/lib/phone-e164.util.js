"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneE164Input = normalizePhoneE164Input;
function normalizePhoneE164Input(raw) {
    const t = raw.trim();
    if (!t)
        return null;
    const digits = t.replace(/[^\d+]/g, '');
    if (!digits)
        return null;
    let s = digits.startsWith('+') ? digits : `+${digits.replace(/^\+/, '')}`;
    if (s.length < 9 || s.length > 17)
        return null;
    if (!/^\+[1-9]\d{6,14}$/.test(s))
        return null;
    return s;
}
//# sourceMappingURL=phone-e164.util.js.map