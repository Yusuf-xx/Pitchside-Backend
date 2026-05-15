/** Keep in sync with `frontend/src/shared/lib/partner-interest.ts` */
export const PARTNER_INTEREST_SOURCES = [
  'WEB_FORM',
  'BOOK_PAGE',
  'TURF_DETAIL',
  'REFERRAL',
  'OTHER',
] as const;

export type PartnerInterestSource = (typeof PARTNER_INTEREST_SOURCES)[number];

export const PARTNER_INTEREST_SOURCE_LIST: string[] = [...PARTNER_INTEREST_SOURCES];

/** Pipeline stages for CRM / ops (not set by public intake; default NEW). */
export const PARTNER_INTEREST_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED', 'DECLINED'] as const;
