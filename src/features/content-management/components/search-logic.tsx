import { useState } from "react";
import { useAuthorSearch } from "./author-search";
import { useBookSearch } from "./book-search";
import { useGenreSearch } from "./genre-search";

// --- Tipo base para searchType y setSearchType ---
type BaseSearchReturn<T extends "genre" | "author" | "book"> = {
    searchType: T;
    setSearchType: React.Dispatch<
        React.SetStateAction<"genre" | "author" | "book">
    >;
    selectedGenreName: string | null; // ✅ ahora siempre existe
};

type GenreSearchReturn = ReturnType<typeof useGenreSearch> &
    BaseSearchReturn<"genre">;

type AuthorSearchReturn = ReturnType<typeof useAuthorSearch> &
    BaseSearchReturn<"author">;

type BookSearchReturn = ReturnType<typeof useBookSearch> &
    BaseSearchReturn<"book">;

// --- Unión discriminada ---
export type SearchLogicReturn =
    | GenreSearchReturn
    | AuthorSearchReturn
    | BookSearchReturn;

// --- Hook principal ---
export const useSearchLogic = (): SearchLogicReturn => {
    const [searchType, setSearchType] = useState<"genre" | "author" | "book">(
        "book"
    );

    const genreSearchLogic = useGenreSearch();
    const authorSearchLogic = useAuthorSearch();
    const bookSearchLogic = useBookSearch();

    switch (searchType) {
        case "genre":
            return {
                ...genreSearchLogic,
                searchType,
                setSearchType,
                selectedGenreName: genreSearchLogic.selectedGenreName,
            };
        case "author":
            return {
                ...authorSearchLogic,
                searchType,
                setSearchType,
                selectedGenreName: null, // ✅ placeholder
            };
        case "book":
        default:
            return {
                ...bookSearchLogic,
                searchType,
                setSearchType,
                selectedGenreName: null, // ✅ placeholder
            };
    }
};
