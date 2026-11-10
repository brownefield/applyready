import { OpportunityTemplate, Requirement } from "./types";

function withIds(
  templateId: string,
  requirements: Omit<Requirement, "id">[]
): Requirement[] {
  return requirements.map((req, index) => ({
    ...req,
    id: `${templateId}-r${index + 1}`,
  }));
}

/** First paid workflow: small-business opportunity / vendor readiness. */
export const vendorReadinessTemplate: OpportunityTemplate = {
  id: "vendor-readiness",
  title: "Vendor / contracting opportunity",
  kind: "vendor",
  blurb: "Organize identity, registrations, insurance, and capability proof for a vendor network or contract.",
  requirements: [
    {
      name: "Legal business identity",
      description: "Legal name, entity type, and operating address match the application.",
      category: "identity",
      required: true,
      vaultKey: "business_identity",
      evidenceHints: [
        { id: "articles", label: "Articles of organization / incorporation" },
        { id: "dba", label: "DBA filing (if used)" },
      ],
    },
    {
      name: "EIN",
      description: "Employer Identification Number issued by the IRS.",
      category: "identity",
      required: true,
      vaultKey: "ein",
      evidenceHints: [{ id: "ein_letter", label: "IRS EIN confirmation letter (CP 575) or equivalent" }],
    },
    {
      name: "W-9",
      description: "Current W-9 ready to provide to the buyer or network.",
      category: "tax",
      required: true,
      vaultKey: "w9",
      evidenceHints: [{ id: "w9", label: "Signed Form W-9" }],
    },
    {
      name: "Insurance",
      description: "Coverage levels that meet the opportunity's insurance schedule.",
      category: "compliance",
      required: true,
      vaultKey: "insurance",
      evidenceHints: [
        { id: "coi", label: "Certificate of insurance" },
        { id: "policy", label: "Declarations page matching required limits" },
      ],
    },
    {
      name: "Capability statement",
      description: "One-page statement of capabilities, NAICS, differentiators, and past work.",
      category: "capability",
      required: true,
      vaultKey: "capability_statement",
      evidenceHints: [{ id: "cap_stmt", label: "Current capability statement (PDF)" }],
    },
    {
      name: "Licenses / permits",
      description: "Any trade, professional, or local licenses the work requires.",
      category: "compliance",
      required: true,
      vaultKey: "licenses",
      evidenceHints: [{ id: "license", label: "Active license certificates" }],
    },
    {
      name: "NAICS codes",
      description: "Primary and secondary NAICS codes aligned to the opportunity.",
      category: "classification",
      required: true,
      vaultKey: "naics",
      evidenceHints: [{ id: "naics_list", label: "NAICS list used in SAM or marketing materials" }],
    },
    {
      name: "SAM.gov registration",
      description: "Active System for Award Management registration when federal buyers are involved.",
      category: "registration",
      required: false,
      vaultKey: "sam",
      evidenceHints: [{ id: "sam_status", label: "SAM entity status screenshot or UEI confirmation" }],
    },
    {
      name: "Past performance",
      description: "Relevant contracts, references, or project summaries the buyer can verify.",
      category: "capability",
      required: true,
      vaultKey: "past_performance",
      evidenceHints: [
        { id: "refs", label: "2–3 references with contact details" },
        { id: "pp_sheet", label: "Past performance sheet" },
      ],
    },
    {
      name: "Certifications",
      description: "Small-business, socioeconomic, or industry certifications claimed in the bid.",
      category: "certification",
      required: false,
      vaultKey: "certifications",
      evidenceHints: [{ id: "certs", label: "Certification letters or portal confirmations" }],
    },
    {
      name: "Cybersecurity baseline",
      description: "Basic cyber controls or questionnaire responses when the buyer requires them.",
      category: "compliance",
      required: false,
      vaultKey: "cybersecurity",
      evidenceHints: [
        { id: "cyber_q", label: "Completed cybersecurity questionnaire" },
        { id: "controls", label: "Notes on MFA, backups, and access control" },
      ],
    },
  ],
};

export const federalJobTemplate: OpportunityTemplate = {
  id: "federal-job",
  title: "Federal or civil-service job",
  kind: "federal_job",
  blurb: "Map a USAJOBS or state posting to qualification evidence and a federal-ready resume packet.",
  requirements: [
    {
      name: "Announcement identified",
      description: "Job announcement number, series, and grade are clear.",
      category: "destination",
      required: true,
      evidenceHints: [{ id: "announcement", label: "Job announcement PDF or URL" }],
    },
    {
      name: "Specialized experience",
      description: "Work history shows the specialized experience the announcement requires.",
      category: "qualifications",
      required: true,
      evidenceHints: [{ id: "resume", label: "Current resume with hours/week and duties" }],
    },
    {
      name: "KSA / competency evidence",
      description: "Narrative or duty statements address required competencies.",
      category: "qualifications",
      required: true,
      evidenceHints: [{ id: "ksa", label: "Draft KSA or accomplishment statements" }],
    },
    {
      name: "Education / transcripts",
      description: "Degree or coursework proof if the posting uses education substitution.",
      category: "education",
      required: false,
      evidenceHints: [{ id: "transcript", label: "Unofficial or official transcripts" }],
    },
    {
      name: "Federal resume format",
      description: "Resume follows OPM/USAJOBS expectations for the series and grade.",
      category: "artifact",
      required: true,
      evidenceHints: [{ id: "fed_resume", label: "Federal-formatted resume draft" }],
    },
    {
      name: "Supporting documents",
      description: "SF-50, DD-214, licenses, or other docs listed in How to Apply.",
      category: "packet",
      required: true,
      evidenceHints: [{ id: "howto", label: "Checklist from How to Apply section" }],
    },
  ],
};

export const grantTemplate: OpportunityTemplate = {
  id: "grant",
  title: "Grant or program application",
  kind: "grant",
  blurb: "Turn a grant notice into eligibility checks, required attachments, and a submission plan.",
  requirements: [
    {
      name: "Eligibility criteria",
      description: "Applicant type, geography, and purpose match the notice.",
      category: "eligibility",
      required: true,
      evidenceHints: [{ id: "notice", label: "NOFO / program notice" }],
    },
    {
      name: "Organizational documents",
      description: "Bylaws, determination letter, or registration docs if required.",
      category: "identity",
      required: true,
      evidenceHints: [{ id: "org_docs", label: "Org packet listed in the notice" }],
    },
    {
      name: "Budget narrative",
      description: "Budget and narrative align with allowable costs.",
      category: "artifact",
      required: true,
      evidenceHints: [{ id: "budget", label: "Budget workbook + narrative draft" }],
    },
    {
      name: "Required forms",
      description: "All mandatory forms listed in the application package.",
      category: "packet",
      required: true,
      evidenceHints: [{ id: "forms", label: "Completed required forms" }],
    },
    {
      name: "Submission account",
      description: "Portal registration (Grants.gov, state system, etc.) is active.",
      category: "registration",
      required: true,
      evidenceHints: [{ id: "portal", label: "Portal login / UEI confirmation" }],
    },
  ],
};

export const certificationTemplate: OpportunityTemplate = {
  id: "certification",
  title: "Certification or license",
  kind: "certification",
  blurb: "Break a certification pathway into prerequisites, exams, evidence, and renewal tracking.",
  requirements: [
    {
      name: "Eligibility prerequisites",
      description: "Age, education, experience, or sponsorship requirements are met.",
      category: "eligibility",
      required: true,
      evidenceHints: [{ id: "prereq", label: "Prerequisite proof" }],
    },
    {
      name: "Required training / hours",
      description: "Coursework or logged hours the credential board requires.",
      category: "training",
      required: true,
      evidenceHints: [{ id: "hours", label: "Training certificate or hour log" }],
    },
    {
      name: "Exam registration",
      description: "Exam scheduled or passed, depending on stage.",
      category: "exam",
      required: true,
      evidenceHints: [{ id: "exam", label: "Exam confirmation or score report" }],
    },
    {
      name: "Application packet",
      description: "Board application, fees, and identity documents.",
      category: "packet",
      required: true,
      evidenceHints: [{ id: "app", label: "Completed board application" }],
    },
  ],
};

export const OPPORTUNITY_TEMPLATES: OpportunityTemplate[] = [
  vendorReadinessTemplate,
  federalJobTemplate,
  grantTemplate,
  certificationTemplate,
];

export function getTemplate(id: string): OpportunityTemplate | undefined {
  return OPPORTUNITY_TEMPLATES.find((t) => t.id === id);
}

export function requirementsForTemplate(template: OpportunityTemplate): Requirement[] {
  return withIds(template.id, template.requirements);
}
