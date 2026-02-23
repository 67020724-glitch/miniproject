'use client';

import { useState } from 'react';
import { useBooks } from '@/context/BookContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import BookCard from '@/components/BookCard';
import AddBookModal from '@/components/AddBookModal';
import EditBookModal from '@/components/EditBookModal';
import WelcomePage from '@/components/WelcomePage';
import { Book } from '@/types/book';

export default function HomePage() {
  const { books, filteredBooks, searchQuery, deleteBook, updateBook, toggleFavorite, authors } = useBooks();
  const { isLoggedIn, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterType, setFilterType] = useState<'author' | 'category'>('author');
  const booksPerPage = 12;

  // Get unique categories
  const categories = Array.from(new Set(books.map(b => b.category).filter(Boolean))) as string[];

  // Use filteredBooks when searching, otherwise use all books
  let displayBooks = searchQuery.trim() ? filteredBooks : books;

  // Filter by Author or Category
  if (filterType === 'author' && selectedAuthor) {
    displayBooks = displayBooks.filter(book => book.author === selectedAuthor);
  } else if (filterType === 'category' && selectedCategory) {
    displayBooks = displayBooks.filter(book => book.category === selectedCategory);
  }

  // Get recent books (last 6) - always from all books
  const recentBooks = [...books]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Paginate display books
  const totalPages = Math.ceil(displayBooks.length / booksPerPage);
  const paginatedBooks = showAll
    ? displayBooks
    : displayBooks.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" style={{ backgroundColor: 'var(--background)' }}>
        <div
          className="animate-spin rounded-full h-12 w-12 border-4"
          style={{
            borderColor: 'var(--card-border)',
            borderTopColor: 'var(--text-muted)'
          }}
        ></div>
      </div>
    );
  }

  // Show welcome page if not logged in
  if (!isLoggedIn) {
    return <WelcomePage />;
  }

  return (
    <div className="space-y-8">
      {/* Search Results Indicator */}
      {searchQuery.trim() && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-700">
            {t('found')} <strong>{filteredBooks.length}</strong> {t('resultsFor')} &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Recent Books Section - Only show when not searching */}
      {!searchQuery.trim() && (
        <section>
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{t('recentBooks')}</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {/* Add Book Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-shrink-0 w-20 h-28 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {recentBooks.map((book) => (
              <div key={book.id} className="flex-shrink-0">
                <BookCard book={book} size="small" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Books Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {searchQuery.trim() ? t('searchResults') : t('allBooks')}
          </h2>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Author Filter */}
            {/* Filter Type Selector */}
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as 'author' | 'category');
                setSelectedAuthor('');
                setSelectedCategory('');
                setCurrentPage(0);
              }}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 font-medium"
            >
              <option value="author">{t('filterByAuthor')}</option>
              <option value="category">{t('filterByCategory')}</option>
            </select>

            {/* Value Selector */}
            <select
              value={filterType === 'author' ? selectedAuthor : selectedCategory}
              onChange={(e) => {
                if (filterType === 'author') setSelectedAuthor(e.target.value);
                else setSelectedCategory(e.target.value);
                setCurrentPage(0);
              }}
              className="flex-1 md:flex-none min-w-[150px] px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
            >
              <option value="">{filterType === 'author' ? t('allAuthors') : t('allCategories')}</option>
              {filterType === 'author'
                ? authors.map(author => (
                  <option key={author} value={author}>{author}</option>
                ))
                : categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))
              }
            </select>

            <button
              onClick={() => {
                setShowAll(!showAll);
                setCurrentPage(0);
              }}
              className={`px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ${showAll
                ? 'bg-gray-700 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {t('showAll')}
            </button>

            <div className="flex items-center gap-1 ml-auto md:ml-0 border-l pl-2 md:border-l-0 md:pl-0 border-gray-200">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {paginatedBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              size="medium"
              showActions={true}
              onDelete={deleteBook}
              onStatusChange={(id, status) => updateBook(id, { status })}
              onRatingChange={(id, rating) => updateBook(id, { rating })}

              onEdit={(book) => {
                setSelectedBookForEdit(book);
                setIsEditModalOpen(true);
              }}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* Empty State */}
        {displayBooks.length === 0 && (
          <div className="text-center py-12">
            {searchQuery.trim() ? (
              <p className="text-gray-500">{t('noResults')} &quot;{searchQuery}&quot;</p>
            ) : (
              <>
                <p className="text-gray-500">{t('noBooksYet')}</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  {t('addFirstBook')}
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {/* Add Book Modal */}
      <AddBookModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {/* Edit Book Modal */}
      <EditBookModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBookForEdit(null);
        }}
        book={selectedBookForEdit}
      />


    </div>
  );
}

