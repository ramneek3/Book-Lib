import { removeBook, updateProgress } from './storage.js';

export function toggleModal(modalId, show = true) {
    const modal = document.getElementById(modalId);
    modal.classList.toggle('hidden', !show);

    if (show) {
        modal.classList.add('modal-show');
    }
}

export function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

export function createBookCard(book) {
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
                
                ${book.shelf === 'readingNow' ? createProgressBar(book.progress) : ''}
                
                <div class="flex gap-2 mt-2">
                    ${createBookActions(book)}
                </div>
            </div>
            
            <button class="delete-book text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove book">
                ✕
            </button>
        </div>
    `;

    attachBookCardListeners(div, book);

    return div;
}

function createProgressBar(progress) {
    return `
        <div class="mt-3">
            <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>${progress}%</span>
            </div>
            <div class="progress-bar bg-pink-100 rounded-full h-2 cursor-pointer">
                <div class="bg-pink-500 rounded-full h-2 transition-all" 
                     style="width: ${progress}%"></div>
            </div>
        </div>
    `;
}

function createBookActions(book) {
    const actions = [];
    
    if (book.shelf === 'readingNow') {
        actions.push(`
            <button class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors mark-complete">
                Mark Complete
            </button>
        `);
    }
    
    if (book.shelf === 'wantToRead') {
        actions.push(`
            <button class="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded hover:bg-pink-200 transition-colors start-reading">
                Start Reading
            </button>
        `);
    }
    
    return actions.join('');
}

function attachBookCardListeners(cardElement, book) {
    const deleteBtn = cardElement.querySelector('.delete-book');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Remove this book from your library?')) {
            removeBook(book.id);
            renderShelf(book.shelf);
        }
    });

    const progressBar = cardElement.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percentage = Math.round(((e.clientX - rect.left) / rect.width) * 100);
            updateProgress(book.id, percentage);
            renderShelf(book.shelf);
        });
    }

    const markCompleteBtn = cardElement.querySelector('.mark-complete');
    if (markCompleteBtn) {
        markCompleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moveBook(book.id, 'completed');
        });
    }

    const startReadingBtn = cardElement.querySelector('.start-reading');
    if (startReadingBtn) {
        startReadingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moveBook(book.id, 'readingNow');
        });
    }
}

export function createSearchResultItem(book, onSelect) {
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

    div.addEventListener('click', () => onSelect(book));
    return div;
}

export function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transform transition-all duration-300 translate-y-full`;
    
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.style.transform = 'translateY(0)', 10);

    setTimeout(() => {
        toast.style.transform = 'translateY(full)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function showError(message, container) {
    container.innerHTML = `
        <div class="text-center text-red-500 p-4">
            ${message}
        </div>
    `;
}

export function showEmptyState(container, message) {
    container.innerHTML = `
        <div class="text-center text-gray-500 py-8">
            ${message}
        </div>
    `;
}

export function renderShelf(shelf, books) {
    const shelfElement = document.getElementById(`${shelf}Shelf`);
    
    if (!books || books.length === 0) {
        showEmptyState(shelfElement, 'No books here yet ✨');
        return;
    }
    
    shelfElement.innerHTML = '';
    books.forEach(book => {
        const bookCard = createBookCard(book);
        shelfElement.appendChild(bookCard);
    });
}

export {
    toggleModal,
    setLoading,
    showToast,
    showError,
    showEmptyState
};