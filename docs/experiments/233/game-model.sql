-- THE COOPERATIVE TRAINING MISSION'S DATA MODEL: experiment 233, second spike, drafted 2026-11-28.
--
-- A DRAFT. NOT RUN against any database, and nothing has been created in Supabase. The practitioner agrees it first
-- (TODO.md, Next batch item 3). Written for Postgres as Supabase hosts it: `auth.uid()` and `auth.users` are Supabase's.
--
-- src/game-model.ts is the same rules in TypeScript, and tests/game-model.test.mjs exercises them. That test also reads
-- this file and checks that each table has row-level security and a read policy, that the append-only tables refuse
-- change, and that the three functions are here. It does not run this SQL.
--
-- What is mutable: a mission's status and current turn, and only through the functions below. Everything a player or
-- the facilitator does is a new row. Moves, turns, turn ends, releases and resolutions are append-only.

create schema if not exists game;

-- ── The mission ────────────────────────────────────────────────────────────────────────────────────────────────────

create table game.mission (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  status              text not null default 'setup' check (status in ('setup', 'in_play', 'debrief', 'closed')),
  turn_count          int  not null check (turn_count >= 1),
  current_turn        int  not null default 0,        -- 0 before the start; also the mission's revision
  -- The pinned worked example the mission was made from, as widgets/examples.json pins one.
  template_repository text not null check (template_repository ~ '^https://github\.com/[^/]+/[^/]+$'),
  template_commit     text not null check (template_commit ~ '^[0-9a-f]{40}$'),
  -- The browser kernel the facilitator's model ran on, by digest.
  kernel_sha256       text not null check (kernel_sha256 ~ '^[0-9a-f]{64}$'),
  created_by          uuid not null references auth.users (id),
  created_at          timestamptz not null default now(),
  check (current_turn between 0 and turn_count)
);

-- What only the facilitator may read while the mission is in play: the model's seed and parameters, and the answer
-- key. Players may read it at the debrief (a question for the practitioner).
create table game.mission_secret (
  mission_id       uuid primary key references game.mission (id),
  seed             bigint not null,
  model_parameters jsonb  not null,
  answer_key       jsonb  not null
);

create table game.team (
  id         uuid primary key default gen_random_uuid(),
  mission_id uuid not null references game.mission (id),
  name       text not null,
  unique (mission_id, name)
);

-- A role in the exercise: the facilitator, or a player's part (field officer, laboratory lead, …). Not a project
-- role (fw:ProjectRole): those are authorship in an investigation.
create table game.role (
  id         uuid primary key default gen_random_uuid(),
  mission_id uuid not null references game.mission (id),
  key        text not null check (key ~ '^[a-z][a-z0-9-]*$'),
  label      text not null,
  kind       text not null check (kind in ('facilitator', 'player')),
  unique (mission_id, key),
  unique (id, kind)
);

-- A player in a role: one person, one membership per mission. A facilitator's membership has no team; a player's has one.
create table game.membership (
  id             uuid primary key default gen_random_uuid(),
  mission_id     uuid not null references game.mission (id),
  team_id        uuid references game.team (id),
  role_id        uuid not null,
  role_kind      text not null,
  user_id        uuid not null references auth.users (id),
  -- Who they are in the exported record: a GitHub login, as fw:githubLogin, with fw:identityBasis.
  github_login   text check (github_login ~ '^[A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38}$'),
  identity_basis text not null default 'declared' check (identity_basis in ('declared', 'attested')),
  joined_at      timestamptz not null default now(),
  foreign key (role_id, role_kind) references game.role (id, kind),
  check ((role_kind = 'facilitator') = (team_id is null)),
  unique (mission_id, user_id)
);

-- ── Turns ──────────────────────────────────────────────────────────────────────────────────────────────────────────

create table game.turn (
  mission_id uuid not null references game.mission (id),
  number     int  not null check (number >= 1),
  opened_at  timestamptz not null,
  primary key (mission_id, number)
);

-- A turn's end, as its own row, so the end is append-only too. The request id is what makes ending idempotent.
create table game.turn_end (
  mission_id    uuid not null,
  turn_number   int  not null,
  ended_at      timestamptz not null,
  ended_by_membership uuid not null references game.membership (id),
  request_id    uuid not null,
  primary key (mission_id, turn_number),
  unique (mission_id, request_id),
  foreign key (mission_id, turn_number) references game.turn (mission_id, number)
);

-- ── Evidence, and its release ──────────────────────────────────────────────────────────────────────────────────────

-- One item of synthetic evidence the facilitator prepared, released at the start of `for_turn`. It may be for every
-- team or one, and for every role or one: the laboratory lead may see results the field officer does not.
create table game.evidence (
  id         uuid primary key default gen_random_uuid(),
  mission_id uuid not null references game.mission (id),
  for_turn   int  not null check (for_turn >= 1),
  team_id    uuid references game.team (id),   -- null: every team
  role_id    uuid references game.role (id),   -- null: every role
  label      text not null,
  path       text not null,                    -- where the file is kept, outside anything a player downloads
  sha256     text not null check (sha256 ~ '^[0-9a-f]{64}$')
);

create table game.release (
  mission_id  uuid not null references game.mission (id),
  evidence_id uuid primary key references game.evidence (id),
  turn_number int  not null,
  released_at timestamptz not null,
  foreign key (mission_id, turn_number) references game.turn (mission_id, number)
);

-- ── Moves ──────────────────────────────────────────────────────────────────────────────────────────────────────────

-- A proposal by one player, or a decision the team records. Every move is timestamped by the server and attributed to
-- the membership, the role and the team, all taken from the caller's membership and never from what the caller sends.
create table game.move (
  id              uuid primary key default gen_random_uuid(),
  seq             bigint generated always as identity unique,   -- ties at the same instant break by arrival
  mission_id      uuid not null references game.mission (id),
  team_id         uuid not null references game.team (id),
  turn_number     int  not null,
  membership_id         uuid not null references game.membership (id),
  role_id         uuid not null references game.role (id),
  user_id         uuid not null references auth.users (id),
  kind            text not null check (kind in ('proposal', 'decision')),
  action          text not null check (length(trim(action)) > 0),
  reason          text,
  evidence_ref    text check (evidence_ref ~ '^(urn:fieldwork:|https://)[^\s<>"{}|\\^`]+$'),
  evidence_sha256 text check (evidence_sha256 ~ '^[0-9a-f]{64}$'),
  reconsider_if   text,
  made_at         timestamptz not null,
  late            boolean not null,   -- made after its turn had ended: kept, never counted
  foreign key (mission_id, turn_number) references game.turn (mission_id, number),
  -- A decision carries its reason, one receipt or artifact with its digest, and what would make the team reconsider.
  check (kind = 'proposal' or (
    length(trim(coalesce(reason, ''))) > 0 and evidence_ref is not null and evidence_sha256 is not null
    and length(trim(coalesce(reconsider_if, ''))) > 0))
);

-- What a turn's end accepted for each team: its last decision made before the end, or none.
create table game.resolution (
  mission_id       uuid not null,
  turn_number      int  not null,
  team_id          uuid not null references game.team (id),
  decision_move_id uuid references game.move (id),
  resolved_at      timestamptz not null,
  primary key (mission_id, turn_number, team_id),
  foreign key (mission_id, turn_number) references game.turn_end (mission_id, turn_number)
);

-- ── Append-only ────────────────────────────────────────────────────────────────────────────────────────────────────

create function game.refuse_change() returns trigger language plpgsql as $$
begin
  raise exception 'game.% is append-only: % refused', tg_table_name, tg_op using errcode = '42501';
end $$;

create trigger turn_append_only         before update or delete on game.turn         for each row execute function game.refuse_change();
create trigger turn_end_append_only     before update or delete on game.turn_end     for each row execute function game.refuse_change();
create trigger release_append_only      before update or delete on game.release      for each row execute function game.refuse_change();
create trigger move_append_only         before update or delete on game.move         for each row execute function game.refuse_change();
create trigger resolution_append_only before update or delete on game.resolution for each row execute function game.refuse_change();
create trigger turn_no_truncate         before truncate on game.turn         for each statement execute function game.refuse_change();
create trigger turn_end_no_truncate     before truncate on game.turn_end     for each statement execute function game.refuse_change();
create trigger release_no_truncate      before truncate on game.release      for each statement execute function game.refuse_change();
create trigger move_no_truncate         before truncate on game.move         for each statement execute function game.refuse_change();
create trigger resolution_no_truncate before truncate on game.resolution for each statement execute function game.refuse_change();

-- ── Who the caller is in a mission ─────────────────────────────────────────────────────────────────────────────────
-- Security definer, so a policy can read memberships without the membership table's own policy applying to itself.

create function game.is_member(m uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from game.membership s where s.mission_id = m and s.user_id = (select auth.uid()))
$$;

create function game.is_facilitator(m uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from game.membership s
                 where s.mission_id = m and s.user_id = (select auth.uid()) and s.role_kind = 'facilitator')
$$;

create function game.player_team(m uuid) returns uuid language sql stable security definer set search_path = '' as $$
  select s.team_id from game.membership s
  where s.mission_id = m and s.user_id = (select auth.uid()) and s.role_kind = 'player'
$$;

create function game.player_role(m uuid) returns uuid language sql stable security definer set search_path = '' as $$
  select s.role_id from game.membership s
  where s.mission_id = m and s.user_id = (select auth.uid()) and s.role_kind = 'player'
$$;

-- A player reads an item of evidence once it is released, if it is for their team (or every team) and for their role
-- (or every role).
create function game.player_can_read_evidence(e uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from game.evidence ev join game.release r on r.evidence_id = ev.id
    where ev.id = e
      and game.player_team(ev.mission_id) is not null
      and (ev.team_id is null or ev.team_id = game.player_team(ev.mission_id))
      and (ev.role_id is null or ev.role_id = game.player_role(ev.mission_id)))
$$;

create function game.in_debrief(m uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from game.mission x where x.id = m and x.status in ('debrief', 'closed'))
$$;

-- ── Each role's read rules ─────────────────────────────────────────────────────────────────────────────────────────
-- Nobody outside a mission reads any of it. The facilitator reads all of their own mission. A player reads the
-- mission, its roles and its turns, and of everything else only their own team's part.

alter table game.mission        enable row level security;
alter table game.mission_secret enable row level security;
alter table game.team           enable row level security;
alter table game.role           enable row level security;
alter table game.membership           enable row level security;
alter table game.turn           enable row level security;
alter table game.turn_end       enable row level security;
alter table game.evidence       enable row level security;
alter table game.release        enable row level security;
alter table game.move           enable row level security;
alter table game.resolution   enable row level security;

create policy mission_read        on game.mission        for select to authenticated using (game.is_member(id));
create policy mission_secret_read on game.mission_secret for select to authenticated
  using (game.is_facilitator(mission_id) or (game.is_member(mission_id) and game.in_debrief(mission_id)));
create policy team_read           on game.team           for select to authenticated
  using (game.is_facilitator(mission_id) or id = game.player_team(mission_id));
create policy role_read           on game.role           for select to authenticated using (game.is_member(mission_id));
create policy membership_read           on game.membership           for select to authenticated
  using (game.is_facilitator(mission_id) or team_id = game.player_team(mission_id));
create policy turn_read           on game.turn           for select to authenticated using (game.is_member(mission_id));
create policy turn_end_read       on game.turn_end       for select to authenticated using (game.is_member(mission_id));
create policy evidence_read       on game.evidence       for select to authenticated
  using (game.is_facilitator(mission_id) or game.player_can_read_evidence(id));
create policy release_read        on game.release        for select to authenticated
  using (game.is_facilitator(mission_id) or game.player_can_read_evidence(evidence_id));
create policy move_read           on game.move           for select to authenticated
  using (game.is_facilitator(mission_id) or team_id = game.player_team(mission_id));
create policy resolution_read   on game.resolution   for select to authenticated
  using (game.is_facilitator(mission_id) or team_id = game.player_team(mission_id));

-- The facilitator prepares the mission: teams, roles, memberships, evidence and the secret. Nobody updates or deletes them.
create policy team_prepare     on game.team           for insert to authenticated with check (game.is_facilitator(mission_id));
create policy role_prepare     on game.role           for insert to authenticated with check (game.is_facilitator(mission_id));
create policy membership_prepare     on game.membership           for insert to authenticated with check (game.is_facilitator(mission_id));
create policy evidence_prepare on game.evidence       for insert to authenticated with check (game.is_facilitator(mission_id));
create policy secret_prepare   on game.mission_secret for insert to authenticated with check (game.is_facilitator(mission_id));

revoke all on all tables in schema game from public, anon, authenticated;
grant usage on schema game to authenticated;
grant select on all tables in schema game to authenticated;
grant insert on game.team, game.role, game.membership, game.evidence, game.mission_secret to authenticated;
-- No insert on mission, turn, turn_end, release, move or resolution: those are written only by the functions below.

-- ── Writing: three functions ───────────────────────────────────────────────────────────────────────────────────────

-- Create a mission and membership its creator as facilitator.
create function game.create_mission(p_title text, p_turn_count int, p_repository text, p_commit text, p_kernel_sha256 text,
                                    p_github_login text default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare m uuid; r uuid;
begin
  if (select auth.uid()) is null then raise exception 'Sign in to create a mission' using errcode = '42501'; end if;
  insert into game.mission (title, turn_count, template_repository, template_commit, kernel_sha256, created_by)
    values (p_title, p_turn_count, p_repository, p_commit, p_kernel_sha256, (select auth.uid())) returning id into m;
  insert into game.role (mission_id, key, label, kind) values (m, 'facilitator', 'Facilitator', 'facilitator') returning id into r;
  insert into game.membership (mission_id, role_id, role_kind, user_id, github_login)
    values (m, r, 'facilitator', (select auth.uid()), p_github_login);
  return m;
end $$;

-- Start: open turn 1 and release its evidence. Idempotent: a mission already started is left as it is.
create function game.start_mission(p_mission uuid)
returns table (opened_turn int, replayed boolean) language plpgsql security definer set search_path = '' as $$
declare m game.mission; t timestamptz;
begin
  if not game.is_facilitator(p_mission) then
    raise exception 'Only the mission''s facilitator can start it' using errcode = '42501';
  end if;
  select * into m from game.mission where id = p_mission for update;
  if m.status <> 'setup' then return query select 1, true; return; end if;
  t := clock_timestamp();
  insert into game.turn (mission_id, number, opened_at) values (p_mission, 1, t);
  insert into game.release (mission_id, evidence_id, turn_number, released_at)
    select p_mission, e.id, 1, t from game.evidence e where e.mission_id = p_mission and e.for_turn = 1;
  update game.mission set status = 'in_play', current_turn = 1 where id = p_mission;
  return query select 1, false;
end $$;

-- A move. The membership, role, team and time come from the server. A move aimed at a turn that has ended is kept and
-- marked late; it is never counted in that turn's resolution.
--
-- Locks the mission row FOR SHARE, so a move and a turn's end cannot interleave: a move either commits before the end
-- (and is counted) or waits and sees the end (and is late). The time is clock_timestamp(), read after the lock,
-- because now() is the transaction's start and a move that waited on the lock would carry a time before the end.
create function game.submit_move(p_mission uuid, p_turn int, p_kind text, p_action text,
                                 p_reason text default null, p_evidence_ref text default null,
                                 p_evidence_sha256 text default null, p_reconsider_if text default null)
returns game.move language plpgsql security definer set search_path = '' as $$
declare s game.membership; m game.mission; mv game.move;
begin
  select * into s from game.membership where mission_id = p_mission and user_id = (select auth.uid()) and role_kind = 'player';
  if not found then raise exception 'Only a player membershiped in this mission can make a move' using errcode = '42501'; end if;
  select * into m from game.mission where id = p_mission for share;
  if m.status in ('setup', 'closed') then raise exception 'The mission is not in play' using errcode = '55000'; end if;
  if not exists (select 1 from game.turn where mission_id = p_mission and number = p_turn) then
    raise exception 'Turn % has not opened', p_turn using errcode = '55000';
  end if;
  insert into game.move (mission_id, team_id, turn_number, membership_id, role_id, user_id, kind, action, reason,
                         evidence_ref, evidence_sha256, reconsider_if, made_at, late)
    values (p_mission, s.team_id, p_turn, s.id, s.role_id, s.user_id, p_kind, p_action, p_reason,
            p_evidence_ref, p_evidence_sha256, p_reconsider_if, clock_timestamp(),
            exists (select 1 from game.turn_end where mission_id = p_mission and turn_number = p_turn))
    returning * into mv;
  return mv;
end $$;

-- THE TURN-ENDING FUNCTION. Only the mission's facilitator. In one transaction: records the end, takes each team's
-- last decision made before it, opens the next turn and releases its evidence, or moves the mission to its debrief
-- after the last turn.
--
-- Idempotent by request id: the client makes one id per press of End turn and resends it until acknowledged, so a
-- repeated request returns the first answer and changes nothing. A different request for a turn that has already
-- ended is refused as stale, so two presses at once advance the turn exactly once. The primary key on turn_end
-- (mission, turn) holds that even if the lock were taken away.
create function game.end_turn(p_mission uuid, p_turn int, p_request uuid)
returns table (ended_turn int, opened_turn int, replayed boolean)
language plpgsql security definer set search_path = '' as $$
declare s game.membership; m game.mission; prior game.turn_end; t timestamptz;
begin
  select * into s from game.membership
    where mission_id = p_mission and user_id = (select auth.uid()) and role_kind = 'facilitator';
  if not found then raise exception 'Only the mission''s facilitator can end a turn' using errcode = '42501'; end if;
  select * into m from game.mission where id = p_mission for update;
  select * into prior from game.turn_end where mission_id = p_mission and request_id = p_request;
  if found then
    return query select prior.turn_number,
      case when prior.turn_number < m.turn_count then prior.turn_number + 1 end, true;
    return;
  end if;
  if m.status <> 'in_play' then raise exception 'The mission is not in play' using errcode = '55000'; end if;
  if p_turn <> m.current_turn then
    raise exception 'Turn % has already ended; the mission is at turn %', p_turn, m.current_turn using errcode = '40001';
  end if;
  t := clock_timestamp();
  insert into game.turn_end (mission_id, turn_number, ended_at, ended_by_membership, request_id)
    values (p_mission, p_turn, t, s.id, p_request);
  insert into game.resolution (mission_id, turn_number, team_id, decision_move_id, resolved_at)
    select p_mission, p_turn, tm.id,
           (select mv.id from game.move mv
            where mv.mission_id = p_mission and mv.team_id = tm.id and mv.turn_number = p_turn
              and mv.kind = 'decision' and not mv.late
            order by mv.made_at desc, mv.seq desc limit 1),
           t
    from game.team tm where tm.mission_id = p_mission;
  if p_turn < m.turn_count then
    insert into game.turn (mission_id, number, opened_at) values (p_mission, p_turn + 1, t);
    insert into game.release (mission_id, evidence_id, turn_number, released_at)
      select p_mission, e.id, p_turn + 1, t from game.evidence e where e.mission_id = p_mission and e.for_turn = p_turn + 1;
    update game.mission set current_turn = p_turn + 1 where id = p_mission;
    return query select p_turn, p_turn + 1, false;
  else
    update game.mission set status = 'debrief' where id = p_mission;
    return query select p_turn, null::int, false;
  end if;
end $$;

revoke all on function game.create_mission, game.start_mission, game.submit_move, game.end_turn from public, anon;
grant execute on function game.create_mission, game.start_mission, game.submit_move, game.end_turn to authenticated;
