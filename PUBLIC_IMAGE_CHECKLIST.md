# ASFC Public Website — Image Collection Checklist

Use this checklist to gather photographs for the current public website. Dimensions below are **width × height in pixels** and recommended export sizes, not strict upload requirements. Keep your original photographs so we can adjust crops later.

## 1. Where to put the files

Put website-ready photographs in:

```text
Frontend/src/assets/public/
  home/
  achievements/
  about/
  future/
```

These are proposed folders; create them when adding your files. Use the filenames listed below. Prefer `.avif` or `.webp`. If you only have JPG originals, keep the same filename with `.jpg` and we can optimize them during integration.

Keep full-resolution originals in a separate folder outside the Git repository, such as `ASFC Photo Originals` on your computer. Do not overwrite existing assets like `fencing.avif` or `Navy-Open-2025.avif`: several sections currently share those files.

**Adding files does not automatically display them.** After collection, the component imports and image descriptions need to be connected to the new files. This checklist prepares the assets; it does not change the website.

## 2. Collect these first

- [ ] One strong real ASFC action photograph for the hero.
- [ ] One training-session photograph showing the club environment.
- [ ] One coach guiding a beginner or small group.
- [ ] One candid team/community photograph.
- [ ] One portrait-oriented practice photograph for About.

These will improve the site most because the current collection is weighted toward competition and medal photographs.

## 3. Homepage images

All paths in this table start with `Frontend/src/assets/public/`.

| Collect | Where it will appear | Store as | Recommended export / layout | Why and how to compose it |
| --- | --- | --- | --- | --- |
| [ ] Real fencing action: two ASFC athletes practising or a clear lunge/bout | Home hero, beside “Where discipline becomes confidence.” | `home/hero-action.avif` | **2000 × 1500**, landscape master. Current display is a flexible crop, approximately square/tall on desktop and variable on phone/tablet; it is not a fixed 16:9 banner. | The first impression should show the sport in action. Keep the main athlete, mask and weapon near the central area, with spare room on all sides. Avoid a composition where the important people sit at opposite edges. Main headline sits outside the image, so no large blank text area is needed. |
| [ ] Training session showing athletes, footwork and the practice space | Home → “Inside All Star”, largest image | `home/training-session.avif` | **1800 × 1350**, 4:3 source. Desktop fills the tall left portion of the gallery; smaller screens use 4:3. | Shows what attending ASFC actually looks like. Shoot slightly wide and keep the main activity central so the desktop crop still makes sense. |
| [ ] Coach helping an athlete with stance, footwork or blade technique | Home → “Inside All Star”, upper supporting image | `home/coach-guidance.avif` | **1600 × 1200**, 4:3 source; displayed at **16:9 on desktop**, 4:3 on smaller screens. | Makes coaching visible rather than relying only on competition photographs. Leave space above heads and below hands for the wide crop. The current “Competition” label will need to change to “Coaching” when this is connected. |
| [ ] Team together at practice or a competition | Home → “Inside All Star”, lower supporting image | `home/team-together.avif` | **1600 × 1200**, 4:3 source; 16:9 on desktop, 4:3 on smaller screens. | Adds the club/community side of training. Prefer a small group over a very wide lineup; keep all important faces within the central wide crop. |
| [ ] Focused practice, coach addressing the group, or disciplined team moment | Home → “We don't only train fencers. We develop athletes.” | `home/discipline-practice.avif` | **1800 × 1200**, 3:2 landscape. Image sits beside the values on desktop and above them on mobile. | Supports discipline, respect, focus and resilience. A genuine practice moment is more useful here than another podium photograph. Keep faces unobstructed and avoid an extremely wide group. |
| [ ] Club-wide moment: group practice, team gathering or shared celebration | Home → “More than training”, largest community image | `home/community-wide.avif` | **1800 × 1200**, 3:2 landscape. Largest image on desktop; full-width above the smaller images on mobile. | Shows belonging and relationships. Choose a different moment from the training gallery so the homepage does not repeat itself. |
| [ ] One or two athletes together: encouragement, friendship or preparation | Home → “More than training”, narrow portrait image | `home/community-portrait.avif` | **1200 × 1500**, 4:5 portrait. | Adds a human detail to the collage. Photograph vertically; do not force a wide team photograph into this slot. |
| [ ] Candid club detail: teammates celebrating, preparing equipment or interacting | Home → “More than training”, compact square image | `home/community-detail.avif` | **1200 × 1200**, 1:1 square. | Completes the story with a close, informal moment. Use one clear subject rather than a busy group scene. |

**Optional hero alternative:** if one photograph cannot crop well on both desktop and mobile, also collect `home/hero-action-mobile.avif` at **1200 × 1500 (4:5)**. The current component uses one source; switching between two photographs would require a small responsive-image update. Do not assume this extra file is required.

## 4. Achievement images — existing photos can stay

These slots already have competition photographs. Only replace them if you have a clearer, better-framed original from the correct event.

| Collect or retain | Where it will appear | New file path under `Frontend/src/assets/public/` | Recommended export / layout | Why |
| --- | --- | --- | --- | --- |
| [ ] Khelo India Youth Games gold-medal photograph | Home → “From Solapur to the national stage”, featured “A golden moment” story | `achievements/khelo-india-youth-gold.avif` | **1800 × 1200**, 3:2 landscape; larger than the two supporting stories. | Direct evidence for the existing achievement. Include the medalists and medals without cutting off people at the edges. Current asset: `KIYG-Gold.avif`. |
| [ ] National-level medalists or podium photograph | Same section, “Ready for the national stage” | `achievements/national-medalists.avif` | **1200 × 900**, 4:3 landscape. | Connects the claim to the actual athletes and event. Current asset: `School-Nation.avif`. |
| [ ] Khelo India University Games participation photograph | Same section, “The journey continues” | `achievements/khelo-india-university.avif` | **1200 × 900**, 4:3 landscape. | Shows the university competition opportunity. Current asset: `KIUG.avif`. |

For each achievement image, note the event name, year, people shown and the result it supports. Do not substitute a photograph from another event just because it looks better.

## 5. About page images

| Collect | Where it will appear | New file path under `Frontend/src/assets/public/` | Recommended export / layout | Why and how to compose it |
| --- | --- | --- | --- | --- |
| [ ] Athlete practising at ASFC, ideally with the club environment visible | About → “A place to find your potential”, beside the club story | `about/club-training-portrait.avif` | **1200 × 1500**, 4:5 portrait. | Grounds the club story in a real place. Shoot vertically with the athlete's face/mask, hands and stance visible. Prefer a different photograph from the hero. |
| [ ] Athlete preparing for or taking part in a competition, optionally with a coach | About → “The next challenge is part of the journey” | `about/competition-development.avif` | **1600 × 1200**, 4:3 landscape. | Shows the connection between training and competition. A preparation or coaching moment adds more depth than repeating the same medal photo. |

## 6. Future content — optional, no visible section yet

Gather these when available. They will require new content and a small layout addition before appearing on the site; putting them in the folder will not publish them.

| Optional image | Intended future placement | Suggested storage under `Frontend/src/assets/public/` | Size / layout | Why and accompanying information |
| --- | --- | --- | --- | --- |
| [ ] Head coach portrait | About → future “Meet the coaches” section; optional short homepage introduction | `future/coach-firstname-lastname.webp` | **1200 × 1500**, 4:5 portrait, head/upper body with room around the face. | Builds trust. Supply the real name, role, approved biography and verified qualifications. |
| [ ] Other coach portraits | Same future About section | `future/coach-firstname-lastname.webp` for each coach | **1200 × 1500**, 4:5; similar lighting and framing across portraits. | Presents the actual coaching team consistently. |
| [ ] Parent portrait, only with a genuine testimonial | Home → future trust/testimonial section | `future/parent-testimonial-01.webp` | **600 × 600**, 1:1; displayed as a small portrait. | Makes a real quotation more personal. Supply the approved quote and display name. A portrait is optional; do not invent testimonials. |
| [ ] Player portrait, only with a genuine testimonial | Same future section or About | `future/player-testimonial-01.webp` | **600 × 600**, 1:1. | Adds an athlete's perspective. Supply the approved quote and appropriate permission to publish. |
| [ ] Beginner's first session with a coach | Potential future beginner/training story, or alternative for the current coaching slot | `future/beginner-session.avif` | **1600 × 1200**, 4:3, with room for a 16:9 crop. | Helps parents picture how a child starts. A calm instructional moment is ideal. |
| [ ] Club entrance or recognizable venue exterior | Optional Contact location photo beside the existing map | `future/club-entrance.avif` | **1600 × 1200**, 4:3 landscape. | Helps first-time visitors recognize the correct building. Keep relevant signage readable. |

Use only photographs you can publish; confirm parent/guardian permission for identifiable children where needed.

## 7. Sections that do not need photographs now

| Section | Current design reason |
| --- | --- |
| Home → Why Fencing | Large statement and numbered benefits already provide hierarchy. |
| Home → Athlete Pathway | Numbers and a timeline keep the four steps clear. |
| Home → final join/contact CTA | Open typography and actions keep the next step obvious. |
| Tournaments | Dates, titles, locations and competition levels are the main task. No tournament posters are required. |
| Results archive | Medal numbers and expandable athlete/team records are the evidence. No per-player photograph is required. |
| Contact | Details, enquiry form, map and FAQs are sufficient; venue photo is optional future content. |
| Navbar and footer | Keep the existing `Frontend/src/assets/ASFC_Logo.png`. No replacement logo is needed. |
| Loading, error, maintenance and 404 pages | Keep these lightweight with typography and recovery actions. |

## 8. Image quality and file-size targets

| Image type | Preferred web format | Practical file-size target |
| --- | --- | --- |
| Hero | AVIF or WebP | Approximately **250–500KB** |
| Large training/group/editorial images | AVIF or WebP | Approximately **150–300KB** |
| Supporting achievement/community images | AVIF or WebP | Approximately **80–200KB** |
| Small testimonial portraits | WebP or AVIF | Approximately **30–80KB** |

These are targets, not rejection limits. Preserve faces, fencing blades and natural detail instead of compressing to a visibly poor image. A sharp smaller original is better than an enlarged blurry file.

- Export from original camera/phone files, not screenshots or heavily compressed chat copies.
- Keep photographs in natural color. Do not bake in a dark overlay, rounded corners, filters, captions or large logos: the site supplies those treatments.
- Keep important faces and action away from the outer edges. The site uses `object-fit: cover`, which fills a frame by cropping excess width or height.
- Leave the bottom-left area reasonably clear because several photographs have a small caption there.
- Collect both a wide shot and a close/vertical alternative during a photo session.
- Avoid near-duplicate images across Hero, Training, About and Community. Each section should reveal a different part of the club.
- If a group cannot fit a requested crop, keep the uncropped original and note this. We can adapt the frame rather than cut people out.

## 9. Suggested folder contents when ready

```text
Frontend/src/assets/public/
├── home/
│   ├── hero-action.avif
│   ├── training-session.avif
│   ├── coach-guidance.avif
│   ├── team-together.avif
│   ├── discipline-practice.avif
│   ├── community-wide.avif
│   ├── community-portrait.avif
│   └── community-detail.avif
├── achievements/                         # Optional replacements for existing photos
│   ├── khelo-india-youth-gold.avif
│   ├── national-medalists.avif
│   └── khelo-india-university.avif
├── about/
│   ├── club-training-portrait.avif
│   └── competition-development.avif
└── future/                               # Optional; not connected to visible sections
    ├── coach-firstname-lastname.webp
    ├── parent-testimonial-01.webp
    ├── player-testimonial-01.webp
    ├── beginner-session.avif
    └── club-entrance.avif
```

The current layout has **13 photo placements: 8 homepage story/hero images, 3 achievement images, and 2 About images**. The three achievement photographs can remain, so prioritize collecting the other ten rather than replacing everything. Start with the five highest-priority shots in section 2.

## 10. Add a short photo note

Alongside the finished files, create `Frontend/src/assets/public/photo-notes.md` with one entry per photograph:

```text
Filename: home/coach-guidance.avif
Shows: Coach helping a beginner practise footwork
Location: [actual location]
Date/event: [actual date or event, if relevant]
People/result: [confirmed details needed for the caption]
Publication permission: [confirmed / needs checking]
Crop note: Keep the coach's hands and athlete's stance visible
```

This provides the information needed for accurate captions, alt text and crop choices. Do not put private contact details or identity documents in photo notes.

## 11. Where the files will be connected

| Images | Component to update after collection |
| --- | --- |
| Hero | `Frontend/src/components/homepage/Hero.jsx` |
| Training, discipline and community | `Frontend/src/components/homepage/HomeStorySections.jsx` |
| Achievement stories | `Frontend/src/components/homepage/Achievements.jsx` |
| About | `Frontend/src/pages/About.jsx` |
| Shared crop/focal-position behavior | `Frontend/src/components/public/PublicUI.jsx` and `Frontend/src/styles/public.css` |

After you add the photographs, the next step is to connect these files, update labels/alt text to match what they actually show, and check crops on phone, tablet and desktop.
