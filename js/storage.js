const STORAGE_KEY = 'cozyLibrary';

export function getAllBooks() {
    try {
        const books = localStorage.getItem(STORAGE_KEY);
        return books ? JSON.parse(books) : [];
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return [];
    }
}

export function getBooksByShelf(shelf) {
    return getAllBooks().filter(book => book.shelf === shelf);
}

export function addBook(bookData, shelf) {
    try {
        const books = getAllBooks();
        
        const existingBook = books.find(book => book.id === bookData.id);
        if (existingBook) {
            existingBook.shelf = shelf;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
            return existingBook;
        }

        const newBook = {
            ...bookData,
            shelf,
            addedDate: new Date().toISOString(),
            progress: 0,
            notes: []
        };

        books.push(newBook);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        return newBook;
    } catch (error) {
        console.error('Error adding book:', error);
        return null;
    }
}

export function updateBook(bookId, updates) {
    try {
        const books = getAllBooks();
        const index = books.findIndex(book => book.id === bookId);
        
        if (index === -1) return null;

        books[index] = { ...books[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        return books[index];
    } catch (error) {
        console.error('Error updating book:', error);
        return null;
    }
}

export function removeBook(bookId) {
    try {
        const books = getAllBooks();
        const filteredBooks = books.filter(book => book.id !== bookId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBooks));
        return true;
    } catch (error) {
        console.error('Error removing book:', error);
        return false;
    }
}

export function updateProgress(bookId, progress) {
    return updateBook(bookId, { 
        progress,
        lastUpdated: new Date().toISOString()
    });
}

export function addNote(bookId, noteText) {
    const book = getAllBooks().find(b => b.id === bookId);
    if (!book) return null;

    const notes = [...(book.notes || []), {
        id: Date.now(),
        text: noteText,
        date: new Date().toISOString()
    }];

    return updateBook(bookId, { notes });
}