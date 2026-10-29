# Vibecoding Project Tracker — PRD

**Status:** Hackathon starter PRD · review and fill in the **`<TODO>`** sections before you tag `prd-done`.

---

## 1. Functional requirements:
- the system should display a board with four columns: To Do:, In Progress, Review and Done
- The system should display old tasks when opened and not lose data
- The system should let users create new tasks with a + button
- the system should let users edit tasks with an edit button
- the system should let users delete tasks with a delete button
- the system should let users change task status when a task is completed
- the system should have a different colour and tag for bugs and features and so visually indicate the status of tasks
- the system should display the name of who each task is assigned to
- the system should have a section under each task where they can include which ai tools they used for development
- the system should automatically record when the task context was last edited
- the system should allow users to copy all task context using a copy button
- the system should have four cards: presentation, demo, report and documentation
- the system should allow users to enter a url for each card that can be saved.

## 2. Non-Functional requirements:
- the system should be easy to navigate and efficient to use
- The system should respond quickly to what the user does, within 3 seconds
- The system should save all data if closed and reopened or refreshed
- The colour scheme for the system should be easy to understand and consistent
- The system must be able to operate on a range of devices and accessible
- The system should be accessible to users, including people with visual impairments

## 3. Data requirements:
- the system should automatically generate a unique ID for each task
- the system should store each tasks title and context
- the system should store if the tasks are a feature or a bug
- the system should store the status of each task
- the system should store the name of each team member assigned to the tasks
- the system should store when each task is due and when it was created
- the system should store when the tasks were last updated
- the system should save each task so that if the site is closed all data is available when reopened


## 1. Problem

Vibecoding teams have two recurring pains with large projects:

1. **They lose track of tasks.** Three teammates, a hundred small things, no shared view. Nothing tells them what state each task is actually in.
2. **They lose track of prompts.** The AI gave them working code two days ago but no one remembers the prompt that produced it. When they need to iterate, they start from scratch.

A spreadsheet doesn't solve this. A real project tool (Linear, Jira, Notion) is overkill, doesn't know about prompts, and takes hours to set up.

## 2. Target users

- **Primary:** the team members, for the remaining weeks of the summer semester.
- **Secondary:** future cohorts of vibecoders taking the same class.

We are designing the tool we ourselves will use. The pitch demo is also our first real user test.

## 3. Product overview

A single-page web app with two persistent surfaces:

- A **Kanban board** where vibecoding tasks move through four states.
- An **Anchor Board** above it that pins the four final-project deliverables (Presentation, Demo, Report, Documentation).

Each task carries the prompt context that produced it, so any teammate can click a button and copy the task + prompt history back into an AI chat to continue work.


*PRD version: hackathon-starter v1 · maintained by Prof. Dr. Ignacio Alvarez*
