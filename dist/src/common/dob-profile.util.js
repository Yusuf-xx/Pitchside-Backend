"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLocalYmd = parseLocalYmd;
exports.startOfLocalDay = startOfLocalDay;
exports.fullYearsBetween = fullYearsBetween;
exports.latestDobForMinAge = latestDobForMinAge;
exports.validateProfileDobYmd = validateProfileDobYmd;
exports.profileDobErrorMessage = profileDobErrorMessage;
exports.formatLocalYmd = formatLocalYmd;
exports.profileDobInputBounds = profileDobInputBounds;
const YMD = /^(\d{4})-(\d{2})-(\d{2})$/;
function parseLocalYmd(ymd) {
    const m = YMD.exec(ymd.trim());
    if (!m)
        return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    const dt = new Date(y, mo - 1, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d)
        return null;
    return dt;
}
function startOfLocalDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function fullYearsBetween(dob, ref) {
    let age = ref.getFullYear() - dob.getFullYear();
    const dm = ref.getMonth() - dob.getMonth();
    if (dm < 0 || (dm === 0 && ref.getDate() < dob.getDate()))
        age -= 1;
    return age;
}
function latestDobForMinAge(minAge, ref) {
    let d = new Date(ref.getFullYear() - minAge, ref.getMonth(), ref.getDate());
    while (fullYearsBetween(d, ref) < minAge) {
        d.setDate(d.getDate() - 1);
    }
    return startOfLocalDay(d);
}
const MIN_AGE = 13;
const MAX_AGE = 120;
function validateProfileDobYmd(dobIso, now = new Date()) {
    const dob = parseLocalYmd(dobIso);
    if (!dob)
        return 'INVALID_DATE';
    const today = startOfLocalDay(now);
    if (dob.getTime() >= today.getTime())
        return 'DOB_NOT_BEFORE_TODAY';
    const age = fullYearsBetween(dob, now);
    if (age < MIN_AGE)
        return 'TOO_YOUNG';
    if (age > MAX_AGE)
        return 'TOO_OLD';
    return null;
}
function profileDobErrorMessage(code) {
    switch (code) {
        case 'INVALID_DATE':
            return 'Enter a valid date of birth.';
        case 'DOB_NOT_BEFORE_TODAY':
            return 'Date of birth must be before today.';
        case 'TOO_YOUNG':
            return `You must be at least ${MIN_AGE} years old.`;
        case 'TOO_OLD':
            return 'Please enter a realistic date of birth.';
        default:
            return 'Invalid date of birth.';
    }
}
function formatLocalYmd(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
function profileDobInputBounds(now = new Date()) {
    const today = startOfLocalDay(now);
    const oldest = new Date(today);
    oldest.setFullYear(oldest.getFullYear() - MAX_AGE);
    const latest = latestDobForMinAge(MIN_AGE, now);
    return { min: formatLocalYmd(oldest), max: formatLocalYmd(latest) };
}
//# sourceMappingURL=dob-profile.util.js.map