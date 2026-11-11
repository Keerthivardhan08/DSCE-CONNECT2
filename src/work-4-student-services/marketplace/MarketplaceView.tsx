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
  AlertTriangle
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { marketplace, addMarketplaceItem, reportItem, currentUser, showToast } = useApp();

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'SELL' | 'FREE' | 'BORROW'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Chat Drawer state
  const [chatTarget, setChatTarget] = useState<{ receiverId: string; receiverName: string; itemTitle: string } | null>(null);

  // Report Modal state
  const [reportingItem, setReportingItem] = useState<MarketplaceItem | null>(null);
  const [reportReason, setReportReason] = useState('Price gouging or duplicate listing');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MarketplaceItem['category']>('CALCULATOR');
  const [type, setType] = useState<MarketplaceItem['type']>('SELL');
  const [price, setPrice] = useState(500);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=300&auto=format&fit=crop&q=80');

  const filteredItems = marketplace.filter(item => {
    if (typeFilter === 'ALL') return true;
    return item.type === typeFilter;
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
      photos: [photoUrl]
    });

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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Campus Marketplace & Exchange
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-bold">
              Verified Students Only
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Buy, sell, borrow, or donate engineering books, scientific calculators, Arduino kits, and lab coats with in-app chat.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/30 transition active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Item for Sale/Borrow</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition ${typeFilter === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All Items
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

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const isMyItem = item.sellerId === currentUser.id;

          return (
            <div 
              key={item.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img 
                    src={item.photos[0]} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm ${
                    item.type === 'FREE' ? 'bg-emerald-500 text-white' :
                    item.type === 'BORROW' ? 'bg-indigo-600 text-white' :
                    'bg-teal-600 text-white'
                  }`}>
                    {item.type}
                  </span>

                  <span className="absolute bottom-3 right-3 text-xs font-black px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white">
                    {item.price > 0 ? `₹${item.price}` : 'FREE / BORROW'}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.sellerName}</span>
                  <span className="text-[10px] text-slate-400">({item.sellerRoll})</span>
                </div>

                <div className="flex items-center gap-1.5">
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

                  <button
                    onClick={() => {
                      if (isMyItem) {
                        showToast('This is your own listing.');
                      } else {
                        setChatTarget({
                          receiverId: item.sellerId,
                          receiverName: item.sellerName,
                          itemTitle: item.title
                        });
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 font-bold transition flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isMyItem ? 'My Post' : 'Contact'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POST LISTING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Post Item to Campus Marketplace</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio fx-991CW Calculator with Box"
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
                    <option value="CALCULATOR">Calculators</option>
                    <option value="BOOKS">Textbooks & Notes</option>
                    <option value="ELECTRONICS">Arduino / Components</option>
                    <option value="LAB_COAT">Lab Coat & Safety</option>
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
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description & Condition *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention condition, semester used, and preferred hostel pickup point..."
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
