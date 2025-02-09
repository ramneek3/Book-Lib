import { searchBooks, getBookDetails } from './api.js';
import { addBook, removeBook, updateProgress, getBooksByShelf } from './storage.js';


const addBookBtn = document.getElementById('addBookBtn');
const addBookModal = document.getElementById('addBookModal');
const bookSearchInput = document.getElementById('bookSearch');
const searchResults = document.getElementById('searchResults');
const selectedBook = document.getElementById('selectedBook');
const selectedBookCover = document.getElementById('selectedBookCover');
const selectedBookTitle = document.getElementById('selectedBookTitle');
const selectedBookAuthor = document.getElementById('selectedBookAuthor');
const shelfSelect = document.getElementById('shelfSelect');
const confirmAddBook = document.getElementById('confirmAddBook');
const cancelAddBook = document.getElementById('cancelAddBook');

let selectedBookData = null;

addBookBtn.addEventListener('click', () => toggleModal(true));
cancelAddBook.addEventListener('click', () => toggleModal(false));

let searchTimeout;
bookSearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length < 3) {
        searchResults.innerHTML = '';
        searchResults.classList.add('hidden');
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        const books = await searchBooks(query);
        renderSearchResults(books);
    }, 300);
});

confirmAddBook.addEventListener('click', () => {
    if (!selectedBookData) return;

    const shelf = shelfSelect.value;
    addBook(selectedBookData, shelf);
    renderShelf(shelf);
    toggleModal(false);
    resetSearch();
});

function toggleModal(show) {
    addBookModal.classList.toggle('hidden', !show);
    if (!show) {
        resetSearch();
    }
}

function resetSearch() {
    bookSearchInput.value = '';
    searchResults.innerHTML = '';
    searchResults.classList.add('hidden');
    selectedBook.classList.add('hidden');
    selectedBookData = null;
    confirmAddBook.disabled = true;
}

function renderSearchResults(books) {
    searchResults.innerHTML = '';
    searchResults.classList.remove('hidden');

    if (books.length === 0) {
        searchResults.innerHTML = `
            <div class="p-4 text-gray-500 text-center">
                No books found
            </div>
        `;
        return;
    }

    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'flex gap-4 p-4 hover:bg-pink-50 cursor-pointer';
        div.innerHTML = `
            <img src="${book.coverUrl}" 
                 class="w-12 h-16 object-cover rounded" 
                 alt="${book.title}"
                 onerror="this.src='/assets/book-placeholder.png'">
            <div>
                <h4 class="font-medium">${book.title}</h4>
                <p class="text-sm text-gray-600">${book.authors[0]}</p>
            </div>
        `;

        div.addEventListener('click', () => selectBook(book));
        searchResults.appendChild(div);
    });
}

function selectBook(book) {
    selectedBookData = book;
    selectedBook.classList.remove('hidden');
    searchResults.classList.add('hidden');
    confirmAddBook.disabled = false;

    selectedBookCover.src = book.coverUrl;
    selectedBookCover.onerror = () => selectedBookCover.src = '/assets/book-placeholder.png';
    selectedBookTitle.textContent = book.title;
    selectedBookAuthor.textContent = book.authors[0];
}

function renderBook(book) {
    const div = document.createElement('div');
    div.className = 'book-card bg-white rounded-lg shadow-sm p-4 transition-all';
    div.innerHTML = `
        <div class="flex gap-4">
            <img src="${book.coverUrl}" 
                 alt="${book.title}"
                 class="w-20 h-28 object-cover rounded-md shadow-sm"
                 onerror="this.src='/assets/book-placeholder.png'">
            
            <div class="flex-1">
                <h3 class="font-semibold text-gray-800">${book.title}</h3>
                <p class="text-sm text-gray-600">${book.authors[0]}</p>
                
                ${book.shelf === 'readingNow' ? `
                    <div class="mt-3">
                        <div class="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>${book.progress}%</span>
                        </div>
                        <div class="progress-bar bg-pink-100 rounded-full h-2 cursor-pointer">
                            <div class="bg-pink-500 rounded-full h-2 transition-all" 
                                 style="width: ${book.progress}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <button class="delete-book text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove book">
                ✕
            </button>
        </div>
    `;

    const deleteBtn = div.querySelector('.delete-book');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Remove this book from your library?')) {
            removeBook(book.id);
            renderShelf(book.shelf);
        }
    });

    const progressBar = div.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percentage = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            updateProgress(book.id, percentage);
            renderShelf(book.shelf);
        });
    }

    return div;
}

function renderShelf(shelfId) {
    const shelfElement = document.getElementById(`${shelfId}Shelf`);
    const books = getBooksByShelf(shelfId);
    
    shelfElement.innerHTML = '';
    
    if (books.length === 0) {
        shelfElement.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                No books here yet ✨
            </div>
        `;
        return;
    }
    
    books.forEach(book => {
        const bookElement = renderBook(book);
        shelfElement.appendChild(bookElement);
    });
}

function initializeApp() {
    ['readingNow', 'wantToRead', 'completed'].forEach(renderShelf);

    addBookModal.addEventListener('click', (e) => {
        if (e.target === addBookModal) {
            toggleModal(false);
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeApp);