// src/features/content-management/api/genresApiSlice.ts 
import { Genre } from '@/features/content-management/api/genresApiSlice';

// Correcting the default form values to match the Genre type structure
export const defaultGenreFormValues = {
  code: '',
  label: '',
  sala: '',
};

/**
 * Maps a Genre model object to the format expected by the GenreForm.
 * @param {Genre | null | undefined} genre - The Genre model object to map.
 * @returns {typeof defaultGenreFormValues} The formatted object for form reset.
 */
export const mapGenreToFormValues = (genre: Genre | null | undefined) => {
  if (!genre) {
    return defaultGenreFormValues;
  }

  return {
    code: genre.code ?? '',
    label: genre.label ?? '',
    sala: genre.sala ?? '',
  };
};

export type GenreFormData = typeof defaultGenreFormValues;