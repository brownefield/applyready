import { Destination, DestinationKind, DestinationSource, Requirement } from "./types";
import {
  getTemplate,
  requirementsForTemplate,
  vendorReadinessTemplate,
  federalJobTemplate,
  grantTemplate,
  certificationTemplate,
} from "./templates";

function uid(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

/** Extract bullet / numbered / line-item style requirements from free text. */
function extractListedRequirements(text: string): string[] {
  const rawLines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Only treat a line as a requirement if it looks like a list item,
  // or if the paste is a multi-line checklist (not a single narrative).
  const marker = /^(?:[-*•]\s+|\d+[.)]\s+|[a-z][.)]\s+)/i;
  const marked = rawLines.filter((line) => marker.test(line));
  const sourceLines =
    marked.length > 0 ? marked : rawLines.length >= 3 ? rawLines : [];

  const listed = sourceLines
    .map((line) =>
      line
        .replace(/^[-*•]\s+/, "")
        .replace(/^\d+[.)]\s+/, "")
        .replace(/^[a-z][.)]\s+/i, "")
        .trim()
    )
    .filter((line) => line.length >= 8 && line.length <= 160)
    .filter((line) => !/^(http|www\.)/i.test(line))
    .filter((line) => !/^(need|looking|i want|trying|please|help)\b/i.test(line));

  const unique: string[] = [];
  for (const item of listed) {
    const key = item.toLowerCase();
    if (!unique.some((u) => u.toLowerCase() === key)) unique.push(item);
  }
  return unique.slice(0, 30);
}

const KEYWORD_REQUIREMENTS: Array<{ pattern: RegExp; name: string; category: string }> = [
  { pattern: /\b(w-?9)\b/i, name: "W-9", category: "tax" },
  { pattern: /\b(ein|employer identification)\b/i, name: "EIN", category: "identity" },
  { pattern: /\b(sam\.?gov|system for award management|uei)\b/i, name: "SAM.gov registration", category: "registration" },
  { pattern: /\b(certificate of insurance|coi|liability insurance|insurance)\b/i, name: "Insurance", category: "compliance" },
  { pattern: /\b(capability statement)\b/i, name: "Capability statement", category: "capability" },
  { pattern: /\b(naics)\b/i, name: "NAICS codes", category: "classification" },
  { pattern: /\b(past performance|references)\b/i, name: "Past performance", category: "capability" },
  { pattern: /\b(dd-?214|veteran)\b/i, name: "Veterans preference documentation", category: "packet" },
  { pattern: /\b(transcript|degree|bachelor|associate)\b/i, name: "Education / transcripts", category: "education" },
  { pattern: /\b(specialized experience)\b/i, name: "Specialized experience", category: "qualifications" },
  { pattern: /\b(ksa|knowledge,? skills,? and abilities)\b/i, name: "KSA / competency evidence", category: "qualifications" },
  { pattern: /\b(nofo|grant|funding opportunity)\b/i, name: "Grant eligibility confirmation", category: "eligibility" },
  { pattern: /\b(license|licensure|certification)\b/i, name: "License / certification", category: "certification" },
  { pattern: /\b(cyber|cmmc|nist)\b/i, name: "Cybersecurity baseline", category: "compliance" },
  { pattern: /\b(background check|fingerprinting)\b/i, name: "Background check", category: "compliance" },
];

function inferKind(text: string): DestinationKind {
  const t = text.toLowerCase();
  if (/(usajobs|gs-\d|specialized experience|federal resume|announcement)/.test(t)) return "federal_job";
  if (/(nofo|grant|funding opportunity|grants\.gov)/.test(t)) return "grant";
  if (/(license|certification|exam|credential)/.test(t)) return "certification";
  if (/(rfp|rfq|vendor|sam\.gov|contract|naics|capability statement|w-9)/.test(t)) return "vendor";
  if (/(contract|solicitation|bid)/.test(t)) return "contract";
  return "general";
}

function titleFromInput(text: string, kind: DestinationKind): string {
  const firstLine = text.split(/\r?\n/).map((l) => l.trim()).find(Boolean) ?? "";
  if (firstLine.length >= 8 && firstLine.length <= 90 && !/^https?:/i.test(firstLine)) {
    return firstLine;
  }
  const labels: Record<DestinationKind, string> = {
    vendor: "Vendor / contracting opportunity",
    federal_job: "Federal or civil-service job",
    grant: "Grant or program application",
    certification: "Certification or license",
    contract: "Contract opportunity",
    program: "Program application",
    general: "Custom opportunity",
  };
  return labels[kind];
}

function keywordRequirements(text: string): Requirement[] {
  const found: Requirement[] = [];
  for (const rule of KEYWORD_REQUIREMENTS) {
    if (!rule.pattern.test(text)) continue;
    found.push({
      id: uid(slugify(rule.name)),
      name: rule.name,
      category: rule.category,
      required: true,
      evidenceHints: [{ id: "proof", label: `Proof of ${rule.name}` }],
    });
  }
  return found;
}

function listedAsRequirements(items: string[]): Requirement[] {
  return items.map((name) => ({
    id: uid(slugify(name) || "req"),
    name,
    required: true,
    evidenceHints: [{ id: "proof", label: `Evidence for: ${name}` }],
  }));
}

function mergeRequirements(...groups: Requirement[][]): Requirement[] {
  const out: Requirement[] = [];
  for (const group of groups) {
    for (const req of group) {
      const key = req.name.toLowerCase();
      if (!out.some((r) => r.name.toLowerCase() === key)) out.push(req);
    }
  }
  return out;
}

function baselineForKind(kind: DestinationKind): Requirement[] {
  switch (kind) {
    case "vendor":
    case "contract":
      return requirementsForTemplate(vendorReadinessTemplate);
    case "federal_job":
      return requirementsForTemplate(federalJobTemplate);
    case "grant":
    case "program":
      return requirementsForTemplate(grantTemplate);
    case "certification":
      return requirementsForTemplate(certificationTemplate);
    default:
      return [
        {
          id: uid("identity"),
          name: "Identity / eligibility basics",
          description: "Confirm you are an eligible applicant for this destination.",
          required: true,
          evidenceHints: [{ id: "identity", label: "Identity or eligibility proof" }],
        },
        {
          id: uid("docs"),
          name: "Required documents",
          description: "Assemble the documents the opportunity lists.",
          required: true,
          evidenceHints: [{ id: "docs", label: "Document checklist from the source" }],
        },
        {
          id: uid("form"),
          name: "Application / submission packet",
          description: "Complete the forms or portal steps required to submit.",
          required: true,
          evidenceHints: [{ id: "packet", label: "Draft application packet" }],
        },
        {
          id: uid("deadline"),
          name: "Deadline and submission method",
          description: "Confirm when and how the packet must be delivered.",
          required: true,
          evidenceHints: [{ id: "deadline", label: "Deadline note + submission channel" }],
        },
      ];
  }
}

export interface ParseInput {
  text: string;
  source: DestinationSource;
  templateId?: string;
  fileName?: string;
}

export function parseOpportunityInput(input: ParseInput): Destination {
  const raw = input.text.trim();
  const now = new Date().toISOString();

  if (input.templateId) {
    const template = getTemplate(input.templateId);
    if (!template) {
      throw new Error(`Unknown template: ${input.templateId}`);
    }
    return {
      id: uid("dest"),
      title: template.title,
      kind: template.kind,
      source: "template",
      templateId: template.id,
      summary: template.blurb,
      rawInput: raw || undefined,
      requirements: requirementsForTemplate(template),
      createdAt: now,
    };
  }

  if (!raw) {
    throw new Error("Paste, describe, or choose a template for the opportunity.");
  }

  const kind = inferKind(raw);
  const listed = extractListedRequirements(raw);
  const fromKeywords = keywordRequirements(raw);
  const fromList = listedAsRequirements(listed);
  const baseline = baselineForKind(kind);

  // Prefer explicit lists + keywords; fill from the matching baseline so
  // short descriptions still produce a usable completion plan.
  const requirements =
    fromList.length >= 4
      ? mergeRequirements(fromList, fromKeywords)
      : mergeRequirements(fromKeywords, fromList, baseline);

  const isUrl = /^https?:\/\//i.test(raw.split(/\s/)[0] ?? "");

  return {
    id: uid("dest"),
    title: input.fileName
      ? `Opportunity from ${input.fileName}`
      : titleFromInput(raw, kind),
    kind,
    source: isUrl ? "link" : input.source,
    rawInput: raw,
    summary:
      fromList.length >= 4
        ? `Extracted ${requirements.length} requirements from the material you provided.`
        : `Mapped this to a ${kind.replace("_", " ")} readiness plan with ${requirements.length} requirements.`,
    requirements,
    createdAt: now,
  };
}
