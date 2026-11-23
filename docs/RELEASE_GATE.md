# Release Gate: Auth, Authorization, Tenant Isolation

**Standing Brownefield requirement (Teddy, 2026-11-23).** No new product, route, tenant, or database function ships to production until this review passes and its results are logged in `brownefield-core.public.changelog`. It is a permanent release gate, not an occasional exercise.

## 1. Authentication
- [ ] Every route that uses the service-role key either checks a signed-in session or is a deliberate public endpoint that is documented as public.
- [ ] Public endpoints validate all input on the server, cap body size, and rate-limit.
- [ ] No secret key reaches the browser (search the client bundle for `SERVICE_ROLE` and secret env names).

## 2. Authorization
- [ ] Operator/admin reads and writes require `app_admins` or a scoped `tenant_users` role.
- [ ] Fields that can be written are allow-listed. No passthrough of request bodies into updates.
- [ ] Every new `SECURITY DEFINER` function: EXECUTE is granted to `anon` or `authenticated` only when a real client calls it, and the reason is written down.

## 3. Tenant isolation
- [ ] Every query that returns tenant data filters by the caller's tenants (or by RLS that does).
- [ ] An ID from another tenant returns 404, never data. Test it with a second, non-admin account.
- [ ] RLS is enabled on every new table, and every policy is reviewed. No `with check (true)` for anon.
- [ ] Storage buckets holding customer files are private.

## 4. Evidence before release
- [ ] Run the Supabase security advisors. Each new finding is fixed or explicitly accepted with a reason.
- [ ] Do a controlled check that unauthenticated requests get 401/404 on the deployed preview.
- [ ] Log the results (VERIFIED / UNTESTED / accepted risks) in the changelog.
