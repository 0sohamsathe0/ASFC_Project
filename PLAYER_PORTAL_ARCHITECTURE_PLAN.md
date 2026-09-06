# ASFC Player Portal Architecture Plan

> Planning and architecture report only. No application implementation is included in this document.

## 1. Current player experience

Today, the player journey is:

1. The player signs in through `/player/login` with Aadhaar number and date of birth.
2. The backend returns `{ role: "player" }` and sets the JWT cookie.
3. `Login.jsx` saves that minimal object in `AuthContext`.
4. The player is sent directly to `/player/profile`.
5. `PlayerProfile.jsx` refetches `/player/profile`, then fetches individual and team results.
6. The selected desktop or mobile profile renders identity and membership details, registration status, Aadhaar preview, attendance, hardcoded tournament statistics, hardcoded upcoming tournaments, results and certificate actions, profile correction, and logout.

Registration also authenticates the new player and redirects directly to `/player/profile`.

Important current behavior:

- There is no player dashboard.
- There is no player portal layout, sidebar, drawer, or player-specific navigation.
- The public site navbar remains visible on protected player pages.
- Its authenticated player action says “My Profile” and links to `/player/profile`.
- Desktop/mobile profile selection is JavaScript-driven at `1024px`, with substantially different component trees.
- The public navbar does not switch to desktop navigation until `1200px`, so the player sees a hamburger navbar between 1024px and 1199px while receiving the desktop profile.
- On session restoration, `AuthContext` first checks admin authentication and then player authentication.

The profile currently displays “12 tournaments played” and two supposedly upcoming tournaments with April and May 2026 dates. As of September 2026, those dates are past, demonstrating why dashboard/profile information must come from live data.

## 2. Current route map

### Player-facing frontend routes

| Route | Component | Protection | Current purpose |
|---|---|---:|---|
| `/player/login` | `Login` | Public | Player authentication |
| `/player/register` | `Register` | Public | Registration |
| `/player/profile` | `PlayerProfile` | `PlayerRoute` | Entire player experience |
| `/player/edit/:playerId` | `EditPlayerProfile` | Not wrapped by `PlayerRoute` | Rejected-profile correction |
| `/explore-tournament` | `ExploreTournament` | Public | Public tournament archive |
| `/club-medal-record` | `ClubMedalRecord` | Public | Public club achievements |

There is no `/player` index route and no player routes for dashboard, attendance, tournaments, achievements, certificates, or learning.

### Relevant backend routes

Player:

- `POST /player/login`
- `POST /player/logout`
- `POST /player/add`
- `GET /player/profile`
- `PUT /player/:pid`
- `GET /player/attendance?month=YYYY-MM`
- `GET /player/attendance?startDate=...&endDate=...`

Tournament:

- `GET /tournament/all` — public and supports the controller's `type` query
- `GET /tournament` — admin-only
- Admin-only tournament creation, editing, and entry endpoints

Results:

- `GET /result/player/individual/:playerId`
- `GET /result/player/team/:playerId`
- These are currently public and accept an arbitrary player ID.
- Certificates have no independent endpoint.

## 3. Current Player Profile responsibilities

### Shared/container responsibilities

`PlayerProfile.jsx` currently manages:

- player fetching
- individual result fetching
- team result fetching
- certificate modal state
- Aadhaar modal state
- logout
- rejected-player edit navigation
- desktop/mobile component selection
- hardcoded tournament information

### Desktop profile

The desktop version contains:

- profile title and player name
- FAI ID
- registration status and rejection reason
- player photograph and weapon/event
- hardcoded tournament count and upcoming tournaments
- personal details and MFA ID
- Aadhaar document preview
- full monthly attendance UI
- individual and team results
- certificate preview modal
- profile correction CTA
- logout

### Mobile profile

The mobile version contains:

- large player identity header
- photograph, name, FAI ID, weapon, and status
- hardcoded tournament count
- derived certificate count
- personal information
- full attendance UI
- hardcoded tournaments
- Aadhaar verification section
- expandable individual/team results
- direct certificate downloads
- rejected-profile edit CTA
- logout

There are already desktop/mobile inconsistencies:

- Desktop displays the rejection reason; mobile does not.
- Desktop uses a certificate preview modal; mobile directly downloads.
- Address presentation differs.
- `MobileResults` receives certificate-selection props but does not use them.
- The mobile header is visually large, which conflicts with the desired compact dashboard direction.

## 4. Reusable existing features

### Attendance: highly reusable

Existing backend capabilities:

- standalone `Attendance` model
- Morning/Evening sessions
- Present/Absent states
- unique index on player, date, and session
- player query derived strictly from `req.user.id`
- month and arbitrary range querying
- server-calculated total, present, absent, and attendance percentage
- date validation and unit tests

Existing frontend capabilities:

- month navigation
- summary statistics
- monthly calendar
- per-day Morning/Evening details
- loading, retry, and empty behavior
- mobile tap interaction and desktop hover interaction

Reuse recommendation:

- Move the existing full `PlayerAttendance` feature to `/player/attendance`.
- Extract its fetching into a shared hook.
- Let the dashboard consume the same server statistics through that hook.
- Do not recalculate attendance percentages in dashboard code.

### Tournaments: partially reusable

Already available:

- title
- start/end date
- city/state
- level
- age category
- date-derived upcoming/ongoing/completed states
- public list endpoint with optional `type`
- responsive public and admin tournament presentations

Safe dashboard fields now are title, date range, level, city/state, and age category.

Not safely available now:

- whether the current player is entered
- entry status
- registration deadline
- venue name beyond city/state
- travel details
- weapon/category-specific eligibility
- player-specific relevance

The admin tournament cards should not be reused visually because they contain management actions and a dark operations-oriented design. Formatting helpers and field mappings can be reused.

### Results: data reusable after access-control correction

The individual and team result endpoints already return a useful normalized shape containing player summary, tournament data, result place, category, and certificate type.

The frontend result cards and certificate generation can be moved to a dedicated achievements experience. The endpoints should not be reused unchanged because they accept arbitrary player IDs without authentication.

### Certificates: renderer reusable

Certificates are not stored records. They are generated client-side from result data using `ClassicCertificate` and the exporter.

Consequences:

- There is no independent certificate lifecycle or “certificate became available” timestamp.
- A separate top-level certificate page would display essentially the same records as Results.
- Merit certificate rendering is implemented.
- `ParticipationCertificates.jsx` is currently only a placeholder, although team result data is fed through the general certificate exporter elsewhere.

Recommendation: initially treat certificates as actions within Achievements rather than a separate primary navigation module.

## 5. Problems with the current structure

1. `PlayerProfile` is both a data orchestrator and an entire portal.
2. Identity, training, competition, and achievement concerns are coupled.
3. Every new feature increases profile length.
4. Hardcoded tournament information creates inaccurate player-facing data.
5. Desktop and mobile have separate implementations, increasing divergence.
6. There is no stable shell for navigation, titles, logout, or future modules.
7. The public navbar is not an appropriate authenticated portal navigator.
8. Profile loading is all-or-nothing at the page level.
9. Results are fetched even when the player may only want identity information.
10. Certificates and results represent the same records but are presented as loosely separate concepts.
11. Profile loading duplicates data already requested during auth restoration.
12. A failure in either result request prevents both result state updates because the requests use `Promise.all`.
13. Existing access-control gaps become more dangerous when the portal gains more routes.
14. The profile's oversized mobile header and stacked sections produce excessive vertical height.
15. Future fees, notifications, learning, and equipment cannot be inserted cleanly without a portal-level information architecture.

## 6. Proposed player information architecture

Use flat semantic routes inside a protected player shell. Visual group headings do not require nested URLs.

```text
PLAYER PORTAL
├── Dashboard                         /player/dashboard
│
├── TRAIN
│   └── Attendance                    /player/attendance
│
├── COMPETE
│   ├── Tournaments                   /player/tournaments
│   └── Achievements                  /player/achievements
│       ├── Individual results
│       ├── Team results
│       └── Certificate actions
│
├── DEVELOP
│   └── Learn to Fence                /player/learn
│
└── ACCOUNT
    └── My Profile                    /player/profile

Future, hidden until functional:
├── Fees                              /player/fees
└── Equipment Store                   /player/equipment
```

This is cleaner than creating separate top-level Results and Certificates today because certificates are derived from result records.

If product requirements eventually demand a certificate library, `/player/certificates` can become either a filtered view backed by the same achievements data source or an independent feature after certificate issuance metadata exists.

Navigation groups should be presentational only. Avoid deep route nesting such as `/player/dashboard/tournaments`.

## 7. Proposed player dashboard

The dashboard should answer: “What should I know or do now?”

### Compact greeting

Use a short white/light-neutral header rather than a hero:

- “Good evening, Soham”
- “Ready for your next bout?”

The model only stores `fullName`. Using its first token as a first name is convenient but not always linguistically correct. Full name is safest unless a preferred/display name is introduced.

The greeting block should be approximately 96–128px tall on desktop, not a full-width promotional banner.

### Registration-status notice

Show only when actionable:

- Pending: registration is being reviewed.
- Rejected: show reason and “Correct profile”.
- Accepted: a compact badge in the portal topbar/profile is enough.

### Quick Actions

Recommended initial actions:

- Attendance
- Tournaments
- Achievements
- My Profile

Do not duplicate “Learn to Fence” as both a quick action and a large featured section unless usage data later justifies it. Certificates should be reached from Achievements initially.

### Next tournament

Show one primary next tournament and optionally a second compact row.

Use only title, dates, level, city/state, and age category if clearly labelled. A countdown should be postponed until tournament date/timezone handling is normalized. Do not show “You're entered” until a player-owned entry endpoint exists.

### Attendance preview

Show current-month server statistics:

- percentage
- recorded sessions
- present
- absent
- “View attendance”

Do not put the full calendar on the dashboard. Retain the rule that unmarked sessions are not counted as absences.

### Important updates

For Phase 1, do not create a fake notification feed.

Instead:

- show the registration-status notice when relevant
- show the next tournament from tournament data
- optionally show a single derived entry/result update later when secure APIs exist

Do not add “View all” until there is a genuine notification collection and destination.

### Learn to Fence preview

Show three compact featured resources:

- Watch competition
- Technique
- Rules & tactics

Each item should show resource type and external-link status. The full library belongs on `/player/learn`.

### Dashboard exclusions

Do not fetch or display fabricated tournament totals, decorative medals charts, certificate counts solely to fill space, fees without ledger data, or store products before the module exists.

Each remote widget should manage its own loading, error, empty, and retry states. A widget failure must not hide the greeting, navigation, Quick Actions, or unrelated widgets.

## 8. Desktop layout

Recommended structure at 1024px and above:

```text
┌──────────────┬────────────────────────────────────────────┐
│ Player nav   │ Topbar: page title / player / logout       │
│              ├────────────────────────────────────────────┤
│ Dashboard    │ Greeting + conditional status notice       │
│ Attendance   ├────────────────────────────────────────────┤
│ Tournaments  │ Quick Actions: 4 compact items             │
│ Achievements ├───────────────────────┬────────────────────┤
│ Learn        │ Attendance summary    │ Next tournament    │
│ Profile      ├───────────────────────┼────────────────────┤
│              │ Important updates*    │ Learn to Fence     │
└──────────────┴───────────────────────┴────────────────────┘
```

`*` Only once meaningful data exists.

At 1366/1440 widths:

- Sidebar: approximately 224–240px.
- Content: centered, maximum 1180–1240px.
- Greeting: compact.
- Quick Actions: one four-column row or two balanced columns.
- Information grid: approximately 7/5 or 1/1 depending actual content.
- Attendance and next tournament should begin within the first viewport.

The player shell may follow the admin shell's structural pattern—sidebar, topbar, mobile drawer, shared navigation configuration—but should use athlete-oriented copy and lighter visual treatment.

## 9. Mobile layout

Recommended mobile order:

1. compact portal topbar
2. greeting
3. conditional registration issue
4. Quick Actions
5. next tournament
6. attendance summary
7. Learn to Fence
8. important updates, once real
9. page bottom spacing

Differences from desktop:

- Quick Actions become a compact 2×2 grid.
- Descriptions are removed from quick-action tiles.
- Tournament metadata wraps into rows rather than columns.
- Attendance statistics use two columns.
- Full attendance details use cards/calendar designed for touch.
- External learning links occupy the full available width.
- No hover-dependent information.
- Long names use `break-words` and do not compete with fixed icons.
- The drawer, not a large public navigation overlay, becomes the full portal menu.

A bottom navigation bar is not recommended. It works for four or five permanent destinations but becomes awkward with learning, fees, equipment, and future notifications. A topbar plus accessible drawer scales better.

## 10. Player Profile restructure

### Keep in My Profile

- photograph
- full name
- weapon/event
- FAI ID and MFA ID
- date of birth and gender
- phone and email
- institute and full address
- registration status
- rejection reason and correction CTA
- identity-document status
- Aadhaar preview only if retained after security review
- profile edit actions

### Move out

| Current content | Destination |
|---|---|
| Attendance calendar and statistics | Attendance |
| Upcoming tournaments | Tournaments and dashboard preview |
| Tournament count | Achievements/Tournaments after deriving it from data |
| Individual results | Achievements |
| Team results | Achievements |
| Certificate actions | Achievements, initially |
| Logout | Portal shell/topbar/drawer |

The restructured profile should share one responsive component hierarchy rather than independent desktop/mobile pages wherever practical.

## 11. Attendance plan

### Dashboard

Call `GET /player/attendance?month=YYYY-MM` and render the returned `statistics` only. The server remains the source of truth for percentages and totals.

### Dedicated page

Move the current functionality to `/player/attendance`:

- current/previous month navigation
- Morning/Evening sessions
- Present/Absent
- totals and attendance percentage
- monthly calendar and day details
- explanatory note about unmarked sessions

### Reuse strategy

Extract a hook such as `usePlayerAttendance(month)` responsible for fetching, cancellation, authentication handling, loading/error/retry, and response normalization. Both dashboard and attendance page use it. The dashboard does not render the calendar.

At 320px, the existing calendar is close to the available width once nested card padding is included. The dedicated page should reduce cell width/gaps at the smallest breakpoint or reduce surrounding nested padding. Do not solve this with horizontal scrolling.

No backend change is required for the initial dashboard or monthly page.

## 12. Tournament plan

### Dashboard preview

Initially use `GET /tournament/all?type=upcoming`, then display only the earliest one or two items.

Safe fields are title, start/end dates, city/state, level, and age category. Do not claim entry status or eligibility.

### Dedicated page

Recommended initial sections:

- Upcoming
- Ongoing
- Completed

Once player entry data exists, evolve this into My Entries, Upcoming, Ongoing, and History. Do not directly reuse the admin CRUD UI; build read-only player cards.

### Required extension for player relevance

Add an ownership-bound endpoint later, for example `GET /player/tournaments`. It must derive `playerId` from `req.user.id` and return tournament metadata plus the authenticated player's entry status.

The current tournament model cannot safely determine weapon-specific relevance or registration eligibility. Age category rules should not be inferred from present-day age without confirming competition eligibility rules.

## 13. Learn to Fence plan

### Initial UX

Create `/player/learn` as a curated resource library.

Suggested categories:

- Watch Fencing
- Technique
- Weapon Skills
- Rules & Competition
- Tactics

Filters:

- All weapons
- Epee
- Foil
- Sabre

Resource types may include video, article, official rules, channel, and competition stream.

Dashboard shows only three featured resources. The dedicated page carries the complete library.

### Initial data approach

Start with a small reviewed frontend configuration or bundled JSON dataset. This is preferable to building CRUD before the club has established its editorial workflow.

Every item should contain a stable local ID, title, short description, category, weapon applicability, resource type, external URL, source name, featured flag, and sort order.

### Future model

```text
LearningResource
- title
- description
- category
- weapons[]
- resourceType
- url
- thumbnailURL
- sourceName
- featured
- published
- sortOrder
- createdBy
- createdAt
- updatedAt
```

Use controlled enums for category, weapon, and type. Do not store arbitrary HTML descriptions.

### External-link safety

- Accept only `https:` URLs.
- Validate URLs on both client and server.
- Consider an approved-host list for admin-managed content.
- Render external-link indicators.
- Use `target="_blank"` only with `rel="noopener noreferrer"`.
- Do not render arbitrary embeds or iframes initially.
- Do not proxy user-supplied URLs.
- Prefer club-controlled thumbnails or trusted provider thumbnails.
- Add a Content Security Policy before supporting embedded video.

## 14. Notification architecture

No announcement or notification model exists. Email messages sent during acceptance/rejection are transactional emails, not an in-app notification system.

### What can be supported now

- profile pending/rejected status
- upcoming tournament announcements derived from tournament data
- new result/certificate availability derived from results, but without a reliable availability timestamp for individual results
- player tournament-entry status after adding a player-owned entry endpoint

### What should remain temporary

A small “Important” area can show status-derived information. It should not pretend to be a chronological inbox and should not have “View all”.

### Eventual architecture

```text
Announcement
- title
- body
- type
- audience/filters
- publishAt
- expiresAt
- published
- priority
- createdBy
- timestamps

PlayerNotification / NotificationReceipt
- playerId
- announcementId or event reference
- type
- title
- body
- actionUrl
- readAt
- createdAt
```

Announcements support club-wide content. Player notification records/receipts support per-player events and read state. Avoid embedding financial details or sensitive player information in globally targeted announcements.

## 15. Future fees integration

There is no fee model, controller, route, or UI.

Recommendation:

- Omit Fees from the functional Phase 1 dashboard and primary navigation.
- Do not show sample due values, paid-through dates, or fake history.
- Do not consume dashboard space with a Coming Soon card.

The player navigation configuration should make adding `/player/fees` straightforward later. A Coming Soon menu item is reasonable only shortly before delivery, when the product owner wants to advertise it deliberately.

Future fees should use a player-owned ledger endpoint and server-calculated balance. Never calculate authoritative financial status from incomplete client-side records.

## 16. Future Equipment Store integration

No product, inventory, cart, order, or payment architecture exists.

Recommendation:

- Omit it from Phase 1 dashboard and navigation.
- Reserve no dedicated dashboard card.
- Add it later through the same navigation configuration and dashboard module registry.
- Initially it could be a club equipment catalogue or enquiry flow; do not assume ecommerce, checkout, inventory reservation, or payments until requirements exist.

## 17. API impact

### Reusable now

| Endpoint | Use |
|---|---|
| `GET /player/profile` | Authenticated player identity; response should later be minimized |
| `GET /player/attendance?month=YYYY-MM` | Dashboard summary and full monthly attendance |
| `GET /player/attendance?startDate&endDate` | Future range report |
| `GET /tournament/all?type=upcoming` | General upcoming tournament preview |
| `GET /tournament/all` | General player tournament listing |

### Functional but should be replaced for player use

| Endpoint | Problem | Recommendation |
|---|---|---|
| `GET /result/player/individual/:playerId` | Public arbitrary player ID | Add authenticated `/result/player/me` or `/player/results` |
| `GET /result/player/team/:playerId` | Public arbitrary player ID | Same |
| `PUT /player/:pid` | Player may update another player and workflow fields | Replace/augment with ownership-bound `PATCH /player/profile` |

### Small extensions

- Add an authenticated player tournament/entry endpoint.
- Optionally add `limit` to the public upcoming tournament query once volumes justify it.
- Normalize profile DTOs so raw model documents are not returned.

### Possible future dashboard endpoint

Do not add it in the first dashboard implementation.

Later, `GET /player/dashboard?month=YYYY-MM` could return:

```json
{
  "success": true,
  "data": {
    "player": {
      "fullName": "",
      "event": "",
      "photoURL": "",
      "requestStatus": ""
    },
    "attendanceSummary": {},
    "upcomingTournaments": [],
    "notifications": []
  }
}
```

Every player-specific query must use `req.user.id`, never a client-supplied player ID.

## 18. Database impact

### No new model required for initial dashboard

Existing models are enough for identity, attendance summary, general tournaments, results, and certificate generation.

### Recommended existing-model improvements

Tournament Entry:

- add a unique `{ playerId: 1, tournamentId: 1 }` index
- clarify `Selected` versus `Submitted`
- add further statuses only when the workflow is defined

Individual Result:

- add timestamps if “new result/certificate available” needs a reliable event date

Tournament potential future fields, only after requirements:

- venue name
- registration deadline
- published/visibility
- external information URL
- description
- competition categories/weapons

### New models later

- `LearningResource`
- `Announcement`
- `PlayerNotification` or `NotificationReceipt`
- fee ledger/payment models
- product/catalogue/order models only if Equipment becomes transactional

A Certificate model is unnecessary unless certificates need issuance dates, serial numbers, revocation, approval, or audit history independent of results.

## 19. Component plan

### Portal-level components

- `PlayerPortalLayout`: sidebar/topbar/drawer, logout, outlet, and player navigation
- `PlayerNavigation`: flat links with visual group labels
- `PlayerMobileDrawer`: accessible focus/escape/body-scroll behavior
- `playerNavigationConfig`: routes, labels, icons, and future feature flags

### Dashboard components

- `PlayerDashboard`: widget composition only
- `PlayerGreeting`: greeting and concise message
- `PlayerQuickActions`: four navigation actions
- `AttendanceSummaryCard`: server statistics and route CTA
- `UpcomingTournamentCard`: one tournament preview
- `LearningPreview`: featured resources
- `DashboardStatusNotice`: pending/rejected state
- `DashboardSectionHeader`: only if repeated by at least three sections
- `EmptyState`: only if a suitable shared component does not already exist

### Page components

- `PlayerProfilePage`
- `PlayerAttendancePage`
- `PlayerTournamentsPage`
- `PlayerAchievementsPage`
- `LearnToFencePage`

### Shared data utilities

- `usePlayerAttendance`
- `usePlayerResults`
- tournament date/location formatting helpers
- external-resource URL validation helpers

Avoid making every small row a component. Extract only repeated behavior, independent loading logic, or sufficiently complex presentation.

## 20. File impact map

No changes have been made. This is the proposed impact.

| File | Current purpose | Proposed change | Why |
|---|---|---|---|
| `Frontend/src/App.jsx` | All route declarations and global navbar/footer decisions | Add protected player layout and child routes; preserve old routes | Establish portal architecture |
| `Frontend/src/pages/Login.jsx` | Player login | Redirect to `/player/dashboard`; honor intended destination | Dashboard becomes landing page |
| `Frontend/src/components/RegistrationForm.jsx` | Player registration | Redirect to dashboard | Consistent post-auth journey |
| `Frontend/src/components/Navbar.jsx` | Public navigation | Player action targets dashboard; protected portal uses its own shell | Avoid profile-as-home and double navigation |
| `Frontend/src/context/AuthContext.jsx` | Session restoration | Expose normalized player data/refresh behavior | Avoid repeated profile fetching |
| `Frontend/src/pages/player/PlayerRoute.jsx` | Protects one child component | Convert to outlet-compatible guard and retain intended path | Protect all player routes uniformly |
| `Frontend/src/pages/PlayerProfile.jsx` | Entire portal/data orchestrator | Restrict to identity/profile concerns | Separate modules |
| `Frontend/src/pages/player/DesktopProfile.jsx` | Desktop all-in-one profile | Re-scope or retire after shared responsive profile exists | Remove duplicated architecture |
| `Frontend/src/pages/player/mobile/MobileProfile.jsx` | Mobile all-in-one profile | Re-scope or retire after shared responsive profile exists | Prevent desktop/mobile divergence |
| `Frontend/src/components/Attendance/PlayerAttendance.jsx` | Full attendance embedded in profile | Use in dedicated page; extract fetching hook | Keep full module out of dashboard |
| `Frontend/src/components/Attendance/PlayerAttendanceStats.jsx` | Attendance stat tiles | Reuse or add compact presentation mode | Dashboard summary |
| `Frontend/src/components/Attendance/PlayerAttendanceCalendar.jsx` | Monthly calendar | Keep on full attendance page and refine 320px density | Mobile correctness |
| `Frontend/src/components/Player/ResultsSection.jsx` | Desktop results inside profile | Move/rework into Achievements | Separate profile and achievements |
| `Frontend/src/pages/admin/AdminDashboard.jsx` | Admin shell | Architectural reference only | Do not clone management UI |
| `Frontend/src/components/Admin/adminNavigationConfig.js` | Admin nav definition | Reference its configuration pattern | Scalable player navigation |
| `Backend/routes/player-router.js` | Player auth/profile/attendance routes | Add self-owned results/tournaments/profile-update routes | Secure portal APIs |
| `Backend/controllers/player-controller.js` | Registration/login/profile/update | Return safe DTOs and enforce self-update | Ownership and privacy |
| `Backend/controllers/attendance-controller.js` | Attendance management and player summary | Reuse unchanged initially | Already provides correct summary |
| `Backend/controllers/tournament-controller.js` | Tournament CRUD and entries | Add player-owned entry projection later | Entry-aware player experience |
| `Backend/routes/result-router.js` | Result routes | Add authenticated self endpoints | Prevent arbitrary player lookup |
| Planned new player portal files | Do not exist | Shell, dashboard, pages, navigation, hooks | Clean separation rather than extending profile files |

## 21. Routing and login redirect plan

Recommended route structure:

```text
/player/login
/player/register

/player
  index -> /player/dashboard
  /player/dashboard
  /player/profile
  /player/profile/edit
  /player/attendance
  /player/tournaments
  /player/achievements
  /player/learn
```

Compatibility:

- Keep `/player/profile` as a real page, so existing bookmarks remain valid.
- Add `/player` → `/player/dashboard`.
- Change login and registration redirects to `/player/dashboard`.
- Keep `/player/edit/:playerId` temporarily as a compatibility redirect, but validate ownership and route it to `/player/profile/edit`.
- Store the requested protected path in route state so a logged-out player opening `/player/attendance` returns there after login.
- An authenticated player visiting `/player/login` should be redirected to `/player/dashboard`.
- Keep login and registration outside the protected portal layout.
- Render the public navbar for login/register if desired, but not inside authenticated player pages.

## 22. Responsiveness plan

| Width | Plan |
|---:|---|
| 320px | Single content column; 12px outer padding; 2×2 compact quick actions; 44px targets; attendance calendar uses smaller cells/gaps; no nested oversized padding |
| 360px | Same hierarchy; tournament title and metadata wrap independently; two-column attendance stats |
| 375px | Standard compact mobile spacing; drawer width capped below viewport |
| 390px | Slightly more horizontal card padding without changing information order |
| 414px | Maintain two-column actions/stats; do not enlarge cards simply because space exists |
| 768px | Mobile/tablet drawer remains; quick actions may use four columns; dashboard information may become two columns where content remains readable |
| 1024px | Persistent player sidebar begins; content grid uses two columns; sidebar should be narrower than the current 256px admin sidebar if needed |
| 1440px | Maximum content width around 1200px; no stretched cards; first viewport includes greeting, actions, and start of attendance/tournament content |

Cross-width checks:

- no horizontal scrolling
- minimum touch targets of 44×44px
- drawer focus handling and Escape support
- long player/tournament names wrap
- compact empty states
- tap-accessible calendar detail
- clear external-link indicators
- no fixed-height dashboard card unless truncation is explicit
- respect reduced-motion preferences

## 23. Performance plan

### Current cost

On a refreshed protected profile, the application can make:

1. admin verification
2. player profile restoration
3. player profile refetch
4. individual results
5. team results
6. attendance

This is more work than necessary, especially when the profile is used only as identity information.

### Initial dashboard strategy

Use independent existing endpoints for player profile, current-month attendance, and upcoming tournaments. That is a reasonable two-to-three-call dashboard at current scale.

Recommendations:

- Do not request results solely to display decorative counts.
- Do not request certificates separately; they are derived from results.
- Fetch achievements only on the Achievements route.
- Fetch full tournament history only on the Tournaments route.
- Use independent widget loading/error state.
- Use cancellation or `AbortController` during route changes.
- Avoid duplicate profile calls by making the portal/auth context authoritative.
- Slice dashboard tournaments client-side initially; add a server limit only when data volume justifies it.

Add `/player/dashboard` aggregation only after notifications, entry status, or fees make orchestration materially more complex.

## 24. Access-control and security review

### Correct existing pattern

Player attendance is properly ownership-bound through JWT verification, player role authorization, and a query built from `req.user.id`.

### High-priority issues to address before expanding the portal

1. Player result endpoints are public and accept arbitrary player IDs.
2. `PUT /player/:pid` allows a player token to submit another player's ID.
3. The update controller allows workflow fields such as `requestStatus`, `rejectionReason`, and `isEditable` to be supplied.
4. `/player/edit/:playerId` is not wrapped in the frontend player guard.
5. `/player/profile` returns the whole player document, including raw Aadhaar-related fields.
6. Aadhaar assets appear to be represented by direct Cloudinary URLs; access policy should be reviewed.

Recommended changes during implementation:

- Introduce self-owned result endpoints based on `req.user.id`.
- Replace player ID profile updates with `PATCH /player/profile`.
- Use explicit allowlists for player-editable fields.
- Keep approval fields admin-only.
- Return purpose-specific profile DTOs.
- Mask or omit the raw Aadhaar number after authentication.
- Decide whether players require ongoing Aadhaar image access.
- Do not include sensitive fields in dashboard DTOs.
- Add backend integration tests for ownership and role enforcement.
- Treat frontend route guards as UX only; backend enforcement remains mandatory.

## 25. Implementation phases

### Phase 0 — API and security stabilization

- define safe player DTOs
- secure self-owned results
- enforce player profile update ownership
- protect/replace the edit route
- add access-control tests
- confirm accepted/pending/rejected portal behavior

### Phase 1 — Portal foundation

- protected `PlayerPortalLayout`
- player navigation config
- desktop sidebar
- mobile drawer/topbar
- `/player/dashboard`
- compact greeting
- status notice
- four Quick Actions
- existing attendance summary
- live upcoming tournament preview
- login/registration redirects
- preserve `/player/profile`

### Phase 2 — Profile and attendance separation

- slim My Profile
- move full attendance to `/player/attendance`
- extract shared attendance hook
- remove attendance from profile
- refine smallest-width calendar behavior
- remove hardcoded tournament data

### Phase 3 — Player tournaments

- dedicated tournament page
- upcoming/ongoing/completed states
- player-owned tournament-entry endpoint
- “My Entries” presentation
- reliable tournament detail navigation

### Phase 4 — Achievements and certificates

- move individual/team results out of profile
- unify responsive result UI
- certificate actions inside achievements
- finish team/participation certificate behavior
- decide whether a separate certificate route adds genuine value

### Phase 5 — Learn to Fence

- reviewed static resource library
- dedicated learning page
- dashboard featured resources
- external-link validation
- admin-managed model only after editorial requirements are proven

### Phase 6 — Notifications

- announcement model
- per-player receipt/read architecture
- notification page and dashboard preview
- derived event notifications

### Phase 7 — Fees

- fee ledger and player-owned APIs
- accurate dashboard status
- history/reminders

### Phase 8 — Equipment

- decide catalogue versus ecommerce
- add only the necessary domain models and flows

## 26. Risks and possible regressions

### Authentication and redirects

- Incorrect route nesting could accidentally protect login/register or leave player modules public.
- Login currently stores only `{ role: "player" }`; dashboard greeting cannot assume full player data immediately.
- Changing result endpoint security could break current profile calls unless frontend and backend change together.
- `AuthContext` currently attempts admin verification before player verification.

### Profile

- Removing embedded modules before their destination pages exist would lose functionality.
- Desktop/mobile profile behavior differs, so consolidation must preserve rejection, certificate, and Aadhaar flows.
- Address and optional field null handling must be hardened.
- Editing must preserve the rejected-player resubmission workflow while preventing players from editing approval fields.

### Attendance

- Dashboard and full page could drift if calculations are duplicated.
- Month strings and local dates must remain timezone-safe.
- The 320px calendar needs exact layout QA.
- “Not marked” must never be interpreted as absent.

### Tournaments

- Current hardcoded data must not survive into the dashboard.
- Date-only competition semantics can shift across timezone boundaries.
- End dates stored at midnight may cause same-day ongoing/completed classification errors.
- Age eligibility should not be inferred without an agreed sporting rule.
- Tournament entries lack a database-level unique player/tournament constraint.

### Results and certificates

- Current result APIs are not ownership-safe.
- A separate Certificates page may duplicate Achievements.
- Individual results lack timestamps for “new certificate” notifications.
- Team participation certificate implementation is incomplete/inconsistent.

### Navigation and mobile

- The public navbar must not coexist with the new player shell.
- Drawer body-scroll and focus restoration require testing.
- A fixed bottom navigation would become overcrowded as modules grow.
- JavaScript-only desktop/mobile branching can produce mismatches on resize and should be reduced.

### Loading/error states

- One rejected request must not blank the dashboard.
- Loading placeholders should preserve approximate card height without making the page feel oversized.
- Server-monitor redirects must return players to the original portal route.

## 27. Final recommended structure

```text
Protected PlayerPortalLayout
│
├── Dashboard
│   ├── compact greeting
│   ├── conditional registration notice
│   ├── four Quick Actions
│   ├── next tournament
│   ├── current-month attendance summary
│   └── three featured learning resources
│
├── Attendance
│   ├── month selector
│   ├── totals and percentage
│   ├── Morning/Evening calendar
│   └── monthly history
│
├── Tournaments
│   ├── My Entries          [after API extension]
│   ├── Upcoming
│   ├── Ongoing
│   └── History
│
├── Achievements
│   ├── Individual
│   ├── Team
│   └── Certificate actions
│
├── Learn to Fence
│   ├── Watch
│   ├── Technique
│   ├── Weapon Skills
│   ├── Rules
│   └── Tactics
│
└── My Profile
    ├── identity
    ├── membership
    ├── registration status
    ├── contact/address
    └── correction/edit flow
```

Fees, Equipment, and Notifications should join this structure only when backed by real behavior or data.

## 28. Questions and decisions

Only these decisions materially affect implementation:

1. Should Results and Certificates launch as one recommended “Achievements” destination, or must they be separate primary navigation items from Phase 1?
2. Should Pending and Rejected players access the full portal in read-only form, or only Dashboard/Profile/Edit until accepted? Recommended: allow portal access but clearly disable eligibility-dependent actions.
3. Should the player tournament page show all club tournaments, or only entered/eligible tournaments once entry data exists? Recommended: “My Entries” plus the complete club calendar.
4. Should players continue to preview their Aadhaar image after registration? Recommended: remove the raw Aadhaar number from routine profile responses and review whether image access is truly required.
5. Should Learn to Fence launch with a small reviewed static library, or wait for admin-managed resources? Recommended: launch static first and add CRUD only after the content workflow is established.
