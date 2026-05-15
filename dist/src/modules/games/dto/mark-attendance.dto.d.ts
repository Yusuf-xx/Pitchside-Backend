declare class AttendanceEntryDto {
    userId: string;
    attended: boolean;
}
export declare class MarkAttendanceDto {
    entries: AttendanceEntryDto[];
}
export {};
