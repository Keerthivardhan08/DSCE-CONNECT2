import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceItem } from '../../types';
import { ChatDrawer } from '../../components/common/ChatDrawer';
import { 
  ShoppingBag, 
  PlusCircle, 
  Tag, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  X, 
  Sparkles,
  Flag,
  AlertTriangle,
  Phone,
  Mail,
  Check,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { marketplace, addMarketplaceItem, markMarketplaceItemSold, reportItem, currentUser, showToast } = useApp();

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SELL' | 'FREE' | 'BORROW'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Chat Drawer state
  const [chatTarget, setChatTarget] = useState<{ receiverId: string; receiverName: string; itemTitle: string } | null>(null);

  // Direct Contact Modal state
  const [contactModalItem, setContactModalItem] = useState<MarketplaceItem | null>(null);

  // Report Modal state
  const [reportingItem, setReportingItem] = useState<MarketplaceItem | null>(null);
  const [reportReason, setReportReason] = useState('Price gouging or duplicate listing');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Form states for new listing
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketplaceItem['category']>('BOOKS');
  const [type, setType] = useState<MarketplaceItem['type']>('SELL');
  const [price, setPrice] = useState(450);
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('+91 98450 12345');
  const [contactEmail, setContactEmail] = useState(currentUser.email || 'student@dsce.edu.in');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80');

  const filteredItems = marketplace.filter(item => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchSeller = item.sellerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSeller) return false;
    }
    return true;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addMarketplaceItem({
      title,
      category,
      type,
      price: type === 'FREE' || type === 'BORROW' ? 0 : price,
      description,
      photos: [photoUrl],
      contactPhone,
      contactEmail
    });

    showToast(`"${title}" listed successfully!`);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const handleConfirmReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingItem) return;
    setIsSubmittingReport(true);
    await reportItem(reportingItem.id, reportingItem.title, 'MARKETPLACE', reportReason, reportDetails);
    setIsSubmittingReport(false);
    setReportingItem(null);
    setReportDetails('');
  };

  const handleToggleSold = (itemId: string, currentStatus?: boolean) => {
    markMarketplaceItemSold(itemId);
    showToast(currentStatus ? 'Listing reopened for buyers' : 'Deal closed! Item marked as SOLD.');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Campus Marketplace & Book Exchange
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified DSCE Students
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Buy, sell, borrow textbooks, reference books, scientific calculators, and hardware kits with direct contact (phone & email) and in-app chat.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/30 transition active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Item for Sale / Borrow</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search engineering textbooks, authors, calculators, kits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Category:
            </span>
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'BOOKS', label: 'Textbooks' },
              { id: 'CALCULATOR', label: 'Calculators' },
              { id: 'ELECTRONICS', label: 'Hardware Kits' },
              { id: 'FURNITURE', label: 'Hostel Essentials' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                  categoryFilter === cat.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listing Type Tabs */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition ${typeFilter === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('SELL')}
              className={`px-3 py-1.5 rounded-xl transition ${typeFilter === 'SELL' ? 'bg-teal-600 text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              For Sale
            </button>
            <button
              onClick={() => setTypeFilter('FREE')}
              className={`px-3 py-1.5 rounded-xl transition ${typeFilter === 'FREE' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Free Giveaways (₹0)
            </button>
            <button
              onClick={() => setTypeFilter('BORROW')}
              className={`px-3 py-1.5 rounded-xl transition ${typeFilter === 'BORROW' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Borrow / Lend
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium px-2">
            {filteredItems.length} active listings
          </span>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No marketplace listings match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search keywords or post a new item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const isMyItem = item.sellerId === currentUser.id;
            const isSold = item.status === 'SOLD' || Boolean((item as any).isSold);

            return (
              <div 
                key={item.id}
                className={`rounded-3xl bg-white dark:bg-slate-900 border transition overflow-hidden flex flex-col justify-between group ${
                  isSold 
                    ? 'border-slate-200 dark:border-slate-800 opacity-70 bg-slate-50/50' 
                    : 'border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-teal-500/50'
                }`}
              >
                <div>
                  {/* Photo */}
                  <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img 
                      src={item.photos[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    
                    {/* Status Badge */}
                    <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm ${
                      isSold
                        ? 'bg-rose-600 text-white'
                        : item.type === 'FREE' 
                          ? 'bg-emerald-500 text-white' 
                          : item.type === 'BORROW' 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-teal-600 text-white'
                    }`}>
                      {isSold ? 'DEAL CLOSED / SOLD' : item.type}
                    </span>

                    {/* Price Badge */}
                    <span className="absolute bottom-3 right-3 text-xs font-black px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md text-white shadow-md">
                      {item.price > 0 ? `₹${item.price}` : 'FREE / BORROW'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md">
                        {item.category === 'BOOKS' ? 'Textbook' : item.category}
                      </span>
                      {isSold && (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Quick contact preview if provided */}
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                      {item.contactPhone && (
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          <Phone className="w-3 h-3 text-teal-600" />
                          <span>{item.contactPhone}</span>
                        </span>
                      )}
                      {item.contactEmail && (
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg truncate max-w-[200px]">
                          <Mail className="w-3 h-3 text-indigo-600" />
                          <span className="truncate">{item.contactEmail}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{item.sellerName}</span>
                      <span className="text-[10px] text-slate-400">({item.sellerRoll})</span>
                    </div>

                    <button
                      onClick={() => {
                        setReportingItem(item);
                        setReportReason('Price gouging or duplicate listing');
                        setReportDetails('');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Report Listing"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Mark Sold toggle for seller or admin */}
                    {(isMyItem || currentUser.role === 'CAMPUS_ADMIN') ? (
                      <button
                        onClick={() => handleToggleSold(item.id, isSold)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isSold 
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-900'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isSold ? 'Reopen Deal' : 'Close Deal / Sold'}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setContactModalItem(item)}
                          className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                          disabled={isSold}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Contact Seller</span>
                        </button>

                        <button
                          onClick={() => {
                            setChatTarget({
                              receiverId: item.sellerId,
                              receiverName: item.sellerName,
                              itemTitle: item.title
                            });
                          }}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1"
                          title="Chat in App"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTACT SELLER MODAL */}
      {contactModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Seller Contact Details</h3>
              </div>
              <button onClick={() => setContactModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{contactModalItem.title}</p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-extrabold">Price: ₹{contactModalItem.price}</p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Seller Name</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    {contactModalItem.sellerName}
                    <span className="text-[10px] text-slate-400 font-normal">({contactModalItem.sellerRoll})</span>
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  Verified Student
                </span>
              </div>

              {contactModalItem.contactPhone && (
                <div className="p-3.5 rounded-2xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/40 dark:bg-teal-950/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Mobile Number</span>
                    <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{contactModalItem.contactPhone}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${contactModalItem.contactPhone}`}
                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${contactModalItem.contactPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {contactModalItem.contactEmail && (
                <div className="p-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between">
                  <div className="truncate mr-2">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">College Email</span>
                    <p className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate">{contactModalItem.contactEmail}</p>
                  </div>
                  <a
                    href={`mailto:${contactModalItem.contactEmail}?subject=Regarding your listing: ${contactModalItem.title}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition shrink-0"
                  >
                    Email
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setContactModalItem(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POST LISTING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Post Item for Sale or Borrow</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Book / Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Engineering Mathematics by B.S. Grewal (44th Edition)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Listing Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    <option value="SELL">Sell (Paid)</option>
                    <option value="FREE">Free Giveaway (₹0)</option>
                    <option value="BORROW">Temporary Borrow/Lend</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    <option value="BOOKS">Textbooks & Reference</option>
                    <option value="CALCULATOR">Calculators</option>
                    <option value="ELECTRONICS">Arduino & Hardware Kits</option>
                    <option value="FURNITURE">Hostel Items</option>
                  </select>
                </div>
              </div>

              {type === 'SELL' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Price in ₹ *</label>
                  <input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none font-bold"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contact Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98450 12345"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">College Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@dsce.edu.in"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description, Edition & Condition *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention edition, no pencil marks, semester used, and pickup location (e.g., Campus Central Library or Block 2)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/30"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT ITEM MODAL */}
      {reportingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Flag Marketplace Listing</h3>
              </div>
              <button onClick={() => setReportingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Reporting: <strong>{reportingItem.title}</strong> by {reportingItem.sellerName}.
            </p>

            <form onSubmit={handleConfirmReport} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reason for Report *</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                >
                  <option value="Price gouging or duplicate listing">Price gouging or duplicate listing</option>
                  <option value="Prohibited item on campus">Prohibited item on campus</option>
                  <option value="Misleading condition description">Misleading condition description</option>
                  <option value="Spam / Non-student commercial posting">Spam / Non-student commercial posting</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Additional Details</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide context for campus administration..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md disabled:opacity-50"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHAT DRAWER */}
      {chatTarget && (
        <ChatDrawer
          isOpen={Boolean(chatTarget)}
          onClose={() => setChatTarget(null)}
          receiverId={chatTarget.receiverId}
          receiverName={chatTarget.receiverName}
          itemContext={chatTarget.itemTitle}
        />
      )}

    </div>
  );
};
