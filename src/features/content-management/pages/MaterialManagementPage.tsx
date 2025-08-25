import React, { useState } from "react";
import { Card, CardContent } from "@/common/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/common/components/ui/table";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/common/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/common/components/ui/alert-dialog";
import { Badge } from "@/common/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/common/hooks/use-toast";
import { MaterialForm } from "@/features/content-management/components/MaterialForm/MaterialForm";
import {
    MaterialType,
    useGetMaterialTypesQuery,
    useCreateMaterialTypeMutation,
    useUpdateMaterialTypeMutation,
    useDeleteMaterialTypeMutation,
} from '@/features/content-management/api/materialTypesApiSlice';

const MaterialManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMaterialFormOpen, setIsMaterialFormOpen] = useState(false);
    const [materialTypeToEdit, setMaterialTypeToEdit] = useState<MaterialType | null>(null);
    const [materialTypeToDelete, setMaterialTypeToDelete] = useState<MaterialType | null>(null);

    const { toast } = useToast();

    const { data: materialTypes, isLoading, isFetching, error } = useGetMaterialTypesQuery();
    const [createMaterialType, { isLoading: isCreating }] = useCreateMaterialTypeMutation();
    const [updateMaterialType, { isLoading: isUpdating }] = useUpdateMaterialTypeMutation();
    const [deleteMaterialType, { isLoading: isDeleting }] = useDeleteMaterialTypeMutation();

    const filteredMaterialTypes = materialTypes?.filter(materialType =>
        materialType.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMaterialFormSubmit = async (materialData: Omit<MaterialType, 'id'>) => {
        try {
            if (materialTypeToEdit) {
                await updateMaterialType({ id: materialTypeToEdit.id, body: materialData }).unwrap();
                toast({
                    title: "Tipo de Material actualizado",
                    description: "Los detalles del tipo de material han sido actualizados exitosamente.",
                });
            } else {
                await createMaterialType(materialData).unwrap();
                toast({
                    title: "Tipo de Material agregado",
                    description: "El nuevo tipo de material ha sido agregado al catálogo exitosamente.",
                });
            }
            setIsMaterialFormOpen(false);
            setMaterialTypeToEdit(null);
        } catch (err) {
            toast({
                title: "Error",
                description: `No se pudo ${materialTypeToEdit ? 'actualizar' : 'agregar'} el tipo de material. Inténtalo de nuevo.`,
                variant: "destructive",
            });
        }
    };

    const handleDeleteMaterialType = async () => {
        if (materialTypeToDelete) {
            try {
                await deleteMaterialType(materialTypeToDelete.id).unwrap();
                toast({
                    title: "Tipo de Material eliminado",
                    description: "El tipo de material ha sido eliminado del catálogo.",
                });
                setMaterialTypeToDelete(null);
            } catch (err) {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el tipo de material. Inténtalo de nuevo.",
                    variant: "destructive",
                });
            }
        }
    };

    const openDeleteDialog = (materialType: MaterialType) => {
        setMaterialTypeToDelete(materialType);
    };

    const openAddMaterialForm = () => {
        setMaterialTypeToEdit(null);
        setIsMaterialFormOpen(true);
    };

    const openEditMaterialForm = (materialType: MaterialType) => {
        setMaterialTypeToEdit(materialType);
        setIsMaterialFormOpen(true);
    };

    const handleMaterialFormCancel = () => {
        setIsMaterialFormOpen(false);
        setMaterialTypeToEdit(null);
    };

    if (isLoading || isFetching) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/4"></div>
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
                <div className="text-xl font-medium text-red-500">
                    Error al cargar los tipos de material.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-foreground">Tipos de Material</h1>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="Buscar tipo de material..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Dialog open={isMaterialFormOpen} onOpenChange={setIsMaterialFormOpen} aria-labelledby="add-edit-material-dialog-title">
                        <DialogTrigger asChild>
                            <Button
                                onClick={openAddMaterialForm}
                                className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Tipo de Material
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle id="add-edit-material-dialog-title" className="text-biblioteca-blue font-display text-xl">
                                    {materialTypeToEdit ? 'Editar Tipo de Material' : 'Agregar Nuevo Tipo de Material'}
                                </DialogTitle>
                            </DialogHeader>
                            <MaterialForm
                                materialType={materialTypeToEdit}
                                onSubmit={handleMaterialFormSubmit}
                                onCancel={handleMaterialFormCancel}
                                isSubmitting={isCreating || isUpdating}
                                isUpdatingMaterial={!!materialTypeToEdit}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre del Tipo de Material</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMaterialTypes?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                        No se encontraron tipos de material.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMaterialTypes?.map((materialType) => (
                                    <TableRow key={materialType.id}>
                                        <TableCell className="font-medium">{materialType.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditMaterialForm(materialType)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog open={!!materialTypeToDelete && materialTypeToDelete.id === materialType.id} onOpenChange={(open) => !open && setMaterialTypeToDelete(null)}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(materialType)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                ¿Estás seguro de que quieres eliminar el tipo de material "{materialTypeToDelete?.name}"? Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDeleteMaterialType} className="bg-red-600 hover:bg-red-700">
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid gap-4">
                {filteredMaterialTypes?.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No se encontraron tipos de material.</p>
                    </div>
                ) : (
                    filteredMaterialTypes?.map((materialType) => (
                        <Card key={materialType.id}>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-sm">{materialType.name}</h3>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => openEditMaterialForm(materialType)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog open={!!materialTypeToDelete && materialTypeToDelete.id === materialType.id} onOpenChange={(open) => !open && setMaterialTypeToDelete(null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(materialType)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            ¿Estás seguro de que quieres eliminar el tipo de material "{materialTypeToDelete?.name}"? Esta acción no se puede deshacer.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDeleteMaterialType} className="bg-red-600 hover:bg-red-700">
                                                            Eliminar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default MaterialManagementPage;