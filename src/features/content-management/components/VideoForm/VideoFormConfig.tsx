// Correcting the import statement based on the file structure
import { Video } from '@/features/content-management/api/videosApiSlice';

// Correcting the default form values to match the Video type structure
export const defaultVideoFormValues = {
  title: '',
  director: undefined as string | undefined,
  release_date: undefined as string | undefined,
  duration: undefined as string | undefined,
  description: undefined as string | undefined,
  cover: '',
  video_file: '',
  slug: undefined as string | undefined,
  genres: [] as string[],
  material_type: '',
};

/**
 * Maps a Video model object to the format expected by the VideoForm.
 * @param {Video | null | undefined} video - The Video model object to map.
 * @returns {typeof defaultVideoFormValues} The formatted object for form reset.
 */
export const mapVideoToFormValues = (video: Video | null | undefined) => {
  if (!video) {
    return defaultVideoFormValues;
  }

  return {
    title: video.title ?? '',
    director: video.director ?? undefined,
    release_date: video.release_date ?? undefined,
    duration: video.duration ?? undefined,
    description: video.description ?? undefined,
    cover: video.cover ?? '',
    video_file: video.video_file ?? '',
    slug: video.slug ?? undefined,
    genres: video.genres.map((genre) => genre.label) ?? [],
    material_type: video.material_type?.name ?? '',
  };
};

export type VideoFormData = typeof defaultVideoFormValues;