'use client';

import { useState, useMemo, useRef } from 'react';
import { useBooks } from '@/context/BookContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import BookCard from '@/components/BookCard';
import AddBookModal from '@/components/AddBookModal';
import EditBookModal from '@/components/EditBookModal';
import UpdateProgressModal from '@/components/UpdateProgressModal';
import WelcomePage from '@/components/WelcomePage';
import { Book } from '@/types/book';

export default function HomePage() {
  const { books, filteredBooks, searchQuery, deleteBook, updateBook, toggleFavorite, authors, getBooksByStatus } = useBooks();
  const { isLoggedIn, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [selectedBookForProgress, setSelectedBookForProgress] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterType, setFilterType] = useState<'author' | 'category'>('author');
  const booksPerPage = 12;

  // Custom drag to scroll for Recently Added
  const scrollRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => setDragging(false);
  const onMouseUp = () => setDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Speed factor
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Get unique categories
  const categories = Array.from(new Set(books.map(b => b.category).filter(Boolean))) as string[];

  // Books by status
  const readingBooks = useMemo(() => getBooksByStatus('reading'), [books]);
  const completedBooks = useMemo(() => getBooksByStatus('completed'), [books]);
  const unreadBooks = useMemo(() => getBooksByStatus('unread'), [books]);

  // Recently added books (last 10)
  const recentBooks = useMemo(() => {
    return [...books].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
  }, [books]);

  // Daily Goal data for currently-reading books
  const dailyGoalBooks = useMemo(() => {
    return readingBooks.filter(b => b.pagesPerDay && b.pagesPerDay > 0);
  }, [readingBooks]);

  // Use filteredBooks when searching, otherwise use all books
  let displayBooks = searchQuery.trim() ? filteredBooks : books;

  // Filter by Author or Category
  if (filterType === 'author' && selectedAuthor) {
    displayBooks = displayBooks.filter(book => book.author === selectedAuthor);
  } else if (filterType === 'category' && selectedCategory) {
    displayBooks = displayBooks.filter(book => book.category === selectedCategory);
  }

  // Paginate display books
  const totalPages = Math.ceil(displayBooks.length / booksPerPage);
  const paginatedBooks = showAll
    ? displayBooks
    : displayBooks.slice(currentPage * booksPerPage, (currentPage + 1) * booksPerPage);

  // Common card props
  const cardProps = {
    onDelete: deleteBook,
    onStatusChange: (id: string, status: Book['status']) => updateBook(id, { status }),
    onRatingChange: (id: string, rating: number) => updateBook(id, { rating }),
    onEdit: (book: Book) => {
      setSelectedBookForEdit(book);
      setIsEditModalOpen(true);
    },
    onFavorite: toggleFavorite,
    onUpdateProgress: (book: Book) => {
      setSelectedBookForProgress(book);
      setIsProgressModalOpen(true);
    },
  };

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

  // Section renderer
  const renderSection = (title: string, sectionBooks: Book[], emptyMsg: string) => (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {title}
          <span className="ml-3 text-sm font-semibold px-2.5 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
            {sectionBooks.length}
          </span>
        </h2>
      </div>
      {sectionBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sectionBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              size="medium"
              showActions={true}
              {...cardProps}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed p-6 text-center" style={{ borderColor: 'var(--card-border)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{emptyMsg}</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-8">
      {/* Search Results Indicator */}
      {searchQuery.trim() && (
        <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
          <p className="text-blue-700 dark:text-blue-400">
            {t('found')} <strong>{filteredBooks.length}</strong> {t('resultsFor')} &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Daily Reading Goal Banner */}
      {!searchQuery.trim() && dailyGoalBooks.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl p-6 border shadow-sm"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)',
            backgroundImage: 'linear-gradient(to bottom right, var(--card-bg), var(--background))' 
          }}>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <span className="text-2xl">🎯</span>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {t('dailyGoalTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {dailyGoalBooks.map(book => {
              const todayPagesRead = book.pagesRead || 0;
              const totalP = book.totalPages || 0;
              const goalPages = book.pagesPerDay || 0;
              const progress = totalP > 0 ? Math.min(100, Math.round((todayPagesRead / totalP) * 100)) : 0;

              return (
                <div key={book.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border shadow-sm transition-all hover:shadow-md group"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  
                  {book.coverUrl && (
                    <div className="w-14 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                      <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 w-full space-y-3">
                    <div>
                      <p className="text-sm font-bold truncate leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{book.title}</p>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" 
                           style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
                           {t('todaysGoal')}
                         </span>
                         <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
                          {t('readPages').replace('{count}', String(goalPages))}
                        </p>
                      </div>
                    </div>

                    {totalP > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{todayPagesRead}/{totalP} {t('pages')}</span>
                          <span style={{ color: 'var(--accent-text)' }}>{progress}%</span>
                        </div>
                        <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--hover-bg)' }}>
                          <div
                            className="h-2 rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${progress}%`,
                              background: progress >= 100
                                ? 'linear-gradient(90deg, #10b981, #059669)'
                                : 'linear-gradient(90deg, #6366f1, #4f46e5)'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBookForProgress(book);
                      setIsProgressModalOpen(true);
                    }}
                    className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all active:scale-95"
                  >
                    <span>{t('updateProgress')}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* If searching, show search results normally */}
      {searchQuery.trim() ? (
        <section>
          <h2 className="text-xl md:text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('searchResults')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                size="medium"
                showActions={true}
                {...cardProps}
              />
            ))}
          </div>
          {displayBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noResults')} &quot;{searchQuery}&quot;</p>
            </div>
          )}
        </section>
      ) : (
        <>


          {/* Recently Added Section */}
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {t('recentlyAdded')}
            </h2>

            <div
              ref={scrollRef}
              onMouseDown={onMouseDown}
              onMouseLeave={onMouseLeave}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              onDragStart={(e) => e.preventDefault()}
              className={`flex overflow-x-auto gap-4 pb-6 hide-scrollbar ${dragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
            >
              {/* Add Book Placeholder */}
              <div className="snap-start shrink-0">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-32 h-44 border-2 border-dashed rounded-2xl flex items-center justify-center transition-all group"
                  style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)' }}
                >
                  <svg
                    className="w-8 h-8 group-hover:scale-110 transition-transform"
                    style={{ color: 'var(--text-muted)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {recentBooks.map((book) => (
                <div key={book.id} className="snap-start shrink-0">
                  <BookCard
                    book={book}
                    size="medium"
                    hideInfo={true}
                    hideFavorite={true}
                    {...cardProps}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Currently Reading Section */}
          {renderSection(
            t('currentlyReading'),
            readingBooks,
            t('noBooksInSection')
          )}

          {/* Completed Section */}
          {renderSection(
            t('completedBooks'),
            completedBooks,
            t('noBooksInSection')
          )}

          {/* To Read Section */}
          {renderSection(
            t('toReadBooks'),
            unreadBooks,
            t('noBooksInSection')
          )}

          {/* All Books Section with Filters - keep for advanced browsing */}
          <section className="pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {t('allBooks')}
                <span className="ml-3 text-sm font-semibold px-2.5 py-0.5 rounded-full border" style={{ backgroundColor: 'var(--hover-bg)', borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
                  {books.length}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Filter Type Selector */}
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value as 'author' | 'category');
                    setSelectedAuthor('');
                    setSelectedCategory('');
                    setCurrentPage(0);
                  }}
                  className="px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer font-medium"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
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
                  className="flex-1 md:flex-none min-w-[160px] px-4 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer font-medium"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
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
                  className={`px-5 py-2 rounded-xl text-sm transition-all whitespace-nowrap shadow-sm hover:shadow-md active:scale-95 font-medium ${showAll
                    ? 'text-white'
                    : 'border hover:bg-[var(--hover-bg)]'
                    }`}
                  style={{ 
                    backgroundColor: showAll ? 'var(--active-bg)' : 'var(--card-bg)', 
                    borderColor: 'var(--card-border)',
                    color: showAll ? 'var(--active-text)' : 'var(--text-secondary)'
                  }}
                >
                  {t('showAll')}
                </button>

                <div className="flex items-center gap-1.5 ml-auto md:ml-0 md:pl-0">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:shadow-md active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:shadow-md active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--card-border)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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
                  {...cardProps}
                />
              ))}
            </div>

            {/* Empty State */}
            {displayBooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{t('noBooksYet')}</p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  {t('addFirstBook')}
                </button>
              </div>
            )}
          </section>
        </>
      )
      }

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

      {/* Update Progress Modal */}
      <UpdateProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => {
          setIsProgressModalOpen(false);
          setSelectedBookForProgress(null);
        }}
        book={selectedBookForProgress}
      />
    </div >
  );
}
