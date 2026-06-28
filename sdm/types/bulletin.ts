export const BULLETIN_RESOURCE_KINDS = ["image", "url"] as const;

export type BulletinResourceKind = (typeof BULLETIN_RESOURCE_KINDS)[number];
