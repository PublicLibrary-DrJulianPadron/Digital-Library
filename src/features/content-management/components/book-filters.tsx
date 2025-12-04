import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/common/components/ui/popover";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/common/components/ui/select";
import { Filter } from "lucide-react";

interface BookFiltersProps {
  filters: {
    search?: string;
    author?: string;
    genres__name?: string;
    publication_date?: string;
    material_type?: string;
    language?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const BookFilters: React.FC<BookFiltersProps> = ({ filters, onFilterChange, pageSize, onPageSizeChange }) => {
  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3" align="end">
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium">Tamaño de página</span>
          <div className="flex items-center space-x-2">
            {pageSizeOptions.map((size) => (
              <Button
                key={size}
                variant={pageSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => onPageSizeChange(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
        <Input
          placeholder="Buscar título..."
          value={filters.search || ""}
          onChange={(e) => onFilterChange("search", e.target.value)}
        />
        <Input
          placeholder="Autor"
          value={filters.author || ""}
          onChange={(e) => onFilterChange("author", e.target.value)}
        />
        <Input
          placeholder="Género"
          value={filters.genres__name || ""}
          onChange={(e) => onFilterChange("genres__name", e.target.value)}
        />
        <Input
          placeholder="Año de publicación"
          value={filters.publication_date || ""}
          onChange={(e) => onFilterChange("publication_date", e.target.value)}
        />
        <Select
          value={filters.material_type || ""}
          onValueChange={(val) => onFilterChange("material_type", val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="book">Libro</SelectItem>
            <SelectItem value="magazine">Revista</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Idioma"
          value={filters.language || ""}
          onChange={(e) => onFilterChange("language", e.target.value)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default BookFilters;