import { useEffect, useState, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X, Upload, CalendarIcon, Plus } from 'lucide-react';
import { mapBookToFormValues, BookFormData } from '@/features/content-management/components/BookForm/BookFormConfig';
import type { Book } from '@/features/content-management/api/booksApiSlice';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { cn } from '@/common/lib/utils';
import { Calendar } from '@/common/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGetMaterialTypesQuery } from '@/features/content-management/api/materialTypesApiSlice';
import { useGetLanguagesQuery } from '@/features/content-management/api/languagesApiSlice';
import { useGetGenresQuery } from '@/features/content-management/api/genresApiSlice';
import { useGetAuthorsQuery } from '@/features/content-management/api/authorsApiSlice';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/common/components/ui/command";
import {
  Popover as CommandPopover,
  PopoverContent as CommandPopoverContent,
  PopoverTrigger as CommandPopoverTrigger,
} from "@/common/components/ui/popover";
import { useDebounce } from '@/common/components/ui/use-debounce';

interface BookFormProps {
  initialData?: Book;
  onSubmit: (bookData: BookFormData | FormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function BookForm({ initialData, onSubmit, onCancel, isSubmitting }: BookFormProps) {
  const { toast } = useToast();
  const { data: materialTypes } = useGetMaterialTypesQuery({ page_size: 1000 });
  const { data: languages } = useGetLanguagesQuery({ page_size: 1000 });
  const { data: genresData } = useGetGenresQuery({ page_size: 1000 });
  const { data: authorsData } = useGetAuthorsQuery({ page_size: 1000 });

  const [authorSearch, setAuthorSearch] = useState('');
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const debouncedAuthorSearch = useDebounce(authorSearch, 50);

  const isEditMode = !!initialData;

  const defaultValues = useMemo(
    () => ({
      ...mapBookToFormValues(initialData),
      authors: initialData?.authors_detail?.map((author) => author.name) || [],
      genres: initialData?.genres_detail?.map((g) => g.label) || [],
      material_type: initialData?.material_type_detail?.slug || "",
      language: initialData?.language_detail?.name || "",
      isbn: initialData?.isbn || "",
    }),
    [initialData]
  );

  const { register, handleSubmit, formState: { errors }, reset, watch, control, setValue } = useForm<BookFormData>({
    defaultValues,
  });

  const watchedCover = watch('cover');
  const watchedDigitalFile = watch('digital_file');

  useEffect(() => {
    if (watchedCover instanceof File) {
      const url = URL.createObjectURL(watchedCover);
      setCoverPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof watchedCover === 'string') {
      setCoverPreviewUrl(watchedCover);
    } else {
      setCoverPreviewUrl(null);
    }
  }, [watchedCover]);

  // Handle digital file preview
  useEffect(() => {
    if (watchedDigitalFile instanceof File) {
      console.log('New digital file selected:', watchedDigitalFile.name);
    }
  }, [watchedDigitalFile]);

  const onFormSubmit = async (data: BookFormData) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append all fields to the FormData object, but only append files if they are actually file objects.
      Object.keys(data).forEach(key => {
        const value = data[key as keyof BookFormData];
        if (value !== undefined && value !== null) {
          if (key === 'cover' || key === 'digital_file') {
            // Only append file fields if the value is an actual File object.
            if (value instanceof File) {
              formData.append(key, value);
            }
          } else if (Array.isArray(value)) {
            value.forEach(item => formData.append(`${key}[]`, item as string));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString().split('T')[0]);
          } else if (typeof value === 'object' && value !== null) {
            // Handle nested objects if necessary, though the current form structure suggests this isn't needed
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Log FormData contents for debugging
      console.log("FormData contents before submission:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Pass the FormData object to the onSubmit prop
      onSubmit(formData);
    } catch (error) {
      toast({ title: 'Error', description: `Error al procesar libro.`, variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (initialData) {
      reset(defaultValues);
    }
  }, [initialData, reset, defaultValues]);

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
                {coverPreviewUrl ? (
                  <img
                    src={coverPreviewUrl}
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
                <Label htmlFor="cover-upload">Subir nueva portada</Label>
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue('cover', file);
                    }
                  }}
                  className={errors.cover ? 'border-red-500' : ''}
                />
                {errors.cover?.message && (
                  <p className="text-red-500 text-sm">{String(errors.cover.message)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-biblioteca-blue">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Título */}
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

                {/* Autores */}
                <div className="space-y-2">
                  <Label htmlFor="authors">Autor(es)</Label>
                  <Controller
                    name="authors"
                    control={control}
                    render={({ field }) => {
                      const handleAddAuthor = (name: string) => {
                        if (!name.trim()) return;
                        if (!field.value.includes(name)) {
                          field.onChange([...(field.value || []), name]);
                        }
                        setAuthorSearch("");
                      };

                      const filteredAuthors = authorsData?.results
                        ?.filter(
                          (author) =>
                            !(field.value || []).includes(author.name) &&
                            author.name.toLowerCase().includes(debouncedAuthorSearch.toLowerCase())
                        ) || [];

                      const noMatchingAuthor =
                        debouncedAuthorSearch &&
                        !filteredAuthors.find(
                          (author) => author.name.toLowerCase() === debouncedAuthorSearch.toLowerCase()
                        );

                      return (
                        <CommandPopover>
                          <CommandPopoverTrigger asChild>
                            <div className="flex flex-wrap gap-2 min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer">
                              {(field.value || []).length === 0 && (
                                <div className="flex items-center">
                                  <span className="text-muted-foreground">Seleccionar autores...</span>
                                  <div className="ml-2 w-6 h-6 rounded-full bg-biblioteca-blue text-white flex items-center justify-center">
                                    <Plus className="h-4 w-4" />
                                  </div>
                                </div>
                              )}
                              {(field.value || []).map((author, index) => (
                                <div
                                  key={index}
                                  className="bg-primary text-primary-foreground rounded px-2 py-1 text-xs flex items-center"
                                >
                                  {author}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const newAuthors = (field.value || []).filter((_, i) => i !== index);
                                      field.onChange(newAuthors);
                                    }}
                                    className="ml-2 hover:text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </CommandPopoverTrigger>
                          <CommandPopoverContent className="p-0" side="bottom" align="start">
                            <Command shouldFilter={false}>
                              <CommandInput
                                placeholder="Buscar autores..."
                                value={authorSearch}
                                onValueChange={setAuthorSearch}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && noMatchingAuthor) {
                                    e.preventDefault();
                                    handleAddAuthor(debouncedAuthorSearch);
                                  }
                                }}
                              />
                              <CommandList>
                                <CommandEmpty>No se encontraron autores.</CommandEmpty>
                                <CommandGroup>
                                  {noMatchingAuthor && (
                                    <CommandItem onSelect={() => handleAddAuthor(debouncedAuthorSearch)}>
                                      Añadir "{debouncedAuthorSearch}"
                                    </CommandItem>
                                  )}
                                  {authorsData?.results?.map((author) => (
                                    <CommandItem
                                      key={author.name}
                                      value={author.name}
                                      onSelect={() => handleAddAuthor(author.name)}
                                    >
                                      {author.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </CommandPopoverContent>
                        </CommandPopover>
                      );
                    }}
                  />
                  {errors.authors?.message && (
                    <p className="text-red-500 text-sm">{String(errors.authors.message)}</p>
                  )}
                </div>

                {/* ISBN */}
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" {...register('isbn')} placeholder="978-0-123456-78-9" />
                </div>

                {/* Tipo de Material */}
                <div className="space-y-2">
                  <Label htmlFor="material_type">Tipo de Material</Label>
                  <Controller
                    name="material_type"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.material_type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialTypes?.results?.map((type) => (
                            // 👇 mandamos el slug al backend, mostramos el nombre al usuario
                            <SelectItem key={type.slug} value={type.slug}>
                              {type.name}
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

                {/* Géneros */}
                <div className="space-y-2">
                  <Label htmlFor="genres">Género</Label>
                  <Controller
                    name="genres"
                    control={control}
                    render={({ field }) => (
                      <CommandPopover>
                        <CommandPopoverTrigger asChild>
                          <Button variant="outline" role="combobox" className="w-auto justify-between">
                            {field.value?.[0] || "Seleccionar género..."}
                          </Button>
                        </CommandPopoverTrigger>
                        <CommandPopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Buscar géneros..." />
                            <CommandList>
                              <CommandEmpty>No se encontraron géneros.</CommandEmpty>
                              <CommandGroup>
                                {genresData?.results?.map((genre) => (
                                  <CommandItem
                                    key={genre.id}
                                    value={genre.label}
                                    onSelect={() => field.onChange([genre.label])}
                                  >
                                    {genre.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </CommandPopoverContent>
                      </CommandPopover>
                    )}
                  />
                  {errors.genres?.message && (
                    <p className="text-red-500 text-sm">{String(errors.genres.message)}</p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" {...register('description')} rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Publicación */}
          <Card>
            <CardHeader>
              <CardTitle className="text-biblioteca-blue">Detalles de Publicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="publisher">Editorial</Label>
                  <Input id="publisher" {...register('publisher')} />
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
                            {value ? format(new Date(value), 'PPP', { locale: es }) : <span>Elige una fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={value ? new Date(value) : undefined}
                            onSelect={(date) => onChange(date?.toISOString())}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date > today || date < new Date('1900-01-01');
                            }}
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
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.language ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages?.results?.map((lang) => (
                            <SelectItem key={lang.name} value={lang.name}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.language?.message && (
                    <p className="text-red-500 text-sm">{String(errors.language.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pages">Número de Páginas</Label>
                  <Input id="pages" type="number" min="1" {...register('pages', { valueAsNumber: true })} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="digital_file">Archivo Digital (PDF, EPUB, etc.)</Label>
                  <Input
                    id="digital_file"
                    type="file"
                    accept=".pdf,.epub"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue('digital_file', file);
                      }
                    }}
                  />
                  {errors.digital_file?.message && (
                    <p className="text-red-500 text-sm">{String(errors.digital_file.message)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventario (solo edición) */}
          {isEditMode && (
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
                      readOnly
                      {...register('quantity_in_stock', { valueAsNumber: true })}
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Actions */}
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
          {isEditMode ? 'Actualizar' : 'Guardar'} Libro
        </Button>
      </div>
    </form>
  );
}

export default BookForm;
