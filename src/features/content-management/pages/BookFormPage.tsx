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
import { BookFormData } from "@/features/content-management/components/BookForm/BookFormConfig";

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

    const handleSubmit = async (bookData: BookFormData | FormData) => {
        try {
            // Check if the data is a FormData object. If so, use it directly.
            // If it's not (e.g., in a non-file submission), create a new one.
            const formData = bookData instanceof FormData ? bookData : new FormData();

            if (!(bookData instanceof FormData)) {
                Object.keys(bookData).forEach(key => {
                    const value = bookData[key as keyof BookFormData];
                    if (value !== undefined && value !== null) {
                        if (Array.isArray(value)) {
                            value.forEach(item => formData.append(`${key}[]`, item as string));
                        } else if (value instanceof File) {
                            formData.append(key, value);
                        } else if (typeof value === 'object' && value !== null) {
                            // Handle nested objects if necessary
                        } else {
                            formData.append(key, String(value));
                        }
                    }
                });
            }

            if (isEditMode) {
                if (slug) {
                    await updateBook({ slug, formData: formData }).unwrap();
                    toast({
                        title: "Libro Actualizado",
                        description: `El libro ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                await createBook(formData).unwrap();
                toast({
                    title: "Libro Creado",
                    description: `El libro ha sido creado exitosamente.`,
                });
            }
            navigate("/gestion/coleccion");
        } catch (error) {
            toast({
                title: "Error",
                description: `Hubo un error al ${isEditMode ? "actualizar" : "crear"} el libro.`,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/gestion/coleccion");
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
                        initialData={isEditMode && book ? book : undefined}
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