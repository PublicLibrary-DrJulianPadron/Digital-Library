import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Genre,
    GenreRequest,
    useGetGenreBySlugQuery,
    useUpdateGenreMutation,
    useCreateGenreMutation,
    useGetGenresQuery, // Import this hook
} from "@/features/content-management/api/genresApiSlice";
import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { useToast } from "@/common/components/ui/use-toast";
import { ReturnButton } from "@/common/components/ui/return-button";
import { GenreForm } from "@/features/content-management/components/GenreForm/GenreForm";

const GenreFormPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const isEditMode = !!slug;

    const { data: genre, isLoading: isGenreLoading } = useGetGenreBySlugQuery(slug, {
        skip: !isEditMode,
    });

    const { data: allSalasData, isLoading: isSalasLoading } = useGetGenresQuery({ page_size: 1000 });
    const uniqueSalas = allSalasData?.results
        ? Array.from(new Set(allSalasData.results.map((genre) => genre.sala).filter(Boolean))) as string[]
        : [];


    const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation();
    const [createGenre, { isLoading: isCreating }] = useCreateGenreMutation();

    const isLoading = isGenreLoading || isUpdating || isCreating || isSalasLoading;

    const handleSubmit = async (genreData: Partial<Genre>) => {
        try {
            if (isEditMode) {
                if (slug) {
                    await updateGenre({ slug, data: genreData as GenreRequest }).unwrap();
                    toast({
                        title: "Género Actualizado",
                        description: `El género "${genreData.label}" ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                await createGenre(genreData as GenreRequest).unwrap();
                toast({
                    title: "Género Creado",
                    description: `El género "${genreData.label}" ha sido creado exitosamente.`,
                });
            }
            navigate("/gestion/generos");
        } catch (error) {
            toast({
                title: "Error",
                description: `Hubo un error al ${isEditMode ? "actualizar" : "crear"} el género.`,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/gestion/generos");
    };

    return (
        <Card>
            <ReturnButton />
            <CardHeader className="px-0">
                <CardTitle>{isEditMode ? "Editar Género" : "Añadir Nuevo Género"}</CardTitle>
            </CardHeader>
            <div className="p-0">
                {isLoading ? (
                    <div>Cargando...</div>
                ) : (
                    <GenreForm
                        genre={isEditMode ? genre : undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isUpdating || isCreating}
                        salas={uniqueSalas}
                    />
                )}
            </div>
        </Card>
    );
};

export default GenreFormPage;