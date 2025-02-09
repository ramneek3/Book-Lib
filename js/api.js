const BASE_URL = 'https://openlibrary.org';

export async function searchBooks(query) {
    if (!query?.trim()) return [];

    try {
        const response = await fetch(
            `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=8`
        );
        
        if (!response.ok) throw new Error('Failed to fetch books');

        const data = await response.json();
        
        return data.docs.map(book => ({
            id: book.key,
            title: book.title,
            authors: book.author_name || ['Unknown Author'],
            coverUrl: book.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                : '/assets/book-placeholder.png',
            description: book.first_sentence || '',
            subjects: book.subject || [],
            firstPublishYear: book.first_publish_year || '',
            isbn: book.isbn?.[0] || ''
        }));
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
}

export async function getBookDetails(bookId) {
    try {
        const response = await fetch(`${BASE_URL}${bookId}.json`);
        if (!response.ok) throw new Error('Failed to fetch book details');

        const book = await response.json();
        
        let authorName = 'Unknown Author';
        if (book.authors?.[0]?.author?.key) {
            try {
                const authorResponse = await fetch(`${BASE_URL}${book.authors[0].author.key}.json`);
                if (authorResponse.ok) {
                    const authorData = await authorResponse.json();
                    authorName = authorData.name;
                }
            } catch (e) {
                console.error('Error fetching author:', e);
            }
        }

        return {
            id: book.key,
            title: book.title,
            authors: [authorName],
            coverUrl: book.covers?.[0] 
                ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
                : '/assets/book-placeholder.png',
            description: book.description?.value || book.description || '',
            subjects: book.subjects || [],
            pageCount: book.number_of_pages || 0,
            publishDate: book.first_publish_date || ''
        };
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
}