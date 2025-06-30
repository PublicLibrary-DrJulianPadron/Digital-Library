import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface BookSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  genres: string[];
}

export function BookSearch({ 
  searchTerm, 
  onSearchChange, 
  selectedGenre, 
  onGenreChange, 
  genres 
}: BookSearchProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-biblioteca-gray" />
        <Input
          placeholder="Buscar por título, autor o ISBN..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 border-biblioteca-blue/20 focus:border-biblioteca-blue focus:ring-biblioteca-blue/20"
        />
      </div>
      
      <div className="md:w-64">
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="h-12 border-biblioteca-blue/20 focus:border-biblioteca-blue focus:ring-biblioteca-blue/20">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-biblioteca-gray" />
              <SelectValue placeholder="Filtrar por género" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los géneros</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}