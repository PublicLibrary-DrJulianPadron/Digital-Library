import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Language,
    LanguageRequest,
    useGetLanguageByIdQuery,
    useUpdateLanguageMutation,
    useCreateLanguageMutation,
} from "@/features/content-management/api/languagesApiSlice";
import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { useToast } from "@/common/components/ui/use-toast";
import { ReturnButton } from "@/common/components/ui/return-button";
import { LanguageForm } from "@/features/content-management/components/LanguageForm/LanguageForm";

const LanguageFormPage: React.FC = () => {
    const { id: idString } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const id = idString ? Number(idString) : undefined;
    const isEditMode = !!id;

    const { data: language, isLoading: isLanguageLoading } = useGetLanguageByIdQuery(id, {
        skip: !isEditMode || isNaN(id),
    });

    const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation();
    const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation();

    const isLoading = isLanguageLoading || isUpdating || isCreating;

    const handleSubmit = async (languageData: Partial<Language>) => {
        try {
            if (isEditMode) {
                if (id) {
                    await updateLanguage({ id, body: languageData as LanguageRequest }).unwrap();
                    toast({
                        title: "Idioma Actualizado",
                        description: `El idioma "${languageData.name}" ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                await createLanguage(languageData as LanguageRequest).unwrap();
                toast({
                    title: "Idioma Creado",
                    description: `El idioma "${languageData.name}" ha sido creado exitosamente.`,
                });
            }
            navigate("/gestion/lenguajes");
        } catch (error) {
            toast({
                title: "Error",
                description: `Hubo un error al ${isEditMode ? "actualizar" : "crear"} el idioma.`,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/gestion/lenguajes");
    };

    return (
        <Card>
            <ReturnButton />
            <CardHeader className="px-0">
                <CardTitle>{isEditMode ? "Editar Idioma" : "Añadir Nuevo Idioma"}</CardTitle>
            </CardHeader>
            <div className="p-0">
                {isLoading ? (
                    <div>Cargando...</div>
                ) : (
                    <LanguageForm
                        language={isEditMode ? language : undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isUpdating || isCreating}
                        isUpdatingLanguage={isEditMode}
                    />
                )}
            </div>
        </Card>
    );
};

export default LanguageFormPage;