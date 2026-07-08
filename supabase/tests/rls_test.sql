-- pgTAP suite for WP-1. Run: supabase test db (see docs/runbooks/supabase-deploy.md).
begin;
select plan(12);

-- Schema sanity
select has_table('public','titles','titles exists');
select has_table('public','coaching_responses','coaching_responses exists');
select has_function('public','retrieval_candidates','retrieval function exists');

-- RLS enabled everywhere
select ok((select relrowsecurity from pg_class where oid = 'public.profiles'::regclass), 'profiles RLS on');
select ok((select relrowsecurity from pg_class where oid = 'public.embeddings'::regclass), 'embeddings RLS on');
select ok((select relrowsecurity from pg_class where oid = 'public.coaching_responses'::regclass), 'coaching_responses RLS on');

-- Anon can read nothing from user plane
set local role anon;
select is_empty($$ select user_id from public.profiles $$, 'anon cannot read profiles');
select is_empty($$ select id from public.sessions $$, 'anon cannot read sessions');
select is_empty($$ select id from public.embeddings $$, 'anon cannot read embeddings');
reset role;

-- Cross-user denial: user A cannot see user B's session
select tests.create_supabase_user('user_a');
select tests.create_supabase_user('user_b');
select tests.authenticate_as('user_b');
insert into public.sessions (id, user_id) values ('00000000-0000-0000-0000-0000000000b1', tests.get_supabase_uid('user_b'));
select tests.authenticate_as('user_a');
select is_empty($$ select id from public.sessions where id = '00000000-0000-0000-0000-0000000000b1' $$,
  'user A cannot read user B session');

-- Authenticated cannot write knowledge tables
select throws_ok(
  $$ insert into public.claims (title_id, attribute, value, content_hash)
     values ((select id from public.titles limit 1), 'x', '1'::jsonb, 'h1') $$,
  '42501', null, 'authenticated cannot insert claims');
reset role;

-- Title gate: retrieval returns zero rows for runtime_eligible=false title (gta-vi)
select is_empty(
  $$ select chunk_id from public.retrieval_candidates(
       (select id from public.titles where slug = 'grand-theft-auto-vi'),
       null, (select array_fill(0.0, array[1536])::vector), 5) $$,
  'ineligible title yields zero retrieval candidates');

select * from finish();
rollback;
