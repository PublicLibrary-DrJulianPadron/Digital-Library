import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAuthorsQuery } from "@/features/content-management/api/authorsApiSlice";
import { skipToken } from '@reduxjs/toolkit/query/react';

export const useAuthorSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState<any[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

    const authorsQueryArg = debouncedQuery ? { search: debouncedQuery, page_size: 5 } : skipToken;
    const { data: authorsData, isFetching: authorsLoading } = useGetAuthorsQuery(authorsQueryArg);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedQuery(searchQuery.trim());
        }, 50);
        return () => clearTimeout(t);
    }, [searchQuery]);

    useEffect(() => {
        if (authorsData?.results) {
            setFilteredResults(authorsData.results.slice(0, 5));
        } else {
            setFilteredResults([]);
        }
    }, [authorsData]);

    const handleSearch = () => {
        const resultToRedirect = highlightedIndex !== null ? filteredResults[highlightedIndex] : filteredResults[0];
        if (resultToRedirect) {
            navigate(`/autor/${resultToRedirect.slug}`);
        }
        setFilteredResults([]);
        setHighlightedIndex(null);
    };

    const handleSuggestionClick = (item: any) => {
        navigate(`/autor/${item.slug}`);
        setSearchQuery("");
        setFilteredResults([]);
    };

    const renderSuggestion = (item: any) => item.name;

    return {
        searchQuery,
        setSearchQuery,
        filteredResults,
        handleSearch,
        handleSuggestionClick,
        highlightedIndex,
        setHighlightedIndex,
        isLoading: authorsLoading,
        renderSuggestion,
    };
};