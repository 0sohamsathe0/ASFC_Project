# ASFC Attendance V1 — Testing Checklist

## Document information

| Field | Value |
|---|---|
| Feature | Attendance Management V1 |
| Branch | `attendance` |
| Test status | Not started |
| Tester |  |
| Test date |  |
| Desktop browser |  |
| Mobile device/browser |  |
| Backend URL |  |
| Frontend URL |  |

## Testing objective

Verify that an authenticated administrator can securely mark, resume, review, correct, and delete Morning and Evening attendance, and that an authenticated player can securely view only their own monthly attendance and calculated statistics.

## Important rules

- Only players with `requestStatus === "Accepted"` are eligible for new attendance.
- Morning and Evening are separate attendance sessions.
- Attendance status can only be Present or Absent.
- One record is uniquely identified by Player + Date + Session.
- Missing attendance does not count as Absent.
- Players can only view their own attendance.
- Attendance dates use local `YYYY-MM-DD` calendar values without UTC conversion.

---

# 1. Local setup

## Start the backend

```powershell
cd Backend
npm.cmd run dev
```

- [ ] Backend starts without an error.
- [ ] MongoDB connects successfully.
- [ ] Backend health endpoint responds.

## Start the frontend

```powershell
cd Frontend
npm.cmd run dev -- --host
```

- [ ] Desktop frontend URL opens.
- [ ] Vite displays a Network URL.
- [ ] Phone can open the Network URL while connected to the same network.

## Required test data

Prepare the following players without using real sensitive identity data:

| Test player | Request status | Purpose |
|---|---|---|
| Player A | Accepted | Normal marking |
| Player B | Accepted | Resume and duplicate tests |
| Player C | Accepted | Edit/delete tests |
| Player D | Pending | Eligibility test |
| Player E | Rejected | Eligibility/history test |

- [ ] At least three Accepted test players exist.
- [ ] At least one Pending test player exists.
- [ ] At least one Rejected test player exists.

---

# 2. Authentication and route access

## Admin access

- [ ] Unauthenticated access to `/admin/attendance/mark` redirects to `/admin/login`.
- [ ] Unauthenticated access to `/admin/attendance/records` redirects to `/admin/login`.
- [ ] Admin login succeeds with valid test credentials.
- [ ] Desktop login redirects to `/admin/dashboard`.
- [ ] Mobile login redirects to `/admin/attendance/mark`.
- [ ] Attendance navigation shows Mark and Records.
- [ ] Admin logout clears the session and returns to login.

## Mobile route separation

- [ ] `/admin/attendance/mark` works on a phone.
- [ ] `/admin/attendance/records` works on a phone.
- [ ] `/admin/dashboard` remains blocked by the existing desktop-only protection on a phone.
- [ ] Attendance does not expose other admin-dashboard functions on mobile.

## Player access

- [ ] Unauthenticated access to `/player/profile` redirects to player login.
- [ ] A logged-in player can open the Attendance section.
- [ ] Admin-only attendance operations are unavailable to players.

---

# 3. Admin marking workflow

Use a new test date that has no existing attendance.

| Field | Test value |
|---|---|
| Date |  |
| Session | Morning |

## Load marking state

- [ ] Open `/admin/attendance/mark`.
- [ ] Select the test date.
- [ ] Select Morning.
- [ ] Click Load Session.
- [ ] Only Accepted players appear.
- [ ] Pending players do not appear.
- [ ] Rejected players do not appear.
- [ ] Aadhaar, phone, email, and identity-document data are not displayed.
- [ ] Progress starts at the correct marked/eligible values.

## Mark attendance

- [ ] Mark Player A Present.
- [ ] The request is saved successfully.
- [ ] Progress increases by one.
- [ ] The UI advances to the next player.
- [ ] Mark Player B Absent.
- [ ] Progress increases again.
- [ ] Present and Absent both use the same workflow.
- [ ] Buttons are disabled while a save request is active.
- [ ] Rapid double-clicking does not create duplicate records.

## Resume workflow

- [ ] Mark only part of the player list.
- [ ] Record the displayed progress: `____ marked / ____ total`.
- [ ] Close or refresh the browser.
- [ ] Return to the same date and session.
- [ ] Previously marked players are not shown as remaining.
- [ ] Progress resumes from the database.
- [ ] The first unmarked player is displayed.
- [ ] No local browser state is required to resume.

## Complete the session

- [ ] Mark all remaining players.
- [ ] Completion state appears.
- [ ] Present count is correct.
- [ ] Absent count is correct.
- [ ] Total equals the number of explicitly marked records.

---

# 4. Morning and Evening independence

- [ ] Complete or partially mark Morning for a test date.
- [ ] Change the session to Evening for the same date.
- [ ] Evening initially has its own progress.
- [ ] Morning records do not mark Evening automatically.
- [ ] The same player can have one Morning and one Evening record.
- [ ] The same player cannot have two Morning records for the same date.
- [ ] Morning status can differ from Evening status.

Example:

| Player | Morning | Evening |
|---|---|---|
| Player A | Present | Absent |
| Player B | Absent | Present |

---

# 5. Admin attendance records

## Load records

- [ ] Open `/admin/attendance/records`.
- [ ] Select the test date.
- [ ] Select All sessions.
- [ ] Click Load Records.
- [ ] Morning and Evening records appear.
- [ ] Record count is correct.
- [ ] Morning summary is correct.
- [ ] Evening summary is correct.
- [ ] Player name, event, session, status, and marked time are displayed.
- [ ] Sensitive Player data is not displayed.

## Session filters

- [ ] Morning filter returns only Morning records.
- [ ] Evening filter returns only Evening records.
- [ ] All sessions returns both.
- [ ] Changing a filter does not show stale results as current data.

## Empty date

- [ ] Select a date with no attendance.
- [ ] The empty state appears.
- [ ] Missing attendance is not described as Absent.

---

# 6. Edit attendance

- [ ] Select a Present record.
- [ ] Open the edit confirmation.
- [ ] Player and session information are correct.
- [ ] Confirm Present → Absent.
- [ ] The record changes to Absent.
- [ ] Summary counts refresh correctly.
- [ ] Change the same record Absent → Present.
- [ ] Summary counts refresh correctly.
- [ ] The UI does not offer editing player, date, session, markedBy, or markedAt.

---

# 7. Delete attendance

- [ ] Select a test attendance record.
- [ ] Open the delete confirmation.
- [ ] The modal warns that deletion is permanent.
- [ ] Cancel leaves the record unchanged.
- [ ] Reopen and confirm deletion.
- [ ] The record disappears from the records view.
- [ ] Summary totals decrease correctly.
- [ ] Return to Mark Attendance for the same date/session.
- [ ] The deleted player appears as unmarked again.
- [ ] Mark the player again successfully.

---

# 8. Player monthly attendance

Log in as a player who has known test attendance records.

- [ ] Open `/player/profile` on desktop.
- [ ] My Attendance appears before Results.
- [ ] Open `/player/profile` on mobile.
- [ ] My Attendance appears in the mobile profile.
- [ ] Current month loads automatically.
- [ ] Previous-month navigation works.
- [ ] Next-month navigation works up to the current month.
- [ ] Future-month navigation is disabled.
- [ ] Current month button returns to the current month.

## Statistics

Manually calculate the expected values:

| Statistic | Expected | Actual | Pass |
|---|---:|---:|---|
| Total sessions |  |  | ☐ |
| Present |  |  | ☐ |
| Absent |  |  | ☐ |
| Attendance percentage |  |  | ☐ |

- [ ] Only explicit records count toward total sessions.
- [ ] Missing Morning or Evening records do not count as Absent.
- [ ] Percentage equals `(Present / Total) × 100`.
- [ ] A month with zero records shows zero statistics without division errors.

---

# 9. Player attendance calendar

## Calendar colors

| Morning | Evening | Expected day color |
|---|---|---|
| Present | Present | Dark green |
| Present | Absent | Light green |
| Absent | Present | Light green |
| Present | Not marked | Light green |
| Absent | Absent | Red |
| Absent | Not marked | Red |
| Not marked | Not marked | Blue-tinted dark cell |

- [ ] Both Present appears dark green.
- [ ] Exactly one Present appears bright light green.
- [ ] Absence with no Present appears red.
- [ ] No records appears as a blue-tinted dark cell.
- [ ] Today has a visible outline.
- [ ] Selected day has a blue outline.
- [ ] The calendar fits on a phone without horizontal scrolling.

## Hover and tap details

- [ ] Desktop hover shows the correct date.
- [ ] Desktop hover shows Morning status.
- [ ] Desktop hover shows Evening status.
- [ ] Keyboard focus exposes the same information.
- [ ] Mobile tap selects the date.
- [ ] Mobile detail panel shows both sessions.
- [ ] Not marked is displayed instead of Absent when a record is missing.

---

# 10. Security tests

These tests should be performed using browser developer tools or an API client without exposing credentials in screenshots or notes.

- [ ] Player attendance request contains no playerId parameter.
- [ ] Player attendance identity comes from the authenticated cookie.
- [ ] A player cannot request another player’s attendance by adding a playerId query parameter.
- [ ] A player cannot call admin marking endpoints successfully.
- [ ] An unauthenticated request receives HTTP 401.
- [ ] A player calling an admin endpoint receives HTTP 403.
- [ ] An admin-only request succeeds for an authenticated admin.
- [ ] Attendance responses do not expose Aadhaar data.
- [ ] Attendance responses do not expose identity-document URLs.

---

# 11. Validation and error handling

## Invalid dates

Confirm that the backend rejects:

- [ ] `2026-02-31`
- [ ] `2026-13-10`
- [ ] `2026-00-05`
- [ ] `2026-04-31`
- [ ] Non-`YYYY-MM-DD` input

Confirm that the backend accepts:

- [ ] `2026-08-19`
- [ ] `2024-02-29`

## Invalid attendance values

- [ ] `Both` session is rejected.
- [ ] `Late` status is rejected.
- [ ] Missing playerId is rejected when marking.
- [ ] Invalid playerId is rejected.
- [ ] Unknown player is rejected.
- [ ] Pending player cannot receive new attendance.
- [ ] Rejected player cannot receive new attendance.
- [ ] Duplicate Player + Date + Session returns HTTP 409.

## Network and server errors

- [ ] Stop the backend while the frontend is open.
- [ ] Attendance pages show a readable error.
- [ ] Restart the backend.
- [ ] Retry successfully reloads data.
- [ ] A failed marking request does not incorrectly advance the current player.

---

# 12. Historical-data behavior

- [ ] Mark attendance for an Accepted test player.
- [ ] Change that player to Rejected or Pending after marking.
- [ ] Historical attendance remains available.
- [ ] The player no longer appears in new marking eligibility.
- [ ] Existing attendance totals remain based on stored records.

If testing deletion of a Player document in a safe test database:

- [ ] Historical Attendance remains in the collection.
- [ ] Admin records view shows `Deleted player` instead of crashing.

---

# 13. Automated verification

## Backend

```powershell
cd Backend
npm.cmd test
```

- [ ] All attendance validation tests pass.

## Frontend

```powershell
cd Frontend
npm.cmd run build
```

- [ ] Production build completes successfully.
- [ ] Attendance components produce no build errors.

---

# 14. Issue report template

## Issue title

`[Attendance] Short description`

## Environment

- Device:
- Browser:
- Frontend URL:
- Date/session tested:
- User role:

## Steps to reproduce

1. 
2. 
3. 

## Expected result


## Actual result


## Screenshot or recording


## Console/network error

Do not include passwords, JWTs, cookies, Aadhaar details, API keys, or environment values.

---

# 15. Final sign-off

| Area | Status | Notes |
|---|---|---|
| Admin authentication | Not tested |  |
| Desktop marking | Not tested |  |
| Mobile marking | Not tested |  |
| Resume workflow | Not tested |  |
| Morning/Evening independence | Not tested |  |
| Records and summaries | Not tested |  |
| Edit and delete | Not tested |  |
| Player statistics | Not tested |  |
| Player calendar | Not tested |  |
| Authorization/security | Not tested |  |
| Validation/error handling | Not tested |  |
| Production build | Not tested |  |

## Release decision

- [ ] Approved for merge
- [ ] Approved with minor known issues
- [ ] Blocked by critical issue

## Final notes


