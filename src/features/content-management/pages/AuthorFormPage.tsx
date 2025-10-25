import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Author,
    AuthorRequest,
    useGetAuthorsQuery,
    useGetAuthorBySlugQuery,
    useUpdateAuthorMutation,
    useCreateAuthorMutation,
} from "@/features/content-management/api/authorsApiSlice";
import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { useToast } from "@/common/components/ui/use-toast";
import { ReturnButton } from "@/common/components/ui/return-button";
import { AuthorForm } from "@/features/content-management/components/AuthorForm/AuthorForm";

const AuthorFormPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const isEditMode = !!slug;

    const { data: author, isLoading: isAuthorLoading } = useGetAuthorBySlugQuery(slug, {
        skip: !isEditMode || !slug,
    });

    const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();
    const [createAuthor, { isLoading: isCreating }] = useCreateAuthorMutation();

    const isLoading = isAuthorLoading || isUpdating || isCreating;

    const handleSubmit = async (authorData: Partial<Author>) => {
        try {
            if (isEditMode) {
                if (slug) {
                    await updateAuthor({ slug, data: authorData as AuthorRequest }).unwrap();
                    toast({
                        title: "Autor Actualizado",
                        description: `El autor "${authorData.name}" ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                await createAuthor(authorData as AuthorRequest).unwrap();
                toast({
                    title: "Autor Creado",
                    description: `El autor "${authorData.name}" ha sido creado exitosamente.`,
                });
            }
            navigate("/gestion/autores");
        } catch (error) {
            toast({
                title: "Error",
                description: `Hubo un error al ${isEditMode ? "actualizar" : "crear"} el autor.`,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/gestion/autores");
    };

    return (
        <Card>
            <ReturnButton />
            <CardHeader className="px-0">
                <CardTitle>{isEditMode ? "Editar Autor" : "Añadir Nuevo Autor"}</CardTitle>
            </CardHeader>
            <div className="p-0">
                {isLoading ? (
                    <div>Cargando...</div>
                ) : (
                    <AuthorForm
                        author={isEditMode ? author : undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isUpdating || isCreating}
                        isUpdatingAuthor={isEditMode}
                    />
                )}
            </div>
        </Card>
    );
};

export default AuthorFormPage;