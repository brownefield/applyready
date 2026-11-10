import Link from "next/link";
import DiagnosticWizard from "@/components/diagnostic/DiagnosticWizard";

export default function DiagnosticPage() {
  return (
    <>
      <div className="mx-auto max-w-xl px-5 pt-10">
        <p className="text-xs uppercase tracking-wide text-amber mb-2">FIND · free</p>
        <p className="text-sm text-muted leading-relaxed mb-2">
          General readiness diagnostic. When you have a specific destination,{" "}
          <Link href="/" className="text-navy underline underline-offset-2">
            bring your own opportunity
          </Link>{" "}
          instead.
        </p>
      </div>
      <DiagnosticWizard />
    </>
  );
}
