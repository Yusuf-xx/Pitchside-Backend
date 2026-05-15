declare const GENDERS: readonly ["MAN", "WOMAN", "NON_BINARY", "UNSPECIFIED"];
export declare class UpdateProfilePrivacyDto {
    gender?: (typeof GENDERS)[number];
    showWomenOnlyGames?: boolean;
}
export {};
