export type AppRole = "admin" | "bibliotecario" | "usuario";
export type LoanState =
  | "PRESTADO"
  | "EN ESPERA DE DEVOLUCION"
  | "DEVUELTO"
  | "EXTRAVIADO";

export const AppRoleConstants = ["admin", "bibliotecario", "usuario"] as const;
export const LoanStateConstants = [
  "PRESTADO",
  "EN ESPERA DE DEVOLUCION",
  "DEVUELTO",
  "EXTRAVIADO",
] as const;

export enum MaterialType {
  Libro = "Libro",
  Revista = "Revista",
  Articulo = "Artículo",
  Tesis = "Tesis",
  Otro = "Otro",
}
export const MaterialTypeOptions = Object.values(MaterialType);

export enum LanguageCode {
  Spanish = "Español",
  English = "Inglés",
  French = "Francés",
  Portuguese = "Portugués",
  Italian = "Italiano",
  German = "Alemán",
  Other = "Otro", 
}
export const LanguageOptions = Object.values(LanguageCode);

export const GenreOptions: string[] = [
  'Realismo Mágico',
  'Novela Criollista',
  'Novela Histórica',
  'Ficción',
  'No Ficción',
  'Biografía',
  'Historia',
  'Ciencia',
  'Tecnología',
  'Arte',
  'Literatura Infantil',
  'Poesía',
  'Teatro',
  'Ensayo',
  'Filosofía',
  'Religión',
  'Autoayuda',
  'Cocina',
  'Viajes',
  'Deportes'
];
