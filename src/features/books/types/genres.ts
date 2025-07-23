export const GenreOptions = [
  "Realismo Mágico",
  "Novela Criollista",
  "Novela Histórica",
  "Ficción",
  "No Ficción",
  "Biografía",
  "Historia",
  "Ciencia",
  "Tecnología",
  "Arte",
  "Literatura Infantil",
  "Poesía",
  "Teatro",
  "Ensayo",
  "Filosofía",
  "Religión",
  "Autoayuda",
  "Cocina",
  "Viajes",
  "Deportes",
] as const;

export type Genre = (typeof GenreOptions)[number];