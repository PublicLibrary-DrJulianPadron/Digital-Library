// src/features/books/components/GenreForm/GenreForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/common/components/ui/form';
import { Input } from '@/common/components/ui/input';
import { Button } from '@/common/components/ui/button';
import { Genre, GenreRequest } from '@/features/content-management/api/genresApiSlice';

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre del género debe tener al menos 2 caracteres." }),
});

interface GenreFormProps {
  genre?: Genre | null;
  onSubmit: (data: GenreRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const GenreForm: React.FC<GenreFormProps> = ({ genre, onSubmit, onCancel, isSubmitting }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: genre?.name || "",
    },
  });

  const handleSubmit = (data: GenreRequest) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Género</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Ficción" {...field} />
              </FormControl>
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