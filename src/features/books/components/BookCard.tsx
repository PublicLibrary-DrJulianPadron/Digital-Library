import React, { useState, useId } from 'react';
import { Book } from '@/features/books/api/booksApiSlice';
import { Button } from '@/common/components/ui/button';
import { Badge } from '@/common/components/ui/badge';
import { Edit, Trash2, MapPin, Calendar, BookOpen, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/common/components/ui/alert-dialog';
interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (bookId: string) => void;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dialogTitleId = useId();

  const getAvailabilityColor = () => {
    if (book.available_copies === 0) return 'bg-red-100 text-red-800';
    if (book.available_copies <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAvailabilityText = () => {
    if (book.available_copies === 0) return 'No disponible';
    if (book.available_copies === 1) return '1 disponible';
    return `${book.available_copies} disponibles`;
  };

  return (
    <div
      className="relative group book-card-hover bg-white rounded-lg border border-gray-200 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.cover_url}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`${getAvailabilityColor()} text-xs font-medium`}>
            {getAvailabilityText()}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-y-1">
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
            onClick={() => onEdit(book)}
          >
            <Edit className="w-3 h-3" />
          </Button>

          <AlertDialog aria-labelledby={dialogTitleId}> {/* Use the generated ID here */}
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="w-8 h-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle id={dialogTitleId}>¿Eliminar libro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente "{book.title}" del catálogo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel autoFocus>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(book.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-semibold text-biblioteca-blue text-sm mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-biblioteca-gray text-xs mb-2">{book.author}</p>

        <div className="flex items-center justify-between text-xs text-biblioteca-gray">
          <span>{book.quantity_in_stock} ejemplares</span>
          <span>{book.publication_date}</span>
        </div>
      </div>

      {/* Hover Panel */}
      {isHovered && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-4 flex flex-col justify-between z-10 transition-all duration-200">
          <div>
            <h3 className="font-display font-semibold text-biblioteca-blue text-sm mb-2 line-clamp-2">
              {book.title}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center text-biblioteca-gray">
                <User className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{book.author}</span>
              </div>

              <div className="flex items-center text-biblioteca-gray">
                <BookOpen className="w-3 h-3 mr-1 flex-shrink-0" />
                <span>{book.genres}</span>
              </div>

              <div className="flex items-center text-biblioteca-gray">
                <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                <span>{book.publication_date}</span>
              </div>
            </div>

            <p className="text-xs text-biblioteca-gray mt-3 line-clamp-3">
              {book.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs">
              <span className="text-biblioteca-gray">Disponibles:</span>
              <Badge className={`${getAvailabilityColor()} text-xs`}>
                {book.available_copies}/{book.quantity_in_stock}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}