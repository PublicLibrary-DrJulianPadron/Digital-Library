import { MaterialType } from "@/features/books/types/material-types";
import { LanguageCode } from "@/features/books/types/language-codes";
import { Genre } from "@/features/books/types/genres";

export interface Book {
  id?: string;
  title?: string;
  author?: string;
  isbn?: string | null;
  publicationYear?: number | null;
  quantityInStock?: number;
  materialType?: MaterialType;
  genre?: Genre;
  publisher?: string;
  availableCopies?: number;
  description?: string;
  coverUrl?: string;
  language?: LanguageCode;
  pages?: number;
  location?: string;
}

export type BookRow = Book & {
  created_at?: string | Date; 
  updated_at?: string | Date; 
};

export type BookInsert = Partial<Book>;

export type BookUpdate = Partial<Book>;