"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEGATIVE_FEEDBACK_TAG_KEYS = exports.POSITIVE_FEEDBACK_TAG_KEYS = void 0;
exports.isAllowedFeedbackTagKey = isAllowedFeedbackTagKey;
exports.POSITIVE_FEEDBACK_TAG_KEYS = [
    'GREAT_ENERGY',
    'CLINICAL_FINISHER',
    'SOLID_DEFENDER',
    'SAFE_HANDS_GK',
    'ALWAYS_RUNNING',
    'TEAM_PLAYER',
    'ALWAYS_ON_TIME',
];
exports.NEGATIVE_FEEDBACK_TAG_KEYS = [
    'BALL_HOG',
    'LATE_ARRIVAL',
    'UNSPORTING_ATTITUDE',
    'LOW_EFFORT',
];
function isAllowedFeedbackTagKey(key, isPositive) {
    const k = key.trim().toUpperCase();
    if (isPositive) {
        return exports.POSITIVE_FEEDBACK_TAG_KEYS.includes(k);
    }
    return exports.NEGATIVE_FEEDBACK_TAG_KEYS.includes(k);
}
//# sourceMappingURL=feedback-tag-keys.js.map