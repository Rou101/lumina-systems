# Lumina Orchestration Protocol
> **Version:** 1.0
> **Last Updated:** 2026-01-12

## 1. System Overview
This protocol defines the "Director-Worker" architecture for the Lumina project. 
*   **The Director (Orchestrator):** Main intelligence capable of high-level reasoning, architecture decisions, and state management. Does NOT write implementation code.
*   **The Worker (Implementer):** Ephemeral sessions dedicated to specific, isolated coding tasks defined by the Director.

## 2. File Structure
*   `_management/Lumina_Orchestration_Protocol.md`: (This file) The rules of engagement.
*   `_management/Project_State_Master.md`: The single source of truth for project status, architecture, and backlog.

## 3. Workflow
### Phase A: Director Planning
1.  Director reads `Project_State_Master.md`.
2.  Director analyzes User Request.
3.  Director breaks down request into discrete **Missions**.
4.  Director generates a **"Technical Prompt"** for a Worker.

### Phase B: Worker Execution
1.  User opens a NEW chat window (The Worker).
2.  User pastes the **"Technical Prompt"**.
3.  Worker executes the task (coding, testing, verifying).
4.  Worker generates a **"Mission Report"** at the end.

### Phase C: Sync
1.  User pastes the **"Mission Report"** back to the Director.
2.  Director updates `Project_State_Master.md` and marks task as complete.

## 4. The Technical Prompt Structure
The Director MUST output prompts for workers using this template:
```markdown
# 🚀 MISSION: [Mission Name]
**Context:** [Brief context from Master State]
**Objective:** [Specific goal of this session]

## 🛠️ Constraints & Standards
- Stack: Next.js 14, TailwindCSS, TypeScript.
- Design: Cyberpunk Luxury (Black/Cyan/Electric Purple).
- Language: English (Code), Spanish (UI/Content).

## 📝 Task List
1. [ ] Step 1
2. [ ] Step 2...

## 📦 Deliverable
At the end, provide a **Mission Report** summarizing:
- Files Created/Modified.
- Key Implementation Details.
- Any unresolved issues.
```

## 5. The Mission Report Structure
The Worker MUST output reports using this template:
```markdown
# ✅ MISSION REPORT: [Mission Name]
**Status:** SUCCESS / PARTIAL / FAILED

## 📂 Canvas Changes
- Modified: `src/components/Footer.tsx`
- Created: `src/lib/utils.ts`

## 📝 Implementation Notes
[Brief explanation of what was done]

## ⚠️ Issues / Next Steps
[Anything the Director needs to know for the next task]
```

## 6. Window Management (BEST PRACTICES)
To avoid cognitive load and chaos:

### The Golden Rule of 2 Windows
*   **Window A (Director):** This window. It stays OPEN always. It is the "Brain".
*   **Window B (Worker):** The "Muscle". It is EPHEMERAL (Temporary).

### The Worker Lifecycle
1.  **Open** new window.
2.  **Paste** Technical Prompt.
3.  **Wait** for completion.
4.  **Copy** Mission Report back to Director.
5.  **CLOSE/DELETE** the Worker window immediately.

### Worker Persona (Optional System Instruction)
If you want to paste a system instruction for the Worker:
> "You are a specialized Worker Agent for the Lumina Project. Your job is to strictly execute the provided Technical Prompt. Do not question the architecture; just implement the code in the requested files. When finished, output a Mission Report."
