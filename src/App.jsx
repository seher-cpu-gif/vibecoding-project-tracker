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

function TaskCard({ task }) {
  return (
    <article className="rounded-lg border border-ink/10 bg-surface-card p-3 transition-shadow hover:shadow-md">
      <h3 className="text-sm font-medium text-ink">{task.title}</h3>
      <p className="mt-2 text-xs text-ink-muted">{task.assignee}</p>
    </article>
  );
}

function Column({ stage, tasks }) {
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
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}

/* ---------- App ---------- */

export default function App() {
  const [tasks] = useLocalStorage('glow.tasks', SEED_TASKS);

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-brand-primary">
          Glow
        </h1>
        <p className="text-sm text-ink-muted">
          Project tracker.
        </p>
      </header>

      {/* The Kanban board (FR1): 1 column on phones, 2 on tablets, 4 on desktops (NF7). */}
      <main className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            stage={stage}
            tasks={tasks.filter((task) => task.status === stage.id)}
          />
        ))}
      </main>
    </div>
  );
}
