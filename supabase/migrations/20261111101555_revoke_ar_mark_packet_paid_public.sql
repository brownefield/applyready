-- Harden ApplyReady payment RPC.
-- ar_mark_packet_paid is SECURITY DEFINER and previously had EXECUTE for
-- PUBLIC / anon / authenticated with no auth check, so anyone holding the
-- publishable anon key could mark an arbitrary packet paid by id, Stripe
-- session, or workspace. Live checkout is not shipped; when it is, only a
-- server-side Stripe webhook using service_role should call this function.

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
  if auth.role() is distinct from 'service_role' then
    raise exception 'ApplyReady: ar_mark_packet_paid requires service_role'
      using errcode = '42501';
  end if;

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

revoke all on function public.ar_mark_packet_paid(uuid, uuid, text, text, integer, text) from public;
revoke execute on function public.ar_mark_packet_paid(uuid, uuid, text, text, integer, text) from anon, authenticated;
grant execute on function public.ar_mark_packet_paid(uuid, uuid, text, text, integer, text) to service_role;
