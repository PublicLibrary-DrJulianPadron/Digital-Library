import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast, useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X, Upload } from 'lucide-react';
import { Book } from '@/types';
import { MaterialType, LanguageCode, MaterialTypeOptions, LanguageOptions, GenreOptions } from '@/common/common/enums';
import { mapBookToFormValues, BookFormData } from '@/features/books/components/BookForm/BookFormConfig';
import { BookRow } from '@/features/books/types/books';

interface BookFormProps {
  book?: BookRow | null;
  onSubmit: (bookData: Omit<BookRow, "id" | "created_at" | "updated_at">) => void; // <-- Corrected
  onCancel: () => void;
}

export function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm({
    defaultValues: mapBookToFormValues(null)
  });
  const watchedCoverUrl = watch('coverUrl');
  const addBookMutation = useMutation({
    mutationFn: async (newBookData: BookFormData) => {
      const dataToInsert = {
        ...newBookData,
        publicationYear: newBookData.publicationYear === null ? null : Number(newBookData.publicationYear),
        quantityInStock: Number(newBookData.quantityInStock),
        availableCopies: Number(newBookData.availableCopies),
        pages: Number(newBookData.pages),
        materialType: newBookData.materialType as MaterialType,
        genre: newBookData.genre as (typeof GenreOptions)[number],
        language: newBookData.language as LanguageCode,
      };

      Object.keys(dataToInsert).forEach(key => {
        if (dataToInsert[key as keyof typeof dataToInsert] === undefined || dataToInsert[key as keyof typeof dataToInsert] === '') {
          delete dataToInsert[key as keyof typeof dataToInsert];
        }
      });

      const { data, error } = await supabase.from('libros').insert([dataToInsert as Partial<Book>]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => { // data is the response from the mutationFn
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      toast({ title: 'Éxito', description: 'Libro agregado correctamente.' });
      // Pass the relevant data to onSubmit
      if (data && data.length > 0) {
        // Assuming data[0] is the newly created book row
        const newBookRow = data[0] as BookRow;
        const { id, created_at, updated_at, ...bookDataWithoutIdTimestamps } = newBookRow;
        onSubmit(bookDataWithoutIdTimestamps);
      } else {
        // Handle case where no data is returned (though unlikely with .select())
        onSubmit({} as Omit<BookRow, "id" | "created_at" | "updated_at">); // Or handle error appropriately
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Error al agregar libro: ${error.message}`, variant: 'destructive' });
    },
  });
  const updateBookMutation = useMutation({
    mutationFn: async (updatedBookData: Book) => {
      const dataToUpdate = {
        ...updatedBookData,
        publicationYear: updatedBookData.publicationYear === null ? null : Number(updatedBookData.publicationYear),
        quantityInStock: Number(updatedBookData.quantityInStock),
        availableCopies: Number(updatedBookData.availableCopies),
        pages: Number(updatedBookData.pages),
      };

      Object.keys(dataToUpdate).forEach(key => {
        if (dataToUpdate[key as keyof typeof dataToUpdate] === undefined || dataToUpdate[key as keyof typeof dataToUpdate] === '') {
          delete dataToUpdate[key as keyof typeof dataToUpdate];
        }
      });

      const { data, error } = await supabase.from('libros').update(dataToUpdate).eq('id', updatedBookData.id).select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => { // data is the response from the mutationFn
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      toast({ title: 'Éxito', description: 'Libro actualizado correctamente.' });
      // Pass the relevant data to onSubmit
      if (data && data.length > 0) {
        // Assuming data[0] is the updated book row
        const updatedBookRow = data[0] as BookRow;
        const { id, created_at, updated_at, ...bookDataWithoutIdTimestamps } = updatedBookRow;
        onSubmit(bookDataWithoutIdTimestamps);
      } else {
        // Handle case where no data is returned (though unlikely with .select())
        onSubmit({} as Omit<BookRow, "id" | "created_at" | "updated_at">); // Or handle error appropriately
      }
    },
    onError: (error) => {
      toast({ title: 'Error', description: `Error al actualizar libro: ${error.message}`, variant: 'destructive' });
    },
  });

  const onFormSubmit = (data: BookFormData) => {
    if (book && book.id) {
      updateBookMutation.mutate({ ...data, id: book.id } as Book);
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
                <Label htmlFor="coverUrl">URL de la Portada</Label>
                <Input
                  id="coverUrl"
                  {...register('coverUrl')}
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
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    {...register('author', { required: 'El autor es requerido' })}
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
                  <Label htmlFor="materialType">Tipo de Material *</Label>
                  <Controller
                    name="materialType"
                    control={control}
                    rules={{ required: 'El tipo de material es requerido' }}
                    defaultValue={book?.materialType || MaterialTypeOptions[0]}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.materialType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {MaterialTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.materialType?.message && (
                    <p className="text-red-500 text-sm">{String(errors.materialType.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Género *</Label>
                  <Controller
                    name="genre"
                    control={control}
                    rules={{ required: 'El género es requerido' }}
                    defaultValue={book?.genre || GenreOptions[0]}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.genre ? 'border-red-500' : ''}>
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
                  {errors.genre?.message && (
                    <p className="text-red-500 text-sm">{String(errors.genre.message)}</p>
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
                  <Label htmlFor="publicationYear">Año de Publicación *</Label>
                  <Input
                    id="publicationYear"
                    type="number"
                    min="1000"
                    max={new Date().getFullYear()}
                    {...register('publicationYear', {
                      required: 'El año de publicación es requerido',
                      valueAsNumber: true,
                      validate: value => value === null || (value >= 1000 && value <= new Date().getFullYear()) || "Año de publicación inválido"
                    })}
                    className={errors.publicationYear ? 'border-red-500' : ''}
                  />
                  {errors.publicationYear?.message && (
                    <p className="text-red-500 text-sm">{String(errors.publicationYear.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Controller
                    name="language"
                    control={control}
                    rules={{ required: 'El idioma es requerido' }}
                    defaultValue={book?.language || LanguageOptions[0]}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          {LanguageOptions.map((language) => (
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

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación en Biblioteca</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="Ej: Estante A-1"
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
                  <Label htmlFor="quantityInStock">Total de Ejemplares *</Label>
                  <Input
                    id="quantityInStock"
                    type="number"
                    min="0"
                    {...register('quantityInStock', {
                      required: 'El total de ejemplares es requerido',
                      valueAsNumber: true,
                      min: { value: 0, message: 'La cantidad total no puede ser negativa' }
                    })}
                    className={errors.quantityInStock ? 'border-red-500' : ''}
                  />
                  {errors.quantityInStock?.message && (
                    <p className="text-red-500 text-sm">{String(errors.quantityInStock.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableCopies">Ejemplares Disponibles *</Label>
                  <Input
                    id="availableCopies"
                    type="number"
                    min="0"
                    {...register('availableCopies', {
                      required: 'Los ejemplares disponibles son requeridos',
                      valueAsNumber: true,
                      min: { value: 0, message: 'La cantidad disponible no puede ser negativa' },
                      validate: (value, formValues) =>
                        value <= formValues.quantityInStock || 'Los ejemplares disponibles no pueden ser más que el total'
                    })}
                    className={errors.availableCopies ? 'border-red-500' : ''}
                  />
                  {errors.availableCopies?.message && (
                    <p className="text-red-500 text-sm">{String(errors.availableCopies.message)}</p>
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