# Attendance Management System - Implementation Plan

## 1. Recommended Database Architecture
**Option B: Separate Attendance model** referencing the Player model.

## 2. Why This Architecture is Preferable
- **Scalability**: Separates attendance data from player documents, avoiding document size growth limits (16MB cap in MongoDB). Attendance records can grow indefinitely without affecting player document performance.
- **Query Performance**: Enables efficient querying by date, session, and playerId through targeted indexes. Admin can query all attendance for a specific date/session without scanning player documents.
- **Indexing Flexibility**: Straightforward unique compound index on `{playerId, date, session}` to prevent duplicates at the database level.
- **Data Independence**: Attendance records persist even if player data is modified or deleted (with appropriate handling). Supports historical analytics without impacting player document operations.
- **Consistency with Existing ASFC Pattern**: Follows the project's pattern of separating concerns (see individual-result-model.js, team-result-model.js, tournament-model.js). Player model remains focused on player-specific data.
- **Atomic Updates**: Updating a single attendance record does not require rewriting the entire player document, reducing contention and improving concurrent update performance.
- **Analytics Friendly**: Aggregation pipelines on the attendance collection are simpler and more performant than unwinding arrays across player documents.

## 3. Attendance Schema
```javascript
const attendanceSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
    index: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD (local India date)
    required: true,
    match: /^\d{4}-\d{2}-\d{2}$/,
    index: true
  },
  session: {
    type: String,
    enum: ['Morning', 'Evening'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  markedBy: {
    type: String, // Stores req.user.id from JWT (either player ObjectId string or "admin" for admin)
    required: true
  },
  markedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // Adds createdAt and updatedAt
```

## 4. Indexes and Uniqueness Constraints
- **Compound Unique Index**: `{ playerId: 1, date: 1, session: 1 }` to prevent duplicate attendance records for the same player on the same date and session.
- **Additional Indexes**:
  - `playerId` (for player-specific queries)
  - `date` (for date-based queries)
  - `session` (for session-based queries)
  - Compound index `{ date: 1, session: 1 }` for efficient day-wise admin views
  - Compound index `{ playerId: 1, date: 1 }` for player date-range queries

## 5. Attendance Lifecycle
1. **Creation**: Admin marks attendance for a player via the admin interface.
2. **Storage**: Record inserted into Attendance collection with server-generated `markedAt` timestamp.
3. **Reading**: 
   - Players view their own records via `/player/attendance` endpoints.
   - Admins view club-wide records via `/admin/attendance` endpoints.
4. **Updating**: Admin corrects a record via `/admin/attendance/:id` (PUT/PATCH).
5. **Deletion**: Admin accidentally marked records can be deleted via `/admin/attendance/:id` (DELETE). Soft delete considered but not implemented initially (hard delete acceptable for correction workflow).
6. **Archival**: No automatic archival; records retained indefinitely for historical reporting.

## 6. Admin Marking Workflow
1. Admin navigates to "Mark Attendance" page.
2. Admin selects date (using date picker) and session (Morning/Evening).
3. System fetches eligible players (see Player Eligibility Rules below) for the selected date/session, excluding those already marked.
4. Admin processes players one-by-one:
   - For each player, admin selects Present or Absent.
   - System sends request to mark attendance for that specific player/date/session.
   - Upon success, UI moves to next player and updates progress indicator.
5. After all eligible players are processed, admin sees completion state and can exit or select a new date/session.

## 7. Mark Present / Mark Absent Design
**Single Controller Function**: `markAttendance(playerId, date, session, status, notes)`
- **Why single function**: 
  - Reduces code duplication (Present/Absent differ only in status value).
  - Ensures consistent validation, duplicate prevention, and audit tracking.
  - Simpler API contract and easier to extend (e.g., adding "Late" status later).
- **Implementation**:
  - Validate playerId exists and is eligible.
  - Check for existing record using unique index constraint (catch duplicate key error).
  - Create new attendance record with provided parameters.
  - Return created record with appropriate success response.

## 8. Edit Attendance Design
- **Endpoint**: `PUT /admin/attendance/:id`
- **Authorization**: Admin only (`verifyJWT` + `authorizeRoles('admin')`)
- **Validation**:
  - Ensure attendance record exists and belongs to the club (no cross-club tampering).
  - Validate input fields (date format, session enum, status enum).
  - Prevent changing playerId or date/session combination that would create a duplicate (unless updating the same record).
- **Update Logic**:
  - Allow modification of: status, notes.
  - Do not allow modification of: playerId, date, session (to preserve data integrity; delete and recreate if needed).
  - Update `updatedAt` timestamp automatically via mongoose timestamps.
  - No audit trail implemented initially (relying on `updatedAt` for basic change tracking).
- **Response**: Updated attendance record.

## 9. Delete Attendance Design
- **Endpoint**: `DELETE /admin/attendance/:id`
- **Authorization**: Admin only
- **Considerations**:
  - **Historical Integrity**: Deletion removes record permanently; suitable only for accidental marking corrections.
  - **Alternative**: Soft delete (adding `isDeleted` flag) considered but not implemented due to low expected deletion volume and simplicity requirements.
  - **Implementation**: Hard delete using `Attendance.findByIdAndDelete(id)`.
  - **Protection**: Route prevents players from deleting records (admin-only authorization).
- **Response**: Success message with deleted record ID.

## 10. Player Attendance Query Design
- **Endpoint**: `GET /player/attendance`
- **Authorization**: Player only (`verifyJWT` + `authorizeRoles('player')`)
- **Query Parameters**:
  - `startDate` (optional, YYYY-MM-DD): Filter records on or after this date.
  - `endDate` (optional, YYYY-MM-DD): Filter records on or before this date.
  - `month` (optional, YYYY-MM): Shorthand for filtering to a specific month (overrides startDate/endDate if provided).
- **Response Structure**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "attendanceId",
        "date": "2026-08-18",
        "session": "Morning",
        "status": "Present",
        "notes": "",
        "markedAt": "2026-08-18T10:30:00.000Z",
        "markedBy": "admin"
      }
    ],
    "count": 25,
    "monthlyStats": {
      "totalSessions": 40,
      "presentCount": 34,
      "absentCount": 6,
      "attendancePercentage": 85
    }
  }
  ```
- **Query Logic**:
  - Build date range filter from parameters.
  - Query: `{ playerId: req.user.id, date: { $gte: startDate, $lte: endDate } }`
  - Sort by date descending, then session (Morning before Evening).
  - Calculate monthly stats dynamically if month parameter provided or if date range spans a single month.

## 11. Day-wise Admin Query Design
- **Endpoint**: `GET /admin/attendance`
- **Authorization**: Admin only
- **Query Parameters**:
  - `date` (required, YYYY-MM-DD): Date to query.
  - `session` (optional): Filter by Morning or Evening.
- **Response Structure**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "attendanceId",
        "playerId": "playerObjectId",
        "fullName": "Player Name",
        "session": "Morning",
        "status": "Present",
        "notes": "",
        "markedAt": "2026-08-18T10:30:00.000Z",
        "markedBy": "admin"
      }
    ],
    "count": 30,
    "summary": {
      "Morning": { "Present": 15, "Absent": 5, "Total": 20 },
      "Evening": { "Present": 12, "Absent": 8, "Total": 20 }
    }
  }
  ```
- **Query Logic**:
  - Validate date format.
  - Build filter: `{ date: req.query.date }` plus optional session filter.
  - Populate playerId to get player names (select: fullName, optionally other light fields).
  - Sort by session then status (Present first) then player name.
  - Calculate summary counts for morning/evening present/absent.

## 12. Monthly Statistics Calculation
- **Approach**: Calculated dynamically on query (not stored) to ensure accuracy and avoid redundancy.
- **When Calculated**:
  - Player view: When querying with month parameter or single-month date range.
  - Admin view: In day-wise endpoint summary (aggregated for that day only).
- **Method**: Aggregation pipeline matching playerId and date range, grouping by status to count Present/Absent, then compute percentage.
- **Performance**: With proper indexes on `{playerId, date}`, performance is acceptable for typical date ranges (e.g., one month).

## 13. Player Eligibility Rules
- **Admin View (for marking)**:
  - Only players with `requestStatus: "Accepted"` are eligible for attendance marking.
  - Pending and Rejected players are excluded (they cannot participate in club activities until accepted).
  - Rationale: Attendance tracking is for active club participants; pending players are not yet cleared to attend, rejected players are no longer members.
- **Player View**:
  - Players can only view their own attendance regardless of requestStatus (historical record).
- **Edge Case**: If a player's status changes from Accepted to Rejected, past attendance records remain accessible for historical purposes but are excluded from new marking.

## 14. Date/Timezone Strategy
- **Storage**: Date stored as string in `YYYY-MM-DD` format representing the local India date (IST, UTC+5:30).
- **Input Handling**:
  - Frontend date picker returns local date string (no timezone conversion needed).
  - Backend validates format but does not convert to UTC; stores as-is.
- **Querying**: Direct string equality match on date field (efficient and timezone-safe).
- **Session Representation**: 
  - Morning: Training session occurring before 12:00 IST.
  - Evening: Training session occurring after 12:00 IST.
  - No time storage needed; session is categorical.
- **Consistency**: All date-related operations (marking, viewing, reporting) use the local India date without timezone conversion complexity.

## 15. REST API Proposal
### Admin Routes (`/admin/attendance*`)
| Method | Route | Description | Auth | Role |
|--------|-------|-------------|------|------|
| POST | `/admin/attendance` | Mark attendance for a single player | verifyJWT | admin |
| GET | `/admin/attendance` | Get attendance for a date (± session) with summary | verifyJWT | admin |
| PUT | `/admin/attendance/:id` | Update attendance record (status/notes) | verifyJWT | admin |
| DELETE | `/admin/attendance/:id` | Delete attendance record | verifyJWT | admin |
| GET | `/admin/attendance/stats` | Optional: Monthly attendance stats for reporting | verifyJWT | admin |

### Player Routes (`/player/attendance*`)
| Method | Route | Description | Auth | Role |
|--------|-------|-------------|------|------|
| GET | `/player/attendance` | Get own attendance with filtering (date/month) | verifyJWT | player |

**Note**: 
- POST `/admin/attendance` expects body: `{ playerId, date, session, status, notes }`
- All dates in requests/responses are `YYYY-MM-DD` strings local to India.
- Response formats follow existing ASFC pattern (`{ success, message, data, count, ... }`).

## 16. Authorization Strategy
- **Backend Enforcement**: 
  - All attendance routes protected by `verifyJWT` middleware.
  - Admin routes additionally protected by `authorizeRoles('admin')`.
  - Player routes additionally protected by `authorizeRoles('player')`.
  - Ownership validation: 
    - Player routes implicitly restrict to `req.user.id` via query (playerId taken from JWT, not request params).
    - Admin routes do not restrict by playerId (admin can mark any eligible player).
- **Frontend Role**: UI hides/shows components based on role, but backend authorization is the source of truth.
- **Token Validation**: 
  - Player JWT payload: `{ id: playerObjectId, role: "player" }`
  - Admin JWT payload: `{ id: "admin", role: "admin" }`
  - `markedBy` field stores the `id` value from the token (string).

## 17. Frontend Component/Page Plan
### Admin
- **Mark Attendance Page**:
  - Date picker (defaults to today).
  - Session toggle buttons (Morning/Evening).
  - Player card component showing:
    - Player photo (thumbnail)
    - Full name
    - Previous status for this date/session (if any, disabled for editing)
    - Present button (green)
    - Absent button (red)
  - Progress indicator: "Marked X/Y players"
  - Completion state: Show summary and option to reset for new date/session.
  - Eligible player list: Only Accepted players, ordered alphabetically.
- **Day-wise View Page** (optional extension):
  - Date picker.
  - Toggle between Morning/Evening or show both.
  - List of players grouped by status (Present/Absent) with names.
  - Summary totals.

### Player
- **Attendance Section in PlayerProfile**:
  - Toggle between "Monthly View" and "Date Range".
  - Monthly View: 
    - Month picker.
    - Calendar heatmap or simple list showing Present/Absent per day.
    - Monthly statistics banner (total sessions, present %, etc.).
  - Date Range View:
    - Start/end date pickers.
    - Detailed list view with date, session, status, notes.
    - Empty state message when no records.
  - Reuse existing UI patterns: 
    - Cards with `overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm`
    - Lucide icons (Calendar, Check, X, etc.)
    - Loading screens and error handling consistent with PlayerProfile.

## 18. Potential Edge Cases
- **Duplicate Marking**: Prevented by unique database index; backend catches duplicate key error and returns 409 Conflict.
- **Timezone Misconfiguration**: Mitigated by storing date as local string; no timezone conversion in backend.
- **Invalid Player ID**: Backend validates playerId exists and is Accepted before marking.
- **Concurrent Updates**: MongoDB document locking on single attendance record is safe; unique index prevents race conditions on creation.
- **Admin Status Change**: If admin logs out during marking session, subsequent requests fail auth (expected behavior).
- **Large Player Count**: Pagination not implemented initially; assumed manageable (<500 players). If exceeded, add pagination to admin eligibility query.
- **Notes Field Abuse**: No validation on length/content beyond being a string; rely on admin judgment.

## 19. Testing Strategy
- **Unit Tests**:
  - Attendance model validation (required fields, enum values, date format).
  - Controller functions: 
    - markAttendance (success, duplicate, invalid player, missing fields).
    - getAttendanceByPlayer (filtering, sorting, stats calculation).
    - getAttendanceByDateAndSession (filtering, population, summary).
    - updateAttendance (field restrictions, validation).
    - deleteAttendance (success, not found).
- **Integration Tests**:
  - API endpoint testing with supertest.
  - Authentication/authorization checks for each route.
  - Database state verification after operations.
- **Manual Testing**:
  - UI workflow testing for admin marking flow.
  - Edge case simulation (duplicate marking, invalid dates).
  - Cross-device testing (desktop/mobile) for date picker usability.
- **Coverage Goal**: 80%+ unit test coverage on attendance model and controllers.

## 20. Recommended Implementation Order
1. **Backend Foundation**:
   - Create attendance-model.js with schema and indexes.
   - Create attendance-controller.js with core functions.
   - Create attendance-router.js and attach to index.js under `/admin` and `/player`.
2. **Admin Marking Workflow**:
   - Implement GET `/admin/attendance` (eligibility list + already marked check).
   - Implement POST `/admin/attendance` (marking single record).
   - Build basic admin UI for date/session selection and player iteration.
3. **Player View**:
   - Implement GET `/player/attendance` (filtering and stats).
   - Add attendance section to PlayerProfile UI.
4. **Edit/Delete Functionality**:
   - Implement PUT and DELETE `/admin/attendance/:id`.
   - Add edit capability in admin day-wise view.
5. **Refinement & Testing**:
   - Add validation improvements and error handling.
   - Write unit and integration tests.
   - Polish UI/UX (loading states, empty states, progress indicators).
6. **Optional Extensions**:
   - Monthly stats endpoint for admin reporting.
   - Day-wise view page for admin.
   - Export functionality (CSV) for admin reports.

## QUESTIONS / DECISIONS REQUIRED FROM ME
1. **Player Eligibility Confirmation**: Should only "Accepted" players be eligible for attendance marking, or should "Pending" players also be included (perhaps with a visual indicator)?
2. **Delete Attendance**: Should attendance records be soft-deleted (with `isDeleted` flag) instead of hard-deleted to preserve audit trails for accidental markings?
3. **Admin Identity**: Should we enhance the admin JWT payload to include admin name or identifier (currently just `"admin"`) for better audit trail in `markedBy` field, or is the current approach sufficient?
4. **Session Definition**: Are Morning and Evening sessions strictly defined by time (e.g., Morning = 6AM-12PM, Evening = 12PM-6PM), or are they purely categorical labels set by the admin when marking? (Current plan treats them as categorical.)
5. **Pagination Threshold**: At what number of players should we implement pagination in the admin eligibility query to maintain performance? (Current plan assumes <500 players without pagination.)