import { DiagnosticDefinition } from "./types";

// Question text, option order, and ids match the spec exactly.
// Keep this file free of UI or scoring logic — DiagnosticWizard reads
// it to render, evaluate.ts reads it to score. Neither owns it.
export const readinessDiagnostic: DiagnosticDefinition = {
  slug: "general-readiness",
  title: "General Readiness Diagnostic",
  questions: [
    {
      id: "goal",
      prompt: "What are you trying to accomplish?",
      options: [
        { value: "apply_qualify", label: "Apply or qualify for something" },
        { value: "fix_process", label: "Fix or improve a process" },
        { value: "create_something", label: "Create something I need" },
        { value: "organize_info", label: "Organize or gather information" },
        { value: "not_sure", label: "I'm not sure yet" },
      ],
    },
    {
      id: "knows_requirements",
      prompt: "Do you already know the requirements?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "some", label: "Some of them" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
    },
    {
      id: "has_documents",
      prompt: "Do you already have the information or documents you need?",
      options: [
        { value: "all", label: "Yes, everything" },
        { value: "most", label: "Most of it" },
        { value: "some", label: "Some of it" },
        { value: "little_none", label: "Very little / none" },
      ],
    },
    {
      id: "process_working",
      prompt: "Is your current process working?",
      options: [
        { value: "yes_well", label: "Yes, it works well" },
        { value: "yes_effort", label: "Yes, but it takes too much effort" },
        { value: "partially", label: "Partially" },
        { value: "no", label: "No" },
        { value: "no_process", label: "I don't have a process yet" },
      ],
    },
    {
      id: "repeating_steps",
      prompt: "Are you repeating the same steps regularly?",
      options: [
        { value: "often", label: "Often" },
        { value: "sometimes", label: "Sometimes" },
        { value: "rarely", label: "Rarely" },
        { value: "never", label: "Never" },
      ],
    },
    {
      id: "needs_review",
      prompt:
        "Does someone else need to review, approve, or receive something before you can continue?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "maybe", label: "Maybe" },
        { value: "no", label: "No" },
        { value: "not_sure", label: "I'm not sure" },
      ],
    },
    {
      id: "missing_artifact",
      prompt:
        "Are you missing something that could be created from information you already have?",
      helperText: "Examples: document, form, checklist, email, application packet, summary, report",
      options: [
        { value: "yes", label: "Yes" },
        { value: "maybe", label: "Maybe" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "biggest_blocker",
      prompt: "What is the biggest thing stopping you right now?",
      options: [
        { value: "dont_know_requirements", label: "I don't know what is required" },
        { value: "missing_info", label: "I'm missing information or documents" },
        { value: "takes_too_long", label: "The process takes too much time" },
        { value: "need_created", label: "I need something created" },
        { value: "waiting_on_other", label: "I'm waiting on another person or organization" },
        { value: "nothing_major", label: "Nothing major — I mainly want to verify I'm ready" },
      ],
    },
  ],
};
