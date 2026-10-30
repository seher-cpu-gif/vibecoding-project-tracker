import { useState, useEffect } from 'react';
import { Sparkles, Bug, Calendar, Clock, AlarmClock, Check, Copy,Presentation, MonitorPlay, FileText, BookOpen, ExternalLink } from 'lucide-react';

/**
 * Glow — a project tracker for vibe-coding projects.
 *
 * The shape of a task:
 * @typedef {Object} Task
 * @property {string} id            Unique ID (DR1)
 * @property {string} title         Required (DR2)
 * @property {string} description   Optional (DR3)
 * @property {'feature'|'bug'} type (DR4)
 * @property {'todo'|'in-progress'|'review'|'done'} status (DR5)
 * @property {string} assignee      One name from TEAM (DR7)
 * @property {string|null} dueDate  'YYYY-MM-DD' (DR8)
 * @property {string} createdDate   'YYYY-MM-DD' (DR9)
 */

export const STAGES = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',      label: 'Review' },
  { id: 'done',        label: 'Done' },
];

export const TEAM = ['Inaya Farah', 'John Smith', 'Jimmy Cooks', 'Frank Ocean'];

const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Gemini', 'Copiolot', 'Other'];

const CONTEXT_TEMPLATE = `## Background
What is this task?

## Constraints
Things to avoid.

## Tried so far
Prompts used:

## Pick up
Next steps.`;

const DELIVERABLES = [
  { id: 'presentation',  label: 'Presentation',  icon: Presentation, placeholder: 'Link to slides' },
  { id: 'demo',          label: 'Demo',          icon: MonitorPlay,  placeholder: 'Link to live demo or video' },
  { id: 'report',        label: 'Report',        icon: FileText,     placeholder: 'Link to report' },
  { id: 'documentation', label: 'Documentation', icon: BookOpen,     placeholder: 'Link to docs or README' },
];

const EMPTY_DELIVERABLES = { presentation: '', demo: '', report: '', documentation: '' };

function isValidUrl(value) {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function daysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

const SEED_TASKS = [
  {
    id: 'seed-1',
    title: 'Set up logo',
    description: 'design and set a logo',
    type: 'feature',
    status: 'done',
    assignee: 'Frank Ocean',
    dueDate: daysFromToday(-2),
    createdDate: daysFromToday(-6),
  },
  {
    id: 'seed-2',
    title: 'Build Kanban board layout',
    description: 'Four columns that show tasks by status.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Inaya Farah',
    dueDate: daysFromToday(3),
    createdDate: daysFromToday(-3),
  },
  {
    id: 'seed-3',
    title: 'Add feature tasks',
    description: 'Add some example features',
    type: 'bug',
    status: 'review',
    assignee: 'John Smith',
    dueDate: daysFromToday(0),
    createdDate: daysFromToday(-2),
  },
  {
    id: 'seed-4',
    title: 'Add bug fixes',
    description: 'add example bugs',
    type: 'bug',
    status: 'todo',
    assignee: 'Jimmy Cooks',
    dueDate: daysFromToday(-1),
    createdDate: daysFromToday(-4),
  },
];

function createId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function newTask() {
  return {
    id: createId(),
    title: '',
    description: '',
    type: 'feature',
    status: 'todo',
    assignee: TEAM[0],
    dueDate: null,
    createdDate: daysFromToday(0),
    context: CONTEXT_TEMPLATE, 
    contextTool: '',           
    contextUpdatedAt: null,    
  };
}

function formatDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function timeAgo(iso, now = Date.now()) {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

function buildContextBlock(task) {
  const details = [
    `Type: ${TYPE_STYLES[task.type]?.label ?? task.type}`,
    `Status: ${STAGES.find((s) => s.id === task.status)?.label ?? task.status}`,
    `Owner: ${task.assignee}`,
    task.dueDate ? `Due: ${formatDate(task.dueDate)}` : null,
    task.contextTool ? `AI tool: ${task.contextTool}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return [
    "I'm continuing work on a task from my project. Here's the context so you can pick up where I left off.",
    '',
    `# Task: ${task.title}`,
    details,
    '',
    '## Description',
    task.description?.trim() || '_No description yet._',
    '',
    task.context?.trim() || '## Context\n_No context yet._',
  ].join('\n');
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(temp);
      return ok;
    } catch {
      return false;
    }
  }
}

const TYPE_STYLES = {
  feature: {
    label: 'Feature',
    icon: Sparkles,
    stripe: 'border-l-type-feature',
    badge: 'bg-type-feature/10 text-type-feature',
    selected: 'border-type-feature bg-type-feature/10 text-type-feature',
    bar: 'bg-type-feature',
  },
  bug: {
    label: 'Bug',
    icon: Bug,
    stripe: 'border-l-type-bug',
    badge: 'bg-type-bug/10 text-type-bug',
    selected: 'border-type-bug bg-type-bug/10 text-type-bug',
    bar: 'bg-type-bug',
  },
};

const DUE_STYLES = {
  safe: {
    icon: Calendar,
    card: 'border-ink/10 bg-surface-card',
    chip: 'border-due-safe/40 bg-surface-card text-due-safe',
  },
  warning: {
    icon: Clock,
    card: 'border-due-warning/40 bg-due-warning/10',
    chip: 'border-due-warning/40 bg-surface-card text-due-warning',
  },
  overdue: {
    icon: AlarmClock,
    card: 'border-due-overdue/50 bg-due-overdue/10',
    chip: 'border-due-overdue/50 bg-surface-card text-due-overdue',
  },
  neutral: {
    icon: Check,
    card: 'border-ink/10 bg-surface-card/60',
    chip: 'border-due-neutral/40 bg-surface-card text-due-neutral',
  },
};


function getDueState(task, now = Date.now()) {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return null;
  const [y, m, d] = task.dueDate.split('-').map(Number);
  const deadline = new Date(y, m - 1, d, 23, 59, 59).getTime();
  const hoursLeft = (deadline - now) / (1000 * 60 * 60);
  if (hoursLeft < 0) return 'overdue';
  if (hoursLeft < 24) return 'warning';
  return 'safe';
}

function getDueLabel(task, state, now = Date.now()) {
  if (state === 'neutral') return 'Done';
  const [y, m, d] = task.dueDate.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const days = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (state === 'overdue') return days === -1 ? 'Overdue by 1 day' : `Overdue by ${-days} days`;
  if (state === 'warning') return 'Due today';
  return days === 1 ? 'Due tomorrow' : `Due in ${days} days`;
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked, ignore for the prototype */
    }
  }, [key, value]);

  return [value, setValue];
}

/* ---------- Components ---------- */

function TypeBadge({ type }) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.feature;
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ${style.badge}`}
    >
      <Icon size={12} aria-hidden="true" />
      {style.label}
    </span>
  );
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ name }) {
  return (
    <span
      title={name}
      aria-hidden="true"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary font-mono text-xs font-semibold text-surface-card"
    >
      {getInitials(name)}
    </span>
  );
}

function DueChip({ task }) {
  const state = getDueState(task);
  if (!state) return null;
  const style = DUE_STYLES[state];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium ${style.chip}`}
    >
      <Icon size={12} aria-hidden="true" />
      {getDueLabel(task, state)}
    </span>
  );
}

function CopyButton({ onClick, label = 'Copy context' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-md border border-ink/15 bg-surface-card px-2.5 py-1.5 text-xs font-medium text-ink hover:border-brand-primary hover:text-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <Copy size={14} aria-hidden="true" />
      Copy Context
    </button>
  );
}

function TaskCard({ task, onOpen, onCopy, highlighted }) { 
  const style = TYPE_STYLES[task.type] ?? TYPE_STYLES.feature;
  const dueState = getDueState(task);
  const dueCard = dueState ? DUE_STYLES[dueState].card : 'border-ink/10 bg-surface-card';

  return (
    <div
      className={`rounded-lg border border-l-4 ${dueCard} transition-shadow hover:shadow-md ${style.stripe} ${
        highlighted ? 'ring-2 ring-brand-accent ring-offset-2' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(task)}
        className="block w-full rounded-t-lg p-3 pb-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-ink">{task.title}</span>
          <TypeBadge type={task.type} />
        </span>

        <span className="mt-3 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            <Avatar name={task.assignee} />
            <span className="truncate text-xs text-ink-muted">{task.assignee}</span>
          </span>
          <DueChip task={task} />
        </span>
      </button>

      <div className="flex justify-end border-t border-ink/5 px-3 py-2">
        <CopyButton onClick={() => onCopy(task)} label={`Copy context for ${task.title}`} />
      </div>
    </div>
  );
}

function Column({ stage, tasks, onOpen, onCopy, highlightedId }) {
  const headingId = `column-${stage.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="flex flex-col rounded-xl bg-brand-primary/5 p-3"
    >
      <h2
        id={headingId}
        className="mb-3 flex items-center justify-between px-1 font-heading text-base font-semibold uppercase tracking-wide text-ink-muted"
      >
        {stage.label}
        <span className="rounded-full bg-surface-card px-2 py-0.5 font-mono text-xs text-ink-muted">
          {tasks.length}
        </span>
      </h2>

      <div className="flex flex-1 flex-col gap-3">
        {tasks.length === 0 ? (
          <p className="rounded-lg border-2 border-dashed border-ink/15 p-4 text-center text-sm text-ink-muted">
            Nothing here yet.
          </p>
        ) : (
                    tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={onOpen}
              onCopy={onCopy}
              highlighted={task.id === highlightedId}
            />
          ))
        )}
      </div>
    </section>
  );
}

function TaskModal({ mode, task, onSave, onDelete, onClose, onHandOff, onCopy }) {
  const [form, setForm] = useState(task);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateContext(value) {
    setForm((prev) => ({
      ...prev,
      context: value,
      contextUpdatedAt: new Date().toISOString(),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return; 
    onSave({ ...form, title: form.title.trim() });
  }

  function handleDelete() {
    if (window.confirm("Delete this task? This can't be undone.")) {
      onDelete(form.id);
    }
  }
  function handleHandOff(name) {
    if (!name || !form.title.trim()) return;
    onHandOff({ ...form, title: form.title.trim(), assignee: name });
  }

  const labelClass = 'mb-1 block text-xs font-medium text-ink-muted';
  const inputClass =
    'w-full rounded-md border border-ink/15 bg-surface-card px-3 py-2 text-sm text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface-card p-6 shadow-xl"
      >
        <div className={`-mx-6 -mt-6 mb-5 h-1.5 rounded-t-xl ${TYPE_STYLES[form.type].bar}`} />

        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="task-modal-title"
            className="font-heading text-lg font-semibold text-brand-primary"
          >
            {mode === 'create' ? 'New task' : 'Edit task'}
          </h2>
          <TypeBadge type={form.type} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-title" className={labelClass}>Title *</label>
            <input
              id="task-title"
              type="text"
              required
              autoFocus
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="e.g. Fix login button on mobile"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="task-description" className={labelClass}>Description</label>
            <textarea
              id="task-description"
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="What needs doing?"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <fieldset>
              <legend className={labelClass}>Type</legend>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(TYPE_STYLES).map(([value, style]) => {
                  const Icon = style.icon;
                  const selected = form.type === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => update('type', value)}
                      className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        selected ? style.selected : 'border-ink/15 text-ink-muted hover:bg-ink/5'
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" />
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="task-status" className={labelClass}>Status</label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className={inputClass}
              >
                {STAGES.map((stage) => (
                  <option key={stage.id} value={stage.id}>{stage.label}</option>
                ))}
              </select>
            </div>

                        {mode === 'create' ? (
              <div>
                <label htmlFor="task-assignee" className={labelClass}>Assignee</label>
                <select
                  id="task-assignee"
                  value={form.assignee}
                  onChange={(e) => update('assignee', e.target.value)}
                  className={inputClass}
                >
                  {TEAM.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="task-handoff" className={labelClass}>Owner</label>
                <div className="mb-2 flex items-center gap-2">
                  <Avatar name={form.assignee} />
                  <span className="text-sm font-medium text-ink">{form.assignee}</span>
                </div>
                <select
                  id="task-handoff"
                  value=""
                  onChange={(e) => handleHandOff(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Hand off to…</option>
                  {TEAM.filter((name) => name !== form.assignee).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="task-due" className={labelClass}>Due date</label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate ?? ''}
                onChange={(e) => update('dueDate', e.target.value || null)}
                className={inputClass}
              />
              <div className="mt-2">
                <DueChip task={form} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-surface-page/60 p-4">
          <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="task-context"
                className="block font-heading text-sm font-semibold uppercase tracking-wide text-brand-primary"
              >
                Context
              </label>
              {/* Copies what's in the form right now, including unsaved edits. */}
              <CopyButton onClick={() => onCopy(form)} />
            </div>
            <p className="mb-2 text-xs text-ink-muted">
              Prompts, results and notes, so you (or your AI) can pick up where you left off. Markdown supported.
            </p>

            <textarea
              id="task-context"
              rows={10}
              value={form.context ?? ''}
              onChange={(e) => updateContext(e.target.value)}
              placeholder={CONTEXT_TEMPLATE}
              className="w-full rounded-md border border-ink/15 bg-surface-card px-3 py-2 font-mono text-[13px] leading-relaxed text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="task-tool" className="text-xs font-medium text-ink-muted">
                  AI tool
                </label>
                <select
                  id="task-tool"
                  value={form.contextTool ?? ''}
                  onChange={(e) => update('contextTool', e.target.value)}
                  className="rounded-md border border-ink/15 bg-surface-card px-2 py-1.5 text-xs text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                >
                  <option value="">Choose…</option>
                  {AI_TOOLS.map((tool) => (
                    <option key={tool} value={tool}>{tool}</option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-ink-muted">
                {form.contextUpdatedAt
                  ? `Last updated ${timeAgo(form.contextUpdatedAt)}`
                  : 'Not edited yet'}
              </p>
            </div>
          </div>

          {mode === 'edit' && (
            <p className="text-xs text-ink-muted">Created {formatDate(form.createdDate)}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            {mode === 'edit' ? (
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-due-overdue hover:bg-due-overdue/10"
              >
                Delete
              </button>
            ) : (
              <span />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink hover:bg-ink/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-brand-primary px-4 py-2.5 text-sm font-medium text-surface-card hover:bg-brand-primary/90"
              >
                {mode === 'create' ? 'Create task' : 'Save changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeliverablesBar({ links, onChange }) {
  const addedCount = DELIVERABLES.filter((d) => isValidUrl(links[d.id] ?? '')).length;

  return (
    <section aria-labelledby="deliverables-heading" className="mb-6">
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2
          id="deliverables-heading"
          className="font-heading text-base font-semibold uppercase tracking-wide text-ink-muted"
        >
          Deliverables
        </h2>
        <span className="font-mono text-xs text-ink-muted">
          {addedCount} of {DELIVERABLES.length} added
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DELIVERABLES.map((d) => {
          const value = links[d.id] ?? '';
          const filled = isValidUrl(value);
          const Icon = d.icon;
          const inputId = `deliverable-${d.id}`;

          return (
            <div key={d.id} className="rounded-lg border border-ink/10 bg-surface-card p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label htmlFor={inputId} className="flex items-center gap-2 text-sm font-medium text-ink">
                  <Icon size={16} aria-hidden="true" className="text-brand-accent" />
                  {d.label}
                </label>

                <span className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-full border-2 border-brand-primary ${
                      filled ? 'bg-brand-primary' : 'bg-transparent'
                    }`}
                  />
                  {filled ? 'Link added' : value.trim() ? 'Check link' : 'No link yet'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id={inputId}
                  type="url"
                  value={value}
                  onChange={(e) => onChange(d.id, e.target.value)}
                  placeholder={d.placeholder}
                  className="min-w-0 flex-1 rounded-md border border-ink/15 bg-surface-card px-2.5 py-1.5 text-xs text-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                />
                {filled && (
                  <a
                    href={value.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${d.label} link in a new tab`}
                    className="rounded-md p-1.5 text-ink-muted hover:bg-ink/5 hover:text-brand-primary"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- App ---------- */

export default function App() {
  const [tasks, setTasks] = useLocalStorage('glow.tasks', SEED_TASKS);

  const [modal, setModal] = useState(null);

  const [deliverables, setDeliverables] = useLocalStorage('glow.deliverables', EMPTY_DELIVERABLES);

  function updateDeliverable(id, value) {
    setDeliverables((prev) => ({ ...prev, [id]: value }));
  }

  function saveTask(task) {
    setTasks((prev) =>
      prev.some((t) => t.id === task.id)
        ? prev.map((t) => (t.id === task.id ? task : t))
        : [...prev, task]
    );
    setModal(null);
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setModal(null);
  }
  const [toast, setToast] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
      setHighlightedId(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function handOffTask(task) {
    saveTask(task);
    setHighlightedId(task.id);
    setToast(`Handed off to ${task.assignee}. It's theirs now.`);
  }

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  async function copyTaskContext(task) {
    const ok = await copyToClipboard(buildContextBlock(task));
    setToast(
      ok
        ? 'Context copied. Paste it into your AI and pick up where you left off.'
        : "Couldn't copy. Please try again."
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-brand-primary">
            Glow
          </h1>
          <p className="text-sm text-ink-muted">Project tracker.</p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: 'create', task: newTask() })}
          className="rounded-md bg-brand-primary px-4 py-2.5 text-sm font-medium text-surface-card hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          + New task
        </button>
      </header>

      <DeliverablesBar links={deliverables} onChange={updateDeliverable} />

      <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            stage={stage}
            tasks={tasks.filter((task) => task.status === stage.id)}
            onOpen={(task) => setModal({ mode: 'edit', task })}
            highlightedId={highlightedId}
            onCopy={copyTaskContext}
          />
        ))}
      </main>

      {modal && (
        <TaskModal
          key={modal.task.id}
          mode={modal.mode}
          task={modal.task}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => setModal(null)}
          onHandOff={handOffTask}
        />
      )}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-medium text-surface-card shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}