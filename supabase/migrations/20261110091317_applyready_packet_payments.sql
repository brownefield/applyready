-- ApplyReady packet payment columns + mark-paid RPC.
-- Applied remotely as applyready_packet_payments (20261110091317).
-- Live Stripe checkout is not shipped yet; this RPC is intended for a
-- future server-side webhook using the service_role key only.

alter table applyready.packet_requests
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'pending', 'paid', 'refunded', 'waived')),
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent text,
  add column if not exists amount_cents integer,
  add column if not exists paid_at timestamptz;

create unique index if not exists packet_requests_stripe_session_uidx
  on applyready.packet_requests (stripe_session_id)
  where stripe_session_id is not null;

create or replace function public.ar_mark_packet_paid(
  p_packet_request_id uuid default null,
  p_workspace_id uuid default null,
  p_stripe_session_id text default null,
  p_stripe_payment_intent text default null,
  p_amount_cents integer default null,
  p_customer_email text default null
)
returns applyready.packet_requests
language plpgsql
security definer
set search_path to 'public', 'applyready'
as $function$
declare
  row applyready.packet_requests;
begin
  if p_packet_request_id is not null then
    update applyready.packet_requests
    set
      payment_status = 'paid',
      stripe_session_id = coalesce(p_stripe_session_id, stripe_session_id),
      stripe_payment_intent = coalesce(p_stripe_payment_intent, stripe_payment_intent),
      amount_cents = coalesce(p_amount_cents, amount_cents),
      paid_at = coalesce(paid_at, now()),
      status = case when status = 'new' then 'reviewing' else status end
    where id = p_packet_request_id
    returning * into row;
  elsif p_stripe_session_id is not null then
    update applyready.packet_requests
    set
      payment_status = 'paid',
      stripe_payment_intent = coalesce(p_stripe_payment_intent, stripe_payment_intent),
      amount_cents = coalesce(p_amount_cents, amount_cents),
      paid_at = coalesce(paid_at, now()),
      status = case when status = 'new' then 'reviewing' else status end
    where stripe_session_id = p_stripe_session_id
    returning * into row;
  elsif p_workspace_id is not null then
    update applyready.packet_requests
    set
      payment_status = 'paid',
      stripe_session_id = coalesce(p_stripe_session_id, stripe_session_id),
      stripe_payment_intent = coalesce(p_stripe_payment_intent, stripe_payment_intent),
      amount_cents = coalesce(p_amount_cents, amount_cents),
      paid_at = coalesce(paid_at, now()),
      status = case when status = 'new' then 'reviewing' else status end
    where id = (
      select id from applyready.packet_requests
      where workspace_id = p_workspace_id
      order by created_at desc
      limit 1
    )
    returning * into row;
  end if;

  if row.workspace_id is not null then
    update applyready.opportunity_workspaces
    set status = 'packet_requested', updated_at = now()
    where id = row.workspace_id;
  elsif p_workspace_id is not null then
    update applyready.opportunity_workspaces
    set status = 'packet_requested', updated_at = now()
    where id = p_workspace_id;
  end if;

  return row;
end;
$function$;

-- Original remote grants left EXECUTE open to anon/authenticated/PUBLIC.
-- Restricted in 20261111101511_revoke_ar_mark_packet_paid_public.sql.
grant execute on function public.ar_mark_packet_paid(uuid, uuid, text, text, integer, text)
  to anon, authenticated, service_role;
