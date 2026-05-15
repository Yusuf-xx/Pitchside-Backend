"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapBooking = mapBooking;
function mapBooking(row) {
    const raw = row.slotStartsJson;
    const slots = Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : [];
    return {
        id: row.id,
        turfId: row.turfId,
        turfName: row.turf.name,
        gameMode: row.gameMode,
        date: row.bookingDate,
        slots,
        totalInr: row.totalInr,
        splitPayment: row.splitPayment,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
    };
}
//# sourceMappingURL=bookings.mapper.js.map