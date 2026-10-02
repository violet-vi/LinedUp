# LinedUp

> **Tell it what needs to get done. It figures out when.**

LinedUp is an **agentic, constraint-aware planning system** that turns commitments into realistic execution plans and adapts those plans when circumstances change.

Traditional task managers answer:

> What do I need to do?

Calendars answer:

> When am I busy?

AI assistants can suggest:

> How might I organize my week?

LinedUp connects all three.

A user provides their commitments, deadlines, workload estimates, difficulty, priorities, fixed events and protected time. LinedUp then determines **when the work can actually happen**, generates work sessions around existing constraints, tracks progress, and can rebalance the remaining schedule when plans change.

Its AI layer adds natural-language interaction and workload intelligence without giving an LLM direct control over scheduling correctness.

**LLM interprets. Algorithm decides. Database remembers.**

---

## Live Application

**AWS Deployment:**  
`YOUR_AMPLIFY_URL_HERE`

The production frontend is hosted using **AWS Amplify** and is publicly accessible through AWS.

---

## The Problem

Planning work is usually fragmented across multiple systems.

A student might have:

- assignments in a task manager,
- classes in a calendar,
- exam dates elsewhere,
- personal commitments in their head,
- and no system determining when the actual work should happen.

Adding a task such as:

> Operating Systems Assignment — 6 hours — due Friday

does not answer the more difficult question:

> **Where do those six hours fit around everything else?**

And when circumstances change—an unexpected quiz, an unfinished study session, a meeting, or simply being unavailable—the manually created plan becomes outdated.

LinedUp is designed around that problem.

---

## Core Idea

LinedUp separates **understanding** from **execution**.

```text
User
 │
 ▼
AI Layer
understands intent
analyzes commitments
explains decisions
 │
 ▼
Structured Actions
 │
 ▼
Deterministic Scheduling Engine
validates constraints
finds free time
prevents collisions
prioritizes work
 │
 ▼
Persistent Schedule

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
