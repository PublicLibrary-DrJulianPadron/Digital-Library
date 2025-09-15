import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Genre, GenreRequest } from '@/features/content-management/api/genresApiSlice';
import { mapGenreToFormValues } from '@/features/content-management/components/GenreForm/GenreFormConfig';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';

const formSchema = z.object({
  code: z.string().min(2, { message: "El código debe tener al menos 2 caracteres." }),
  label: z.string().min(2, { message: "La etiqueta debe tener al menos 2 caracteres." }),
  sala: z.string().min(1, { message: "La sala es requerida." }),
});

interface GenreFormProps {
  genre?: Genre | null;
  onSubmit: (data: GenreRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  salas: string[]; // Add a prop for the list of unique salas
}

export const GenreForm: React.FC<GenreFormProps> = ({ genre, onSubmit, onCancel, isSubmitting, salas }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: useMemo(() => mapGenreToFormValues(genre), [genre]),
  });

  const { reset } = form;

  // Only reset when the genre changes, using memoized values
  useEffect(() => {
    if (genre) {
      reset(mapGenreToFormValues(genre));
    }
  }, [genre, reset]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data as GenreRequest);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código del Género</FormLabel>
              <FormControl>
                <Input placeholder="Ej. FIC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiqueta del Género</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Ficción" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* New Field for Sala Selection */}
        <FormField
          control={form.control}
          name="sala"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una sala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {salas.map((sala) => (
                    <SelectItem key={sala} value={sala}>
                      {sala}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Género"}
          </Button>
        </div>
      </form>
    </Form>
  );
};