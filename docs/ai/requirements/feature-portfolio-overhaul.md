---
status: "approved"
---

# Feature: Project SLTECH Portfolio Overhaul

## Problem Statement

The current project representation on both the Frontend and Admin interfaces lacks visual authority and usability. The admin form uses raw JSON editing for metrics, making data entry error-prone, while the frontend details page presents an unoptimized, blocky layout that lacks the "Editorial Technical B2B" aesthetic. Additionally, we need to bypass slow UI seeding by directly applying real data via D1 SQL.

## Goals

1. **Direct Database Seeding**: Introduce the SSG GROUP project data via `wrangler d1 execute` directly to avoid UI automation quotas.
2. **Admin UX Refinement**: Simplify `ProjectFormSheet.tsx`. Switch key metrics to a dynamic "Key - Value" list and Highlights to a dynamic string list. Move to a wide split-screen layout.
3. **Frontend Project Detail Redesign**: Overhaul `ProjectDetail.tsx` to an editorial dual-column layout. Remove the broken dark bars. Add a majestic hero image overlay, dynamic features rendering, and standard spacing.

## Personas
- **Senior Fullstack Architect/Admin**: Wants quick and structured project entry without raw JSON manipulation.
- **Client/B2B Buyer**: Wants an authoritative, deeply technical, and scannable visual project case study.

## User Stories

1. As an Admin, I want to edit Key Metrics using an intuitive "Add Row" dynamic component instead of writing raw JSON.
2. As an Admin, I want to manage Highlights using simple bullet points.
3. As a Visitor, I want to see a full-width immersive Hero section with massive white typography.
4. As a Visitor, I want a clean, legible 2-column editorial structure to parse tech specs easily with standard `#3C5DAA` colored typography metrics.

## Key Constraints

1. Do NOT destructively alter the base D1 database beyond seeding the new row.
2. Must map Admin inputs flawlessly back into the underlying JSON column schema required by the backend.
3. Front-end fonts must be `text-lg` or `text-base` for clarity, with dark text (`text-slate-800`).
