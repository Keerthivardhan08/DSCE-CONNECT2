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
  Building2,
  PlusCircle,
  Trash2,
  Paperclip,
  Check,
  Eye,
  Megaphone,
  AlertTriangle,
  Award,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { ClassTimetableGrid } from './ClassTimetableGrid';
import { isCyberSecuritySem3 } from '../../data/cyberSecuritySem3Data';
import { Assignment, Course } from '../../types';

export const AcademicsView: React.FC = () => {
  const { 
    currentUser,
    courses, 
    assignments, 
    examTimetable, 
    academicCalendar, 
    submitAssignmentWork, 
    addAssignment,
    deleteAssignment,
    deleteAllMockAssignments,
    gradeAssignmentSubmission,
    updateCourseSyllabus,
    showToast 
  } = useApp();

  // Active view tab inside Academics: 'timetable' | 'courses' | 'assignments' | 'exam_timetable' | 'academic_calendar' | 'study_material' | 'gpa'
  const [subTab, setSubTab] = useState<'timetable' | 'courses' | 'assignments' | 'exam_timetable' | 'academic_calendar' | 'study_material' | 'gpa'>('timetable');

  // Student Assignment submission modal state
  const [activeSubmitAssignment, setActiveSubmitAssignment] = useState<Assignment | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionFileName, setSubmissionFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Faculty Assignment Creation Modal state
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgCourseCode, setNewAsgCourseCode] = useState(courses[0]?.code || '1BCY303');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgDueDate, setNewAsgDueDate] = useState('Dec 07, 2026 · 11:59 PM');
  const [newAsgMarks, setNewAsgMarks] = useState(25);
  const [newAsgFileName, setNewAsgFileName] = useState('');

  // Faculty Review Submissions Modal state
  const [inspectingAssignment, setInspectingAssignment] = useState<Assignment | null>(null);
  const [gradingStudentId, setGradingStudentId] = useState<string | null>(null);
  const [gradingMarks, setGradingMarks] = useState<number>(20);
  const [gradingFeedback, setGradingFeedback] = useState('');

  // Course Syllabus Viewer / Editor Modal state
  const [viewingSyllabusCourse, setViewingSyllabusCourse] = useState<Course | null>(null);
  const [editingSyllabusCourse, setEditingSyllabusCourse] = useState<Course | null>(null);
  const [editSyllabusContent, setEditSyllabusContent] = useState('');
  const [editSyllabusType, setEditSyllabusType] = useState<'TEXT' | 'PDF' | 'IMAGE'>('TEXT');
  const [editSyllabusFileName, setEditSyllabusFileName] = useState('');

  const isFacultyOrAdmin = currentUser.role === 'FACULTY' || currentUser.role === 'CAMPUS_ADMIN';
  const isCyber = isCyberSecuritySem3(currentUser);
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  // GPA Calculator State
  const [gpaGrades, setGpaGrades] = useState<Record<string, number>>({
    '1BMAT31A': 9,
    '1BCY302': 9,
    '1BCY303': 10,
    '1BCY304': 9,
    '1BCY305': 9,
    '1BCYL306': 10,
    '1BCYL307A': 10,
    '1BCP308': 10,
    CS301: 9,
    CS302: 8,
    CS303: 9,
    CS304: 10,
    CS305: 10
  });

  const calculateSGPA = () => {
    let totCredits = 0;
    let earnedPoints = 0;
    courses.forEach(c => {
      const gp = gpaGrades[c.code] || 8;
      earnedPoints += gp * c.credits;
      totCredits += c.credits;
    });
    return totCredits > 0 ? (earnedPoints / totCredits).toFixed(2) : '0.00';
  };

  // Student handles submission
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitAssignment) return;
    setIsSubmitting(true);
    await submitAssignmentWork(activeSubmitAssignment.id, {
      textContent: submissionNotes.trim() || 'Assignment submission deliverable attached.',
      fileName: submissionFileName.trim() || `${currentUser.rollNumber}_${activeSubmitAssignment.courseCode}_Submission.pdf`
    });
    setIsSubmitting(false);
    setActiveSubmitAssignment(null);
    setSubmissionNotes('');
    setSubmissionFileName('');
  };

  // Faculty creates assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim() || !newAsgCourseCode.trim()) return;

    const targetCourse = courses.find(c => c.code === newAsgCourseCode);

    await addAssignment({
      title: newAsgTitle,
      courseCode: newAsgCourseCode,
      courseName: targetCourse?.name || newAsgCourseCode,
      dueDate: newAsgDueDate,
      totalMarks: Number(newAsgMarks) || 20,
      description: newAsgDesc,
      status: 'PENDING',
      fileAttachmentName: newAsgFileName.trim() || undefined,
      createdBy: currentUser.name,
      submissions: []
    });

    setShowAddAssignmentModal(false);
    setNewAsgTitle('');
    setNewAsgDesc('');
    setNewAsgFileName('');
  };

  // Faculty grades a student submission
  const handleGradeSubmission = (studentId: string) => {
    if (!inspectingAssignment) return;
    gradeAssignmentSubmission(inspectingAssignment.id, studentId, gradingMarks, gradingFeedback);
    setGradingStudentId(null);
    setGradingFeedback('');
    // refresh inspecting assignment from state
    const updated = assignments.find(a => a.id === inspectingAssignment.id);
    if (updated) setInspectingAssignment(updated);
  };

  // Admin / Faculty saves syllabus
  const handleSaveSyllabus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSyllabusCourse) return;

    await updateCourseSyllabus(editingSyllabusCourse.id, {
      content: editSyllabusContent.trim(),
      type: editSyllabusType,
      fileName: editSyllabusFileName.trim() || undefined
    });

    setEditingSyllabusCourse(null);
  };

  const pyqList = [
    { title: '1BMAT31A Probability & Statistics Model Question Bank (IAT-3 & End-Sem)', sem: 'Sem 3', size: '2.8 MB', type: 'PDF' },
    { title: '1BCY302 Object Oriented Programming with Java Comprehensive Question Bank', sem: 'Sem 3', size: '3.4 MB', type: 'PDF' },
    { title: '1BCY303 Operating Systems & Linux Programming Lab Manual & Viva Q&A (Dr. Padmavati S)', sem: 'Sem 3', size: '2.1 MB', type: 'PDF' },
    { title: '1BCY304 Data Structures & Applications Lecture Notes & Code Snippets', sem: 'Sem 3', size: '4.2 MB', type: 'PDF' },
    { title: '1BCY305 Digital Design & Computer Architecture Unit 1-5 Modules (Dr. Pallavi Bindagi)', sem: 'Sem 3', size: '3.1 MB', type: 'PDF' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Official Controller of Examinations Notice Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-rose-500/15 via-red-500/10 to-amber-500/15 border-2 border-rose-500/40 text-rose-950 dark:text-rose-100 flex items-center gap-3.5 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Megaphone className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-600 text-white">
              Official Examination Notice
            </span>
            <span className="text-[11px] font-mono font-bold text-rose-600 dark:text-rose-400">
              Office of the Controller of Examinations
            </span>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mt-1">
            3rd internal starts at 8th dec , only 75% attendance students will be able to write the internals
          </p>
        </div>
      </div>

      {/* Academics Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Academics & Timetable
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-campus-100 text-campus-700 dark:bg-campus-950 dark:text-campus-300 font-bold">
              {isCyber ? `Semester 3 • ${totalCredits} Credits • Room CDS10-104` : `Semester ${currentUser.semester || 3} • ${totalCredits} Credits`}
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
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap flex items-center gap-1.5 ${subTab === 'timetable' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Calendar className="w-3.5 h-3.5 text-campus-500" />
            <span>Class Timetable</span>
          </button>
          <button
            onClick={() => setSubTab('courses')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'courses' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Courses & Syllabus
          </button>
          <button
            onClick={() => setSubTab('assignments')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'assignments' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Assignments & Submissions
          </button>
          <button
            onClick={() => setSubTab('exam_timetable')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'exam_timetable' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Exam Timetable
          </button>
          <button
            onClick={() => setSubTab('academic_calendar')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'academic_calendar' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Academic Calendar
          </button>
          <button
            onClick={() => setSubTab('study_material')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'study_material' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            PYQs & Notes
          </button>
          <button
            onClick={() => setSubTab('gpa')}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${subTab === 'gpa' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'}`}
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enrolled Department Courses & Detailed Syllabus</h3>
              <p className="text-xs text-slate-500">View attendance tracking, designated faculty mentors, and syllabus modules.</p>
            </div>
            {isFacultyOrAdmin && (
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                Faculty / Admin Syllabus Editing Enabled
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => {
              const pct = ((course.classesAttended / course.classesHeld) * 100);
              const isAtRisk = pct < 75;

              return (
                <div 
                  key={course.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-campus-50 text-campus-700 dark:bg-campus-950 dark:text-campus-300 border border-campus-200 dark:border-campus-800 font-mono">
                            {course.code}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{course.credits} Credits</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                          {course.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-campus-600" />
                          <span className="font-semibold">{course.facultyName}</span>
                          <span>•</span>
                          <span>{course.room}</span>
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
                        <span>Minimum Required: 75%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 rounded-full ${isAtRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Syllabus Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
                    <button
                      onClick={() => setViewingSyllabusCourse(course)}
                      className="flex-1 py-2 px-3 rounded-xl bg-campus-50 hover:bg-campus-100 dark:bg-campus-950 dark:hover:bg-campus-900 text-campus-700 dark:text-campus-300 font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View Syllabus</span>
                    </button>

                    {isFacultyOrAdmin && (
                      <button
                        onClick={() => {
                          setEditingSyllabusCourse(course);
                          setEditSyllabusContent(course.syllabusContent || '');
                          setEditSyllabusType(course.syllabusType || 'TEXT');
                          setEditSyllabusFileName(course.syllabusFileName || '');
                        }}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition flex items-center justify-center gap-1"
                        title="Edit Course Syllabus"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Edit Syllabus</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ASSIGNMENT TRACKER & FACULTY PORTAL */}
      {subTab === 'assignments' && (
        <div className="space-y-6">
          
          {/* Header & Faculty Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Continuous Internal Evaluation (CIE) Assignments</h3>
                {isFacultyOrAdmin && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold uppercase">
                    Faculty Assignment Management
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isFacultyOrAdmin 
                  ? 'Faculty can publish new assignments, attach assignment files, review student submissions, and grade deliverables.'
                  : 'Track deadlines, download assignment problem sheets, and submit deliverables before deadline.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {isFacultyOrAdmin && (
                <>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete all mock assignments? This clears existing test records.')) {
                        deleteAllMockAssignments();
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-900 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete All Mock Assignments</span>
                  </button>

                  <button
                    onClick={() => setShowAddAssignmentModal(true)}
                    className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-bold shadow-md shadow-campus-600/30 transition flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add New Assignment</span>
                  </button>
                </>
              )}

              {!isFacultyOrAdmin && (
                <span className="text-xs px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800">
                  {assignments.filter(a => a.status === 'PENDING').length} Due Soon
                </span>
              )}
            </div>
          </div>

          {/* Assignments list */}
          {assignments.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No active assignments posted yet</h4>
              <p className="text-xs text-slate-500 mt-1">
                {isFacultyOrAdmin 
                  ? 'Click "Add New Assignment" to post the first assignment for students.'
                  : 'All assignments are clear or pending faculty posting.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map(asg => {
                const mySubmission = asg.submissions?.find(s => s.studentId === currentUser.id);
                const isSubmitted = asg.status === 'SUBMITTED' || Boolean(mySubmission);
                const totalSubmissions = asg.submissions?.length || 0;

                return (
                  <div 
                    key={asg.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-campus-600 dark:text-campus-400 font-mono">
                              {asg.courseCode}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSubmitted 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {isFacultyOrAdmin ? `${totalSubmissions} Submitted` : (isSubmitted ? 'SUBMITTED' : 'PENDING')}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                            {asg.title}
                          </h4>
                        </div>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                          {asg.totalMarks} Marks
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {asg.description}
                      </p>

                      {/* File attachment by faculty if present */}
                      {asg.fileAttachmentName && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate font-semibold">
                            <Paperclip className="w-3.5 h-3.5 text-campus-600 shrink-0" />
                            <span className="truncate">{asg.fileAttachmentName}</span>
                          </span>
                          <button
                            onClick={() => showToast(`Opened "${asg.fileAttachmentName}"`)}
                            className="text-campus-600 dark:text-campus-400 font-bold hover:underline shrink-0 text-[11px]"
                          >
                            View Sheet
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom row actions */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs gap-2">
                      <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3" />
                        Due: <strong className="text-slate-700 dark:text-slate-300">{asg.dueDate}</strong>
                      </span>

                      {/* Faculty actions vs Student action */}
                      {isFacultyOrAdmin ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setInspectingAssignment(asg)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Submissions ({totalSubmissions})</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete assignment "${asg.title}"?`)) {
                                deleteAssignment(asg.id);
                              }
                            }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                            title="Delete Assignment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          {isSubmitted ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Turned In</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveSubmitAssignment(asg);
                                setSubmissionNotes('');
                                setSubmissionFileName(`${currentUser.rollNumber}_${asg.courseCode}_Solution.pdf`);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Submit Work</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: EXAM TIMETABLE */}
      {subTab === 'exam_timetable' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Department CIE & Internals Timetable</h3>
              <p className="text-xs text-slate-500">
                Starts with Maths, OPJ, OS, DSA, DDCA (Morning 1 and Evening 1) — Marked as Internals.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                {examTimetable.length} Exams Scheduled
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
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {item.examType}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                      {item.courseName}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date & Session</span>
                    <span className="font-bold text-slate-900 dark:text-white block">{item.date}</span>
                    <span className="text-[11px] text-slate-500 font-semibold">{item.time}</span>
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

      {/* SUBTAB 4: ACADEMIC CALENDAR (EMBEDDED PDF) */}
      {subTab === 'academic_calendar' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Dayananda Sagar College of Engineering — UG Calendar of Events
              </h3>
              <p className="text-xs text-slate-500">
                Autonomous Undergraduate Calendar of Events for 3rd & 5th Semester (Academic Year 2026–27).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/academic-calendar-2026-27.pdf"
                download="DSCE_UG_Calendar_3_and_5_Sem_2026-27.pdf"
                className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Official PDF</span>
              </a>
            </div>
          </div>

          {/* Embedded Official PDF Document */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg bg-slate-900">
            <iframe 
              src="/academic-calendar-2026-27.pdf"
              title="Official DSCE Academic Calendar 2026-27"
              className="w-full h-[750px] border-none"
            />
          </div>

          {/* Milestone timeline summary */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Key Academic Milestones Summary (2026–27)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Commencement of Classes', date: 'August 24, 2026', color: 'border-l-campus-500' },
                { label: 'IAT-1 (1st Internal)', date: 'Sep 28 – Sep 30, 2026', color: 'border-l-indigo-500' },
                { label: 'IAT-2 (2nd Internal)', date: 'Nov 03 – Nov 05, 2026', color: 'border-l-indigo-500' },
                { label: 'IAT-3 (3rd Internal)', date: 'Dec 08 – Dec 10, 2026', color: 'border-l-rose-500' },
                { label: 'Lab Internals / SEE Labs', date: 'Dec 12 – Dec 17, 2026', color: 'border-l-purple-500' },
                { label: 'Last Working Day & CIE', date: 'December 18, 2026', color: 'border-l-amber-500' },
                { label: 'Semester End Theory Exams', date: 'Dec 21, 2026 onwards', color: 'border-l-emerald-500' },
                { label: 'Even Sem Commencement', date: 'January 18, 2027', color: 'border-l-sky-500' },
              ].map((m, idx) => (
                <div key={idx} className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 border-l-4 ${m.color} space-y-0.5`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{m.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: PYQS & STUDY MATERIAL */}
      {subTab === 'study_material' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Verified Previous-Year Exam Question Banks & Faculty Lecture Notes
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

      {/* STUDENT SUBMIT ASSIGNMENT MODAL */}
      {activeSubmitAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-campus-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Assignment Work</h3>
              </div>
              <button onClick={() => setActiveSubmitAssignment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1">
              <span className="text-[10px] font-mono font-bold text-campus-600 dark:text-campus-400">
                {activeSubmitAssignment.courseCode}
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{activeSubmitAssignment.title}</p>
              <p className="text-[11px] text-slate-500">Deadline: {activeSubmitAssignment.dueDate}</p>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Deliverable / Solution Document Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1BCY042_OS_Sync_Problems.pdf"
                  value={submissionFileName}
                  onChange={(e) => setSubmissionFileName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Submission Notes & GitHub Repository / Drive Link</label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Paste GitHub repository link, cloud drive URL, or notes for the professor..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-campus-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveSubmitAssignment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-campus-600 hover:bg-campus-700 text-white shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Turn In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FACULTY ADD ASSIGNMENT MODAL */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-campus-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Course Assignment</h3>
              </div>
              <button onClick={() => setShowAddAssignmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating System Concurrency & Semaphore Implementation"
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Course Subject *</label>
                  <select
                    value={newAsgCourseCode}
                    onChange={(e) => setNewAsgCourseCode(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.code}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Marks *</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newAsgMarks}
                    onChange={(e) => setNewAsgMarks(parseInt(e.target.value) || 20)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Submission Deadline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dec 07, 2026 · 11:59 PM"
                  value={newAsgDueDate}
                  onChange={(e) => setNewAsgDueDate(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Attach Assignment Problem Sheet (PDF / Doc Name)</label>
                <input
                  type="text"
                  placeholder="e.g. Assignment_OS_Semaphore_Specs.pdf"
                  value={newAsgFileName}
                  onChange={(e) => setNewAsgFileName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Assignment Content & Problem Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide detailed instructions, problem questions, test case requirements, and formatting guidelines..."
                  value={newAsgDesc}
                  onChange={(e) => setNewAsgDesc(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-campus-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-campus-600 hover:bg-campus-700 text-white shadow-md shadow-campus-600/30"
                >
                  Publish to Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FACULTY REVIEW SUBMISSIONS MODAL */}
      {inspectingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-campus-600 dark:text-campus-400">
                    {inspectingAssignment.courseCode}
                  </span>
                  <span className="text-xs text-slate-400">({inspectingAssignment.totalMarks} Marks)</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Submissions: {inspectingAssignment.title}
                </h3>
              </div>
              <button onClick={() => setInspectingAssignment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {(!inspectingAssignment.submissions || inspectingAssignment.submissions.length === 0) ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No student has submitted work for this assignment yet.
              </div>
            ) : (
              <div className="space-y-3">
                {inspectingAssignment.submissions.map(sub => (
                  <div 
                    key={sub.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{sub.studentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">({sub.studentRoll || sub.rollNumber})</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Submitted at: {sub.submittedAt}</span>
                      </div>

                      {(sub.marksAwarded !== undefined || sub.obtainedMarks !== undefined) ? (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-xl">
                          Graded: {sub.marksAwarded ?? sub.obtainedMarks} / {inspectingAssignment.totalMarks}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setGradingStudentId(sub.studentId);
                            setGradingMarks(inspectingAssignment.totalMarks);
                            setGradingFeedback('Good implementation of requirements.');
                          }}
                          className="px-3 py-1 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-bold shadow-xs transition"
                        >
                          Grade Work
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      {sub.submissionNotes || sub.textContent}
                    </p>

                    {(sub.fileAttachmentName || sub.fileName) && (
                      <div className="flex items-center gap-2 text-xs text-campus-600 dark:text-campus-400 font-semibold">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Attached File: {sub.fileAttachmentName || sub.fileName}</span>
                      </div>
                    )}

                    {/* Grading Form */}
                    {gradingStudentId === sub.studentId && (
                      <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Enter Grade & Feedback:</span>
                          <div className="flex items-center gap-1">
                            <label className="text-[10px] font-bold text-slate-500">Marks:</label>
                            <input
                              type="number"
                              min="0"
                              max={inspectingAssignment.totalMarks}
                              value={gradingMarks}
                              onChange={(e) => setGradingMarks(parseInt(e.target.value) || 0)}
                              className="w-16 text-xs p-1 rounded-lg bg-white dark:bg-slate-800 border border-indigo-300 font-bold text-center"
                            />
                            <span className="text-xs text-slate-500">/ {inspectingAssignment.totalMarks}</span>
                          </div>
                        </div>

                        <input
                          type="text"
                          placeholder="Faculty feedback / comments..."
                          value={gradingFeedback}
                          onChange={(e) => setGradingFeedback(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-indigo-300 outline-none"
                        />

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setGradingStudentId(null)}
                            className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleGradeSubmission(sub.studentId)}
                            className="px-3.5 py-1 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          >
                            Save Grade
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW SYLLABUS MODAL */}
      {viewingSyllabusCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-campus-600 dark:text-campus-400">
                  {viewingSyllabusCourse.code} • {viewingSyllabusCourse.credits} Credits
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {viewingSyllabusCourse.name} — Syllabus
                </h3>
              </div>
              <button onClick={() => setViewingSyllabusCourse(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Faculty: <strong>{viewingSyllabusCourse.facultyName}</strong>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-campus-100 text-campus-700 dark:bg-campus-950 dark:text-campus-300">
                  Format: {viewingSyllabusCourse.syllabusType || 'TEXT'}
                </span>
              </div>

              {viewingSyllabusCourse.syllabusFileName && (
                <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-200">
                    <Paperclip className="w-4 h-4 text-indigo-600" />
                    <span>{viewingSyllabusCourse.syllabusFileName}</span>
                  </span>
                  <button 
                    onClick={() => showToast(`Opened syllabus file: ${viewingSyllabusCourse.syllabusFileName}`)}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Open Document
                  </button>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-sans">
                {viewingSyllabusCourse.syllabusContent || `Module 1: Introduction, fundamental concepts and architecture.\nModule 2: Advanced theory, data representation and state mechanics.\nModule 3: Core algorithms, efficiency analysis and performance metrics.\nModule 4: Practical lab implementations, tools and industry applications.\nModule 5: Security assessments, case studies and end-semester project review.`}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingSyllabusCourse(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
              >
                Close Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SYLLABUS MODAL (ADMIN / FACULTY) */}
      {editingSyllabusCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-campus-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add / Update Syllabus: {editingSyllabusCourse.code}
                </h3>
              </div>
              <button onClick={() => setEditingSyllabusCourse(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSyllabus} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Syllabus Format *</label>
                  <select
                    value={editSyllabusType}
                    onChange={(e) => setEditSyllabusType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    <option value="TEXT">Writing / Text Modules</option>
                    <option value="PDF">PDF Document</option>
                    <option value="IMAGE">Pictures / Diagram Scan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">File Name / Link</label>
                  <input
                    type="text"
                    placeholder="e.g. 1BCY303_OS_Syllabus_2026.pdf"
                    value={editSyllabusFileName}
                    onChange={(e) => setEditSyllabusFileName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Syllabus Description & Module Units *</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Enter module-by-module breakdown, prescribed textbooks, and evaluation scheme..."
                  value={editSyllabusContent}
                  onChange={(e) => setEditSyllabusContent(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-campus-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSyllabusCourse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-campus-600 hover:bg-campus-700 text-white shadow-md shadow-campus-600/30"
                >
                  Save Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
