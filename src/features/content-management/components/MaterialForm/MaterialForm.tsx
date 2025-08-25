import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X } from 'lucide-react';
import { MaterialType } from '@/features/content-management/api/materialTypesApiSlice';
import {
  MaterialTypeFormData,
  defaultMaterialTypeFormValues,
  mapMaterialTypeToFormValues
} from '@/features/content-management/components/MaterialForm/MaterialFormConfig';

interface MaterialFormProps {
  materialType?: MaterialType | null;
  onSubmit: (materialData: Omit<MaterialType, "id">) => void;
  onCancel: () => void;
  isUpdatingMaterial: boolean | null;
  isSubmitting: boolean;
}

export function MaterialForm({ materialType, onSubmit, onCancel, isUpdatingMaterial, isSubmitting }: MaterialFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<MaterialTypeFormData>({
    defaultValues: defaultMaterialTypeFormValues,
  });

  const onFormSubmit = async (data: MaterialTypeFormData) => {
    try {
      onSubmit(data as Omit<MaterialType, "id">);
    } catch (error) {
      toast({ title: 'Error', description: `Error al procesar el tipo de material.`, variant: 'destructive' });
    }
  };

  useEffect(() => {
    reset(mapMaterialTypeToFormValues(materialType));
  }, [materialType, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-biblioteca-blue">Información del Tipo de Material</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Tipo de Material *</Label>
            <Input
              id="name"
              {...register('name', { required: 'El nombre es requerido' })}
              className={errors.name ? 'border-red-500' : ''}
              placeholder="Ej. Libro"
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
          {isUpdatingMaterial ? 'Actualizar' : 'Guardar'} Tipo de Material
        </Button>
      </div>
    </form>
  );
}