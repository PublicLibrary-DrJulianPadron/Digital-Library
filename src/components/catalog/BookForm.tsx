import React from 'react';
import { useForm } from 'react-hook-form';
import { Book, BookFormData } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Upload } from 'lucide-react';

interface BookFormProps {
  book?: Book | null;
  onSubmit: (data: BookFormData) => void;
  onCancel: () => void;
}

const genres = [
  'Realismo Mágico',
  'Novela Criollista',
  'Novela Histórica',
  'Ficción',
  'No Ficción',
  'Biografía',
  'Historia',
  'Ciencia',
  'Tecnología',
  'Arte',
  'Literatura Infantil',
  'Poesía',
  'Teatro',
  'Ensayo',
  'Filosofía',
  'Religión',
  'Autoayuda',
  'Cocina',
  'Viajes',
  'Deportes'
];

const languages = [
  'Español',
  'Inglés',
  'Francés',
  'Portugués',
  'Italiano',
  'Alemán',
  'Otro'
];

export function BookForm({ book, onSubmit, onCancel }: BookFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<BookFormData>({
    defaultValues: book ? {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      publisher: book.publisher,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      description: book.description,
      coverUrl: book.coverUrl,
      language: book.language,
      pages: book.pages,
      location: book.location,
    } : {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      publisher: '',
      publishedYear: new Date().getFullYear(),
      totalCopies: 1,
      availableCopies: 1,
      description: '',
      coverUrl: '',
      language: 'Español',
      pages: 0,
      location: '',
    }
  });

  const watchedCoverUrl = watch('coverUrl');

  const onFormSubmit = (data: BookFormData) => {
    onSubmit(data);
  };

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
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    {...register('title', { required: 'El título es requerido' })}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    {...register('author', { required: 'El autor es requerido' })}
                    className={errors.author ? 'border-red-500' : ''}
                  />
                  {errors.author && (
                    <p className="text-red-500 text-sm">{errors.author.message}</p>
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
                  <Label htmlFor="genre">Género *</Label>
                  <Select onValueChange={(value) => setValue('genre', value)} defaultValue={book?.genre}>
                    <SelectTrigger className={errors.genre ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.genre && (
                    <p className="text-red-500 text-sm">{errors.genre.message}</p>
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
                  <Label htmlFor="publishedYear">Año de Publicación *</Label>
                  <Input
                    id="publishedYear"
                    type="number"
                    min="1000"
                    max={new Date().getFullYear()}
                    {...register('publishedYear', { 
                      required: 'El año es requerido',
                      valueAsNumber: true 
                    })}
                    className={errors.publishedYear ? 'border-red-500' : ''}
                  />
                  {errors.publishedYear && (
                    <p className="text-red-500 text-sm">{errors.publishedYear.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select onValueChange={(value) => setValue('language', value)} defaultValue={book?.language || 'Español'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="totalCopies">Total de Ejemplares *</Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    min="1"
                    {...register('totalCopies', { 
                      required: 'El total de ejemplares es requerido',
                      valueAsNumber: true 
                    })}
                    className={errors.totalCopies ? 'border-red-500' : ''}
                  />
                  {errors.totalCopies && (
                    <p className="text-red-500 text-sm">{errors.totalCopies.message}</p>
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
                      valueAsNumber: true 
                    })}
                    className={errors.availableCopies ? 'border-red-500' : ''}
                  />
                  {errors.availableCopies && (
                    <p className="text-red-500 text-sm">{errors.availableCopies.message}</p>
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
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {book ? 'Actualizar' : 'Guardar'} Libro
        </Button>
      </div>
    </form>
  );
}