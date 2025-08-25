export const MaterialTypeConstants = [
  "Libro",
  "Revista",
  "Artículo",
  "Tesis",
  "Otro",
] as const;

export type MaterialType = (typeof MaterialTypeConstants)[number];