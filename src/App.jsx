import { useState, useEffect } from 'react';


/**
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

/**
 * Saves a value in the browser's localStorage so it survives reloads (NF1, DR15).
 */
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

function TaskCard({ task, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="w-full rounded-lg border border-ink/10 bg-surface-card p-3 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
    >
      <span className="block text-sm font-medium text-ink">{task.title}</span>
      <span className="mt-2 block text-xs text-ink-muted">{task.assignee}</span>
    </button>
  );
}

function Column({ stage, tasks, onOpen }) {
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
                    tasks.map((task) => <TaskCard key={task.id} task={task} onOpen={onOpen} />)
        )}
      </div>
    </section>
  );
}

function TaskModal({ mode, task, onSave, onDelete, onClose }) {
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
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-surface-card p-6 shadow-xl"
      >
        <h2
          id="task-modal-title"
          className="mb-4 font-heading text-lg font-semibold text-brand-primary"
        >
          {mode === 'create' ? 'New task' : 'Edit task'}
        </h2>

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
            <div>
              <label htmlFor="task-type" className={labelClass}>Type</label>
              <select
                id="task-type"
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                className={inputClass}
              >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
              </select>
            </div>

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

            <div>
              <label htmlFor="task-due" className={labelClass}>Due date</label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate ?? ''}
                onChange={(e) => update('dueDate', e.target.value || null)}
                className={inputClass}
              />
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

/* ---------- App ---------- */

export default function App() {
  const [tasks, setTasks] = useLocalStorage('glow.tasks', SEED_TASKS);

  const [modal, setModal] = useState(null);

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

      <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            stage={stage}
            tasks={tasks.filter((task) => task.status === stage.id)}
            onOpen={(task) => setModal({ mode: 'edit', task })}
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
        />
      )}
    </div>
  );
}
