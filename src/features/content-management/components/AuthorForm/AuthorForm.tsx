// src/features/content-management/components/AuthorForm/AuthorForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X } from 'lucide-react';
import {
  Author
} from '@/features/content-management/api/authorsApiSlice'; // This import needs to be adjusted based on the actual API slice for authors
import {
  AuthorFormData,
  defaultAuthorFormValues,
  mapAuthorToFormValues
} from '@/features/content-management/components/AuthorForm/AuthorFormConfig';

interface AuthorFormProps {
  author?: Author | null;
  onSubmit: (authorData: Omit<Author, "id">) => void;
  onCancel: () => void;
  isUpdatingAuthor: boolean | null;
  isSubmitting: boolean;
}

export function AuthorForm({ author, onSubmit, onCancel, isUpdatingAuthor, isSubmitting }: AuthorFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthorFormData>({
    defaultValues: defaultAuthorFormValues,
  });

  const onFormSubmit = async (data: AuthorFormData) => {
    try {
      onSubmit(data as Omit<Author, "id">);
    } catch (error) {
      toast({ title: 'Error', description: `Error al procesar el autor.`, variant: 'destructive' });
    }
  };

  useEffect(() => {
    reset(mapAuthorToFormValues(author));
  }, [author, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Autor *</Label>
            <Input
              id="name"
              {...register('name', { required: 'El nombre es requerido' })}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Ej. Gabriel García Márquez"
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
          {isUpdatingAuthor ? 'Actualizar' : 'Guardar'} Autor
        </Button>
      </div>
    </form>
  );
}