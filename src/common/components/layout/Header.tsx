import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from "@/common/components/ui/sidebar";
import { UserProfile } from "@/features/authentication/components/LogInButton";
import { SearchBar } from '@/common/components/ui/searchbar';
import { useGetSalaWithGenresQuery, useGetBooksByGenreSlugQuery } from '@/features/content-management/api/genresApiSlice';
import { IconButton } from "@/common/components/ui/icon-button";
import { SearchIcon, XIcon } from "lucide-react";
import { useGetBooksQuery } from "@/features/content-management/api/booksApiSlice";
import { useGetAuthorsQuery } from "@/features/content-management/api/authorsApiSlice";
import { skipToken } from '@reduxjs/toolkit/query/react';

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
    const [debouncedQuery, setDebouncedQuery] = useState(""); // debounced version of searchQuery
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [searching, setSearching] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const { data: salas } = useGetSalaWithGenresQuery();
    const { data: allBooksData, isLoading: allBooksLoading } = useGetBooksQuery({});
    const booksQueryArg = {
        slug: selectedGenreSlug || undefined,
        page: pageParams[selectedGenreSlug || 'all'] || 1,
        page_size: DEFAULT_PAGE_SIZE,
    };
    const { data: booksData } = useGetBooksByGenreSlugQuery(booksQueryArg);

    // === use non-lazy authors query, skip when query empty ===
    const authorsQueryArg = debouncedQuery ? { search: debouncedQuery, page_size: 5 } : skipToken;
    const { data: authorsData, isFetching: authorsLoading } = useGetAuthorsQuery(authorsQueryArg);

    useEffect(() => {
        setSelectedGenreSlug(genreFromUrl);
    }, [genreFromUrl]);

    useEffect(() => {
        if (selectedGenreSlug) {
            setPageParams((prev) => ({ ...prev, [selectedGenreSlug]: 1 }));
        }
    }, [selectedGenreSlug]);

    // debounce the user's typing so we don't hit the API on every keystroke
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
        }, 50);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // whenever searchQuery / authorsData / etc. change, update suggestions
    useEffect(() => {
        if (searchQuery.trim()) {
            updateSuggestions(searchQuery);
        } else {
            setFilteredResults([]);
        }
        // authorsData is included so author suggestions update after debouncedQuery resolves
    }, [searchQuery, searchType, salas, allBooksData, authorsData, debouncedQuery]);

    const updateSuggestions = (value: string) => {
        const lowerValue = value.toLowerCase();
        let results: any[] = [];

        if (searchType === "genre" && salas) {
            results = salas.flatMap((sala: any) =>
                sala.genres
                    .filter((g: any) => g.label.toLowerCase().includes(lowerValue))
                    .map((g: any) => ({ ...g, sala: sala.sala }))
            );
            setFilteredResults(results.slice(0, 5));
            return;
        }

        if (searchType === "author") {
            // authorsData comes from the authors API (debounced). Use it directly.
            setFilteredResults((authorsData?.results ?? []).slice(0, 5));
            return;
        }

        if (searchType === "book" && allBooksData?.results?.length) {
            results = allBooksData.results.filter((b: any) =>
                b.title.toLowerCase().includes(lowerValue)
            );
            setFilteredResults(results.slice(0, 5));
            return;
        }

        setFilteredResults([]);
    };

    const handleSearch = () => {
        setSearching(true);
        const resultToRedirect =
            highlightedIndex !== null ? filteredResults[highlightedIndex] : filteredResults[0];

        if (searchType === "genre" && resultToRedirect) {
            navigate(`/catalogo?genre=${resultToRedirect.slug}`);
            setSelectedGenreSlug(resultToRedirect.slug);
        } else if (searchType === "author" && resultToRedirect) {
            navigate(`/autor/${resultToRedirect.slug}`);
        } else if (searchType === "book" && resultToRedirect) {
            navigate(`/libro/${resultToRedirect.slug}`);
        }

        setFilteredResults([]);
        setHighlightedIndex(null);
        setSearching(false);
    };

    const handleSuggestionClick = (item: any) => {
        if (searchType === "genre") {
            navigate(`/catalogo?genre=${item.slug}`);
        } else if (searchType === "author") {
            navigate(`/autor/${item.slug}`);
        } else if (searchType === "book") {
            navigate(`/libro/${item.slug}`);
        }
        setSearchQuery("");
        setFilteredResults([]);
    };

    const isLoading = searchType === "author" ? authorsLoading : allBooksLoading;

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
                    isLoading={isLoading}
                    renderSuggestion={(item) =>
                        searchType === "genre"
                            ? `${item.label} (${item.sala})`
                            : item.name || item.title
                    }
                />
            </div>

            {/* Mobile search bar */}
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
                        isLoading={isLoading}
                        renderSuggestion={(item) =>
                            searchType === "genre"
                                ? `${item.label} (${item.sala})`
                                : item.name || item.title
                        }
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
