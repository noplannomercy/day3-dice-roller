# Day 3 - Dice Roller: All Prompts Used

## Overview
- **Date:** 2026-01-05
- **Project:** Dice Roller & Coin Flipper
- **Total Phases:** 5
- **Approach:** TDD (Test-Driven Development)

---

## 1. PRD Review & CLAUDE.md Generation

```
Read: docs/PRD.md - Based on this PRD, generate CLAUDE.md following Anthropic best practices.

Requirements:
- Read existing day1 and day2 CLAUDE.md files for format reference
- Include all sections: Tech Stack, Commands, Development Workflow, Git Workflow, Testing Requirements, Code Conventions, Critical Rules
- Use strong keywords: CRITICAL, IMPORTANT, YOU MUST, NEVER, ALWAYS
- Keep under 60 lines
- Include my strict TODO workflow requirement
```

---

## 2. IMPLEMENTATION.md Creation

```
Read: docs/PRD.md, CLAUDE.md - Create detailed implementation plan.

Requirements:
- Checklist format with [ ] for each item
- Include all phases from PRD with time estimates
- TDD steps: Write test first → Implement → Verify
- Edge cases and error handling
- Mobile testing checklist
- File structure at the end
```

---

## 3. Co-pilot AI Review (Korean)

```
나 지금 Dice Roller 앱 만들려고 구현 계획 짰어. 이 계획 검토해주고 놓친 거 있으면 알려줘.

특히:
- 애니메이션 성능 (rAF, GPU 힌트)
- 랜덤 분포 (d10/d100 범위)
- 모바일 UX (터치 피드백, 스크롤)
- 엣지 케이스 (d10 0-9, d100 00-99, 손상된 JSON)
```

---

## 4. Feedback Application

```
피드백 반영해서 IMPLEMENTATION.md 업데이트해줘
```

---

## 5. Git Initialization

```
Initialize Git repository:
1. git init
2. Create .gitignore (node_modules, .DS_Store, etc.)
3. Initial commit with docs only
```

---

## 6. Phase 1 Execution

```
Phase 1 시작해줘
```

```
진행해줘
```

```
continue
```

```
phase1 전체 완료시켜주세요.
```

```
IMPLEMENTATION.md 업데이트 하고 git commit후 시작해주세요
```

---

## 7. Phase 2 Approval & Execution

```
네
```
(Phase 2 TODO 승인)

```
네
```
(Phase 2 커밋 및 Phase 3 시작 승인)

---

## 8. Phase 3 Execution

(Phase 2 승인 후 자동 진행)

---

## 9. Phase 4 Execution

```
네 Phase 4 전체 진행해줘
```

---

## 10. Phase 5 Execution

```
네 Phase 5 진행해줘
```

---

## 11. Documentation

```
List all prompts I used today from start to finish.

Include:
1. PRD review
2. CLAUDE.md generation
3. IMPLEMENTATION.md creation
4. Co-pilot AI review feedback application
5. Git initialization
6. All implementation steps
7. Everything

Chronological order.
Save to: docs/PROMPTS-DAY3.md
```

---

## Summary

| Step | Prompt Type | Korean/English |
|------|-------------|----------------|
| 1 | PRD → CLAUDE.md | English |
| 2 | IMPLEMENTATION.md | English |
| 3 | Plan Review | Korean |
| 4 | Apply Feedback | Korean |
| 5 | Git Init | English |
| 6 | Phase 1 | Korean |
| 7 | Phase 2 | Korean (네) |
| 8 | Phase 3 | (auto) |
| 9 | Phase 4 | Korean |
| 10 | Phase 5 | Korean |
| 11 | Docs | English |

**Total Prompts:** ~15
**Languages Used:** Korean (approvals), English (detailed instructions)
**Key Pattern:** Detailed first prompt → Short approvals (네, continue)
