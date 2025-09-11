import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetSalaWithGenresQuery } from '@/features/content-management/api/genresApiSlice';

export const useGenreSearch = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const genreFromUrl = params.get("genre");

    const [selectedGenreSlug, setSelectedGenreSlug] = useState<string | null>(genreFromUrl);
    const [selectedGenreName, setSelectedGenreName] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

    const { data: salas, isLoading: isLoadingSalas } = useGetSalaWithGenresQuery();

    // debounce
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
        }, 50);
        return () => clearTimeout(t);
    }, [searchQuery]);

    // filtrar resultados
    useEffect(() => {
        if (debouncedQuery && salas) {
            const lowerValue = debouncedQuery.toLowerCase();
            const results = salas.flatMap((sala: any) =>
                sala.genres
                    .filter((g: any) => g.label.toLowerCase().includes(lowerValue))
                    .map((g: any) => ({ ...g, sala: sala.sala }))
            );
            setFilteredResults(results.slice(0, 5));
        } else {
            setFilteredResults([]);
        }
    }, [debouncedQuery, salas]);

    // actualizar nombre cuando cambia la URL (?genre=...)
    useEffect(() => {
        if (genreFromUrl && salas) {
            const foundGenre = salas
                .flatMap((sala: any) => sala.genres)
                .find((g: any) => g.slug === genreFromUrl);

            if (foundGenre) {
                setSelectedGenreName(foundGenre.label);
            } else {
                setSelectedGenreName(null);
            }
        } else {
            setSelectedGenreName(null);
        }
    }, [genreFromUrl, salas]);

    const handleSearch = () => {
        const resultToRedirect =
            highlightedIndex !== null
                ? filteredResults[highlightedIndex]
                : filteredResults[0];

        if (resultToRedirect) {
            navigate(`/catalogo?genre=${resultToRedirect.slug}`);
            setSelectedGenreSlug(resultToRedirect.slug);
            setSelectedGenreName(resultToRedirect.label); // 👈 actualizar nombre aquí
            setSearchQuery(resultToRedirect.label);
        }
        setFilteredResults([]);
        setHighlightedIndex(null);
    };

    const handleSuggestionClick = (item: any) => {
        navigate(`/catalogo?genre=${item.slug}`);
        setSelectedGenreSlug(item.slug);
        setSelectedGenreName(item.label); // 👈 actualizar nombre aquí
        setSearchQuery(item.label);
        setFilteredResults([]);
    };

    const renderSuggestion = (item: any) => `${item.label} (${item.sala})`;

    return {
        searchQuery,
        setSearchQuery,
        filteredResults,
        handleSearch,
        handleSuggestionClick,
        highlightedIndex,
        setHighlightedIndex,
        isLoading: isLoadingSalas,
        renderSuggestion,
        genreFromUrl,
        selectedGenreName, // 👈 ahora siempre estará actualizado
    };
};
