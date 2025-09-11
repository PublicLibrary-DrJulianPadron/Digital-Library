import {
    ChangeEvent,
    KeyboardEvent,
    useEffect,
    useRef,
    useState,
    forwardRef,
} from "react";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { SearchIcon, Loader2 } from "lucide-react";
import { cn } from "@/common/lib/utils";

type SearchType = "genre" | "author" | "book";

interface SearchBarProps<T> {
    searchType: SearchType;
    setSearchType: (type: SearchType) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredResults: T[];
    handleSearch: () => void;
    handleSuggestionClick: (item: T) => void;
    highlightedIndex: number | null;
    setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>; // Tipo corregido
    isLoading: boolean;
    renderSuggestion: (item: T) => React.JSX.Element;
}

const SearchBar = forwardRef(
    <T extends { id: any }>(
        {
            searchType,
            setSearchType,
            searchQuery,
            setSearchQuery,
            filteredResults,
            handleSearch,
            handleSuggestionClick,
            highlightedIndex,
            setHighlightedIndex,
            isLoading,
            renderSuggestion,
        }: SearchBarProps<T>,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const [showSuggestions, setShowSuggestions] = useState(false);
        const wrapperRef = useRef<HTMLDivElement>(null);

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    prevIndex === null || prevIndex === filteredResults.length - 1
                        ? 0
                        : prevIndex + 1
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    prevIndex === null || prevIndex === 0
                        ? filteredResults.length - 1
                        : prevIndex - 1
                );
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (highlightedIndex !== null && filteredResults[highlightedIndex]) {
                    handleSuggestionClick(filteredResults[highlightedIndex]);
                } else {
                    handleSearch();
                }
            }
        };

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim().length > 0) {
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        };

        const handleInputFocus = () => {
            if (searchQuery.trim().length > 0) {
                setShowSuggestions(true);
            }
        };

        const handleInputBlur = (e: React.FocusEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.relatedTarget)) {
                setTimeout(() => setShowSuggestions(false), 200);
            }
        };

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    wrapperRef.current &&
                    !wrapperRef.current.contains(event.target as Node)
                ) {
                    setShowSuggestions(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        return (
            <div
                className="relative flex w-full max-w-lg items-center space-x-2"
                ref={wrapperRef}
            >
                <div className="flex w-full items-center rounded-lg border border-gray-300 bg-white shadow-sm">
                    <div className="flex-none rounded-l-lg bg-gray-100 p-2">
                        <select
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value as SearchType)}
                            className="rounded-md bg-gray-100 text-sm font-medium focus:outline-none"
                        >
                            <option value="book">Libro</option>
                            <option value="author">Autor</option>
                            <option value="genre">Género</option>
                        </select>
                    </div>
                    <Input
                        type="text"
                        placeholder={`Buscar por ${searchType === "book"
                                ? "título"
                                : searchType === "author"
                                    ? "nombre"
                                    : "género"
                            }...`}
                        className="flex-1 rounded-none border-0 focus-visible:ring-0"
                        value={searchQuery}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        onClick={handleSearch}
                        className="flex-none rounded-r-lg"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <SearchIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
                {showSuggestions && searchQuery.length > 0 && filteredResults.length > 0 && (
                    <div className="absolute top-full z-10 w-full mt-2 rounded-md border border-gray-300 bg-white shadow-lg max-h-60 overflow-y-auto">
                        <ul className="py-1">
                            {filteredResults.map((item, index) => (
                                <li
                                    key={item.id || index}
                                    className={cn(
                                        "cursor-pointer px-4 py-2 text-sm hover:bg-gray-100",
                                        highlightedIndex === index && "bg-gray-200"
                                    )}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    onMouseLeave={() => setHighlightedIndex(null)}
                                    onClick={() => handleSuggestionClick(item)}
                                >
                                    {renderSuggestion(item)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }
);

SearchBar.displayName = "SearchBar";

export { SearchBar };