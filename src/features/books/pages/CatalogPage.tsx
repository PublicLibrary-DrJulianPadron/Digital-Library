import React, { useState } from 'react';
import { BookList } from '@/features/books/components/BookList';
import { BookForm } from '@/features/books/components/BookForm/BookForm';
import { BookSearch } from '@/features/books/components/BookSearch';
import { Button } from '@/common/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/common/components/ui/dialog';
import { BookRow, Book } from '@/features/books/types/books';
import { MaterialType, LanguageCode } from "@/common/common/enums";


const Catalog = () => {
    const [books, setBooks] = useState<BookRow[]>([
        {
            id: '1',
            title: 'Cien Años de Soledad',
            author: 'Gabriel García Márquez',
            isbn: '978-0-06-088328-7',
            genre: 'Realismo Mágico',
            publisher: 'Editorial Sudamericana',
            publicationYear: 1967,
            quantityInStock: 5,
            availableCopies: 3,
            description: 'Una obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo.',
            coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
            language: LanguageCode.Spanish,
            pages: 417,
            location: 'Estante A-1',
            created_at: new Date('2024-01-15'),
            updated_at: new Date('2024-01-15')
        },
        {
            id: '2',
            title: 'Doña Bárbara',
            author: 'Rómulo Gallegos',
            isbn: '978-84-376-0494-7',
            genre: 'Novela Criollista',
            publisher: 'Cátedra',
            publicationYear: 1929,
            quantityInStock: 3,
            availableCopies: 2,
            description: 'Clásico de la literatura venezolana que retrata la lucha entre civilización y barbarie en los llanos venezolanos.',
            coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
            language: LanguageCode.Spanish,
            pages: 384,
            location: 'Estante B-2',
            created_at: new Date('2024-01-10'),
            updated_at: new Date('2024-01-10')
        },
        {
            id: '3',
            title: 'Las Lanzas Coloradas',
            author: 'Arturo Uslar Pietri',
            isbn: '978-980-01-0123-4',
            genre: 'Novela Histórica',
            publisher: 'Monte Ávila Editores',
            publicationYear: 1931,
            quantityInStock: 4,
            availableCopies: 0,
            description: 'Novela histórica sobre la Guerra de Independencia de Venezuela, considerada una de las mejores obras de la literatura venezolana.',
            coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
            language: LanguageCode.Spanish,
            pages: 298,
            location: 'Estante B-3',
            created_at: new Date('2024-01-05'),
            updated_at: new Date('2024-01-05')
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<BookRow | null>(null);

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn.includes(searchTerm);
        const matchesGenre = !selectedGenre || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    const genres = Array.from(new Set(books.map(book => book.genre)));

    const handleGenreChange = (value: string) => {
        // Convert "all-genres" back to empty string for internal state
        setSelectedGenre(value === 'all-genres' ? '' : value);
    };

    const handleAddBook = (bookData: Omit<BookRow, 'id' | 'created_at' | 'updated_at'>) => {
        const newBook: BookRow = {
            ...bookData,
            id: Date.now().toString(),
            created_at: new Date(),
            updated_at: new Date()
        };
        setBooks([...books, newBook]);
        setIsFormOpen(false);
    };

    const handleEditBook = (bookData: Omit<BookRow, 'id' | 'created_at' | 'updated_at'>) => {
        if (editingBook) {
            const updatedBook: BookRow = {
                ...bookData,
                id: editingBook.id,
                created_at: editingBook.created_at,
                updated_at: new Date()
            };
            setBooks(books.map(book => book.id === editingBook.id ? updatedBook : book));
            setEditingBook(null);
            setIsFormOpen(false);
        }
    };

    const handleDeleteBook = (bookId: string) => {
        setBooks(books.filter(book => book.id !== bookId));
    };

    const openEditForm = (book: BookRow) => {
        setEditingBook(book);
        setIsFormOpen(true);
    };

    const openAddForm = () => {
        setEditingBook(null);
        setIsFormOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-biblioteca-blue rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="font-display text-3xl font-bold text-biblioteca-blue">
                                    Gestión de Catálogo
                                </h1>
                                <p className="text-biblioteca-gray">
                                    Administra la colección de libros de la biblioteca
                                </p>
                            </div>
                        </div>

                        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} aria-labelledby="dialog-title">
                            <DialogTrigger asChild>
                                <Button
                                    onClick={openAddForm}
                                    className="bg-biblioteca-blue hover:bg-biblioteca-blue/90 text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Libro
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-biblioteca-blue font-display text-xl">
                                        {editingBook ? 'Editar Libro' : 'Agregar Nuevo Libro'}
                                    </DialogTitle>
                                </DialogHeader>
                                <BookForm
                                    book={editingBook}
                                    onSubmit={editingBook ? handleEditBook : handleAddBook}
                                    onCancel={() => setIsFormOpen(false)}
                                />
                            </DialogContent>
                        </Dialog>
                        
                    </div>

                    {/* Search and Filters */}
                    <BookSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        selectedGenre={selectedGenre || 'all-genres'}
                        onGenreChange={handleGenreChange}
                        genres={genres}
                    />          {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-biblioteca-blue">{books.length}</div>
                            <div className="text-sm text-biblioteca-gray">Total de Libros</div>
                        </div>
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-biblioteca-blue">
                                {books.reduce((sum, book) => sum + book.quantityInStock, 0)}
                            </div>
                            <div className="text-sm text-biblioteca-gray">Total de Ejemplares</div>
                        </div>
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {books.reduce((sum, book) => sum + book.availableCopies, 0)}
                            </div>
                            <div className="text-sm text-biblioteca-gray">Disponibles</div>
                        </div>
                        <div className="bg-biblioteca-light/30 rounded-lg p-4">
                            <div className="text-2xl font-bold text-biblioteca-red">
                                {books.reduce((sum, book) => sum + (book.quantityInStock - book.availableCopies), 0)}
                            </div>
                            <div className="text-sm text-biblioteca-gray">En Préstamo</div>
                        </div>
                    </div>
                </div>

                {/* Book List */}
                <BookList
                    books={filteredBooks}
                    onEdit={openEditForm}
                    onDelete={handleDeleteBook}
                />
            </div>
        </div>
    );
};

export default Catalog;