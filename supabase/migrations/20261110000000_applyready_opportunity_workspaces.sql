-- ApplyReady opportunity workspaces (Readiness Workspace persistence).
-- Applied remotely via Supabase MCP as applyready_opportunity_workspaces.
-- Client-side sessionStorage remains the MVP path; these tables unlock
-- shareable workspaces and Ready Packet lead capture.

create table if not exists applyready.opportunity_workspaces (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'qualifying'
    check (status in ('intake','qualifying','planned','packet_requested')),
  destination jsonb not null,
  evidence jsonb not null default '{}'::jsonb,
  plan jsonb,
  source text,
  template_id text
);

create table if not exists applyready.packet_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  workspace_id uuid references applyready.opportunity_workspaces(id) on delete set null,
  name text not null,
  email text not null,
  note text,
  offer text not null default 'ready_packet_99',
  status text not null default 'new'
    check (status in ('new','reviewing','in_progress','completed','declined'))
);

alter table applyready.opportunity_workspaces enable row level security;
alter table applyready.packet_requests enable row level security;

-- No direct table policies: access via SECURITY DEFINER RPCs only.

create or replace function public.ar_create_workspace(
  p_destination jsonb,
  p_evidence jsonb default '{}'::jsonb,
  p_source text default null,
  p_template_id text default null
)
returns applyready.opportunity_workspaces
language plpgsql
security definer
set search_path = public, applyready
as $$
declare
  row applyready.opportunity_workspaces;
begin
  insert into applyready.opportunity_workspaces (destination, evidence, source, template_id, status)
  values (p_destination, coalesce(p_evidence, '{}'::jsonb), p_source, p_template_id, 'qualifying')
  returning * into row;
  return row;
end;
$$;

create or replace function public.ar_update_workspace(
  p_id uuid,
  p_evidence jsonb,
  p_plan jsonb default null,
  p_status text default null
)
returns applyready.opportunity_workspaces
language plpgsql
security definer
set search_path = public, applyready
as $$
declare
  row applyready.opportunity_workspaces;
begin
  update applyready.opportunity_workspaces
  set
    evidence = coalesce(p_evidence, evidence),
    plan = coalesce(p_plan, plan),
    status = coalesce(p_status, status),
    updated_at = now()
  where id = p_id
  returning * into row;
  return row;
end;
$$;

create or replace function public.ar_get_workspace(p_id uuid)
returns applyready.opportunity_workspaces
language sql
security definer
set search_path = public, applyready
as $$
  select * from applyready.opportunity_workspaces where id = p_id;
$$;

create or replace function public.ar_create_packet_request(
  p_workspace_id uuid,
  p_name text,
  p_email text,
  p_note text default null,
  p_offer text default 'ready_packet_99'
)
returns applyready.packet_requests
language plpgsql
security definer
set search_path = public, applyready
as $$
declare
  row applyready.packet_requests;
begin
  insert into applyready.packet_requests (workspace_id, name, email, note, offer)
  values (p_workspace_id, p_name, p_email, p_note, coalesce(p_offer, 'ready_packet_99'))
  returning * into row;

  update applyready.opportunity_workspaces
  set status = 'packet_requested', updated_at = now()
  where id = p_workspace_id;

  return row;
end;
$$;

grant execute on function public.ar_create_workspace(jsonb, jsonb, text, text) to anon, authenticated;
grant execute on function public.ar_update_workspace(uuid, jsonb, jsonb, text) to anon, authenticated;
grant execute on function public.ar_get_workspace(uuid) to anon, authenticated;
grant execute on function public.ar_create_packet_request(uuid, text, text, text, text) to anon, authenticated;
