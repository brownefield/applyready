import WorkspaceClient from "@/components/opportunity/WorkspaceClient";

export default function ReadyWorkspacePage({
  params,
}: {
  params: { workspaceId: string };
}) {
  return <WorkspaceClient workspaceId={params.workspaceId} />;
}
