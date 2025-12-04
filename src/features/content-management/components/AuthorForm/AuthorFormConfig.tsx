import { z } from 'zod';

export const AuthorSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, { message: 'Author name must not be empty.' }),
});

export type Author = z.infer<typeof AuthorSchema>;

export const defaultAuthorFormValues = {
  name: '',
};

/**
 * Maps an Author model object to the format expected by the AuthorForm.
 * This is useful for editing existing author entries.
 * @param {Author | null | undefined} author - The Author model object to map.
 * @returns {typeof defaultAuthorFormValues} The formatted object for form reset.
 */
export const mapAuthorToFormValues = (author: Author | null | undefined) => {
  if (!author) {
    return defaultAuthorFormValues;
  }

  return {
    name: author.name ?? '',
  };
};

export type AuthorFormData = typeof defaultAuthorFormValues;