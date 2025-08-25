import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X, Upload } from 'lucide-react';
import { MaterialType, MaterialTypeConstants } from '@/features/books/types/material-types';
import { LanguageCodeConstants } from '@/features/books/types/language-codes';
import { GenreOptions } from '@/features/books/types/genres';
import { mapBookToFormValues, BookFormData } from '@/features/books/components/BookForm/BookFormConfig';
import type { BooksList, Book } from '@/features/books/api/booksApiSlice';


interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: Omit<Book, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

export function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm<BookFormData>({
    defaultValues: mapBookToFormValues(book)
  });
  const watchedCoverUrl = watch('cover_url');
  const watchedAvailableCopies = watch('available_copies');
  const watchedQuantityInStock = watch('quantity_in_stock');

  const addBookMutation = useMutation({
    mutationFn: async (newBookData: BookFormData) => {
      const { data, error } = await supabase.from('libros').insert([{
        ...newBookData,
        publication_date: newBookData.publication_date ? Number(newBookData.publication_date) : undefined,
        pages: newBookData.pages ? Number(newBookData.pages) : undefined,
        quantity_in_stock: Number(newBookData.quantity_in_stock),
        available_copies: Number(newBookData.available_copies),
        material_type: newBookData.material_type as MaterialType,
      } as Partial<Book>]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      toast({ title: 'Éxito', description: 'Libro agregado correctamente.' });
      if (data && data.length > 0) {
        const newBookRow = data[0] as BooksList;
        const { id, created_at, updated_at, ...bookDataWithoutIdTimestamps } = newBookRow;
        onSubmit(bookDataWithoutIdTimestamps);
      } else {
        onSubmit({} as Omit<BooksList, "id" | "created_at" | "updated_at">);
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Error al agregar libro: ${error.message}`, variant: 'destructive' });
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: async (updatedBookData: BookFormData & { id: string }) => {
      const { data, error } = await supabase.from('libros').update({
        ...updatedBookData,
        publication_date: updatedBookData.publication_date ? Number(updatedBookData.publication_date) : undefined,
        pages: updatedBookData.pages ? Number(updatedBookData.pages) : undefined,
        quantity_in_stock: Number(updatedBookData.quantity_in_stock),
        available_copies: Number(updatedBookData.available_copies),
        material_type: updatedBookData.material_type as MaterialType,
      } as Partial<Book>).eq('id', updatedBookData.id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      toast({ title: 'Éxito', description: 'Libro actualizado correctamente.' });
      if (data && data.length > 0) {
        const updatedBookRow = data[0] as BooksList;
        const { id, created_at, updated_at, ...bookDataWithoutIdTimestamps } = updatedBookRow;
        onSubmit(bookDataWithoutIdTimestamps);
      } else {
        onSubmit({} as Omit<BooksList, "id" | "created_at" | "updated_at">);
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Error al actualizar libro: ${error.message}`, variant: 'destructive' });
    },
  });

  const onFormSubmit = (data: BookFormData) => {
    if (book && book.id) {
      updateBookMutation.mutate({ ...data, id: book.id });
    } else {
      addBookMutation.mutate(data);
    }
  };

  useEffect(() => {
    reset(mapBookToFormValues(book));
  }, [book, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cover Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-biblioteca-blue">
                Portada del Libro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                {watchedCoverUrl ? (
                  <img
                    src={watchedCoverUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Upload className="w-12 h-12" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover_url">URL de la Portada</Label>
                <Input
                  id="cover_url"
                  {...register('cover_url')}
                  placeholder="https://ejemplo.com/portada.jpg"
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-biblioteca-blue">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Nombre (Título) *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'El título es requerido' })}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title?.message && (
                    <p className="text-red-500 text-sm">{String(errors.title.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Autor</Label>
                  <Input
                    id="author"
                    {...register('author')}
                    className={errors.author ? 'border-red-500' : ''}
                  />
                  {errors.author?.message && (
                    <p className="text-red-500 text-sm">{String(errors.author.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    {...register('isbn')}
                    placeholder="978-0-123456-78-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material_type">Tipo de Material</Label>
                  <Controller
                    name="material_type"
                    control={control}
                    defaultValue={book?.material_type || MaterialTypeConstants[0]}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.material_type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {MaterialTypeConstants.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.material_type?.message && (
                    <p className="text-red-500 text-sm">{String(errors.material_type.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre_names">Género (s)</Label>
                  {/* NOTE: You should use a multi-select component here for genre_names to align with the string[] type. */}
                  {/* The current implementation is a single select for demonstration. */}
                  <Controller
                    name="genre_names"
                    control={control}
                    defaultValue={book?.genre_names || []}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange([value])} // Cast to array for single select
                        defaultValue={field.value[0]}
                      >
                        <SelectTrigger className={errors.genre_names ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          {GenreOptions.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.genre_names?.message && (
                    <p className="text-red-500 text-sm">{String(errors.genre_names.message)}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                  placeholder="Breve descripción del libro..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Publication Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-biblioteca-blue">Detalles de Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Editorial</Label>
                  <Input
                    id="publisher"
                    {...register('publisher')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publication_date">Año de Publicación</Label>
                  <Input
                    id="publication_date"
                    type="number"
                    min="1000"
                    max={new Date().getFullYear()}
                    {...register('publication_date', {
                      valueAsNumber: true,
                      validate: value => value === null || (value >= 1000 && value <= new Date().getFullYear()) || "Año de publicación inválido"
                    })}
                    className={errors.publication_date ? 'border-red-500' : ''}
                  />
                  {errors.publication_date?.message && (
                    <p className="text-red-500 text-sm">{String(errors.publication_date.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Controller
                    name="language"
                    control={control}
                    defaultValue={book?.language || LanguageCodeConstants[0]}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          {LanguageCodeConstants.map((language) => (
                            <SelectItem key={language} value={language}>
                              {language}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.language && (
                    <p className="text-red-500 text-sm">{errors.language.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Número de Páginas</Label>
                  <Input
                    id="pages"
                    type="number"
                    min="1"
                    {...register('pages', { valueAsNumber: true })}
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-biblioteca-blue">Inventario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity_in_stock">Total de Ejemplares</Label>
                  <Input
                    id="quantity_in_stock"
                    type="number"
                    readOnly={true} // Marked as read-only to match the Book type
                    {...register('quantity_in_stock', {
                      valueAsNumber: true,
                    })}
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="available_copies">Ejemplares Disponibles</Label>
                  <Input
                    id="available_copies"
                    type="number"
                    min="0"
                    {...register('available_copies', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'La cantidad disponible no puede ser negativa' },
                      validate: (value) =>
                        value <= watchedQuantityInStock || 'Los ejemplares disponibles no pueden ser más que el total'
                    })}
                    className={errors.available_copies ? 'border-red-500' : ''}
                  />
                  {errors.available_copies?.message && (
                    <p className="text-red-500 text-sm">{String(errors.available_copies.message)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-biblioteca-blue text-biblioteca-blue hover:bg-biblioteca-blue hover:text-white"
          disabled={addBookMutation.isPending || updateBookMutation.isPending}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white"
          disabled={addBookMutation.isPending || updateBookMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {book ? 'Actualizar' : 'Guardar'} Libro
        </Button>
      </div>
    </form>
  );
}