import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LostAndFoundItem } from '../../types';
import { ChatDrawer } from '../../components/common/ChatDrawer';
import { 
  SearchCode, 
  PlusCircle, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  HelpCircle, 
  CheckCircle2, 
  X, 
  Lock, 
  Unlock,
  MessageSquare,
  Flag,
  AlertTriangle
} from 'lucide-react';

export const LostFoundView: React.FC = () => {
  const { lostAndFound, addLostFoundItem, verifyLostFoundClaim, reportItem, currentUser, showToast } = useApp();

  const [filterType, setFilterType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [claimModalItem, setClaimModalItem] = useState<LostAndFoundItem | null>(null);
  const [claimAnswer, setClaimAnswer] = useState('');

  // Chat Drawer state
  const [chatTarget, setChatTarget] = useState<{ receiverId: string; receiverName: string; itemTitle: string } | null>(null);

  // Report Modal state
  const [reportingItem, setReportingItem] = useState<LostAndFoundItem | null>(null);
  const [reportReason, setReportReason] = useState('Suspicious or false lost/found claim');
  const [reportDetails, setReportDetails] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'LOST' | 'FOUND'>('FOUND');
  const [category, setCategory] = useState<LostAndFoundItem['category']>('ELECTRONICS');
  const [locationArea, setLocationArea] = useState('Central Library 2nd Floor');
  const [incidentDate, setIncidentDate] = useState('Today, 11:30 AM');
  const [secretChallengeQuestion, setSecretChallengeQuestion] = useState('What sticker or serial number is on the back?');
  const [description, setDescription] = useState('');

  const filteredItems = lostAndFound.filter(item => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !secretChallengeQuestion.trim()) return;

    addLostFoundItem({
      title,
      type,
      category,
      locationArea,
      incidentDate,
      secretChallengeQuestion,
      description
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  const handleVerifyClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimModalItem || !claimAnswer.trim()) return;

    const res = verifyLostFoundClaim(claimModalItem.id, claimAnswer);
    if (res.success) {
      showToast(res.message);
      setClaimModalItem(null);
      setClaimAnswer('');
    } else {
      showToast(res.message);
    }
  };

  const handleConfirmReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingItem) return;
    setIsSubmittingReport(true);
    await reportItem(reportingItem.id, reportingItem.title, 'LOST_FOUND', reportReason, reportDetails);
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
              Campus Lost & Found Network
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold">
              Challenge Quiz Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lost or found student ID cards, keys, earphones, or books. Private challenge question protects items from false claims.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/30 transition active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Lost or Found Item</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-xl transition ${filterType === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterType('FOUND')}
            className={`px-3 py-1.5 rounded-xl transition ${filterType === 'FOUND' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Found by Classmates
          </button>
          <button
            onClick={() => setFilterType('LOST')}
            className={`px-3 py-1.5 rounded-xl transition ${filterType === 'LOST' ? 'bg-rose-600 text-white font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Reported Lost Items
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium px-2">
          {filteredItems.length} active notices
        </span>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map(item => {
          const isMyPost = item.posterId === currentUser.id;

          return (
            <div 
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    item.type === 'FOUND' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {item.type} ITEM
                  </span>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.incidentDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Location: <strong className="text-slate-700 dark:text-slate-300">{item.locationArea}</strong></span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Challenge verification teaser */}
                <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Verification Challenge Question:</strong>
                    <p className="text-[11px] mt-0.5">{item.secretChallengeQuestion}</p>
                  </div>
                </div>
              </div>

              {/* Footer with action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Posted by {item.posterName}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setReportingItem(item);
                      setReportReason('Suspicious or false lost/found claim');
                      setReportDetails('');
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition"
                    title="Report Listing"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  {!isMyPost && (
                    <button
                      onClick={() => {
                        setChatTarget({
                          receiverId: item.posterId,
                          receiverName: item.posterName,
                          itemTitle: item.title
                        });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  )}

                  {item.status === 'RETURNED' ? (
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Claimed & Closed
                    </span>
                  ) : item.type === 'FOUND' ? (
                    <button
                      onClick={() => {
                        setClaimModalItem(item);
                        setClaimAnswer('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition shadow-xs flex items-center gap-1"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Claim Item</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setChatTarget({
                          receiverId: item.posterId,
                          receiverName: item.posterName,
                          itemTitle: item.title
                        });
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 border border-rose-200"
                    >
                      Found Similar? Notify
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLAIM VERIFICATION CHALLENGE MODAL */}
      {claimModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Verify Ownership Challenge</h3>
              </div>
              <button onClick={() => setClaimModalItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              To prevent false claims on <strong>{claimModalItem.title}</strong>, please answer the finder's private challenge question:
            </p>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs font-bold text-amber-900 dark:text-amber-200">
              ❓ "{claimModalItem.secretChallengeQuestion}"
            </div>

            <form onSubmit={handleVerifyClaim} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Answer (Be specific) *</label>
                <textarea
                  required
                  rows={3}
                  value={claimAnswer}
                  onChange={(e) => setClaimAnswer(e.target.value)}
                  placeholder="e.g. It has a green silicone cover with a miniature Pikachu keychain..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setClaimModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/30"
                >
                  Submit Answer & Unlock Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST NEW LOST/FOUND MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SearchCode className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Post to Campus Lost & Found Board</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Boat Airdopes Case with single earbud"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notice Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    <option value="FOUND">I Found an Item</option>
                    <option value="LOST">I Lost an Item</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    <option value="ID_CARD">College ID Card</option>
                    <option value="ELECTRONICS">Earphones / Electronics</option>
                    <option value="KEYS">Hostel Room Keys</option>
                    <option value="BOOKS">Notebooks / Folders</option>
                    <option value="CLOTHING">Jackets / Umbrellas</option>
                    <option value="OTHER">Other Valuables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Spot / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LHC-204 Desk 4"
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Approximate Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Today, 2:15 PM"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>
              </div>

              {/* Private Challenge Question */}
              <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 space-y-1">
                <label className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Anti-Fraud Ownership Challenge Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What sticker or inscription is on the back?"
                  value={secretChallengeQuestion}
                  onChange={(e) => setSecretChallengeQuestion(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 outline-none"
                />
                <span className="text-[10px] text-amber-800/80 dark:text-amber-300/80 block">
                  Only the genuine owner will know this exact detail.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Public Description</label>
                <textarea
                  rows={2}
                  placeholder="Visible description (don't reveal the answer to your secret question!)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/30"
                >
                  Post to Board
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
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Flag Lost & Found Item</h3>
              </div>
              <button onClick={() => setReportingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Reporting item: <strong>{reportingItem.title}</strong> posted by {reportingItem.posterName}.
            </p>

            <form onSubmit={handleConfirmReport} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reason for Report *</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                >
                  <option value="Suspicious or false lost/found claim">Suspicious or false lost/found claim</option>
                  <option value="Duplicate or spam entry">Duplicate or spam entry</option>
                  <option value="Harassment or inappropriate content">Harassment or inappropriate content</option>
                  <option value="Item already handed over">Item already handed over</option>
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
