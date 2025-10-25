// src/features/languages/components/LanguageForm/LanguageForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X } from 'lucide-react';
import {
  Language
} from '@/features/content-management/api/languagesApiSlice';
import {
  LanguageFormData,
  defaultLanguageFormValues,
  mapLanguageToFormValues
} from '@/features/content-management/components/LanguageForm/LanguageFormConfig';

interface LanguageFormProps {
  language?: Language | null;
  onSubmit: (languageData: Omit<Language, "id">) => void;
  onCancel: () => void;
  isUpdatingLanguage: boolean | null;
  isSubmitting: boolean;
}

export function LanguageForm({ language, onSubmit, onCancel, isUpdatingLanguage, isSubmitting }: LanguageFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LanguageFormData>({
    defaultValues: defaultLanguageFormValues,
  });

  const onFormSubmit = async (data: LanguageFormData) => {
    try {
      onSubmit(data as Omit<Language, "id">);
    } catch (error) {
      toast({ title: 'Error', description: `Error al procesar el idioma.`, variant: 'destructive' });
    }
  };

  useEffect(() => {
    reset(mapLanguageToFormValues(language));
  }, [language, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Idioma *</Label>
            <Input
              id="name"
              {...register('name', { required: 'El nombre es requerido' })}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Ej. Español"
            />
            {errors.name?.message && (
              <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-biblioteca-blue text-biblioteca-blue hover:bg-biblioteca-blue hover:text-white"
          disabled={isSubmitting}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white"
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdatingLanguage ? 'Actualizar' : 'Guardar'} Idioma
        </Button>
      </div>
    </form>
  );
}
