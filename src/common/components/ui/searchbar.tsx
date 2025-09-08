import { ChangeEvent, useState, KeyboardEvent, useRef, Dispatch, SetStateAction } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { cn } from "@/common/lib/utils";

interface SearchBarProps<T> {
    searchType: "genre" | "author" | "book";
    setSearchType: Dispatch<SetStateAction<"genre" | "author" | "book">>;
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    filteredResults: T[];
    handleSearch: () => void;
    handleSuggestionClick: (item: T) => void;
    highlightedIndex: number | null;
    setHighlightedIndex: Dispatch<SetStateAction<number | null>>;
    renderSuggestion: (item: T, index: number) => JSX.Element;
    isLoading: boolean;
}

export const SearchBar = <T,>({
    searchType,
    setSearchType,
    searchQuery,
    setSearchQuery,
    filteredResults,
    handleSearch,
    handleSuggestionClick,
    highlightedIndex,
    setHighlightedIndex,
    renderSuggestion,
    isLoading,
}: SearchBarProps<T>) => {
    const suggestionsRef = useRef<HTMLUListElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev === null || prev >= filteredResults.length - 1 ? 0 : prev + 1
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev === null || prev <= 0 ? filteredResults.length - 1 : prev - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex !== null) {
                handleSuggestionClick(filteredResults[highlightedIndex]);
            } else {
                handleSearch();
            }
        }
        if (highlightedIndex !== null && suggestionsRef.current) {
            const highlightedItem = suggestionsRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedItem) {
                highlightedItem.scrollIntoView({ block: "nearest" });
            }
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex item-center space-between bg-white">
            <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                // Use `text-sm` for smaller text and padding
                className="border mr-3 w-content rounded px-1 py-1.5 focus:outline-none focus:ring focus:ring-biblioteca-blue text-sm"
            >
                <option value="genre">Género</option>
                <option value="author">Autor</option>
                <option value="book">Libro</option>
            </select>

            <div className="flex gap-2 w-full relative">
                <input
                    type="text"
                    placeholder={`Buscar por ${searchType === "genre"
                        ? "Género"
                        : searchType === "author"
                            ? "Autor"
                            : "Libro"
                        }`}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full md:w-96 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-biblioteca-blue"
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className={cn(
                        "px-3 py-2 bg-biblioteca-blue text-white rounded hover:bg-biblioteca-blue/80",
                        isLoading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <AiOutlineSearch className="h-5 w-5" />
                </button>

                {searchQuery && filteredResults.length > 0 && (
                    <ul
                        ref={suggestionsRef}
                        className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-50 max-h-60 overflow-y-auto"
                    >
                        {filteredResults.map((item, i) => (
                            <li
                                key={i}
                                onClick={() => handleSuggestionClick(item)}
                                className={`p-2 cursor-pointer hover:bg-biblioteca-blue/10 ${highlightedIndex === i ? "bg-biblioteca-blue/20" : ""
                                    }`}
                            >
                                {renderSuggestion(item, i)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};