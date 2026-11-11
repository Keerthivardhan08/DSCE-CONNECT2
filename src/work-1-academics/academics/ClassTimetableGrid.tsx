import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Download, 
  Printer, 
  Filter, 
  Info,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { 
  CYBER_SECURITY_SEM3_TIMETABLE, 
  CYBER_SECURITY_SEM3_METADATA, 
  FACULTY_DIRECTORY,
  TimetableSlot 
} from '../../data/cyberSecuritySem3Data';

interface ClassTimetableGridProps {
  initialBatch?: 'ALL' | 'A1' | 'A2' | 'A3';
}

export const ClassTimetableGrid: React.FC<ClassTimetableGridProps> = ({ initialBatch = 'ALL' }) => {
  const [selectedBatch, setSelectedBatch] = useState<'ALL' | 'A1' | 'A2' | 'A3'>(initialBatch);
  const [viewMode, setViewMode] = useState<'MATRIX' | 'DAILY'>('MATRIX');
  const [activeDay, setActiveDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'>('MON');

  const days: ('MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT')[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const periodsHeader = [
    { num: 1, time: '9:00 - 10:00' },
    { num: 2, time: '10:00 - 11:00' },
    { isBreak: true, label: 'TEA BREAK', time: '11:00 - 11:15' },
    { num: 3, time: '11:15 - 12:15' },
    { num: 4, time: '12:15 - 1:15' },
    { isBreak: true, label: 'LUNCH BREAK', time: '1:15 - 2:00' },
    { num: 5, time: '2:00 - 3:00' },
    { num: 6, time: '3:00 - 4:00' },
    { num: 7, time: '4:00 - 5:00' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const getSlotHighlight = (shortName: string, batches?: string) => {
    if (selectedBatch === 'ALL' || !batches) return '';
    if (batches.includes(selectedBatch) || batches.includes('All')) {
      return 'ring-2 ring-campus-500 bg-campus-50 dark:bg-campus-950/60 font-bold';
    }
    return 'opacity-40 grayscale';
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* 1. Official Timetable Document Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="text-center space-y-1.5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campus-50 text-campus-700 dark:bg-campus-950/80 dark:text-campus-300 text-[11px] font-extrabold uppercase tracking-wider border border-campus-200 dark:border-campus-800">
            <Calendar className="w-3.5 h-3.5" />
            <span>Official Institute Academic Timetable</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {CYBER_SECURITY_SEM3_METADATA.title}
          </h2>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {CYBER_SECURITY_SEM3_METADATA.duration} &nbsp;·&nbsp; {CYBER_SECURITY_SEM3_METADATA.department}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs">
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              SEMESTER: <strong>{CYBER_SECURITY_SEM3_METADATA.semester}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ROOM NO: <strong>{CYBER_SECURITY_SEM3_METADATA.roomNo}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              WITH EFFECT FROM: <strong>{CYBER_SECURITY_SEM3_METADATA.withEffectFrom}</strong>
            </span>
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Batch Filter Tabs */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Lab Batch:</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['ALL', 'A1', 'A2', 'A3'] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBatch(b)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    selectedBatch === b 
                      ? 'bg-campus-600 text-white shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {b === 'ALL' ? 'All Batches' : `Batch ${b}`}
                </button>
              ))}
            </div>
          </div>

          {/* View mode toggle & print */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode('MATRIX')}
                className={`px-3 py-1 rounded-lg transition ${viewMode === 'MATRIX' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Full Matrix
              </button>
              <button
                onClick={() => setViewMode('DAILY')}
                className={`px-3 py-1 rounded-lg transition ${viewMode === 'DAILY' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Daily View
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Print Timetable"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Full Matrix Timetable Grid */}
      {viewMode === 'MATRIX' ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse text-xs min-w-[900px]">
              
              {/* Header Rows */}
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3 border-r border-slate-200 dark:border-slate-700 font-extrabold w-20">
                    <span className="block text-[10px] text-slate-400 font-semibold">Periods →</span>
                    <span>Day</span>
                  </th>
                  <th className="p-3 border-r border-slate-200 dark:border-slate-700 font-extrabold">
                    <span className="block text-slate-400 text-[10px]">1</span>
                    <span>9:00 - 10:00</span>
                  </th>
                  <th className="p-3 border-r border-slate-200 dark:border-slate-700 font-extrabold">
                    <span className="block text-slate-400 text-[10px]">2</span>
                    <span>10:00 - 11:00</span>
                  </th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-700 font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 w-16">
                    <span className="block text-[10px]">11:00 - 11:15</span>
                    <span>TEA</span>
                  </th>
                  <th className="p-3 border-r border-slate-200 dark:border-slate-700 font-extrabold">
                    <span className="block text-slate-400 text-[10px]">3</span>
                    <span>11:15 - 12:15</span>
                  </th>
                  <th className="p-3 border-r border-slate-200 dark:border-slate-700 font-extrabold">
                    <span className="block text-slate-400 text-[10px]">4</span>
                    <span>12:15 - 1:15</span>
                  </th>
                  <th className="p-2 border-r border-slate-200 dark:border-slate-700 font-extrabold bg-orange-500/10 text-orange-700 dark:text-orange-300 w-16">
                    <span className="block text-[10px]">1:15 - 2:00</span>
                    <span>LUNCH</span>
                  </th>
                  <th className="p-3 border-r border-slate-200 dark:border-slate-700 font-extrabold">
                    <span className="block text-slate-400 text-[10px]">5</span>
                    <span>2:00 - 3:00</span>
                  </th>
                  <th className="p-3 border-r border-slate-200 dark:border-slate-700 font-extrabold">
                    <span className="block text-slate-400 text-[10px]">6</span>
                    <span>3:00 - 4:00</span>
                  </th>
                  <th className="p-3 font-extrabold">
                    <span className="block text-slate-400 text-[10px]">7</span>
                    <span>4:00 - 5:00</span>
                  </th>
                </tr>
              </thead>

              {/* Table Body matching image exactly */}
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                
                {/* MONDAY */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-black bg-slate-50/80 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 text-campus-700 dark:text-campus-400">
                    MON
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">OS</div>
                    <div className="text-[10px] text-slate-500">Padmavathi S</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">DSA</div>
                    <div className="text-[10px] text-slate-500">Dr. Mohd. Tajuddin</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-amber-500/5 text-amber-800 dark:text-amber-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    TEA BREAK
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">OPJ</div>
                    <div className="text-[10px] text-slate-500">Dr. Rakshitha Kiran P</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">DDCA</div>
                    <div className="text-[10px] text-slate-500">Dr. Pallavi Kulkarni</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-orange-500/5 text-orange-800 dark:text-orange-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    LUNCH BREAK
                  </td>
                  <td colSpan={2} className={`p-3 border-r border-slate-200 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20 ${getSlotHighlight('OS Lab', 'A2 & A3')}`}>
                    <div className="font-extrabold text-xs text-purple-900 dark:text-purple-200">
                      OS Lab A2 & A3
                    </div>
                    <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                      (PS + VHC + NAR + MK)
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Systems Lab · 2:00 – 4:00 PM</div>
                  </td>
                  <td className="p-3 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">Maths</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                </tr>

                {/* TUESDAY */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-black bg-slate-50/80 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 text-campus-700 dark:text-campus-400">
                    TUE
                  </td>
                  <td colSpan={2} className={`p-3 border-r border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/20 ${getSlotHighlight('DSA Lab / OPJ Lab', 'A1, A2 & A3')}`}>
                    <div className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200">
                      DSA Lab A1 (MT + ML)
                    </div>
                    <div className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200 mt-0.5">
                      OPJ Lab A2 & A3 (RK + VD + VHC)
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Computing Labs · 9:00 – 11:00 AM</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-amber-500/5 text-amber-800 dark:text-amber-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    TEA BREAK
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">PS</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">OS</div>
                    <div className="text-[10px] text-slate-500">Padmavathi S</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-orange-500/5 text-orange-800 dark:text-orange-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    LUNCH BREAK
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">DDCA</div>
                    <div className="text-[10px] text-slate-500">Dr. Pallavi Kulkarni</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">DSA</div>
                    <div className="text-[10px] text-slate-500">Dr. Mohd. Tajuddin</div>
                  </td>
                  <td className="p-3 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">Maths</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                </tr>

                {/* WEDNESDAY */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-black bg-slate-50/80 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 text-campus-700 dark:text-campus-400">
                    WED
                  </td>
                  <td colSpan={2} className={`p-3 border-r border-slate-200 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20 ${getSlotHighlight('DSA Lab', 'A2 & A3')}`}>
                    <div className="font-extrabold text-xs text-purple-900 dark:text-purple-200">
                      DSA Lab A2 & A3
                    </div>
                    <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                      (MT + VD + VHC + PS)
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">DSA Lab · 9:00 – 11:00 AM</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-amber-500/5 text-amber-800 dark:text-amber-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    TEA BREAK
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">OS</div>
                    <div className="text-[10px] text-slate-500">Padmavathi S</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">PS</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-orange-500/5 text-orange-800 dark:text-orange-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    LUNCH BREAK
                  </td>
                  <td colSpan={2} className={`p-3 border-r border-slate-200 dark:border-slate-800 bg-teal-50/50 dark:bg-teal-950/20 ${getSlotHighlight('OS / AEC Lab', 'A1 & A3')}`}>
                    <div className="font-extrabold text-xs text-teal-900 dark:text-teal-200">
                      OS Lab A1 (PS + PB)
                    </div>
                    <div className="font-extrabold text-xs text-teal-900 dark:text-teal-200 mt-0.5">
                      AEC Lab A3 (NAR + ML)
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Systems / Cyber AEC Lab · 2:00 – 4:00 PM</div>
                  </td>
                  <td className="p-3 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">Maths</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                </tr>

                {/* THURSDAY */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-black bg-slate-50/80 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 text-campus-700 dark:text-campus-400">
                    THU
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">PS</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">DSA</div>
                    <div className="text-[10px] text-slate-500">Dr. Mohd. Tajuddin</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-amber-500/5 text-amber-800 dark:text-amber-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    TEA BREAK
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">OPJ</div>
                    <div className="text-[10px] text-slate-500">Dr. Rakshitha Kiran P</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">DDCA</div>
                    <div className="text-[10px] text-slate-500">Dr. Pallavi Kulkarni</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-orange-500/5 text-orange-800 dark:text-orange-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    LUNCH BREAK
                  </td>
                  <td colSpan={2} className={`p-3 border-r border-slate-200 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20 ${getSlotHighlight('OPJ Lab', 'A1')}`}>
                    <div className="font-extrabold text-xs text-purple-900 dark:text-purple-200">
                      OPJ Lab A1
                    </div>
                    <div className="text-[10px] text-purple-700 dark:text-purple-300 font-medium">
                      (RK + PS)
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Java Lab · 2:00 – 4:00 PM</div>
                  </td>
                  <td className="p-3 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">Maths</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                </tr>

                {/* FRIDAY */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-black bg-slate-50/80 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 text-campus-700 dark:text-campus-400">
                    FRI
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">OPJ</div>
                    <div className="text-[10px] text-slate-500">Dr. Rakshitha Kiran P</div>
                  </td>
                  <td className="p-3 border-r border-slate-200 dark:border-slate-800 font-bold">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white">PS</div>
                    <div className="text-[10px] text-slate-500">Dr. K V Nagmani</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-amber-500/5 text-amber-800 dark:text-amber-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    TEA BREAK
                  </td>
                  <td colSpan={2} className={`p-3 border-r border-slate-200 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-950/20 ${getSlotHighlight('AEC Lab', 'A1 & A2')}`}>
                    <div className="font-extrabold text-xs text-blue-900 dark:text-blue-200">
                      AEC Lab A1 & A2
                    </div>
                    <div className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                      (NAR + PS + PB)
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Cyber Security AEC Lab · 11:15 AM – 1:15 PM</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-orange-500/5 text-orange-800 dark:text-orange-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    LUNCH BREAK
                  </td>
                  <td colSpan={2} className={`p-3 border-r border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/20 ${getSlotHighlight('Community Project', 'All')}`}>
                    <div className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200">
                      Community Project (Project-Based Learning)
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                      (VHC + MT)
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Societal Project · 2:00 – 4:00 PM</div>
                  </td>
                  <td className="p-3 font-bold bg-sky-50/50 dark:bg-sky-950/20">
                    <div className="font-extrabold text-xs text-sky-900 dark:text-sky-200">Tutorial OPJ</div>
                    <div className="text-[10px] text-slate-500">Dr. Rakshitha Kiran P</div>
                    <div className="text-[9px] text-sky-600 dark:text-sky-400">CDS10-104</div>
                  </td>
                </tr>

                {/* SATURDAY */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-3 font-black bg-slate-50/80 dark:bg-slate-800/40 border-r border-slate-200 dark:border-slate-700 text-campus-700 dark:text-campus-400">
                    SAT
                  </td>
                  <td colSpan={2} className="p-3 border-r border-slate-200 dark:border-slate-800 bg-sky-50/40 dark:bg-sky-950/20">
                    <div className="font-extrabold text-sm text-sky-900 dark:text-sky-200">
                      Tutorial DDCA
                    </div>
                    <div className="text-[10px] text-slate-500">Dr. Pallavi Kulkarni · 9:00 – 11:00 AM</div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-amber-500/5 text-amber-800 dark:text-amber-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    TEA BREAK
                  </td>
                  <td colSpan={2} className="p-3 border-r border-slate-200 dark:border-slate-800 bg-amber-50/60 dark:bg-amber-950/20">
                    <div className="font-extrabold text-sm text-amber-900 dark:text-amber-200">
                      PROCTOR MEETING
                    </div>
                    <div className="text-[10px] text-amber-700 dark:text-amber-300">
                      Faculty Mentorship & Guidance · 11:15 AM – 1:15 PM
                    </div>
                  </td>
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 bg-orange-500/5 text-orange-800 dark:text-orange-200 font-extrabold text-[10px] uppercase tracking-widest writing-mode-vertical">
                    LUNCH BREAK
                  </td>
                  <td colSpan={2} className="p-3 border-r border-slate-200 dark:border-slate-800 bg-sky-50/40 dark:bg-sky-950/20">
                    <div className="font-extrabold text-sm text-sky-900 dark:text-sky-200">
                      Tutorial OS
                    </div>
                    <div className="text-[10px] text-slate-500">Padmavathi S · 2:00 – 4:00 PM</div>
                  </td>
                  <td className="p-3 font-semibold text-slate-400 bg-slate-50/30 dark:bg-slate-900/30 text-[11px]">
                    — Self Study —
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 3. Daily Breakdown Cards View */
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {days.map(d => (
              <button
                key={d}
                onClick={() => setActiveDay(d)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                  activeDay === d
                    ? 'bg-campus-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {d === 'MON' ? 'Monday' : d === 'TUE' ? 'Tuesday' : d === 'WED' ? 'Wednesday' : d === 'THU' ? 'Thursday' : d === 'FRI' ? 'Friday' : 'Saturday'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {CYBER_SECURITY_SEM3_TIMETABLE.filter(s => s.day === activeDay).map((slot, idx) => (
              <div 
                key={`${slot.day}-${slot.periodNumber}-${idx}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-campus-50 text-campus-700 dark:bg-campus-950 dark:text-campus-300 font-extrabold text-xs">
                      Period {slot.periodNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {slot.time}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    slot.type === 'LAB' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' 
                      : slot.type === 'TUTORIAL'
                      ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                      : slot.type === 'MEETING'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {slot.type} {slot.batches ? `(${slot.batches})` : ''}
                  </span>
                </div>

                <div className="pt-1">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {slot.shortName} — {slot.courseName}
                  </h4>
                  {slot.courseCode && (
                    <span className="text-[10px] font-mono text-campus-600 dark:text-campus-400 font-bold block mt-0.5">
                      Course Code: {slot.courseCode}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                    👨‍🏫 {slot.faculty}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3" />
                    {slot.room}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Official Course & Faculty Reference Directory Table (Exact match to uploaded timetable bottom table) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <BookOpen className="w-4 h-4 text-campus-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Course Details & Designated Faculty Mentors
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold ml-auto">
            Room: CDS10-104
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                <th className="p-2.5 font-bold w-24">Code</th>
                <th className="p-2.5 font-bold">Course Name</th>
                <th className="p-2.5 font-bold border-r border-slate-200 dark:border-slate-700">Faculty</th>
                <th className="p-2.5 font-bold w-28 pl-4">Code</th>
                <th className="p-2.5 font-bold">Course Name</th>
                <th className="p-2.5 font-bold">Faculty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400">1BMAT31A</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Probability and Statistics (PS)</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">Dr. K V Nagmani</td>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400 pl-4">1BCY305</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Digital Design & Computer Architecture (DDCA)</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300">Dr. Pallavi Kulkarni</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400">1BCY302</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Object Oriented Programming with Java (OPJ)</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">Dr. Rakshitha Kiran P</td>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400 pl-4">1BCYL306</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Data Structures Laboratory</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300">Dr. Mohd. Tajuddin</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400">1BCY303</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Operating System & Linux System Programming (OS)</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">Padmavathi S</td>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400 pl-4">1BCYL307A</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Cyber Security and its Applications</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300">Nida Afreen Rizvi</td>
              </tr>
              <tr>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400">1BCY304</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Data Structures and Applications (DSA)</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700">Dr. Mohd. Tajuddin</td>
                <td className="p-2.5 font-mono font-bold text-campus-600 dark:text-campus-400 pl-4">1BCP308</td>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Community Project (Project-Based Learning) / Societal Project</td>
                <td className="p-2.5 text-slate-600 dark:text-slate-300">Dr. Vinod H C</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Faculty Initials Legend */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">Faculty Initials Key:</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span><strong>PS:</strong> Padmavathi S</span>
            <span><strong>RK:</strong> Dr. Rakshitha Kiran P</span>
            <span><strong>MT:</strong> Dr. Mohd. Tajuddin</span>
            <span><strong>VHC:</strong> Dr. Vinod H C</span>
            <span><strong>NAR:</strong> Nida Afreen Rizvi</span>
            <span><strong>PK:</strong> Dr. Pallavi Kulkarni</span>
            <span><strong>KVN:</strong> Dr. K V Nagmani</span>
            <span><strong>ML / VD / PB / MK:</strong> Computing Labs Staff</span>
          </div>
        </div>
      </div>

    </div>
  );
};
