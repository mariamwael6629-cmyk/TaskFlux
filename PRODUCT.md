# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the README and `frontend/src`. The owner asked the redesign to proceed on inferred context; treat each line as an assumption until confirmed.

## Platform

web

## Users
Small teams running projects together: they move cards across a Kanban board, write shared documents, and check who is doing what. They live in it all day.

## Product Purpose
TaskFlux: login/register, a dashboard, workspaces with Kanban boards (drag and drop via `@hello-pangea/dnd`, priorities, assignees, due dates), shared documents with an editor, and a team page. React + Vite with one stylesheet (`src/index.css`, CSS variables); FastAPI backend with JWT.

## Positioning
The team's plan on one board, with the docs beside it.

## Capabilities and Constraints
- Tokens are CSS variables; components also use a few inline colours (avatar palette, priority badge).

## Brand Commitments
- Name "TaskFlux".

## Product Principles
1. The board is the product: cards scan fast.
2. Priority and ownership read at a glance.
3. Quiet chrome, dense content.
