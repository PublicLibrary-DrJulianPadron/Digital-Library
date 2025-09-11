// src/features/content-management/pages/FormBookPage.tsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookForm } from "@/features/content-management/components/BookForm/BookForm";
import {
    Book,
    BookRequest,
    useGetBookBySlugQuery,
    useUpdateBookMutation,
    usePartialUpdateBookMutation,
    useCreateBookMutation,
} from "@/features/content-management/api/booksApiSlice";
import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { useToast } from "@/common/components/ui/use-toast";
import { ReturnButton } from "@/common/components/ui/return-button";

const BookFormPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const isEditMode = !!slug;

    const { data: book, isLoading: isBookLoading } = useGetBookBySlugQuery(slug, {
        skip: !isEditMode,
    });

    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
    const [partialUpdateBook, { isLoading: isPartialUpdating }] =
        usePartialUpdateBookMutation();
    const [createBook, { isLoading: isCreating }] = useCreateBookMutation();

    const isLoading = isBookLoading || isUpdating || isPartialUpdating || isCreating;

    const handleSubmit = async (bookData: Partial<Book>) => {
        try {
            if (isEditMode) {
                if (slug) {
                    await updateBook({ slug, body: bookData as BookRequest }).unwrap();
                    toast({
                        title: "Libro Actualizado",
                        description: `El libro "${bookData.title}" ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                await createBook(bookData as BookRequest).unwrap();
                toast({
                    title: "Libro Creado",
                    description: `El libro "${bookData.title}" ha sido creado exitosamente.`,
                });
            }
            navigate("/content-management/books");
        } catch (error) {
            toast({
                title: "Error",
                description: `Hubo un error al ${isEditMode ? "actualizar" : "crear"} el libro.`,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/content-management/books");
    };

    return (
        <Card>
            <ReturnButton />
            <CardHeader className="px-0">
                <CardTitle>{isEditMode ? "Editar Libro" : "Añadir Nuevo Libro"}</CardTitle>
            </CardHeader>
            <div className="p-0">
                {isEditMode && isBookLoading ? (
                    <div>Cargando libro...</div>
                ) : (
                    <BookForm
                        initialData={isEditMode ? book : undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isLoading}
                    />
                )}
            </div>
        </Card>
    );
};

export default BookFormPage;