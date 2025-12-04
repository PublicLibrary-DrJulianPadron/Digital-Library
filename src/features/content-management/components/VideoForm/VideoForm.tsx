import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useToast } from '@/common/hooks/use-toast';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { Label } from '@/common/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card';
import { Save, X, Upload, CalendarIcon } from 'lucide-react';
import { mapVideoToFormValues, VideoFormData } from '@/features/content-management/components/VideoForm/VideoFormConfig';
import type { Video, VideoRequest } from '@/features/content-management/api/videosApiSlice';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { cn } from '@/common/lib/utils';
import { Calendar } from '@/common/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGetMaterialTypesQuery } from '@/features/content-management/api/materialTypesApiSlice';
import { useGetGenresQuery } from '@/features/content-management/api/genresApiSlice';

interface VideoFormProps {
  initialData?: Video;
  onSubmit: (videoData: VideoRequest & { genres: string[], material_type: string, cover: string, video_file: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function VideoForm({ initialData, onSubmit, onCancel, isSubmitting }: VideoFormProps) {
  const { toast } = useToast();
  const { data: materialTypes } = useGetMaterialTypesQuery();
  const { data: genresData } = useGetGenresQuery({ page_size: 1000 });

  const isEditMode = !!initialData;

  const defaultValues = useMemo(() => mapVideoToFormValues(initialData), [initialData]);

  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm<VideoFormData>({
    defaultValues,
  });

  const watchedCover = watch('cover');

  const onFormSubmit = async (data: VideoFormData) => {
    try {
      const videoData = {
        ...data,
        release_date: data.release_date ? new Date(data.release_date).toISOString().split('T')[0] : undefined,
      };

      onSubmit(videoData as any);
    } catch (error) {
      toast({ title: 'Error', description: `Error al procesar video.`, variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (initialData) {
      reset(mapVideoToFormValues(initialData));
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cover Preview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-biblioteca-blue">
                Portada del Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                {watchedCover ? (
                  <img
                    src={watchedCover}
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
                  <Label htmlFor="director">Director</Label>
                  <Input
                    id="director"
                    {...register('director')}
                    placeholder="Director del video"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material_type">Tipo de Material</Label>
                  <Controller
                    name="material_type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={errors.material_type ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialTypes?.map(type => (
                            <SelectItem key={type.name} value={type.name}>{type.name}</SelectItem>
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
                  <Label htmlFor="genres">Género</Label>
                  <Controller
                    name="genres"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange([value])}
                        defaultValue={field.value[0]}
                      >
                        <SelectTrigger className={errors.genres ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Seleccionar género" />
                        </SelectTrigger>
                        <SelectContent>
                          {genresData?.results.map((genre) => (
                            <SelectItem
                              key={genre.id}
                              value={genre.label}
                            >
                              {genre.label}
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
                  placeholder="Breve descripción del video..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">URL de la Portada</Label>
                <Input
                  id="cover"
                  {...register('cover')}
                  placeholder="https://example.com/cover.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_file">URL del Archivo de Video</Label>
                <Input
                  id="video_file"
                  {...register('video_file')}
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-biblioteca-blue">Detalles del Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="release_date">Fecha de Lanzamiento</Label>
                  <Controller
                    name="release_date"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="release_date"
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !value && 'text-muted-foreground',
                              errors.release_date && 'border-red-500'
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
                            onSelect={(date) => onChange(date?.toISOString())}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date > today || date < new Date('1900-01-01');
                            }}
                            initialFocus
                            classNames={{
                              day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 rounded-full border-2 border-blue-700",
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.release_date?.message && (
                    <p className="text-red-500 text-sm">{String(errors.release_date.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (min)</Label>
                  <Input
                    id="duration"
                    {...register('duration')}
                    placeholder="Ej: 90"
                  />
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
          {isEditMode ? 'Actualizar' : 'Guardar'} Video
        </Button>
      </div>
    </form>
  );
}

export default VideoForm;