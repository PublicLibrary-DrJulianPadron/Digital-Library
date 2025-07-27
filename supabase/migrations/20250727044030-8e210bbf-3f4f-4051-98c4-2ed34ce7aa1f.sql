-- Update libros table to match Book types
ALTER TABLE public.libros RENAME COLUMN nombre TO title;
ALTER TABLE public.libros RENAME COLUMN autor TO author;
ALTER TABLE public.libros RENAME COLUMN ano_publicacion TO "publicationYear";
ALTER TABLE public.libros RENAME COLUMN cantidad_existencia TO "quantityInStock";
ALTER TABLE public.libros RENAME COLUMN tipo_material TO "materialType";

-- Add missing columns for Book interface
ALTER TABLE public.libros ADD COLUMN "availableCopies" integer DEFAULT 0;
ALTER TABLE public.libros ADD COLUMN description text;
ALTER TABLE public.libros ADD COLUMN "coverUrl" text;
ALTER TABLE public.libros ADD COLUMN language text;
ALTER TABLE public.libros ADD COLUMN pages integer;
ALTER TABLE public.libros ADD COLUMN location text;
ALTER TABLE public.libros ADD COLUMN publisher text;
ALTER TABLE public.libros ADD COLUMN genre text;