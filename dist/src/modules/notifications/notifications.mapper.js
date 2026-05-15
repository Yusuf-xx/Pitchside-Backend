"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapNotification = mapNotification;
function mapNotification(row) {
    return {
        id: row.id,
        type: row.type,
        title: row.title,
        body: row.body,
        createdAt: row.createdAt.toISOString(),
        read: row.read,
        readAt: row.readAt?.toISOString(),
        actionPath: row.actionPath ?? undefined,
    };
}
//# sourceMappingURL=notifications.mapper.js.map