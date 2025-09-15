import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MaterialType,
    MaterialTypeRequest,
    useGetMaterialTypeByIdQuery,
    useUpdateMaterialTypeMutation,
    useCreateMaterialTypeMutation,
} from "@/features/content-management/api/materialTypesApiSlice";
import { Card, CardHeader, CardTitle } from "@/common/components/ui/card";
import { useToast } from "@/common/components/ui/use-toast";
import { ReturnButton } from "@/common/components/ui/return-button";
import { MaterialForm } from "@/features/content-management/components/MaterialForm/MaterialForm";

const MaterialFormPage: React.FC = () => {
    const { id: idString } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();

    const id = idString ? Number(idString) : undefined;
    const isEditMode = !!id;

    const { data: materialType, isLoading: isMaterialLoading } = useGetMaterialTypeByIdQuery(id, {
        skip: !isEditMode || isNaN(id),
    });

    const [updateMaterialType, { isLoading: isUpdating }] = useUpdateMaterialTypeMutation();
    const [createMaterialType, { isLoading: isCreating }] = useCreateMaterialTypeMutation();

    const isLoading = isMaterialLoading || isUpdating || isCreating;

    const handleSubmit = async (materialData: Partial<MaterialType>) => {
        try {
            if (isEditMode) {
                if (id) {
                    await updateMaterialType({ id, body: materialData as MaterialTypeRequest }).unwrap();
                    toast({
                        title: "Tipo de Material Actualizado",
                        description: `El tipo de material "${materialData.name}" ha sido actualizado exitosamente.`,
                    });
                }
            } else {
                await createMaterialType(materialData as MaterialTypeRequest).unwrap();
                toast({
                    title: "Tipo de Material Creado",
                    description: `El tipo de material "${materialData.name}" ha sido creado exitosamente.`,
                });
            }
            navigate("/gestion/materiales");
        } catch (error) {
            toast({
                title: "Error",
                description: `Hubo un error al ${isEditMode ? "actualizar" : "crear"} el tipo de material.`,
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/gestion/materiales");
    };

    return (
        <Card>
            <ReturnButton />
            <CardHeader className="px-0">
                <CardTitle>{isEditMode ? "Editar Tipo de Material" : "Añadir Nuevo Tipo de Material"}</CardTitle>
            </CardHeader>
            <div className="p-0">
                {isLoading ? (
                    <div>Cargando...</div>
                ) : (
                    <MaterialForm
                        materialType={isEditMode ? materialType : undefined}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        isSubmitting={isUpdating || isCreating}
                        isUpdatingMaterial={isEditMode}
                    />
                )}
            </div>
        </Card>
    );
};

export default MaterialFormPage;
