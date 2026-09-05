# ASFC Public Website UI Update Plan

Date: 5 September 2026  
Branch: `UI-Changes`  
Status: Approved baseline implemented on `UI-Changes`; see [PUBLIC_UI_IMPLEMENTATION_REPORT.md](PUBLIC_UI_IMPLEMENTATION_REPORT.md) for changes and verification.

## 1. Objective and review limits

Make the public website feel like one club website with a clear information and visual hierarchy. Sections can use different compositions, but must share typography, spacing, colors, buttons, image treatment, and navigation conventions.

The inventory and findings below record the original planning phase. They come from route and component source inspection, not the subsequent rendered browser audit. Responsive issues identified from classes are risks to verify, not confirmed screenshot defects. No application UI changes or runtime tests were made for this plan. The forthcoming design prompt will determine the final visual direction; the proposals below are a baseline, not a finalized design.

## 2. Scope and route inventory

| Public surface | Current source | Role in the visitor journey |
| --- | --- | --- |
| `/` | `Frontend/src/pages/Home.jsx`, `Hero.jsx`, `HomeStorySections.jsx`, `Achievements.jsx` in `components/homepage` | Introduce fencing and the club, build trust, lead to an enquiry or registration |
| `/about` | `Frontend/src/pages/About.jsx` | Explain the club, training approach, and competition opportunities |
| `/explore-tournament` | `Frontend/src/components/homepage/ExploreTournament.jsx` | Browse upcoming and completed competitions |
| `/club-medal-record` | `Frontend/src/components/homepage/ClubMedalRecord.jsx` | Explore club results and medal details |
| `/contact` | `Frontend/src/pages/Contact.jsx` | Find contact details, ask questions, send a message, locate the club |
| Shared navigation and footer | `Frontend/src/components/Navbar.jsx`, `PublicFooter.jsx` | Maintain orientation and consistent next actions |
| Public not-found and maintenance states | `Frontend/src/pages/NotFound.jsx`, `Maintenance.jsx` | Explain interruptions and provide recovery |

Interpretation of this phase: public information pages viewed by a guest. Player profiles, player editing, admin pages, attendance management, and backend changes are excluded. Login and registration are guest-accessible but belong to the account flow; preserve links to `/player/login` and `/player/register`, with their form redesign outside this phase unless the user expands the scope.

`App.jsx` currently shows Navbar on non-admin routes, including player routes, while PublicFooter excludes player routes, admin routes, and maintenance. Shared navigation edits therefore need a regression check on account pages even though those pages are not being redesigned.

## 3. Current homepage hierarchy

The rendered composition declared in `Home.jsx` is:

1. Hero: club identity, headline, Discover Our Club and See Our Results actions.
2. Progression strip: District through International.
3. Why fencing: introduction and three benefits.
4. Inside All Star: training and competition image grid.
5. Discipline beyond sport: athlete values and image.
6. Achievements: featured achievement and supporting cards.
7. Athlete pathway: four development stages.
8. More than training: community copy and another image grid.
9. Start your journey: registration, contact, and player-login actions.
10. Shared footer.

`HomeStorySections.jsx` owns most of this sequence and inserts Achievements through a prop. `AboutPreview.jsx`, `ClubExperience.jsx`, and `CTA.jsx` are older homepage components that are not used in this active composition; do not mistake them for visible sections or redesign them first.

## 4. Findings and priorities

| Priority | Source evidence | Impact and planned response |
| --- | --- | --- |
| High | Hero and HomeStorySections use large, mostly left-aligned headings, open layouts, square image frames, and flat light/dark surfaces. Achievements uses a centered badge, gradient heading, rounded cards, shadows, and glow. | The homepage itself changes visual language. Apply one heading, surface, and image system across the entire sequence. |
| High | About and Contact use extensive dark glass-like cards and glow effects; Tournaments adds a grid background and `#07152E`; the newer homepage alternates white, off-white, and several navy values. | Establish named background roles and deliberate section transitions across all routes. |
| High | Homepage H2s reach `lg:text-6xl`; Achievements uses `lg:text-5xl`; About H1 reaches `lg:text-5xl`, while Tournaments reaches `lg:text-7xl`. | Define heading sizes by semantic role and page type, so supporting sections do not compete with page introductions. |
| High | Hero uses `max-w-[1600px]` and custom inner padding; most sections use `max-w-7xl` with varying `px-4`, `px-5`, or `px-6`. Medal records starts at `pt-28`. | Set a common content grid, gutters, and header spacing. Allow a wider hero only as an intentional design exception. |
| High | Hero and final homepage CTA use pill buttons; Navbar uses `rounded-xl` gradients; Contact mixes `rounded-2xl` and `rounded-xl`. | Define shared primary, secondary, and text actions with matching geometry, size, and states. |
| Medium | Homepage repeats discipline/confidence themes and reuses several competition images across sections. | Give each section a distinct question to answer and reduce repeated copy or imagery where it adds no new information. |
| Medium | Medal records is linked from the homepage but is absent from the primary navigation and footer Explore list. | Include a consistent Results destination in the proposed public information architecture, checking available header width. |
| Medium | Contact places FAQs in a near-full-height mobile introduction before contact details and the form. | Bring the visitor's primary contact task forward; place FAQs as supporting content. |
| Medium | Tournament fetch failures are only logged, leaving empty arrays; medal records has separate loading/error/empty components. | Design consistent data states and distinguish a failed request from a valid empty list. |
| Medium | Framer Motion, CSS hover transitions, Lucide, MUI icons, and social icons coexist. | Standardize functional icon size/stroke and motion behavior; keep recognizable social marks. |
| Medium | Mobile Navbar drawer uses `top-16` while the header changes to `sm:h-20`, and desktop navigation begins at `md`. | Verify drawer alignment at 640–767px and header fit near 768px. Check focus containment, hidden-menu tab order, Escape, and scroll restoration. |
| Medium | Contact labels lack explicit `htmlFor` associations in the inspected form. | Include label/input associations and readable validation states in the public form pass. |

Content review also needs to resolve the placeholder association name in About structured data and review Contact's beginner-age and safety wording with the club before changing factual claims. Do not invent credentials, medal counts, testimonials, or training details for the redesign.

## 5. Proposed visitor and page hierarchy

Site journey: **Understand the club → see the training experience → trust the evidence → understand how to start → contact or register.**

Proposed navigation: Home, About, Tournaments, Results, Contact; registration as the emphasized action and Player Login as a quieter utility. Exact wording and placement will follow the supplied design prompt.

### Homepage

1. One dominant hero: identity, location, value proposition, primary discovery/enquiry action, secondary results link.
2. Brief introduction to fencing and who can start.
3. Training experience: authentic imagery and concrete coaching context.
4. Proof: selected achievements with a link to full results. Treat the progression strip as context rather than duplicating the full pathway here.
5. Athlete pathway: clear beginner-to-competition progression.
6. Club values/community: combine overlapping content if it improves pacing.
7. Final action: one primary next step and one secondary contact route.
8. Footer: contact essentials, exploration, and account links.

### Supporting pages

| Page | Proposed content order |
| --- | --- |
| About | Compact page introduction → club story and training approach → development/opportunities → values → contact/join action |
| Tournaments | Compact introduction → upcoming/current competition information → completed competitions → relevant results link |
| Results | Compact introduction → medal summary → level groups → tournament summaries → expandable individual/team details |
| Contact | Compact introduction → direct contact details and enquiry form → supporting FAQs → map/location |
| Utility pages | Clear status → brief explanation → recovery action using the public design system |

Keep existing tournament grouping/sorting, medal calculations, expansion behavior, and contact submission contracts while changing presentation. Any business-behavior change should be identified separately.

## 6. Shared visual rules to settle before page edits

| System | Required decision |
| --- | --- |
| Typography | One public type system; H1, H2, H3, body, label, caption scales at mobile and desktop; consistent weight, tracking, and line height |
| Layout | Standard maximum content width, mobile gutters, section spacing, grid gaps, and sticky-header offset |
| Color | Named page, alternate-section, emphasis, text, muted-text, border, and action colors |
| Surfaces | Defined treatment for content cards, data cards, images, form panels, and dividers; limited radius and shadow options |
| Actions | Primary, secondary, text-link, and icon-button variants with hover, focus, disabled, and loading states |
| Imagery | Consistent aspect-ratio families, crops, overlays, captions, and alt text; preserve authentic club assets |
| Motion | A small set of transitions; respect reduced motion and avoid requiring animation to reveal essential content |
| Data states | Matching loading, empty, error, and retry presentation across public data pages |

Candidate shared pieces: `PublicContainer`, `PublicSection`, `PublicSectionHeading`, `PublicPageIntro`, `PublicButton`, and `PublicDataState` under `Frontend/src/components/public/`. Extract only patterns actually reused. Keep layout variations explicit rather than creating one component with many unrelated switches.

Scope styles to public components or a public wrapper. Avoid global heading/button changes that would also restyle player and admin screens. Existing font imports in App are not sufficient evidence for choosing the final public typography.

## 7. Implementation sequence after the design prompt

1. Translate the prompt into a concrete visual specification: typography, colors, container widths, spacing, imagery, actions, and section order. Record how it changes this baseline.
2. Capture guest-state browser baselines for all five primary routes and utility states. Review desktop, tablet, and phone before implementing.
3. Build shared public styles/components and align Navbar/Footer. Preserve account links and existing authenticated navigation behavior.
4. Apply the system to the complete homepage in one coordinated pass, including Achievements and every HomeStorySections section. Use it as the reference for supporting pages.
5. Align About and Contact to that reference, preserving contact API submission and feedback.
6. Align Tournaments and Results; cover realistic long content, loading, empty, and failure states.
7. Align public utility states and check route-dependent shell behavior.
8. Review all pages side by side, fix remaining drift, run the checks below, and record completed work and known limitations here.

Likely edits: the public files inventoried above, with narrowly scoped integration in `App.jsx` and public styling files as necessary. No backend, environment-file, player-dashboard, or admin redesign is required.

## 8. Acceptance and verification checklist

- All public pages share a recognizable content grid, heading scale, button family, and section spacing.
- Each page has one main heading and an understandable heading order; each homepage section has one distinct purpose.
- Check widths 320, 375, 390, 640, 768, 1024, and 1440px, plus text zoom. No viewport overflow, clipped actions, or unreadable data cards.
- Verify Navbar width, drawer placement, keyboard navigation, visible focus, Escape, menu close on navigation, and restored body scrolling.
- Verify anchors clear the sticky header, and images retain useful crops without covering important subjects.
- Test every public nav/footer/CTA destination and direct-route refresh.
- Verify tournaments and results with populated, empty, loading, and failed requests; preserve data calculations and group behavior.
- Verify Contact required fields, submission loading, success/failure messages, labels, telephone/email links, and map containment without sending a real enquiry during visual checks.
- Verify reduced-motion behavior, text contrast, useful image alternatives, and accessible interactive controls.
- Preserve structured data and legitimate club details; resolve placeholders using confirmed information.
- Run `npm run lint` and `npm run build` from `Frontend`; distinguish pre-existing failures from new regressions. Use focused interaction tests where behavior is changed.
- Regression-check account destinations and authenticated Navbar variants because Navbar is shared; do not broaden the redesign into those areas.

## 9. Approved visual direction and implementation

The user approved this baseline and supplied an editorial sports direction: real existing photography, navy/off-white rhythm, restrained blue actions, asymmetric compositions, fewer cards, and consistent public typography. Public UI implementation follows that direction. The referenced Padel image was unavailable in the current conversation context, so comparison was against the written specification.

The public pages, shared navigation/footer, and public utility states have been updated. Browser checks and remaining content needs are recorded in [PUBLIC_UI_IMPLEMENTATION_REPORT.md](PUBLIC_UI_IMPLEMENTATION_REPORT.md). The original source findings above are retained as historical context, not a description of the updated interface.
