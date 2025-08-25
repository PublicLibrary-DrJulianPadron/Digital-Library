import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X, Upload, CalendarIcon } from 'lucide-react';
import { useGetMaterialTypesQuery } from '@/features/content-management/api/materialTypesApiSlice';
import { useGetGenresQuery } from '@/features/content-management/api/genresApiSlice';
import { useGetLanguagesQuery } from '@/features/content-management/api/languagesApiSlice';
import { mapBookToFormValues, BookFormData } from '@/features/content-management/components/BookForm/BookFormConfig';
import type { Book } from '@/features/content-management/api/booksApiSlice';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { cn } from '@/common/lib/utils';
import { Calendar } from '@/common/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: Omit<Book, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
  isUpdatingBook: boolean | null;
  isSubmitting: boolean;
}

export function BookForm({ book, onSubmit, onCancel, isUpdatingBook, isSubmitting }: BookFormProps) {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm<BookFormData>({
    defaultValues: mapBookToFormValues(book)
  });
  const watchedCoverUrl = watch('cover_url');
  const watchedAvailableCopies = watch('available_copies');
  const watchedQuantityInStock = watch('quantity_in_stock');
  const watchedPublicationDate = watch('publication_date');

  // Load option lists from the metadata API slices
  const { data: materialTypesData, isLoading: materialTypesLoading } = useGetMaterialTypesQuery();
  const { data: genresData, isLoading: genresLoading } = useGetGenresQuery();
  const { data: languagesData, isLoading: languagesLoading } = useGetLanguagesQuery();

  // Map API results to simple string arrays used by the Select components.
  const MaterialTypeOptions: string[] = materialTypesData ? materialTypesData.map((m) => m.name) : [];
  const GenreOptions: string[] = genresData ? genresData.map((g) => g.name) : [];
  const LanguageCodeOptions: string[] = languagesData ? languagesData.map((l) => l.name) : [];

  const onFormSubmit = async (data: BookFormData) => {
    try {
      const bookData = {
        ...data,
        publication_date: data.publication_date ? String(data.publication_date) : undefined,
        pages: data.pages ? Number(data.pages) : undefined,
        quantity_in_stock: Number(data.quantity_in_stock),
        available_copies: Number(data.available_copies),
        material_type: data.material_type,
        genre_names: Array.isArray(data.genres) ? data.genres : [data.genres].filter(Boolean),
      };

      onSubmit(bookData as Omit<Book, "id" | "created_at" | "updated_at">);
    } catch (error) {
      toast({ title: 'Error', description: `Error al procesar libro.`, variant: 'destructive' });
    }
  };

  useEffect(() => {
    const initialValues = mapBookToFormValues(book);
    if (initialValues.publication_date) {
      initialValues.publication_date = initialValues.publication_date.toString();
    }
    reset(initialValues);
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
                    defaultValue={book?.material_type || MaterialTypeOptions[0]}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.material_type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {(materialTypesLoading ? ['Cargando...'] : MaterialTypeOptions).map((type) => (
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
                  <Label htmlFor="genres">Género (s)</Label>
                  {/* NOTE: You should use a multi-select component here for genre_names to align with the string[] type. */}
                  {/* The current implementation is a single select for demonstration. */}
                  <Controller
                    name="genres"
                    control={control}
                    defaultValue={book?.genres || []}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange([value])} // Cast to array for single select
                        defaultValue={field.value?.[0]}
                      >
                        <SelectTrigger className={errors.genres ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          {(genresLoading ? ['Cargando...'] : GenreOptions).map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.genres?.message && (
                    <p className="text-red-500 text-sm">{String(errors.genres.message)}</p>
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
                  <Label htmlFor="publication_date">Fecha de Publicación</Label>
                  <Controller
                    name="publication_date"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="publication_date"
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !value && 'text-muted-foreground',
                              errors.publication_date && 'border-red-500'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? (
                              format(new Date(value), 'PPP', { locale: es })
                            ) : (
                              <span>Elige una fecha</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={value ? new Date(value) : undefined}
                            onSelect={(date) => onChange(date ? date.toISOString().split('T')[0] : undefined)}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
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
                    defaultValue={book?.language || LanguageCodeOptions[0]}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          {(languagesLoading ? ['Cargando...'] : LanguageCodeOptions).map((language) => (
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
          {isUpdatingBook &&
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
                      readOnly={true}
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
                    />
                    {errors.available_copies?.message && (
                      <p className="text-red-500 text-sm">{String(errors.available_copies.message)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          }
        </div>
      </div>

      {/* Form Actions */}
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
          {isUpdatingBook ? 'Actualizar' : 'Guardar'} Libro
        </Button>
      </div>
    </form>
  );
}