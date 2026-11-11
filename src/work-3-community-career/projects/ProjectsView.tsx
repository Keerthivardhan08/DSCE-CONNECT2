import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectListing, ProjectShowcase } from '../../types';
import { 
  FolderGit2, 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send, 
  X, 
  Target, 
  ListTodo, 
  Star, 
  ExternalLink, 
  Github, 
  Check, 
  XCircle,
  Plus,
  Layers,
  Award
} from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    projectShowcases, 
    createProject, 
    applyToProject, 
    reviewProjectApplicant, 
    addProjectTask, 
    toggleProjectTask, 
    submitProjectShowcase, 
    currentUser, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'SHOWCASE'>('PROJECTS');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applyModalProjectId, setApplyModalProjectId] = useState<string | null>(null);
  const [pitchMessage, setPitchMessage] = useState('');

  // Review Applicants Modal
  const [reviewModalProject, setReviewModalProject] = useState<ProjectListing | null>(null);

  // Add Task input per project
  const [newTaskTitle, setNewTaskTitle] = useState<Record<string, string>>({});
  const [newTaskAssignee, setNewTaskAssignee] = useState<Record<string, string>>({});

  // Showcase Submission Modal
  const [showSubmitShowcaseModal, setShowSubmitShowcaseModal] = useState(false);
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseSummary, setShowcaseSummary] = useState('');
  const [showcaseAuthors, setShowcaseAuthors] = useState(currentUser.name);
  const [showcaseDemoUrl, setShowcaseDemoUrl] = useState('');
  const [showcaseRepoUrl, setShowcaseRepoUrl] = useState('');
  const [showcaseCategory, setShowcaseCategory] = useState('IoT & Civic Tech');
  const [showcaseTags, setShowcaseTags] = useState('React, Python, OpenCV');

  // Project Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsStr, setSkillsStr] = useState('Flutter, Node.js, Hardware IoT');
  const [stage, setStage] = useState<'IDEA' | 'PROTOTYPING' | 'HACKATHON'>('HACKATHON');
  const [openSlots, setOpenSlots] = useState(2);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a title and description.');
      return;
    }
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    createProject(title, description, skills, openSlots, stage);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalProjectId || !pitchMessage.trim()) return;
    applyToProject(applyModalProjectId, pitchMessage);
    setApplyModalProjectId(null);
    setPitchMessage('');
  };

  const handleAddTask = (projectId: string) => {
    const taskTitle = newTaskTitle[projectId]?.trim();
    if (!taskTitle) return;
    const assignee = newTaskAssignee[projectId]?.trim() || currentUser.name;
    addProjectTask(projectId, taskTitle, assignee);
    setNewTaskTitle({ ...newTaskTitle, [projectId]: '' });
    setNewTaskAssignee({ ...newTaskAssignee, [projectId]: '' });
  };

  const handleSubmitShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseTitle.trim() || !showcaseSummary.trim()) return;
    const tags = showcaseTags.split(',').map(t => t.trim()).filter(Boolean);
    submitProjectShowcase({
      title: showcaseTitle.trim(),
      summary: showcaseSummary.trim(),
      authors: showcaseAuthors.trim() || currentUser.name,
      demoUrl: showcaseDemoUrl.trim() || undefined,
      repoUrl: showcaseRepoUrl.trim() || undefined,
      category: showcaseCategory,
      tags
    });
    setShowSubmitShowcaseModal(false);
    setShowcaseTitle('');
    setShowcaseSummary('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Project Hub & Innovation Showcase
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
              Team Workspaces Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build hackathon squads, manage milestone task lists, review applicant pitches, and showcase finished capstones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'PROJECTS' ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition active:scale-95 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Project</span>
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitShowcaseModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/30 transition active:scale-95 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Submit to Showcase</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('PROJECTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'PROJECTS' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Active Projects & Team Finder ({projects.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('SHOWCASE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'SHOWCASE' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Campus Project Showcase ({projectShowcases.length})</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE PROJECTS */}
      {activeTab === 'PROJECTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(project => {
            const isOwner = project.ownerId === currentUser.id;
            const hasApplied = project.applicants.some(a => a.userId === currentUser.id);
            const pendingApplicants = project.applicants.filter(a => a.status === 'PENDING');

            return (
              <div 
                key={project.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      project.stage === 'HACKATHON' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                      project.stage === 'PROTOTYPING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {project.stage} STAGE
                    </span>

                    <span className="text-xs font-semibold text-slate-400">
                      {project.openSlots} Open Slots
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Skills tags */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Skills Needed</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.requiredSkills.map(skill => (
                        <span 
                          key={skill}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Team Workspace Tasks */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <ListTodo className="w-3.5 h-3.5 text-indigo-600" /> Team Workspace Milestones
                      </span>
                      <span>{project.tasks.filter(t => t.done).length} / {project.tasks.length} Done</span>
                    </div>

                    <div className="space-y-1.5">
                      {project.tasks.map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => toggleProjectTask(project.id, task.id)}
                          className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={task.done} 
                              onChange={() => {}} 
                              className="rounded text-indigo-600 cursor-pointer"
                            />
                            <span className={task.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200 font-medium'}>
                              {task.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">({task.assignee})</span>
                        </div>
                      ))}
                    </div>

                    {/* Add Task Input */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new team sprint task..."
                        value={newTaskTitle[project.id] || ''}
                        onChange={(e) => setNewTaskTitle({ ...newTaskTitle, [project.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(project.id); }}
                        className="flex-1 text-xs px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTask(project.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer with Creator and Action */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {project.ownerName[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{project.ownerName}</span>
                      <span className="text-[10px] text-slate-400">Team Lead</span>
                    </div>
                  </div>

                  {isOwner ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReviewModalProject(project)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Review Applicants ({project.applicants.length})</span>
                      </button>
                    </div>
                  ) : hasApplied ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Application Submitted ✅
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setApplyModalProjectId(project.id);
                        setPitchMessage('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      Apply to Join Team →
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: PROJECT SHOWCASE */}
      {activeTab === 'SHOWCASE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectShowcases.map(show => (
              <div 
                key={show.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {show.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {show.stars} stars
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {show.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {show.summary}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {show.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">By {show.authors}</span>
                  <div className="flex gap-2">
                    {show.repoUrl && (
                      <a 
                        href={show.repoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {show.demoUrl && (
                      <a 
                        href={show.demoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEW APPLICANTS MODAL */}
      {reviewModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Review Applicant Pitches</h3>
                <p className="text-xs text-slate-500">{reviewModalProject.title} ({reviewModalProject.openSlots} slots remaining)</p>
              </div>
              <button onClick={() => setReviewModalProject(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewModalProject.applicants.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No applications received yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviewModalProject.applicants.map(app => (
                  <div key={app.userId} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{app.userName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {app.skills.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {s}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                      "{app.pitch}"
                    </p>

                    {app.status === 'PENDING' && (
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={async () => {
                            await reviewProjectApplicant(reviewModalProject.id, app.userId, 'REJECTED');
                            setReviewModalProject({
                              ...reviewModalProject,
                              applicants: reviewModalProject.applicants.map(a => a.userId === app.userId ? { ...a, status: 'REJECTED' } : a)
                            });
                          }}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 hover:text-rose-600"
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await reviewProjectApplicant(reviewModalProject.id, app.userId, 'ACCEPTED');
                            setReviewModalProject({
                              ...reviewModalProject,
                              openSlots: Math.max(0, reviewModalProject.openSlots - 1),
                              applicants: reviewModalProject.applicants.map(a => a.userId === app.userId ? { ...a, status: 'ACCEPTED' } : a)
                            });
                          }}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept into Team</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Project & Find Teammates</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Powered Autonomous Campus Rover"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Project Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 font-semibold"
                  >
                    <option value="HACKATHON">Upcoming Hackathon</option>
                    <option value="PROTOTYPING">Active Prototype</option>
                    <option value="IDEA">Idea & Research</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Open Member Slots</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={openSlots}
                    onChange={(e) => setOpenSlots(parseInt(e.target.value) || 1)}
                    className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Required Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python, ROS, Computer Vision, React"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Project Mission & Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what problem your project solves and what you hope to build together..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-1 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLY TO PROJECT MODAL */}
      {applyModalProjectId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Apply for Project Team</h3>
            <p className="text-xs text-slate-500">
              Submit your mini pitch and explain which required skills you bring to the table.
            </p>
            <form onSubmit={handleApply} className="space-y-3">
              <textarea
                required
                rows={4}
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                placeholder="e.g. Hey! I have built 2 ROS robots and worked with Gazebo simulation. I'd love to help with the path-planning code."
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApplyModalProjectId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                >
                  Send Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT SHOWCASE MODAL */}
      {showSubmitShowcaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Submit Project to Showcase</h3>
              <button onClick={() => setShowSubmitShowcaseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitShowcase} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Project Title *</label>
                <input
                  type="text"
                  required
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  placeholder="e.g. Campus Quadcopter Aerial Telemetry"
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Short Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={showcaseSummary}
                  onChange={(e) => setShowcaseSummary(e.target.value)}
                  placeholder="One paragraph overview of the technical solution and impact..."
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={showcaseRepoUrl}
                    onChange={(e) => setShowcaseRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Demo URL</label>
                  <input
                    type="url"
                    value={showcaseDemoUrl}
                    onChange={(e) => setShowcaseDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tech Stack Tags (Comma separated)</label>
                <input
                  type="text"
                  value={showcaseTags}
                  onChange={(e) => setShowcaseTags(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitShowcaseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                >
                  Publish Showcase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
