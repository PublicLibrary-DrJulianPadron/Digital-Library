import { z } from 'zod';
import { MaterialType } from '@/features/content-management/api/materialTypesApiSlice';

export const MaterialTypeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, { message: 'Material Type name must not be empty.' }),
});

export type MaterialTypeData = z.infer<typeof MaterialTypeSchema>;

export const defaultMaterialTypeFormValues = {
  name: '',
};

/**
 * Maps a MaterialType model object to the format expected by the MaterialForm.
 * This is useful for editing existing material type entries.
 * @param {MaterialType | null | undefined} materialType - The MaterialType model object to map.
 * @returns {typeof defaultMaterialTypeFormValues} The formatted object for form reset.
 */
export const mapMaterialTypeToFormValues = (materialType: MaterialType | null | undefined) => {
  if (!materialType) {
    return defaultMaterialTypeFormValues;
  }

  return {
    name: materialType.name ?? '',
  };
};

export type MaterialTypeFormData = typeof defaultMaterialTypeFormValues;