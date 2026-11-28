# 233 · A cooperative, turn-based training mission

_Created 2026-11-26 · Updated 2026-11-27_

**Status:** tried, one spike; a second drafted, not run. A research proposal, kept for review. The first piece is
tried: a Supabase key made by the practitioner and checked from Fieldwork's Credentials dialog, which Supabase accepted
(2026-11-27, below). The second is a draft of the game's data model, checked by unit tests against a TypeScript copy of
its rules, and not run on any database (2026-11-28, below). Nothing else is built: no game, no hosted session, no
learner trial. Every other design choice below is the proposal's, and none has been settled by the practitioner.

## The question

Can learners work together against a scenario, using the same analytical tools they would use in Fieldwork, in a
session kept clearly apart from ordinary project work?

The proposal was written in a ChatGPT session and given by the practitioner on 2026-11-26 to be written up as an
experiment and reviewed later. Its recommendations are recorded as it made them.

The [learning-surface comparison](../research/desktop-and-browser-for-learning.md) argued against putting game
mechanics into the browser field tool. This asks something narrower: whether a separate, opt-in **Training Mission**
session can support collaboration and leave field work unchanged. [27](27-workflow-learning-and-gamification.md) and
the [gamification spike](93-gamification-spike.md) asked about scoring one practitioner's work. This is about a team
playing a fictional exercise.

## The proposal

**The team plays against the clock and against incomplete information, not against each other.** Three team turns,
one facilitator, one fictional event. It is a training exercise. It forecasts no real outbreak.

| Part | Holds | Does not hold |
| --- | --- | --- |
| A worked-example repository on GitHub | The pinned scenario, the starter workflow, the first synthetic data, the rules, and a few small licensed graphics | Live moves, rosters, the answer key, the seed, or evidence not yet released |
| Fieldwork, in the learner's browser | The map, tables, charts, receipts, and drafting a move | The official state, advancing the turn, or grading |
| Supabase | Who is signed in, team membership, released snapshots, moves and decisions | The epidemiological model |
| The agent-based model, run by the facilitator | A reproducible simulated course and its hidden state | Scoring, permissions, or what is released |

### A turn

1. The facilitator creates a session and shares a join link. A learner signs in, joins a team they are authorized
   for, and opens the pinned template. The link says which team they belong to. It gives no access to another team's
   data.
2. The dashboard opens at the saved turn. Every learner looks at the same released snapshot. They can build a map,
   check a denominator, or note a gap in reporting. Drafts can stay local. A move counts as submitted only once the
   server acknowledges it.
3. Players propose actions. The team agrees a decision and records three things with it: why, one receipt or
   artifact as evidence, and what would make them reconsider.
4. Only the facilitator can end a turn. One database transaction checks the facilitator's authority, checks the
   session's revision, refuses stale decisions, and commits the accepted moves, the score and the next snapshot
   together. Sending the same request twice must not advance the clock twice.
5. Clients refresh after a release. A client that missed the notice reads the authoritative snapshot when it
   reconnects. Debrief reopens the snapshot the team actually saw, not the latest map.

### The record

Decisions are append-only, and snapshots are versioned. The tables are sessions, memberships, moves, resolutions and
released evidence. Each decision records:
- its turn and snapshot;
- the action and the reason for it;
- a reference to its receipt, with the receipt's digest;
- the server's time.

A run's id helps find its receipt, but an id held only on one device cannot be replayed. The evidence is either a
small, cleaned export kept with the decision, or a durable reference with a digest. The template's revision and the
kernel build are recorded too. Material not yet released stays where only the facilitator can read it: outside what
players download, and outside every view, API and subscription a player can reach.

Supabase Auth says who someone is. Row-level security limits what they can read to the sessions they belong to.
Writes are limited to the right role, through a database function. No privileged key goes to the browser. Supabase's
live updates are only a signal to refresh. They are not the game's record.

**Without a live service**, the proposal falls back to one GitHub issue per turn, and one commit by the facilitator
through the existing [repository save](../../src/repository-save.ts). Comments are proposals, and the accepted reason
belongs in the commit. The [shared-project reader](../../src/shared-project.ts) does not read game-state files, so
this fallback starts with downloading a valid Fieldwork snapshot and importing it by hand.

### Pictures and dashboards

Two kinds of picture, kept apart:
- **Scene-setting:** a briefing card for Country X, a few consistent role portraits, and drawings for messages such as
  "new report available". Optional, light, and kept in the template.
- **Evidence:** drawn by Fieldwork from the released data, with keys, dates, denominators and sources. An illustrated
  map can introduce Country X. It never replaces the map learners decide from.

| View | Holds | Leaves out |
| --- | --- | --- |
| Team | The turn and simulated date, the actions available, incoming reports, the main map, a time series or a comparison of districts, and a drawer for the decision's reason and evidence | Hidden model state, a leaderboard of individuals, many score cards |
| Facilitator | The current revision, what has been submitted, who is ready, a preview of exactly what will be released, and End turn | A second copy of the analysis, or a preview a player can see by accident |
| Debrief | Each turn as evidence available, then decision and reason, then result, each linking back to its map, table or receipt | Hindsight shown as if players had it; claims of cases averted that nothing supports |

On a desktop, the map is the main panel, with a narrow panel for the turn and decision beside it. On a phone, the
order is briefing, then evidence, then decision, with a table in place of the map. Suspected, confirmed, not yet
reported and zero stay distinct by label and symbol as well as colour. Boundaries and keys stay the same across turns,
or the change is said. Accents mark scarce actions and new evidence, not every click. A 3D flyover of Country X could
come later as an optional introduction. Nothing in play depends on it.

## What a pilot would try

One fictional event, two to four learners, three releases of evidence:

1. An apparent hotspot, and a gap in reporting.
2. A choice between checking a denominator and spending a scarce action on outreach.
3. A response to defend, naming the evidence that would change it.

The model runs once. Actions can unlock reports or change the operational record. They do not change the modelled case
counts. Timeliness, reasoning and the quality of evidence are scored against published criteria. If 7-1-7 is used to
frame the exercise, simulated days are kept apart from minutes on the clock, and a simplified score is not presented
as a formal 7-1-7 measurement.

Two things would be evaluated separately.

**Does it hold together?**
- Two learners see the same revision.
- Someone joining late sees the latest snapshot they are allowed to see.
- Two End turn presses at once advance the turn exactly once.
- A second team cannot read the first team's evidence or moves.
- Nothing unreleased reaches a browser response or cache.
- The map and table work on a phone and after a reconnect.

**Does anyone learn?**
- Can learners tell missing reports from zero cases?
- Can they justify a denominator?
- Can they defend a decision with a receipt?
- Can the facilitator reconstruct what was knowable at each turn?
- Is it better than the same worked example discussed without turns?

A small pilot is evidence about usability and reasoning. It is not proof that learning improved.

The proposal's order: build join, inspect, submit, resolve and replay before any animation, leaderboard or richer
multiplayer. A way to step and resume the model, and decisions that change the simulated course, come only if the
pilot shows players' decisions need to.

## What is already in the repository, checked 2026-11-26

- **Pinned examples.** The [worked-example catalog](../../widgets/examples.json) pins each example by commit and
  content digest, so a session can record the template revision it admitted rather than follow a branch.
- **A reproducible model.** [199](199-an-agent-based-model-in-the-browser.md) and the
  [kernel's model](../../kernel/src/abm.rs) run a whole outbreak reproducibly in the browser. 199 reports agreement
  with Starsim for its test model. It does not report a fit to any historical outbreak.
- **Saving to a repository.** [repository-save.ts](../../src/repository-save.ts) exists. So does
  [shared-project.ts](../../src/shared-project.ts), which reads a shared project but not game-state files, as the
  proposal says.

## For review: where it meets what is already decided

Recorded so the review starts from them. None is settled here.

- **One of many kinds of teaching material.** The practitioner, 2026-11-26: Dive Deeper is teaching material, *"by no
  means the only teaching material in fieldwork"*. The others are the worked examples, their manual walkthroughs,
  Show me how, the manual, and the proposed [table operations as challenges](226-table-operations-as-challenges.md).
  A training mission would sit beside these. It is only loosely coupled to Dive Deeper, which is deferred until the
  widgets mature.
- **A new outside service.** Supabase would hold learners' identities and team data. That is a new outside service,
  with its own terms and its own place where people's data lives. The proposal's fallback, GitHub issues and commits,
  avoids it.
- **A laptop, not a cluster.** The model on the facilitator's side is the existing browser kernel, so a session runs
  on an ordinary laptop, as every simulation here does.
- **Scoring.** [27](27-workflow-learning-and-gamification.md) and [93](93-gamification-spike.md) concluded that
  points must follow evidence and milestones, not clicks, and must never be stored on the workflow. This proposal
  scores a team's decisions, kept in the session record, which is consistent with that. Whether to score at all is
  still open.

## Spike 1: a Supabase key, checked on the spot (2026-11-27)

The practitioner: *"For 233, can we do a spike on Supabase? How about a manual entry for it in the credentials dialog
so I can follow it and create my API key and test it on the spot with an API status check?"*

**What was built, for 0.204.0:**

| Part | Where |
| --- | --- |
| How to make a Supabase project and copy its publishable key, and the form for it | The manual's Credentials page, *Make a Supabase project and its publishable key* |
| **Check** beside each `supabase` key in the Credentials list: one request to the project's Auth health route (`/auth/v1/health`, the key on the `apikey` header), and what came back in words | `src/supabase-check.ts`, `src/credentials-ui.ts` |
| A secret key (`sb_secret_`, or the legacy `service_role`) is refused as it is added and never sent | the same; seven unit tests in `tests/supabase-check.test.mjs` |

**Read from Supabase's documentation, 2026-11-27:** a project has a publishable key, safe in a browser, and secret
keys for servers only, which Supabase answers with 401 from a browser. The legacy `anon` and `service_role` keys are
to be retired in early 2027. The free plan allows two active projects and pauses one after a week without use. The
docs name `/auth/v1/health` as the route to check a publishable key, but do not say what it returns, what a wrong key
gets, or whether a browser may call it from another site (CORS).

**What the spike is for:** those three unknowns, and whether the manual's steps match Supabase's screens. Steps 2 and
3 of the manual were written without a reader having followed them.

**Observation to make, written before it is known:** does the practitioner reach *the project is running and
accepted this key* by following the manual alone? Record each place a screen differed, what **Check** said, and what
it said for a deliberately wrong key.

**Validation record:** seven unit tests pass against a stubbed network (Node, no browser).

**Tried, 2026-11-27, against the practitioner's own project**, from Fieldwork on a local server (Chromium,
`http://127.0.0.1:4199`), the key unlocked from the practitioner's credentials file:

| Request to `/auth/v1/health` | Supabase answered |
| --- | --- |
| The publishable key, by **Check** | 200, `{"name":"GoTrue","version":"v2.199.0",…}`; Check said *the project is running and accepted this key (GoTrue v2.199.0)* |
| A made-up publishable key, sent by hand | 401, *Invalid API key* |
| No key | 401, *No API key found in request* |

The three unknowns the documentation left are answered: what the route returns, what a wrong key gets, and that a
browser page may call it from another site (CORS), from `127.0.0.1` at least. Not yet tried from the published site,
nor on a paused project. **The manual, as followed by the practitioner:** steps 1 to 3 matched Supabase's screens. Step 4 did not: *"The
Connect button did not have the API variables I need. They were under the Settings panel specifically 'General' and
'API Keys'."* The Project ID is under **Settings**, **General**, and the address is built from it; the publishable key
is under **Settings**, **API Keys**. The manual was corrected the same day.

## Precedents and patterns, researched 2026-11-27

The practitioner: *"research whether this game has precedents in epidemiology or any related field and whether there
are patterns in collaborative games that we can learn from."* Read from web pages and open abstracts; no file was
downloaded and no PDF opened. Open copies are linked; a source marked **closed** was read as an abstract only and
nothing below rests on its detail.

**In short:** nothing found combines all of this proposal: turns, a hidden agent-based model, synthetic snapshots
analysed in real tools, and a team move with its evidence. The nearest pair staged or live data with team analysis.
Across the field the evidence of learning is weak and mostly self-reported. Two failures are documented: learners game
whatever is scored, and an exercise's lessons are often never acted on.

### The nearest precedents

| Precedent | What it is | Cooperative | Evidence of learning |
| --- | --- | --- | --- |
| [CDC's Case Studies in Applied Epidemiology](https://archive.cdc.gov/www_cdc_gov/eis/request-services/casestudies.html) (EIS, since 1951) | A real investigation in parts: learners work one question before the next part is released; the instructor's guide is held back | Group work, unscored | None found |
| [Real-time outbreak simulation, MMED at AIMS](https://europepmc.org/article/PMC/PMC3317897) (Bellan, Pulliam et al., 2012) | Participants act out a stochastic outbreak; the data are reported as it runs, then analysed | Group | The authors observed gains; no measure reported |
| [EpiGames, Murdoch University](https://www.murdoch.edu.au/schools/medical-molecular-and-forensic-sciences/about/news/innovative-outbreak-simulation-brings-real-world-epidemiology-to-life-for-midsc-students) (2026) | 126 people spread a virtual pathogen by phone; response teams analyse the live, incomplete data, false positives included, and write situation reports against the clock | Teams | None; a news report |
| ["Pangea 2030" matrix game](https://europepmc.org/article/PMC/PMC7063729) (Smith et al., 2020) | Six teams, four rounds; the gamemaster rewrites news injects between rounds from the players' moves; each move is an argument others can challenge | Shared goal, mixed interests | 14 of 18 replied; most found it useful, nearly a third did not feel they knew more; 7 of 24 actions used the gender lens that was its aim |
| [Pandemic board game, interprofessional](https://jdc.jefferson.edu/jcipe/vol7/iss2/4) (McCave, 2017) | Teams of four professions, each role needed to win | Fully | Pre and post teamwork scales; results not on the page read |
| ["Disease detective cards"](https://europepmc.org/article/PMC/PMC6924897) (Burckhardt and Kissling, 2020) | Learners play outbreak participants; the facilitator gathers their card data as the investigation unfolds | Group | Not evaluated |
| [WHO simulation exercises](https://www.who.int/emergencies/operations/simulation-exercises), [ECDC's handbook](https://ecdc.europa.eu/en/publications-data/handbook-simulation-exercises-eu-public-health-settings) | Tabletop to full-scale exercises run on a list of injects, with an after-action review | Responders together | Of 117 WHO-supported exercises, 56 had a report available ([Copper et al., 2020](https://europepmc.org/article/PMC/PMC7705853)) |
| [Operation Outbreak](https://europepmc.org/article/PMC/PMC7467071), [Solve the Outbreak](https://doi.org/10.1007/s44217-024-00137-3), [Outbreak at Watersedge](https://mclph.umn.edu/watersedge/teachers_guide.html) | A phone-to-phone outbreak in schools; CDC's solo multiple-choice app; a solo e-learning investigation | Community; solo; solo | Solve the Outbreak: 16 students enjoyed it, and found ways to cheat its answers (Seitz et al., 2024) |
| Dark Winter, Clade X, Event 201 ([Johns Hopkins](https://www.centerforhealthsecurity.org/our-work/exercises)); Crimson Contagion; Exercise Cygnus | Senior leaders, one team against a scenario, facilitated | One team | No learning evaluation found |

Reviews: a scoping review of 86 studies (Skryabina et al., 2017; open CC-BY copy, PDF not opened) found exercises
improve knowledge, confidence and understanding of roles, and few studies looked at transfer to real response.
[Mahdi et al., 2023](https://europepmc.org/article/PMC/PMC10206538), 29 disaster-exercise studies, calls for more
rigorous evaluation. Krishnamoorthy et al., 2025, 12 studies of gamified outbreak training, **closed**.

### Patterns to learn from

| Pattern | The problem it meets | What it would mean here |
| --- | --- | --- |
| **Staged release** (the CDC case studies' parts; WHO and ECDC's injects) | Deciding under uncertainty, not with hindsight | One snapshot a turn is the established form. Whether a snapshot answers the team's last move, as Pangea's did, is a choice to make on purpose |
| **A facilitator who adjudicates** (free Kriegsspiel, 1876; matrix games) | Rules cannot foresee every move | The facilitator fits; give them a written basis for judging, so judgement does not drift with rank or mood |
| **A move is an argument**: action, expected result, reasons, open to challenge (matrix games; Pangea) | Rewards reasoning over a lucky right answer | "Decisions plus their evidence" already has this shape: assess the reasoning and the evidence cited, not agreement with the answer |
| **Against one player steering the team**: partial information per player ([Hanabi](https://arxiv.org/abs/1902.00506)), roles all needed (Pandemic), actions without team consent | Quieter members stop learning | Role-specific views of a snapshot (one holds laboratory results, another field reports), each role signing its part of the move. No peer-reviewed test of which counter works was found |
| **Cooperative design lessons** (Zagal, Rick and Hsi, 2006; journal **closed**, author's copy a PDF not opened, read through a summary) | One player decides everything; outcomes cannot be traced to decisions; no change on replay | A hidden model gives little feedback: let the team see at the debrief which decision changed what |
| **The debrief is where learning happens** | Play alone does not teach | Well-run debriefs improved performance by about a fifth in a meta-analysis (Tannenbaum and Cerasoli, 2013, **closed**); [debrief quality did not predict team learning](https://europepmc.org/article/PMC/PMC8936698) in another study. After turn 3, show the hidden run against the team's moves |
| **No single score** | A score is gamed, and leaderboards demotivate all but the strongest | If anything is scored, it is the quality of each move's evidence and reasoning |
| **Low fidelity is enough** ([Ratwatte, Skryabina et al., 2025](https://jphe.amegroups.org/article/view/10289/html)) | Full-scale exercises are costly | Three turns and one facilitator is a defensible scale |

### Against, and failures

- **The evidence is weak.** Most evaluations are self-reported satisfaction or confidence with no comparison group, and
  transfer to real response is mostly unmeasured. This literature cannot support a claim that the mission teaches.
- **The aim can be lost to the win.** Pangea's players set aside the lens the game existed for and turned competitive
  when interests were unclear. A team may chase the visible win and skip the analysis the mission is meant to train.
- **A scored game is gamed** (Solve the Outbreak).
- **The model teaches its assumptions.** Experts said Plague Inc. oversells border closures
  ([JMIR Serious Games survey, 2021](https://games.jmir.org/2021/2/e26216)). A hidden agent-based model with unrealistic
  parameters teaches those parameters.
- **Lessons not acted on.** Crimson Contagion (2019) and Cygnus (2016) found gaps that recurred in COVID-19 (their
  reports are PDFs, not opened); [Reddin et al., 2021](https://europepmc.org/article/PMC/PMC8020603) conclude a
  simulation helps only if its lessons are acted on quickly.
- **An exercise is not a forecast** ([RAND, 2020](https://www.rand.org/pubs/commentary/2020/05/how-can-wargaming-improve-government-response-to-catastrophic.html)).
  The proposal already says it forecasts no real outbreak.

### Not found, and not opened

Not found: a controlled evaluation of any cooperative outbreak game; a tested counter to one player steering; an
evaluation of tabletop exercises within field epidemiology training; outcome data for EpiGames, Operation Outbreak or
Outbreak at Watersedge. PDFs not opened include WHO's simulation exercise manual, ECDC's handbooks, the Zagal
author's copy and the Skryabina review. Nothing here shows that a cooperative turn-based mission teaches analysis
better than a staged case study: that comparison has not been made in anything found.

## Spike 2: the game's data model, drafted (2026-11-28)

Agreed by the practitioner on 2026-11-27 as the third item of the next batch: *"the cooperative game's data model
drafted in 233 as a second spike: schema, each role's read rules as testable checks, the turn-ending function, every
move timestamped and attributed, provenance; nothing created in Supabase until the practitioner agrees it"*.

**Nothing was created in Supabase or anywhere else.** No database was run. The SQL is a draft for review.

| Part | Where |
| --- | --- |
| The tables, who may read each, and the functions that write, for Postgres as Supabase hosts it | [233/game-model.sql](233/game-model.sql) |
| The same rules and functions in TypeScript, so tests can exercise them | [src/game-model.ts](../../src/game-model.ts) (nothing in the app uses it) |
| The tests | [tests/game-model.test.mjs](../../tests/game-model.test.mjs) |

### The record

The words are the proposal's: a **mission** is one session of the exercise, a **membership** is one person in one
role, a **move** is a proposal or a decision, a **resolution** is what a turn's end accepted. None of these is in the
[glossary](../glossary.md) yet.

| Table | Holds | Changes after it is written? |
| --- | --- | --- |
| mission | Title, number of turns, the current turn, the pinned template (repository and commit) and the kernel's digest | Status and current turn, through the functions only |
| mission_secret | The model's seed and parameters, and the answer key | No |
| team, role | The teams, and the roles: the facilitator, and the players' parts (field officer, laboratory lead, …) | No |
| membership | One person in one role in one mission; a player's has a team, the facilitator's has none | No |
| evidence | Each item of synthetic evidence, with its digest, the turn it is for, and optionally one team or one role | No |
| release | When each item was released | Never (append-only) |
| turn, turn_end | When each turn opened and ended, who ended it, and the request that ended it | Never (append-only) |
| move | The team, role, person, turn and time, the action, and for a decision its reason, its evidence with a digest, and what would make the team reconsider | Never (append-only) |
| resolution | Each team's accepted decision for a turn, or none | Never (append-only) |

The person, role, team and time of a move come from the server, never from what the browser sends. A decision missing
its reason, its evidence, its digest or what would change it is refused by the database (a hard stop). A proposal needs
only an action.

### Who reads what

Enforced by row-level security in the SQL, and by the same rules in the TypeScript model.

| | Facilitator | A player, own team | A player, another team's | Someone with no membership, or another mission's facilitator |
| --- | --- | --- | --- | --- |
| The mission, its roles, its turns | Yes | Yes | Yes, the same rows | No |
| Teams, memberships | All | Own team's | No | No |
| Moves and resolutions | All | Own team's | No | No |
| Evidence and its release | All, unreleased included | Released, for their team (or all teams) and their role (or all roles) | No | No |
| The secret | Yes | At the debrief only | At the debrief only | No |

A player never reads the facilitator's membership. Before the mission starts, players read no evidence.

### Ending a turn

| Question | What the draft does |
| --- | --- |
| Who may end a turn | Only a facilitator of that mission. Everyone else is refused |
| What it does, in one transaction | Records the end; for each team, takes its last decision made before the end, or records none; opens the next turn and releases its evidence; after the last turn, moves the mission to its debrief |
| A move made after the end | Kept, marked late, never counted. A move and a turn's end cannot interleave: the end locks the mission, and a move waits for the lock and then reads its time |
| The same request twice | Answers the same and changes nothing. Each press of End turn has its own request id, resent until acknowledged |
| Two presses at once | The second is refused as stale. The turn advances once |

### Provenance

A mission's record is written in PROV-O with the terms a run's receipts already use. No term is coined.

| In the mission | In PROV-O | Already used by |
| --- | --- | --- |
| The mission | `prov:Activity`, `prov:used` the template (a `prov:Plan` at its commit) and the kernel (with `<urn:fieldwork:sha256>`) | Run plans; digests on study areas |
| A turn, and its end | `prov:Activity` with `prov:startedAtTime`, `prov:endedAtTime` | Each run step's receipt |
| A move | `prov:Activity`, `prov:wasAssociatedWith` the person, `prov:qualifiedAssociation` with `prov:hadRole` the role; `prov:used` the turn's snapshot and the evidence cited | — (`prov:Role` is used for reference roles) |
| A decision | `prov:Entity`, `prov:wasAttributedTo` the person, `prov:generatedAtTime` | A drawn study area's author |
| A person | `prov:Agent`, their GitHub account where known, `fw:githubLogin`, `fw:identityBasis` | `fw:Author` |
| A snapshot | `prov:Collection`, `prov:hadMember` each released item; the turn's end `prov:generated` it, and `prov:used` the accepted decisions | — |
| Evidence cited | A Fieldwork run's receipt (`urn:fieldwork:run:…`) or an https address, with its digest | Run receipts |

The record is built from what the reader may read, so a player's copy holds only their team's moves and the evidence
they saw. The secret, account ids and the evidence files' locations are never written.

**Found:** `fw:githubLogin` and `fw:identityBasis` are declared for `fw:Author`, "a person who authored part of an
investigation". A reasoner reading a mission's record will conclude every player is an author. Not changed here.

### Choices this draft made, for the practitioner

1. **A move after the turn ends** is kept and marked late, so the debrief can show it. The proposal says stale
   decisions are refused. Keep, or refuse?
2. **Evidence by role.** The draft lets an item go to one role only (the laboratory lead's results), the pattern
   against one player steering. Use it in the pilot, or give every role everything?
3. **The secret at the debrief.** Players read the seed, parameters and answer key once the last turn ends. Is that
   what the debrief should show?
4. **Other teams at the debrief.** Players never read another team's moves, even then. Should the debrief compare
   teams?
5. **Who records a decision.** Any player in the team may. Should each role sign its part?
6. **A decision without all its parts** is refused. Should it be kept and flagged instead?
7. **Joining.** Here the facilitator adds each membership, which needs the person's account id. A join link is not
   drafted.
8. **Signing in with GitHub through Supabase** would make a player's identity `attested`, as `fw:identityBasis`
   defines it. Is that the sign-in to use?
9. **The `game` schema.** Supabase serves only its `public` schema until another is added in its settings. Keep a
   schema of its own?
10. **Scoring** is not drafted, as whether to score is still open.

### Observation to make, written before it is known

Reading the "Who reads what" table and the SQL, can the practitioner say, without help, what a laboratory lead in
Team A sees at the start of turn 2? Record what they said and where it differed.

### Validation record

Node 22.23.3, no browser, no database, 2026-11-28:

- **27 unit tests pass** in `tests/game-model.test.mjs`. Nine are read rules, by role, with the negative cases: what
  the facilitator, each player, another mission's facilitator and an outsider cannot read. Four are moves. Eight are
  starting and ending turns. Three are provenance, parsed as Turtle. Three read the SQL file and check it has the same
  tables, one read policy each with row-level security on, the append-only triggers, no update or delete grants, and
  the writing functions locking before they read the time.
- The full unit suite: 2,124 tests, 2,120 pass, 0 fail, 4 skipped.
- **Deliberate defects**, each put into the model and then removed: ignoring an item's role failed 2 tests; letting a
  player read another team's moves and resolutions failed 3; dropping the request-id check failed 2. Counting a late
  move failed none. That check is a second guard: in a single-threaded model the end's resolution is written before
  any late move exists, so only a real concurrent database could show whether it is needed.

### What this spike does not establish

- **That the SQL runs.** It has not been run on Postgres or Supabase. The tests read it as text; they do not execute
  it. Syntax errors, a policy that recurses, or a lock that behaves differently from the comment are all possible.
- **That the TypeScript and the SQL agree** beyond what the three text checks cover. They were written side by side.
- **Concurrency.** The model is single-threaded. Two moves and an end arriving at once is argued from the locks, not
  tested.
- **That nothing unreleased reaches a browser.** Row-level security covers the tables. The evidence files themselves,
  Supabase's storage and its live updates are not drafted.
- That the roles, the read rules or the turn's steps suit a real exercise. No facilitator or learner has seen them.

## What this does not establish

That learners want this, that a facilitator can run it, that Supabase is the right service, or that turns teach better
than a discussed worked example. *Corrected 2026-11-28:* this read "Nothing has been built or tried", which stopped
being true with the first spike. What is built is the key check and a draft data model; no game has been played.
