import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/readiness/session";
import ReadinessScore from "@/components/results/ReadinessScore";
import ResultSummary from "@/components/results/ResultSummary";
import ActionList from "@/components/results/ActionList";
import NextStepForm from "@/components/results/NextStepForm";

export default async function ResultsPage({
  params,
}: {
  params: { sessionId: string };
}) {
  const session = await getSession(supabaseServer(), params.sessionId).catch(() => null);

  if (!session || !session.result) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl text-ink mb-3">We couldn&rsquo;t find that result.</h1>
        <p className="text-muted mb-8">
          It may still be in progress, or the link may be incorrect.
        </p>
        <Link href="/diagnostic" className="rounded-card bg-navy text-white px-6 py-3 text-sm">
          Start the Diagnostic
        </Link>
      </main>
    );
  }

  const { result } = session;

  return (
    <main className="mx-auto max-w-xl px-5 py-14 sm:py-20 flex flex-col gap-12">
      <ReadinessScore score={result.score} />
      <ResultSummary result={result} />
      <ActionList actions={result.recommendedActions} />
      <NextStepForm sessionId={session.id} />
    </main>
  );
}
