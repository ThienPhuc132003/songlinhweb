---
status: "approved"
---

# Design: Project SLTECH Portfolio Overhaul

## Architecture Overview

This feature restructures the `ProjectDetail.tsx` presentation layout, refines `ProjectFormSheet.tsx` administration inputs, and integrates with direct D1 data seeding.

## Components & Modules

### 1. Admin UI: `ProjectFormSheet.tsx`
- **Layout**: Switch to a Wide Split-Screen layout (Left: Main Content, Right: Meta & Relations).
- **KeyMetricsEditor**: Enhance to support a UI-driven list of Key-Value pairs that serializes down to JSON `{ "Key": "Value" }`.
- **Highlights/Challenges**: Add a simple dynamic array string component for bullet points instead of a text area or raw strings.
- **Styling**: Increase label sizes and padding.

### 2. Frontend UI: `ProjectDetail.tsx`
- **Hero Section**: Full-width Cover Image with gradient overlay (`bg-gradient-to-t`). Project & Client in massive white text.
- **Stats Bar**: Move under the hero. White/Light Gray BG. Numbers styled with monospace Roboto Mono (`font-mono`) in `#3C5DAA` (`text-primary`). Labels in Dark Slate.
- **Content Area**: 
  - Left column (70%): Narrative content. Base typography `text-lg` with `text-slate-800`.
  - Right column (30%): Sticky sidebar for Meta info.
- **Highlights Rendering**: Render `outcomes/highlights` and `system_types` via a Bento Grid or structured lists with Lucide `CheckCircle` icons.

## Data Model (Schema Mapping)
- `system_types`: JSON array of strings `["CCTV", "Tel Data"]`. Admin UI uses a dynamic Multi-Select or CheckBox group.
- `key_metrics`: JSON object `{"Hạ tầng": "100+", "CCTV": "300"}`. Admin uses KeyValue UI, saves as mapped object.
- `outcomes` (Highlights): JSON array of string bullets `["Feature 1", "Feature 2"]`. Admin uses a dynamic string list editor.

## Design Tokens
- Primary Brand Color: `#3C5DAA` (mapped as `text-primary`).
- Editorial Layout: `grid-cols-1 lg:grid-cols-12` (Col space 8 for main, 4 for sidebar).
- Readability: `prose-lg`, `text-slate-800`, `leading-relaxed`.
