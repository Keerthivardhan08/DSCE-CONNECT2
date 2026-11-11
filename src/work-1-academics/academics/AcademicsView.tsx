import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  GraduationCap, 
  Calendar, 
  AlertCircle,
  Upload,
  Send,
  MapPin,
  FileCheck2,
  BookmarkCheck,
  Building2
} from 'lucide-react';
import { ClassTimetableGrid } from './ClassTimetableGrid';
import { isCyberSecuritySem3 } from '../../data/cyberSecuritySem3Data';

export const AcademicsView: React.FC = () => {
  const { 
    currentUser,
    courses, 
    assignments, 
    examTimetable, 
    academicCalendar, 
    submitAssignment, 
    showToast 
  } = useApp();

  // Active view tab inside Academics: 'timetable' | 'courses' | 'assignments' | 'exam_timetable' | 'academic_calendar' | 'study_material' | 'gpa'
  const [subTab, setSubTab] = useState<'timetable' | 'courses' | 'assignments' | 'exam_timetable' | 'academic_calendar' | 'study_material' | 'gpa'>('timetable');

  // Assignment submission modal state
  const [activeSubmitAssignmentId, setActiveSubmitAssignmentId] = useState<string | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCyber = isCyberSecuritySem3(currentUser);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  // GPA Calculator State
  const [gpaGrades, setGpaGrades] = useState<Record<string, number>>({
    '1BMAT31A': 9,
    '1BCY302': 9,
    '1BCY303': 9,
    '1BCY304': 10,
    '1BCY305': 9,
    '1BCYL306': 10,
    '1BCYL307A': 10,
    '1BCP308': 10,
    CS301: 9, // Grade points (10: O, 9: A+, 8: A, 7: B+, 6: B)
    CS302: 8,
    CS303: 9,
    CS304: 10,
    CS305: 10
  });

  const calculateSGPA = () => {
    let totalCredits = 0;
    let earnedPoints = 0;
    courses.forEach(c => {
      const gp = gpaGrades[c.code] || 8;
      earnedPoints += gp * c.credits;
      totalCredits += c.credits;
    });
    return totalCredits > 0 ? (earnedPoints / totalCredits).toFixed(2) : '0.00';
  };

  const handleAssignmentSubmit = async () => {
    if (!activeSubmitAssignmentId) return;
    setIsSubmitting(true);
    await submitAssignment(activeSubmitAssignmentId, submissionNotes.trim() || 'Work attached via student repository.');
    setIsSubmitting(false);
    setActiveSubmitAssignmentId(null);
    setSubmissionNotes('');
  };

  const pyqList = isCyber ? [
    { title: '1BMAT31A Probability & Statistics Previous End-Sem Exam Paper', sem: 'Sem 3', size: '2.8 MB', type: 'PDF' },
    { title: '1BCY302 Object Oriented Programming with Java Model Question Bank', sem: 'Sem 3', size: '3.4 MB', type: 'PDF' },
    { title: '1BCY303 Operating Systems & Linux Programming Lab Manual & Viva Q&A', sem: 'Sem 3', size: '2.1 MB', type: 'PDF' },
    { title: '1BCY304 Data Structures & Applications Lecture Notes & Code Snippets', sem: 'Sem 3', size: '4.2 MB', type: 'PDF' }
  ] : [
    { title: 'CS301 End-Semester Exam Paper 2025', sem: 'Sem 6', size: '2.4 MB', type: 'PDF' },
    { title: 'CS302 Mid-Sem Question Bank with Solutions', sem: 'Sem 6', size: '4.1 MB', type: 'PDF' },
    { title: 'CS303 Network Protocols Lab Experiments & Viva Q&A', sem: 'Sem 6', size: '1.8 MB', type: 'PDF' },
    { title: 'CS304 Agile & Software Design Handout (Prof Geetha)', sem: 'Sem 6', size: '3.6 MB', type: 'PDF' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Academics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Academics & Timetable
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-campus-100 text-campus-700 dark:bg-campus-950 dark:text-campus-300 font-bold">
              {isCyber ? `Semester 3 • ${totalCredits} Credits • Room CDS10-104` : `Semester ${currentUser.semester || 6} • ${totalCredits} Credits`}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enrolled subjects, official weekly class timetable, assignment submissions, exams, and syllabus documents.
          </p>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold overflow-x-auto max-w-full">
          <button
            onClick={() => setSubTab('timetable')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${subTab === 'timetable' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Calendar className="w-3.5 h-3.5 text-campus-500" />
            <span>Class Timetable</span>
          </button>
          <button
            onClick={() => setSubTab('courses')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'courses' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Courses & Syllabus
          </button>
          <button
            onClick={() => setSubTab('assignments')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'assignments' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Assignment Tracker
          </button>
          <button
            onClick={() => setSubTab('exam_timetable')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'exam_timetable' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Exam Timetable
          </button>
          <button
            onClick={() => setSubTab('academic_calendar')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'academic_calendar' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Academic Calendar
          </button>
          <button
            onClick={() => setSubTab('study_material')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'study_material' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            PYQs & Notes
          </button>
          <button
            onClick={() => setSubTab('gpa')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'gpa' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            SGPA Estimator
          </button>
        </div>
      </div>

      {/* SUBTAB 0: CLASS TIMETABLE (ODD SEMESTER 2026-27) */}
      {subTab === 'timetable' && (
        <ClassTimetableGrid />
      )}

      {/* SUBTAB 1: COURSES & SYLLABUS */}
      {subTab === 'courses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => {
              const pct = ((course.classesAttended / course.classesHeld) * 100);
              const isAtRisk = pct < 75;

              return (
                <div 
                  key={course.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-campus-50 text-campus-700 dark:bg-campus-950 dark:text-campus-300 border border-campus-200 dark:border-campus-800">
                          {course.code}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{course.credits} Credits</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                        {course.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {course.facultyName} • {course.room}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xl font-extrabold ${isAtRisk ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {pct.toFixed(1)}%
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAtRisk ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {isAtRisk ? 'WARNING (<75%)' : 'ELIGIBLE'}
                      </span>
                    </div>
                  </div>

                  {/* Attendance Log Metric */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Attended: {course.classesAttended} / {course.classesHeld} lectures</span>
                      <span>Institute Minimum: 75%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Schedule slot */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.scheduleDayTime}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">Core Subject</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ASSIGNMENT TRACKER */}
      {subTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Continuous Assessment Tracker</h3>
              <p className="text-xs text-slate-500">Track deadlines, submit deliverables, and view graded submissions.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800">
                {assignments.filter(a => a.status === 'PENDING').length} Pending Action
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map(asg => {
              const isSubmitted = asg.status === 'SUBMITTED';

              return (
                <div 
                  key={asg.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-campus-600 dark:text-campus-400 font-mono">
                          {asg.courseCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSubmitted ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {asg.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {asg.title}
                      </h4>
                    </div>
                    <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 shrink-0">
                      {asg.totalMarks} Marks
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {asg.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Due: <strong className="text-slate-700 dark:text-slate-300">{asg.dueDate}</strong>
                    </span>

                    {isSubmitted ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Work Submitted
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveSubmitAssignmentId(asg.id);
                          setSubmissionNotes('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 3: EXAM TIMETABLE */}
      {subTab === 'exam_timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">End-Semester & Mid-Term Exam Timetable</h3>
              <p className="text-xs text-slate-500">Official hall allocations, seat assignments, and examination regulations.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {examTimetable.length} Examinations Scheduled
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examTimetable.map(item => (
              <div 
                key={item.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-mono">
                        {item.courseCode}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {item.examType.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                      {item.courseName}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                    <span className="font-bold text-slate-900 dark:text-white block">{item.date}</span>
                    <span className="text-[11px] text-slate-500">{item.time}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hall & Seat</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 block flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {item.hall}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">{item.seatNumber}</span>
                  </div>
                </div>

                {item.instructions && (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>{item.instructions}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: ACADEMIC CALENDAR */}
      {subTab === 'academic_calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Calendar & Milestones</h3>
              <p className="text-xs text-slate-500">Official semester milestones, instructional days, holidays and key deadlines.</p>
            </div>
            <span className="text-xs font-bold text-campus-600">Even Semester 2026</span>
          </div>

          <div className="relative border-l-2 border-campus-200 dark:border-campus-800 ml-4 pl-6 space-y-6">
            {academicCalendar.map((event, idx) => (
              <div key={event.id} className="relative group">
                {/* Dot */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                  event.category === 'EXAM' ? 'bg-purple-500' :
                  event.category === 'HOLIDAY' ? 'bg-emerald-500' :
                  event.category === 'DEADLINE' ? 'bg-rose-500' : 'bg-campus-500'
                }`} />

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-campus-600 dark:text-campus-400">
                      {event.date}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      event.category === 'EXAM' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                      event.category === 'HOLIDAY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      event.category === 'DEADLINE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {event.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {event.title}
                    {event.isMilestone && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                        Milestone
                      </span>
                    )}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: PYQS & STUDY MATERIAL */}
      {subTab === 'study_material' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Previous-Year Exam Question Banks & Lecture Notes
            </h3>
            <span className="text-xs text-campus-600 font-semibold cursor-pointer" onClick={() => showToast('Contribute materials feature opening next week.')}>
              + Upload Study Material
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pyqList.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.sem} • {item.size} • Verified Faculty Upload</p>
                  </div>
                </div>

                <button 
                  onClick={() => showToast(`Downloaded "${item.title}" successfully!`)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: SGPA ESTIMATOR */}
      {subTab === 'gpa' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Semester SGPA Calculator</h3>
              <p className="text-xs text-slate-500">Utility calculator based on course credits and expected letter grades.</p>
            </div>
            <div className="p-3 rounded-2xl bg-campus-50 dark:bg-campus-950 border border-campus-200 dark:border-campus-800 text-center">
              <span className="text-[10px] font-bold text-campus-600 dark:text-campus-400 block">ESTIMATED SGPA</span>
              <span className="text-2xl font-black text-campus-700 dark:text-campus-300">{calculateSGPA()}</span>
            </div>
          </div>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {courses.map(course => (
              <div key={course.id} className="pt-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{course.code}: {course.name}</span>
                  <span className="text-[11px] text-slate-400 block">{course.credits} Credits</span>
                </div>
                <select
                  value={gpaGrades[course.code] || 9}
                  onChange={(e) => setGpaGrades({ ...gpaGrades, [course.code]: parseInt(e.target.value) })}
                  className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="10">O (Outstanding - 10)</option>
                  <option value="9">A+ (Excellent - 9)</option>
                  <option value="8">A (Very Good - 8)</option>
                  <option value="7">B+ (Good - 7)</option>
                  <option value="6">B (Above Avg - 6)</option>
                  <option value="5">C (Pass - 5)</option>
                  <option value="0">F (Fail - 0)</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {activeSubmitAssignmentId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Assignment Deliverable</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your code repository link, cloud drive URL, or submission comments.
              </p>
            </div>

            <textarea
              rows={4}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="e.g. GitHub URL: https://github.com/student/dbms-assignment or summary of solutions..."
              className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-campus-500 text-slate-900 dark:text-white"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveSubmitAssignmentId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAssignmentSubmit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-campus-600 hover:bg-campus-700 text-white shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm Submission</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
