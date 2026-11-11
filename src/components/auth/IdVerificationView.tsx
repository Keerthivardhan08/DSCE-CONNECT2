import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Upload, FileText, CheckCircle2, ArrowRight, AlertTriangle, Eye } from 'lucide-react';

interface IdVerificationViewProps {
  onComplete: () => void;
}

export const IdVerificationView: React.FC<IdVerificationViewProps> = ({ onComplete }) => {
  const { currentUser, uploadIdCard, showToast } = useApp();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    currentUser.idCardUrl || 'https://placehold.co/600x380/1e293b/ffffff.png?text=STUDENT+ID+CARD+-+' + encodeURIComponent(currentUser.rollNumber)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSampleCard = () => {
    const sample = `https://placehold.co/600x380/0f172a/38bdf8.png?text=COLLEGE+IDENTITY+CARD%0A${encodeURIComponent(currentUser.name)}%0AUSN:+${encodeURIComponent(currentUser.rollNumber)}%0ADept:+${encodeURIComponent(currentUser.department)}`;
    setPreviewUrl(sample);
    showToast('Loaded sample college ID card preview.');
  };

  const handleSubmit = async () => {
    if (!previewUrl) {
      showToast('Please upload or generate your student ID card image.');
      return;
    }
    setIsUploading(true);
    await uploadIdCard(currentUser.id, previewUrl);
    setIsUploading(false);
    setUploadSuccess(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-2xl w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-campus-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
              2
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-campus-600 dark:text-campus-400">Step 2 of 2 • Mandatory Verification</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Upload Your Student ID Card</h2>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Pending Verification</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p>
            Welcome, <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> (<code className="font-mono text-campus-600 dark:text-campus-400">{currentUser.rollNumber}</code>)!
          </p>
          <p>
            To activate full college permissions, borrow library books, participate in projects, and access hostel facilities, the Office of the Dean requires a clear photo or scan of your physical institutional ID card.
          </p>
        </div>

        {/* Upload Dropzone */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-campus-500 dark:hover:border-campus-400 rounded-2xl p-6 text-center transition bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-campus-50 dark:bg-campus-950 text-campus-600 dark:text-campus-400 flex items-center justify-center shadow-inner">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <label htmlFor="id-card-input" className="cursor-pointer text-xs font-bold text-campus-600 dark:text-campus-400 hover:underline">
                Click to browse file
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400"> or drag and drop PNG, JPG, or PDF</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Maximum file size: 5MB</p>
            </div>
            <input 
              id="id-card-input" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Don't have your scan handy?</span>
            <button
              type="button"
              onClick={handleUseSampleCard}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Generate Digital Institute ID Preview
            </button>
          </div>
        </div>

        {/* Preview Card */}
        {previewUrl && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-campus-600" />
              ID Card Image Preview:
            </span>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-md">
              <img 
                src={previewUrl} 
                alt="Student ID Card Preview" 
                className="w-full h-52 object-contain bg-slate-900"
              />
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Encrypted & routed to Campus Admin portal for review.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onComplete}
              className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition"
            >
              Skip for now
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploading || uploadSuccess}
              className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-campus-600 to-indigo-600 hover:from-campus-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-campus-600/25 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : uploadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Submitted! Entering Dashboard...</span>
                </>
              ) : (
                <>
                  <span>Submit ID & Enter DSCE Connect</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
