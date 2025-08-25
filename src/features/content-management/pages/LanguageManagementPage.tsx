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
import { LanguageForm } from "@/features/content-management/components/LanguageForm/LanguageForm";
import { Language, LanguageRequest, useGetLanguagesQuery, useCreateLanguageMutation, useUpdateLanguageMutation, useDeleteLanguageMutation } from '@/features/content-management/api/languagesApiSlice';

const LanguageManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLanguageFormOpen, setIsLanguageFormOpen] = useState(false);
    const [languageToEdit, setLanguageToEdit] = useState<Language | null>(null);
    const [languageToDelete, setLanguageToDelete] = useState<Language | null>(null);

    const { toast } = useToast();

    const { data: languages, isLoading, isFetching, error } = useGetLanguagesQuery();
    const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation();
    const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation();
    const [deleteLanguage, { isLoading: isDeleting }] = useDeleteLanguageMutation();

    const filteredLanguages = languages?.filter(language =>
        language.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLanguageFormSubmit = async (languageData: LanguageRequest) => {
        try {
            if (languageToEdit) {
                await updateLanguage({ id: languageToEdit.id, body: languageData }).unwrap();
                toast({
                    title: "Idioma actualizado",
                    description: "Los detalles del idioma han sido actualizados exitosamente.",
                });
            } else {
                await createLanguage(languageData).unwrap();
                toast({
                    title: "Idioma agregado",
                    description: "El nuevo idioma ha sido agregado al catálogo exitosamente.",
                });
            }
            setIsLanguageFormOpen(false);
            setLanguageToEdit(null);
        } catch (err) {
            toast({
                title: "Error",
                description: `No se pudo ${languageToEdit ? 'actualizar' : 'agregar'} el idioma. Inténtalo de nuevo.`,
                variant: "destructive",
            });
        }
    };

    const handleDeleteLanguage = async () => {
        if (languageToDelete) {
            try {
                await deleteLanguage(languageToDelete.id).unwrap();
                toast({
                    title: "Idioma eliminado",
                    description: "El idioma ha sido eliminado del catálogo.",
                });
                setLanguageToDelete(null);
            } catch (err) {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar el idioma. Inténtalo de nuevo.",
                    variant: "destructive",
                });
            }
        }
    };

    const openDeleteDialog = (language: Language) => {
        setLanguageToDelete(language);
    };

    const openAddLanguageForm = () => {
        setLanguageToEdit(null);
        setIsLanguageFormOpen(true);
    };

    const openEditLanguageForm = (language: Language) => {
        setLanguageToEdit(language);
        setIsLanguageFormOpen(true);
    };

    const handleLanguageFormCancel = () => {
        setIsLanguageFormOpen(false);
        setLanguageToEdit(null);
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
                    Error al cargar los idiomas.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-foreground">Idiomas</h1>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex-1 w-full">
                        <Input
                            placeholder="Buscar idioma..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Dialog open={isLanguageFormOpen} onOpenChange={setIsLanguageFormOpen} aria-labelledby="add-edit-language-dialog-title">
                        <DialogTrigger asChild>
                            <Button
                                onClick={openAddLanguageForm}
                                className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white w-full sm:w-auto"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Idioma
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle id="add-edit-language-dialog-title" className="text-biblioteca-blue font-display text-xl">
                                    {languageToEdit ? 'Editar Idioma' : 'Agregar Nuevo Idioma'}
                                </DialogTitle>
                            </DialogHeader>
                            <LanguageForm
                                language={languageToEdit}
                                onSubmit={handleLanguageFormSubmit}
                                onCancel={handleLanguageFormCancel}
                                isSubmitting={isCreating || isUpdating}
                                isUpdatingLanguage={!!languageToEdit}
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
                                <TableHead>Nombre del Idioma</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLanguages?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                        No se encontraron idiomas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLanguages?.map((language) => (
                                    <TableRow key={language.id}>
                                        <TableCell className="font-medium">{language.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditLanguageForm(language)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog open={!!languageToDelete && languageToDelete.id === language.id} onOpenChange={(open) => !open && setLanguageToDelete(null)}>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(language)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                ¿Estás seguro de que quieres eliminar el idioma "{languageToDelete?.name}"? Esta acción no se puede deshacer.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleDeleteLanguage} className="bg-red-600 hover:bg-red-700">
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
                {filteredLanguages?.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">No se encontraron idiomas.</p>
                    </div>
                ) : (
                    filteredLanguages?.map((language) => (
                        <Card key={language.id}>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-sm">{language.name}</h3>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => openEditLanguageForm(language)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog open={!!languageToDelete && languageToDelete.id === language.id} onOpenChange={(open) => !open && setLanguageToDelete(null)}>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(language)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            ¿Estás seguro de que quieres eliminar el idioma "{languageToDelete?.name}"? Esta acción no se puede deshacer.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDeleteLanguage} className="bg-red-600 hover:bg-red-700">
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

export default LanguageManagementPage;