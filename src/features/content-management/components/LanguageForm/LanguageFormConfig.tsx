import { z } from 'zod';

export const LanguageSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, { message: 'Language name must not be empty.' }),
});

export type Language = z.infer<typeof LanguageSchema>;

export const defaultLanguageFormValues = {
  name: '',
};

/**
 * Maps a Language model object to the format expected by the LanguageForm.
 * This is useful for editing existing language entries.
 * @param {Language | null | undefined} language - The Language model object to map.
 * @returns {typeof defaultLanguageFormValues} The formatted object for form reset.
 */
export const mapLanguageToFormValues = (language: Language | null | undefined) => {
  if (!language) {
    return defaultLanguageFormValues;
  }

  return {
    name: language.name ?? '',
  };
};

export type LanguageFormData = typeof defaultLanguageFormValues;