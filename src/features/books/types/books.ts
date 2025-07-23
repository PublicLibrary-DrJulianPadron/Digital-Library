import { MaterialType, LanguageCode } from "@/common/common/enums";

export interface Book {
  id?: string;
  title?: string;
  author?: string;
  isbn?: string | null;
  publicationYear?: number | null;
  quantityInStock?: number;
  materialType?: MaterialType;
  genre?: string;
  publisher?: string;
  availableCopies?: number;
  description?: string;
  coverUrl?: string;
  language?: LanguageCode;
  pages?: number;
  location?: string;
}

export type BookRow = Book & {
  id: string;
  created_at?: string | Date; 
  updated_at?: string | Date; 
};

export type BookInsert = Partial<Book>;

export type BookUpdate = Partial<Book>;