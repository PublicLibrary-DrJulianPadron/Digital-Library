import React from 'react';
import { useGetSalasQuery } from '@/features/content-management/api/genresApiSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/components/ui/button';
import { BookOpen, AlertCircle } from 'lucide-react';

const RoomsPage = () => {
    const { data: salas, isLoading, isError } = useGetSalasQuery();
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-primary font-medium italic">Cargando salas...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Error al cargar las salas</h2>
                <p className="text-muted-foreground">Por favor, intente de nuevo más tarde.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-primary mb-4 tracking-tight">
                    Nuestras Salas
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Explore los diferentes espacios dedicados al conocimiento y la cultura.
                    Cada sala cuenta con una colección única esperando ser descubierta.
                </p>
                <div className="mt-6 flex justify-center">
                    <div className="h-1.5 w-24 bg-highlight-gold rounded-full"></div>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {salas?.map((item) => (
                    <button
                        key={item.sala}
                        onClick={() => navigate(`/sala/${item.sala}`)}
                        className="group relative flex flex-col items-center justify-center p-8 bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-highlight-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                        <div className="p-4 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300 mb-4">
                            <BookOpen className="h-8 w-8 text-primary" />
                        </div>

                        <h3 className="text-xl font-bold text-primary group-hover:text-highlight-gold transition-colors duration-300 text-center uppercase tracking-wide">
                            {item.sala}
                        </h3>

                        <div className="mt-4 flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                            <span className="bg-muted group-hover:bg-primary/10 px-3 py-1 rounded-full text-xs">
                                {item.entries} libros
                            </span>
                        </div>

                        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-primary text-sm font-semibold flex items-center">
                                Entrar a la sala
                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {!salas || salas.length === 0 && (
                <div className="text-center py-20 bg-muted rounded-2xl border-2 border-dashed border-border">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No se encontraron salas disponibles.</p>
                </div>
            )}
        </div>
    );
};

export default RoomsPage;
