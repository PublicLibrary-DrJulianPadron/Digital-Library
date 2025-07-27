export const LanguageCodeConstants = [
  "Español",
  "Inglés",
  "Francés",
  "Portugués",
  "Italiano",
  "Alemán",
  "Otro",
] as const;

export type LanguageCode = (typeof LanguageCodeConstants)[number];