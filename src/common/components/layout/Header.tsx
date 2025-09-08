import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from "@/common/components/ui/sidebar";
import { UserProfile } from "@/features/authentication/components/LogInButton";
import { SearchBar } from '@/common/components/ui/searchbar';
import { useGetSalaWithGenresQuery, useGetBooksByGenreSlugQuery } from '@/features/content-management/api/genresApiSlice';
import { IconButton } from "@/common/components/ui/icon-button"; // New component for search icon
import { SearchIcon, XIcon } from "lucide-react"; // Icons from lucide-react
import { useGetBooksQuery } from "@/features/content-management/api/booksApiSlice"; // Import the new query hook

type PageParams = Record<string, number>;
const DEFAULT_PAGE_SIZE = 5;

export const AppHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const genreFromUrl = params.get("genre");

    const [selectedGenreSlug, setSelectedGenreSlug] = useState<string | null>(genreFromUrl);
    const [pageParams, setPageParams] = useState<PageParams>({});
    const [searchType, setSearchType] = useState<"genre" | "author" | "book">("book");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [searching, setSearching] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false); // New state for mobile search visibility

    const { data: salas, isLoading: salasLoading, error: salasError } = useGetSalaWithGenresQuery();
    const { data: allBooksData, isLoading: allBooksLoading } = useGetBooksQuery({});
    const booksQueryArg = {
        slug: selectedGenreSlug || undefined,
        page: pageParams[selectedGenreSlug || 'all'] || 1,
        page_size: DEFAULT_PAGE_SIZE,
    };
    const { data: booksData, isLoading: booksLoading } = useGetBooksByGenreSlugQuery(booksQueryArg);

    useEffect(() => {
        setSelectedGenreSlug(genreFromUrl);
    }, [genreFromUrl]);

    useEffect(() => {
        if (selectedGenreSlug) {
            setPageParams((prev) => ({ ...prev, [selectedGenreSlug]: 1 }));
        }
    }, [selectedGenreSlug]);

    useEffect(() => {
        if (searchQuery.trim()) {
            updateSuggestions(searchQuery);
        } else {
            setFilteredResults([]);
        }
    }, [searchQuery, searchType, salas, allBooksData]);

    const updateSuggestions = (value: string) => {
        let results: any[] = [];
        const lowerValue = value.toLowerCase();
        const availableBooks = allBooksData?.results || [];

        if (searchType === "genre" && salas) {
            results = salas.flatMap((sala: any) =>
                sala.genres
                    .filter((g: any) => g.label.toLowerCase().includes(lowerValue))
                    .map((g: any) => ({ ...g, sala: sala.sala }))
            );
        } else if (searchType === "author" && availableBooks.length) {
            results = availableBooks.filter((b: any) =>
                b.author && b.author.toLowerCase().includes(lowerValue)
            );
        } else if (searchType === "book" && availableBooks.length) {
            results = availableBooks.filter((b: any) =>
                b.title.toLowerCase().includes(lowerValue)
            );
        }
        setFilteredResults(results.slice(0, 5));
    };

    const handleSearch = () => {
        setSearching(true);
        setFilteredResults([]);
        setHighlightedIndex(null);

        const resultToRedirect = highlightedIndex !== null ? filteredResults[highlightedIndex] : filteredResults[0];

        if (searchType === "genre" && resultToRedirect) {
            navigate(`/catalogo?genre=${resultToRedirect.slug}`);
            setSelectedGenreSlug(resultToRedirect.slug);
        } else {
            // Logic to handle non-genre search results, possibly pass to a context or state manager
        }
        setSearching(false);
    };

    const handleSuggestionClick = (item: any) => {
        if (searchType === "genre") {
            navigate(`/catalogo?genre=${item.slug}`);
        } else {
            // Logic to handle non-genre suggestion clicks
        }
        setSearchQuery("");
        setFilteredResults([]);
    };

    return (
        <header className="bg-background border-b border-border px-3 py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="text-foreground hover:text-primary" />
                </div>
                <div className="flex md:hidden items-center gap-2">
                    <IconButton
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        className="text-white hover:text-primary"
                    >
                        {isSearchVisible ? <XIcon className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
                    </IconButton>
                    <UserProfile />
                </div>
            </div>

            {/* Full-width search bar for desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl">
                <SearchBar
                    searchType={searchType}
                    setSearchType={setSearchType}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filteredResults={filteredResults}
                    handleSearch={handleSearch}
                    handleSuggestionClick={handleSuggestionClick}
                    highlightedIndex={highlightedIndex}
                    setHighlightedIndex={setHighlightedIndex}
                    isLoading={allBooksLoading}
                    renderSuggestion={(item) => (
                        searchType === "genre"
                            ? `${item.label} (${item.sala})`
                            : item.title || item.author
                    )}
                />
            </div>

            {/* Mobile search bar that appears when the search icon is clicked */}
            {isSearchVisible && (
                <div className="md:hidden w-full transition-all duration-300 ease-in-out mt-2">
                    <SearchBar
                        searchType={searchType}
                        setSearchType={setSearchType}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filteredResults={filteredResults}
                        handleSearch={handleSearch}
                        handleSuggestionClick={handleSuggestionClick}
                        highlightedIndex={highlightedIndex}
                        setHighlightedIndex={setHighlightedIndex}
                        isLoading={allBooksLoading}
                        renderSuggestion={(item) => (
                            searchType === "genre"
                                ? `${item.label} (${item.sala})`
                                : item.title || item.author
                        )}
                    />
                </div>
            )}

            {/* Desktop User Profile */}
            <div className="hidden md:flex items-center">
                <UserProfile />
            </div>
        </header>
    );
};