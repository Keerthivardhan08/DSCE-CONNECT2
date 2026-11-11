import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { LibraryBook } from '../../types';
import { 
  Library, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Search, 
  AlertTriangle, 
  ArrowUpDown, 
  Bookmark, 
  Layers, 
  Send,
  MapPin,
  Sparkles,
  BookMarked
} from 'lucide-react';

type SortOption = 'AVAILABILITY' | 'TITLE_AZ' | 'COPIES_DESC';

export const LibraryView: React.FC = () => {
  const { libraryBooks, borrowBook, returnBook, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('AVAILABILITY');

  // Compute categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    libraryBooks.forEach(b => {
      if (b.category) set.add(b.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [libraryBooks]);

  // Aggregate stats
  const totalBooks = libraryBooks.length;
  const borrowedByMeBooks = libraryBooks.filter(b => b.isBorrowedByMe);
  const borrowedCount = borrowedByMeBooks.length;
  const availableTitlesCount = libraryBooks.filter(b => b.availableCopies > 0).length;
  const totalCopiesSum = libraryBooks.reduce((acc, b) => acc + b.totalCopies, 0);
  const availableCopiesSum = libraryBooks.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedCopiesSum = totalCopiesSum - availableCopiesSum;

  // Helper to check if a due date is overdue
  const isOverdue = (dueDateStr?: string): boolean => {
    if (!dueDateStr) return false;
    if (dueDateStr.toLowerCase().includes('overdue')) return true;
    
    // Attempt parse
    const cleanDate = dueDateStr.replace(/\s*\(.*\)/, '').trim();
    const parsed = new Date(cleanDate);
    if (!isNaN(parsed.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsed < today;
    }
    return false;
  };

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let result = libraryBooks.filter(book => {
      const matchesCategory = selectedCategory === 'ALL' || book.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.authors.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q) ||
        book.shelfLocation.toLowerCase().includes(q) ||
        book.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'AVAILABILITY') {
        // Available copies first, then title
        if ((a.availableCopies > 0) !== (b.availableCopies > 0)) {
          return a.availableCopies > 0 ? -1 : 1;
        }
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'TITLE_AZ') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'COPIES_DESC') {
        return b.availableCopies - a.availableCopies;
      }
      return 0;
    });

    return result;
  }, [libraryBooks, selectedCategory, searchQuery, sortBy]);

  const handleBorrow = (book: LibraryBook) => {
    if (book.availableCopies === 0) {
      showToast(`All copies of "${book.title}" are currently issued. You have been added to the reservation queue!`);
      return;
    }
    borrowBook(book.id);
    showToast(`Successfully borrowed "${book.title}" for 14 days! Pick up copy from ${book.shelfLocation}.`);
  };

  const handleReturn = (book: LibraryBook) => {
    returnBook(book.id);
    showToast(`Returned "${book.title}". Thank you for returning on time!`);
  };

  const handleInterLibraryLoanRequest = () => {
    showToast('Inter-library Loan (ILL) request initiated. Central Library helpdesk will review within 24 hours!');
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 animate-gradient text-white p-6 sm:p-8 shadow-2xl shadow-emerald-900/30">
        {/* Decorative glass blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 right-1/4 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-emerald-200 border border-white/15">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
              </span>
              📖 Central Library Stacks &amp; Digital Loans · Open 24x7
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Central Library Catalog &amp; Loans
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Search physical textbook stacks, view real-time availability, borrow copies with your digital student ID, or reserve high-demand academic references.
            </p>
          </div>

          {/* Glass Stat Pods */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 self-start lg:self-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">Total Titles</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 group-hover:scale-105 transition-transform">{totalBooks}</div>
              <div className="text-[10px] mt-0.5 bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full font-bold">Catalog</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">My Loans</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-cyan-200 group-hover:scale-105 transition-transform">{borrowedCount}</div>
              <div className="text-[10px] mt-0.5 bg-cyan-400/20 text-cyan-200 px-2 py-0.5 rounded-full font-bold">Borrowed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3.5 rounded-2xl text-center min-w-[95px] hover:bg-white/15 transition group">
              <div className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">Available Now</div>
              <div className="text-2xl sm:text-3xl font-extrabold mt-1 text-emerald-300 group-hover:scale-105 transition-transform">{availableTitlesCount}</div>
              <div className="text-[10px] mt-0.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Ready to Issue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Policy & Service Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Borrow Limit</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">14 Days Loan Duration</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overdue Fine</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">₹5 / Day after due date</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Physical Inventory</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{availableCopiesSum} in Stacks · {issuedCopiesSum} Issued</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-sm flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Special Service</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Book Not Found?</div>
          </div>
          <button
            onClick={handleInterLibraryLoanRequest}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white text-[11px] font-bold shadow-md shadow-teal-500/20 transition-all whitespace-nowrap"
          >
            Request ILL →
          </button>
        </div>
      </div>

      {/* Highlighted "My Borrowed Books" Section (if any borrowed) */}
      {borrowedByMeBooks.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 backdrop-blur-xl border border-emerald-500/30 dark:border-emerald-700/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
                📚 Currently Borrowed By You ({borrowedByMeBooks.length})
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              Return on or before due date to avoid fines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrowedByMeBooks.map(book => {
              const overdue = isOverdue(book.dueDate);

              return (
                <div
                  key={book.id}
                  className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-700/30 p-4 shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        ISBN {book.isbn}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        {book.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {book.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">By {book.authors}</p>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Return Desk: <strong>{book.shelfLocation}</strong></span>
                    </div>

                    {/* Due Date & Overdue Warning */}
                    <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                      overdue
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40 text-rose-800 dark:text-rose-300'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300'
                    }`}>
                      <Clock className={`w-4 h-4 shrink-0 ${overdue ? 'text-rose-600 animate-bounce' : 'text-amber-600'}`} />
                      <div className="flex-1">
                        {overdue ? (
                          <span><strong>OVERDUE WARNING:</strong> Due date was {book.dueDate}. Please return immediately.</span>
                        ) : (
                          <span>Due Date: <strong>{book.dueDate}</strong> (Active Loan)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleReturn(book)}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition shadow-sm"
                    >
                      Return Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search books by title, author, ISBN or shelf stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-3.5 pr-8 py-2.5 text-xs font-bold rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 shadow-sm outline-none text-slate-700 dark:text-slate-200 cursor-pointer focus:border-teal-500 transition"
            >
              <option value="AVAILABILITY">Sort: Available First</option>
              <option value="TITLE_AZ">Sort: Title (A - Z)</option>
              <option value="COPIES_DESC">Sort: Most Copies</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          const count = cat === 'ALL' ? totalBooks : libraryBooks.filter(b => b.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-105'
                  : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{cat === 'ALL' ? '📚 All Categories' : cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                isActive ? 'bg-white/20 dark:bg-slate-900/20 text-white dark:text-slate-900' : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Showing {filteredAndSortedBooks.length} of {libraryBooks.length} Books
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Books Grid (2 cols md) */}
      {filteredAndSortedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedBooks.map(book => {
            const isAvailable = book.availableCopies > 0;
            const availabilityPct = Math.round((book.availableCopies / book.totalCopies) * 100);

            return (
              <div
                key={book.id}
                className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 p-6 flex flex-col justify-between group space-y-4"
              >
                {/* Left accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b ${
                    isAvailable ? 'from-emerald-400 to-teal-600' : 'from-rose-400 to-red-600'
                  }`}
                />

                <div className="space-y-3.5">
                  {/* Top Header: ISBN & Availability */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                      ISBN: {book.isbn}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isAvailable
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40'
                      }`}
                    >
                      {isAvailable ? `${book.availableCopies} of ${book.totalCopies} Available` : 'All Issued'}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      By <span className="font-semibold text-slate-700 dark:text-slate-300">{book.authors}</span>
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md">
                      {book.category}
                    </span>
                  </div>

                  {/* Physical Shelf Location */}
                  <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Physical Shelf Location</span>
                        <span className="font-bold">{book.shelfLocation}</span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/70 font-semibold text-slate-600 dark:text-slate-300">
                      Stack Zone
                    </span>
                  </div>

                  {/* Availability Progress Indicator */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Stack Inventory</span>
                      <span className="font-semibold">
                        {book.availableCopies} available / {book.totalCopies} copies
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isAvailable
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : 'bg-gradient-to-r from-rose-500 to-red-400'
                        }`}
                        style={{ width: `${availabilityPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Borrowed by Me Warning Banner */}
                  {book.isBorrowedByMe && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0 text-amber-600" />
                      <div className="flex-1">
                        Currently Issued to You. Due on: <strong>{book.dueDate}</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">
                    {book.isBorrowedByMe
                      ? 'In your active bag'
                      : isAvailable
                      ? 'Instant 14-day checkout'
                      : 'Waitlist open'}
                  </div>

                  {book.isBorrowedByMe ? (
                    <button
                      onClick={() => handleReturn(book)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Return Book</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBorrow(book)}
                      disabled={book.availableCopies === 0}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        book.availableCopies > 0
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{book.availableCopies > 0 ? 'Borrow Copy (14 Days)' : 'All Issued'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl shadow-black/5 space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
            📚
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Books Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any catalog entries matching "{searchQuery}" or the selected category.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
              setSortBy('AVAILABILITY');
            }}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
