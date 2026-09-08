# Fees Management V1 — Revised Backend Plan

This revision incorporates the approved architecture corrections and the finalized business rules. The plan was approved for backend implementation on 2026-09-08; commit, push, merge, and deployment still require separate approval.

## 1. Current backend findings

The inspected repository currently has:

- Express 5, Mongoose 9, and ES modules.
- JWT authentication through an HTTP-only cookie.
- `verifyJWT` followed by `authorizeRoles(...)`.
- Player JWT identity available as `req.user.id`.
- Player eligibility represented by `requestStatus === "Accepted"`.
- A standalone Attendance model with strict date validation, unique indexes, ownership-bound player queries, server-calculated summaries, and Node test coverage.
- Routes mounted directly in `Backend/index.js`.
- No existing fee models, controllers, services, routes, or UI.
- Node’s built-in test runner through `node --test`.
- A clean `master` working tree at the locally known `origin/master` when this plan was prepared.
- 22 existing backend tests passing when this plan was prepared.

Before implementation, the approved base must be refreshed and confirmed, then a dedicated branch such as `fees-management-v1` should be created. Fee work should not be performed directly on `master`.

## 2. Confirmed V1 scope

Fees Management V1 is a membership-coverage system that stores:

- A player’s first payable month.
- Their last covered payable month.
- Their cumulative recorded total.
- Global fee-rate changes.
- Temporary non-payable pauses.
- A terminal closure month.

The backend dynamically calculates:

- Current status.
- Covered months.
- Pending months.
- Paused months.
- Closed months.
- Future prepaid months.
- Applicable rate for each month under the current rate timeline.
- Current outstanding amount.
- Next unpaid payable month.
- June–May financial-year summaries.

All amounts are integer rupees. Partial monthly payments remain prohibited.

### Finalized business rules

- The initial monthly FeeRate is ₹1,500, effective from `2026-06`.
- ASFC’s financial year runs from June through May.
- Twelve payable months at ₹1,500 total ₹18,000; this is not a discount or separate annual rate.
- A single coverage request may select at most 12 payable months, and the resulting account may contain no more than 12 future prepaid payable months.
- Future prepaid months are active payable months strictly after the current `Asia/Kolkata` month. Overdue and current months do not consume this allowance, and paused months are excluded.
- For newly accepted players, acceptance and FeeAccount creation happen together.
- The acceptance UI asks the admin to select `billingStartMonth` and may default it to the current India month.
- Billing start may be backdated but cannot precede `2026-06` or be later than the current India month.
- Billing start is never inferred from registration or acceptance dates.
- Existing Accepted players require a one-time reviewed initialization process.
- Ordinary pauses may start only in the current or a future month, cannot begin inside covered months, and must cover at least one complete month.
- Reactivation begins at least one month after pause start.
- Closure is terminal in V1 and may begin only after the final covered month.

## 3. Explicit exclusions

V1 will not introduce:

- `FeePayment` or `FeeCharge`.
- Payment transaction history.
- Payment dates, methods, references, or administrator-entry history.
- Stored monthly charge or payment documents.
- Partial payments.
- Discounts, including an annual-payment discount.
- Fines, refunds, offers, or payment gateways.
- Receipts or reminders.
- Correction history.

The 12-month amount is ₹18,000 solely because:

```text
₹1,500 × 12 months = ₹18,000
```

It is not a separate annual price and carries no discount.

## 4. Final recommended models

### FeeAccount

```js
{
  playerId,
  billingStartMonth,
  paidThroughMonth,
  totalPaid,
  closedFromMonth,
  createdAt,
  updatedAt
}
```

No status is stored.

### FeeRate

```js
{
  amount,
  effectiveFromMonth,
  createdAt,
  updatedAt
}
```

There is no `effectiveToMonth`.

### FeePause

```js
{
  playerId,
  startMonth,
  endMonth,
  createdAt,
  updatedAt
}
```

There is no stored pause status.

## 5. FeeAccount schema

Suggested schema:

```js
const feeAccountSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      immutable: true,
      unique: true,
    },

    billingStartMonth: {
      type: String,
      required: true,
      immutable: true,
      validate: isValidFeeMonth,
    },

    paidThroughMonth: {
      type: String,
      default: null,
      validate: nullableFeeMonthValidator,
    },

    totalPaid: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: isSafeNonNegativeInteger,
    },

    closedFromMonth: {
      type: String,
      default: null,
      validate: nullableFeeMonthValidator,
    },
  },
  { timestamps: true }
);
```

Retain Mongoose’s `__v`.

### Field semantics

| Field | Meaning |
|---|---|
| `playerId` | Accepted player who owns the account |
| `billingStartMonth` | First potentially payable month |
| `paidThroughMonth` | Last payable month covered; null means nothing has been paid |
| `totalPaid` | Lifetime cumulative integer amount recorded |
| `closedFromMonth` | First month from which the account is permanently closed |
| `__v` | Optimistic concurrency token |
| timestamps | General modification timestamps, not payment history |

### Empty account

A newly initialized account with no fee coverage is:

```js
{
  billingStartMonth: "2026-09",
  paidThroughMonth: null,
  totalPaid: 0,
  closedFromMonth: null
}
```

### FeeAccount indexes

```js
{ playerId: 1 } // unique
{ closedFromMonth: 1 }
{ paidThroughMonth: 1 }
```

The unique `playerId` index is the authoritative duplicate-account protection.

### Cross-field validation

Service-level validation must enforce:

- `paidThroughMonth` cannot precede `billingStartMonth`.
- `paidThroughMonth: null` requires `totalPaid: 0`.
- Non-null paid-through requires `totalPaid > 0`.
- `totalPaid` must be a non-negative safe integer.
- A non-null paid-through month must be payable.
- A non-null paid-through month cannot fall in a pause.
- A non-null paid-through month cannot be at or after closure.
- `closedFromMonth` cannot invalidate already-covered months.

## 6. FeeRate schema

Suggested schema:

```js
const feeRateSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: isSafePositiveInteger,
    },

    effectiveFromMonth: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
      validate: isValidFeeMonth,
    },
  },
  { timestamps: true }
);
```

### FeeRate index

```js
{ effectiveFromMonth: 1 } // unique
```

This index supports both uniqueness and reverse lookup.

### Applicable-rate lookup

For a requested month:

```js
FeeRate.findOne({
  effectiveFromMonth: { $lte: requestedMonth }
})
  .sort({ effectiveFromMonth: -1 })
  .lean();
```

Because canonical `YYYY-MM` strings sort chronologically, this returns the latest rate that had taken effect by the requested month.

For batch calculations, load all potentially relevant rates once:

```js
FeeRate.find({
  effectiveFromMonth: { $lte: viewEndMonth }
})
  .sort({ effectiveFromMonth: 1 })
  .lean();
```

Then walk the months and rate list in memory. This avoids one database query per month.

### Adding a rate

A rate addition:

1. Validates `amount` as a positive safe integer.
2. Validates strict `YYYY-MM`.
3. Normally requires `effectiveFromMonth` to be later than the current `Asia/Kolkata` month.
4. Inserts one immutable FeeRate document.
5. Maps duplicate `effectiveFromMonth` to `409 Conflict`.

It does not:

- Modify the previous rate.
- Use a transaction.
- Recalculate any FeeAccount.
- Change any existing `totalPaid`.
- Retroactively increase prepaid coverage.

### Initial rate

The initial record is finalized as:

```js
{
  amount: 1500,
  effectiveFromMonth: "2026-06"
}
```

`2026-06` is also the earliest permitted `billingStartMonth`. Later rate records are normally future-effective and remain immutable after insertion.

If no applicable FeeRate exists for a payable month, the operation must fail with a domain validation response rather than treating the fee as zero.

## 7. FeePause schema

Suggested schema:

```js
const feePauseSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
      immutable: true,
    },

    startMonth: {
      type: String,
      required: true,
      immutable: true,
      validate: isValidFeeMonth,
    },

    endMonth: {
      type: String,
      default: null,
      validate: nullableFeeMonthValidator,
    },
  },
  { timestamps: true }
);
```

### Derived pause state

```text
endMonth === null → open
endMonth !== null → completed/bounded
```

No stored pause status is necessary.

### FeePause indexes

```js
{ playerId: 1, startMonth: 1 } // unique
{ playerId: 1, startMonth: 1, endMonth: 1 }
```

To enforce at most one open pause per player:

```js
{ playerId: 1 }
```

with:

```js
{
  unique: true,
  partialFilterExpression: { endMonth: null }
}
```

All documents should explicitly store `endMonth`, including null, so the partial-index behavior remains predictable.

### Pause validation

- `endMonth`, when present, must be at or after `startMonth`.
- A new pause must not overlap any bounded pause.
- Only one open pause may exist.
- Pause start cannot fall within already-covered territory.
- A pause cannot begin at or after terminal closure.
- Normal pause creation should be current- or future-effective unless retroactive pause changes are separately approved.

## 8. Model relationships

```text
Player 1 ─── 0..1 FeeAccount
Player 1 ─── 0..N FeePause
FeeRate ─── global chronological rate timeline
```

Only players with:

```js
requestStatus === "Accepted"
```

may receive a FeeAccount.

For newly accepted players, the existing acceptance operation must create the FeeAccount in the same MongoDB transaction. The request supplies the admin-selected `billingStartMonth`; the frontend may default it to the current India month, but the backend validates it independently. The month must be between `2026-06` and the current India month inclusive.

Existing players who were Accepted before Fees Management V1 require a one-time initialization workflow. The admin first lists Accepted players without an account, reviews and selects each player’s billing start, and creates the missing account through the protected initialization endpoint. The unique `playerId` index prevents duplicates.

A later change to the Player’s registration status does not automatically delete financial information.

## 9. Month and financial-year utilities

Create a dedicated month utility rather than coupling fees to Attendance.

Recommended exports:

```js
FEE_FINANCIAL_YEAR_START_MONTH
isValidFeeMonth
compareMonths
addMonths
previousMonth
iterateMonths
getCurrentClubMonth
getFinancialYearRange
getFinancialYearLabel
isMonthInRange
```

### Month ordinal

Convert a canonical month to:

```js
year * 12 + (month - 1)
```

This supports ordering and arithmetic without Date timezone shifts.

### India month boundary

`getCurrentClubMonth(now)` must use:

```js
timeZone: "Asia/Kolkata"
```

A UTC time immediately before and after 18:30 on the final UTC day of a month must be tested because that is midnight in India.

### Financial-year configuration

Use one named backend constant:

```js
const FEE_FINANCIAL_YEAR_START_MONTH = 6;
```

The value `6` must not be duplicated throughout controllers or services.

A financial year beginning in June 2026 is:

```text
2026-06 through 2027-05
```

Recommended API filter:

```text
financialYearStart=2026
```

Recommended returned label:

```text
2026-27
```

A player joining in October has no payable months for June–September. Their account starts from their actual `billingStartMonth`.

## 10. Derived status algorithm

No status is stored in FeeAccount or FeePause.

For an account and requested month:

```text
If closedFromMonth exists and requestedMonth >= closedFromMonth:
    closed
Else if requestedMonth falls in a FeePause:
    paused
Else:
    active
```

A month falls in a pause when:

```text
month >= startMonth
and
(endMonth is null or month <= endMonth)
```

### Current status

The API calculates:

```js
currentStatus = getStatusForMonth(
  account,
  pauses,
  getCurrentClubMonth()
);
```

### Future pause example

```text
Current month: 2026-09
Pause begins: 2026-12
```

Status is:

```text
September: active
October: active
November: active
December onward: paused
```

### Future closure example

```text
Current month: 2026-09
closedFromMonth: 2027-01
```

Status is not immediately closed. It becomes closed in January 2027.

If a pause covers the current month but a closure is scheduled later, current status is paused. Closure takes precedence only from `closedFromMonth` onward.

## 11. Paid-through semantics

`paidThroughMonth` is the last covered payable month, not simply the last calendar month examined.

The invariant is:

> Every payable month from billing start through paid-through is covered; paused months inside that chronological span are excluded.

Example:

```text
Paid through: September 2026
Pause: October–December 2026
Reactivated: January 2027
```

Before January coverage is added:

```text
paidThroughMonth: 2026-09
nextUnpaidPayableMonth: 2027-01
```

After one month is recorded:

```text
paidThroughMonth: 2027-01
```

Paused months are never counted as paid or pending.

## 12. Open-pause behavior

An open pause blocks indefinite future coverage.

Example:

```text
paidThroughMonth: 2026-09
pause.startMonth: 2026-10
pause.endMonth: null
```

Result:

```text
nextUnpaidPayableMonth: null
coverageBlockedReason: "OPEN_PAUSE"
```

The service must not jump over the pause because no reactivation month exists.

After reactivation from January 2027:

```text
pause.startMonth: 2026-10
pause.endMonth: 2026-12
```

The next unpaid payable month becomes:

```text
2027-01
```

A future open pause still permits coverage only for payable months before its start. If the requested number of months would cross the pause boundary, reject the whole operation rather than silently covering fewer months.

## 13. Per-month calculation algorithm

For each month in the requested view:

1. If the month precedes `billingStartMonth`, it is outside the account.
2. If it is at or after `closedFromMonth`, classify as `closed`.
3. Otherwise, if it belongs to a FeePause, classify as `paused`.
4. Otherwise it is payable.
5. Find the latest FeeRate whose start is not after the month.
6. If payable and not after paid-through, classify as `covered`.
7. If payable, after paid-through, and no later than the current month, classify as `pending`.
8. If payable, covered, and after the current month, classify as `futurePrepaid`.
9. If payable, uncovered, and after the current month, classify as `futureUnpaid`; this is informational and not currently outstanding.

Suggested entry:

```json
{
  "month": "2027-01",
  "status": "active",
  "payable": true,
  "coverageState": "pending",
  "scheduledRate": 1500
}
```

For paused and closed months:

```json
{
  "month": "2026-12",
  "status": "paused",
  "payable": false,
  "coverageState": "notApplicable",
  "scheduledRate": null
}
```

## 14. Totals

### Current outstanding

Sum the applicable FeeRate for every pending payable month through the current India month.

```text
currentOutstanding = sum(pending payable month rates)
```

### Recorded paid

```text
recordedPaid = FeeAccount.totalPaid
```

This is a lifetime aggregate.

### Total expected over the account horizon

A useful account-level aggregate is:

```text
recordedPaid + currentOutstanding
```

It preserves the value already recorded for grandfathered prepaid months.

It must not be represented as a reconstructed month-by-month historical payment total.

### Financial-year results

For a selected June–May financial year, the backend can accurately calculate:

- Covered month count.
- Pending month count.
- Paused month count.
- Closed months.
- Outstanding amount within that year.
- Current nominal scheduled rate for each payable month.
- Coverage status for each month.

It cannot reliably allocate lifetime `totalPaid` into individual financial years because payment/coverage segments are intentionally absent.

Therefore, financial-year reports should return:

- Lifetime `totalPaid` separately.
- Financial-year coverage and outstanding figures.
- No claim that a calculated financial-year “amount paid” is historically exact.

## 15. Prepaid rate-change policy

Retain the approved rule:

> A fee-rate change applies only to months that were not already covered when the new rate was created. Previously covered advance months remain covered at the amount already included in `totalPaid`.

When adding a rate:

- Existing accounts are not updated.
- Existing `paidThroughMonth` values are not changed.
- Existing `totalPaid` values are not changed.
- Already-covered months are not charged again.
- New coverage calculates each selected month using the latest applicable rate.

### Reporting limitation

For a covered month, the system can provide:

- That it is covered.
- The current nominal FeeRate timeline entry for that month.
- The lifetime aggregate `totalPaid`.

It cannot always provide the exact rate originally used when that month was covered.

If exact historical monthly paid amounts are later required, the architecture would require immutable coverage segments or payment records, which are excluded from V1.

## 16. Starting a pause

Suggested request:

```json
{
  "startMonth": "2026-12",
  "expectedPaidThroughMonth": "2026-09",
  "expectedVersion": 3
}
```

Algorithm:

1. Validate player ID and request.
2. Load the account and current pause records.
3. Require an existing fee account.
4. Validate strict `YYYY-MM`.
5. Reject a start before billing start.
6. Reject a start inside or before already-covered chronological territory.
7. Reject a pause at or after terminal closure.
8. Reject overlap with bounded pauses.
9. Insert the open pause.
10. Ensure the account concurrency token has not changed.

### Transaction decision

Pause creation affects a FeePause document but also needs to invalidate coverage calculations that may have loaded the previous pause set.

Recommended approach:

- Insert the FeePause and increment FeeAccount `__v` in one short transaction.
- Coverage extension also checks `__v`.
- This prevents coverage from racing through a newly created pause.

The transaction is justified here because two documents participate in one concurrency boundary. No stored status is updated.

The partial unique open-pause index remains the final protection against two simultaneous open pauses.

## 17. Reactivation

Perform the full operation inside one MongoDB transaction. Load both the current FeeAccount and open FeePause using the transaction session before applying the checks below.

Suggested request:

```json
{
  "reactivationMonth": "2027-01",
  "expectedVersion": 4,
  "expectedPauseVersion": 0
}
```

Algorithm:

1. Find the player’s open pause.
2. Require FeeAccount `__v` to match `expectedVersion` and FeePause `__v` to match `expectedPauseVersion`.
3. Recheck `closedFromMonth` inside the transaction and reject when `reactivationMonth >= closedFromMonth`; the closure month is already closed.
4. Require a valid reactivation month after `startMonth`.
5. Calculate:

```text
endMonth = previousMonth(reactivationMonth)
```

6. Conditionally update the open FeePause using its `_id`, `endMonth: null`, and expected `__v`, then increment the FeePause version.
7. Conditionally increment FeeAccount `__v` using the expected account version and loaded closure state.
8. Abort the transaction and return `409` if either conditional update does not match.
9. Return the updated pause and FeeAccount so the caller receives the new concurrency values.

No FeeAccount status is stored. The FeeAccount version update exists solely to coordinate reactivation with simultaneous coverage, pause, correction, or terminal-closure operations and prevent success from a stale account snapshot.

The earliest ordinary reactivation is the month after the pause begins, ensuring at least one full paused month. Same-month cancellation remains a business question.

## 18. Closure

Suggested request:

```json
{
  "closedFromMonth": "2027-01",
  "expectedPaidThroughMonth": "2026-09",
  "expectedVersion": 4,
  "confirmed": true
}
```

Algorithm:

1. Require admin authorization and confirmation.
2. Validate the closure month.
3. Reject closure before billing start.
4. Reject closure inside or before already-covered chronological territory.
5. Reject closure that conflicts with a future prepaid month.
6. Validate its interaction with existing pause periods.
7. Atomically update FeeAccount using expected paid-through and `__v`.
8. Increment `__v`.
9. Return `409` on stale state.

Because closure modifies only FeeAccount, it does not require a transaction.

A future closure does not immediately change current status.

### Reopening

Terminal closure remains recommended for V1.

Clearing `closedFromMonth` would make months during the former closure payable again. Supporting repeated close/reopen cycles safely would require stored closure periods, which are not part of the approved three-model shape.

## 19. Coverage-extension algorithm

Suggested request:

```json
{
  "expectedPaidThroughMonth": "2026-08",
  "expectedVersion": 4,
  "numberOfMonths": 3
}
```

For a new account:

```json
{
  "expectedPaidThroughMonth": null,
  "expectedVersion": 0,
  "numberOfMonths": 1
}
```

Algorithm:

1. Validate positive integer `numberOfMonths`.
2. Require `numberOfMonths` to be between 1 and 12 inclusive. The request limit counts selected payable months; bounded paused months are skipped and do not consume it.
3. Load the latest FeeAccount.
4. Confirm the Player is still Accepted.
5. Confirm expected paid-through and `__v`.
6. Load all relevant FeePause and FeeRate records in sorted order.
7. Begin at billing start when paid-through is null; otherwise begin with the next calendar month.
8. For each candidate:
   - Stop at terminal closure.
   - Skip bounded paused months.
   - Stop at an open-ended pause.
   - Treat other months as payable.
9. Select exactly the requested number of payable months.
10. Reject the request if closure or an open pause prevents selecting the full amount.
11. Find the latest applicable FeeRate for every selected payable month.
12. Count all resulting future prepaid payable months strictly after the current `Asia/Kolkata` month, including existing future coverage and the selected months. Exclude bounded paused months from this count.
13. Reject with `422 FUTURE_PREPAID_LIMIT_EXCEEDED` if the resulting account would contain more than 12 future prepaid payable months. Overdue and current payable months do not consume this allowance.
14. Calculate the total on the backend.
15. Atomically update FeeAccount only where:
   - paid-through matches,
   - `__v` matches,
   - closure state matches the loaded state.
16. Set paid-through to the last selected payable month.
17. Increment `totalPaid` by the backend-calculated amount.
18. Increment `__v`.
19. Return `409` if no document matched.
20. Return selected months, skipped bounded pauses, calculated amount, and refreshed summary.

The frontend never supplies an authoritative amount.

### Example with bounded pause

```text
Paid through: September
Bounded pause: October–December
Requested payable months: 2
```

Selected months:

```text
January and February
```

### Example with open pause

```text
Paid through: September
Open pause: October onward
Requested payable months: 1
```

Result:

```http
422 Unprocessable Entity
```

```json
{
  "success": false,
  "code": "COVERAGE_BLOCKED_BY_OPEN_PAUSE",
  "message": "Reactivate the account from an explicit month before recording further coverage."
}
```

## 20. Coverage correction

Correction is a trusted administrative override.

Suggested request:

```json
{
  "expectedPaidThroughMonth": "2026-11",
  "expectedVersion": 7,
  "correctedPaidThroughMonth": "2026-09",
  "correctedTotalPaid": 6000,
  "confirmed": true
}
```

The endpoint validates:

- Admin authorization.
- Explicit confirmation.
- Expected paid-through and `__v`.
- Strict month format.
- Corrected month is not before billing start.
- Corrected month is payable.
- Corrected month is not paused.
- Corrected month is not closed.
- Total is a non-negative safe integer.
- Null paid-through requires total zero.
- Non-null paid-through requires a positive total.

It does not claim to prove that `correctedTotalPaid` is historically exact.

After prepaid coverage, rate changes, or earlier manual corrections, the backend lacks the records needed to reconstruct the original month-level amounts. The administrator is explicitly overriding the aggregate.

The operation must not:

- Recalculate the corrected total automatically.
- Change FeeRate records.
- Change FeePause records.
- Store a correction-history document.

The response should identify the override clearly:

```json
{
  "success": true,
  "message": "Fee coverage position corrected by administrative override.",
  "data": {
    "overrideApplied": true,
    "account": {}
  }
}
```

## 21. Concurrency strategy

### Coverage and correction

Use optimistic concurrency with:

```text
expectedPaidThroughMonth
expectedVersion (__v)
```

The atomic update filter should include both.

A duplicate submission or second administrator using stale data receives `409 Conflict`.

### Closure

Closure is an atomic FeeAccount update using the same concurrency fields.

### Fee-rate addition

Adding a rate is one insert:

- No transaction.
- Unique `effectiveFromMonth` prevents duplicate start months.
- Existing FeeAccounts and totals are untouched.

### Pause creation

Use a short transaction only to:

- Insert the open FeePause.
- Increment the associated FeeAccount version.

This coordinates pause scheduling with concurrent coverage extension.

### Reactivation

Use a short MongoDB transaction to conditionally bound the open FeePause and increment FeeAccount `__v`. The request supplies both `expectedPauseVersion` and FeeAccount `expectedVersion`. This makes reactivation conflict with simultaneous closure or coverage, and either both documents update or neither does.

### Concurrent rate creation and coverage

A fee-extension request uses the rate timeline loaded by that request. Because rates are future-effective and immutable, this race is narrow, but strict global ordering between a simultaneous rate insertion and coverage extension cannot be guaranteed without a shared revision/lock or broader transaction design.

Operationally, future rate creation should be serialized with fee-entry administration. If stronger multi-instance serialization becomes mandatory, it requires an additional coordination mechanism and should be approved separately.

## 22. Proposed admin routes

Every route uses:

```js
verifyJWT
authorizeRoles("admin")
```

| Method | Route | Responsibility |
|---|---|---|
| `POST` | `/admin/fees/accounts` | Initialize a missing account for a legacy Accepted player |
| `GET` | `/admin/fees/uninitialized-players` | List Accepted players without a FeeAccount for one-time initialization |
| `GET` | `/admin/fees/accounts` | Search/list accounts |
| `GET` | `/admin/fees/overview` | Current or financial-year overview |
| `GET` | `/admin/fees/accounts/:playerId` | Calculated player coverage |
| `POST` | `/admin/fees/accounts/:playerId/coverage` | Record complete payable months |
| `PATCH` | `/admin/fees/accounts/:playerId/correction` | Trusted coverage override |
| `POST` | `/admin/fees/accounts/:playerId/pause` | Schedule/start open pause |
| `POST` | `/admin/fees/accounts/:playerId/reactivate` | Bound the open pause |
| `POST` | `/admin/fees/accounts/:playerId/close` | Schedule terminal closure |
| `GET` | `/admin/fees/rates` | View chronological rates |
| `POST` | `/admin/fees/rates` | Add immutable future rate |

Recommended financial-year query:

```text
GET /admin/fees/overview?financialYearStart=2026
```

This represents June 2026 through May 2027.

### Acceptance integration

The existing route remains:

```http
PATCH /admin/acceptPlayer/:playerId
```

Its request must include:

```json
{
  "billingStartMonth": "2026-09"
}
```

The frontend may preselect the current India month, but the backend requires and validates the submitted value. In one MongoDB transaction, the controller/service must:

1. Confirm the player exists and is eligible to be accepted.
2. Validate billing start between `2026-06` and the current India month.
3. Update the Player to `Accepted`.
4. Create the player’s unique FeeAccount with null paid-through and zero total.
5. Commit both changes together.

If FeeAccount creation fails, player acceptance must roll back. If acceptance fails, no FeeAccount may remain. Duplicate FeeAccounts return `409`. The acceptance email is sent only after the database transaction commits, and an email failure does not roll back the accepted player/account state.

## 23. Player route

```http
GET /player/fees
```

Protection:

```js
verifyJWT
authorizeRoles("player")
```

Requirements:

- Use only `req.user.id`.
- Do not accept a player ID.
- Return only the authenticated player’s FeeAccount.
- Include calculated current status.
- Include covered, pending, paused, and future prepaid months.
- Include lifetime `totalPaid`.
- Include current outstanding.
- Support a validated June–May financial-year filter if needed.
- Return no administrator-only concurrency controls unless the frontend requires read-version display.

## 24. Controller responsibilities

### Admin controller

Suggested functions:

```js
initializeFeeAccount
listUninitializedAcceptedPlayers
listFeeAccounts
getFeeOverview
getAdminFeeAccount
extendFeeCoverage
correctFeeCoverage
pauseFeeAccount
reactivateFeeAccount
closeFeeAccount
listFeeRates
addFutureFeeRate
```

Controllers should:

- Validate transport-level input.
- Delegate calculations and database orchestration.
- Map domain errors to HTTP responses.
- Return stable DTOs.
- Never calculate authoritative coverage totals themselves.

### Player controller

```js
getOwnFeeAccount
```

It derives ownership from JWT and uses the same calculation service as the admin detail endpoint.

## 25. Service responsibilities

### `fee-calculation-service.js`

- Derive status for any month.
- Classify payable, paused, and closed months.
- Find applicable rates from a sorted timeline.
- Calculate financial-year ranges.
- Find next unpaid payable month.
- Select the next N payable months.
- Block at open pause or closure.
- Calculate outstanding and coverage summaries.

### `fee-account-service.js`

- Initialize legacy accounts for Accepted players.
- Create a FeeAccount atomically as part of new-player acceptance.
- List Accepted players who still lack a FeeAccount.
- Verify Accepted-player eligibility.
- Fetch and batch-compose account views.
- Perform coverage CAS updates.
- Perform trusted correction overrides.
- Schedule closure.
- Coordinate pause creation.
- Normalize duplicate and conflict errors.

### `fee-rate-service.js`

- Insert the initial or future rate.
- Validate future-effective policy.
- Retrieve sorted rate timelines.
- Map duplicate start month to `409`.

## 26. Response examples

### Future scheduled pause

Current month: September 2026.

```json
{
  "account": {
    "billingStartMonth": "2026-06",
    "paidThroughMonth": "2026-09",
    "totalPaid": 6000,
    "closedFromMonth": null
  },
  "currentStatus": "active",
  "pauses": [
    {
      "startMonth": "2026-12",
      "endMonth": null,
      "derivedStatus": "open"
    }
  ],
  "nextUnpaidPayableMonth": "2026-10"
}
```

Coverage may extend through October and November but cannot cross December until reactivation is recorded.

### Future closure

```json
{
  "account": {
    "closedFromMonth": "2027-01"
  },
  "asOfMonth": "2026-09",
  "currentStatus": "active",
  "statusAtClosureMonth": "closed"
}
```

### Rate response

```json
{
  "success": true,
  "data": [
    {
      "amount": 1500,
      "effectiveFromMonth": "2026-10"
    },
    {
      "amount": 1700,
      "effectiveFromMonth": "2027-06"
    }
  ]
}
```

No derived `effectiveToMonth` needs to be stored. The API may optionally calculate a display-only “applies until” value from the next record.

## 27. HTTP status conventions

| Status | Use |
|---:|---|
| `200` | Successful reads, updates, corrections, lifecycle changes |
| `201` | FeeAccount, FeeRate, or FeePause created |
| `400` | Invalid format or malformed request |
| `401` | Missing or invalid authentication |
| `403` | Wrong role |
| `404` | Player, account, pause, or rate coverage not found |
| `409` | Duplicate account/rate/open pause or stale concurrency token |
| `422` | Validly formatted but logically impossible fee operation |
| `500` | Unexpected server failure |

Suggested stable error codes include:

```text
FEE_ACCOUNT_CONFLICT
FEE_ACCOUNT_ALREADY_EXISTS
FEE_RATE_ALREADY_EXISTS
FEE_RATE_NOT_FOUND
OPEN_PAUSE_ALREADY_EXISTS
COVERAGE_BLOCKED_BY_OPEN_PAUSE
COVERAGE_BLOCKED_BY_CLOSURE
INVALID_COVERAGE_POSITION
```

## 28. Revised test strategy

Continue using Node’s built-in test runner.

### Month and financial-year tests

- Valid and invalid `YYYY-MM`.
- Month ordering.
- Forward/backward arithmetic.
- December-to-January transitions.
- June–May financial-year ranges.
- Player joining after June excludes earlier months.
- India month boundary at 18:30 UTC.

### FeeRate tests

- Latest `effectiveFromMonth <= requestedMonth`.
- Lookup before first rate returns no rate.
- Multiple chronological rate changes.
- Duplicate effective start rejected.
- Historical/effective records treated as immutable.
- Rate insertion does not alter previous rates.
- Rate insertion does not modify `totalPaid`.
- Coverage across a rate boundary.
- Twelve months at ₹1,500 totals ₹18,000.

### FeeAccount tests

- Player acceptance and FeeAccount creation commit together.
- FeeAccount failure rolls back player acceptance.
- Player-acceptance failure leaves no FeeAccount.
- Acceptance rejects missing or invalid billing start.
- Accepted-player legacy initialization.
- Listing Accepted players without accounts.
- Pending/Rejected-player rejection.
- Duplicate account prevention.
- Empty account uses null paid-through and zero total.
- Null paid-through with positive total rejected.
- Non-null paid-through with zero total rejected.
- Billing begins from actual joining month.

### Derived-status tests

- Active month.
- Month inside bounded pause.
- Month inside open pause.
- Month before a future pause remains active.
- Future pause does not change current status.
- Month at and after closure is closed.
- Future closure does not change current status.
- Closure takes precedence over pause from closure month onward.
- No stored status is required.

### Coverage tests

- One complete month.
- Multiple complete months.
- Yearly 12-month coverage.
- Per-request and resulting future-prepaid-limit rejection.
- Existing future prepaid months count toward the 12-month allowance.
- Overdue and current months do not consume the future allowance.
- Rate-boundary calculation.
- Later rate insertion preserves prepaid total.
- Bounded paused months are skipped.
- Future open pause allows coverage before its start.
- Open pause blocks coverage beyond its start.
- Open pause currently in effect has no next payable month.
- Coverage resumes only after explicit reactivation.
- Closure blocks coverage from its effective month.
- Stale paid-through conflict.
- Stale `__v` conflict.
- Duplicate submission advances only once.

### Pause tests

- Start an immediate pause.
- Schedule a future pause.
- Reject overlap.
- Reject pause inside covered territory.
- Reject second open pause.
- Partial unique-index duplicate behavior.
- Reactivation sets `endMonth` to the preceding month.
- Reactivation updates FeePause and FeeAccount concurrency versions in one transaction.
- Reactivation at or after terminal closure is rejected.
- Stale account- or pause-version conflict.

### Correction tests

- Admin-only.
- Confirmation required.
- Valid trusted override.
- Invalid corrected month.
- Corrected month before billing start.
- Corrected month in pause.
- Corrected month after closure.
- Negative/non-integer/unsafe total.
- Null paid-through requires zero.
- Non-null paid-through requires positive total.
- Backend does not attempt to reconstruct or overwrite the supplied trusted total.
- FeeRate and FeePause remain unchanged.
- Stale account conflict.

### Authorization tests

- Unauthenticated admin request returns `401`.
- Player using admin route returns `403`.
- Unauthenticated player request returns `401`.
- Player endpoint queries only `req.user.id`.
- Supplied player identifiers cannot override authenticated ownership.

Real unique-index and transaction behavior should be verified against an isolated MongoDB test environment in addition to mocked unit/controller tests.

## 29. Files likely to be created or modified

### Likely new files

```text
Backend/models/fee-account-model.js
Backend/models/fee-rate-model.js
Backend/models/fee-pause-model.js

Backend/controllers/admin-fee-controller.js
Backend/controllers/player-fee-controller.js

Backend/services/fee-calculation-service.js
Backend/services/fee-account-service.js
Backend/services/fee-rate-service.js

Backend/routes/admin-fee-router.js
Backend/routes/player-fee-router.js

Backend/utils/fee-validation.js
Backend/utils/fee-month.js
Backend/config/fee-config.js

Backend/tests/fee-month.test.js
Backend/tests/fee-models.test.js
Backend/tests/fee-rate-service.test.js
Backend/tests/fee-calculation.test.js
Backend/tests/fee-account-service.test.js
Backend/tests/fee-authorization.test.js
```

### Likely modified file

```text
Backend/index.js
Backend/controllers/admin-controller.js
Backend/routes/admin-router.js
```

Suggested mounting:

```js
app.use("/admin/fees", adminFeeRouter);
app.use("/player/fees", playerFeeRouter);
```

No package change is currently expected.

## 30. Risks and accepted limitations

- Exact historical per-month paid amounts cannot be reconstructed.
- Lifetime `totalPaid` cannot be accurately allocated to individual June–May financial years.
- `updatedAt` is not a payment timestamp.
- Corrections are trusted overrides without an audit trail.
- Covered months can display the current nominal rate but not always the original paid rate.
- Simultaneous rate creation and coverage recording require an operational serialization policy if strict commit ordering is required.
- Bounded-pause overlap depends partly on service validation.
- Pause creation requires a short transaction if FeeAccount version invalidation is retained.
- Atomic player acceptance plus FeeAccount creation requires MongoDB transaction support.
- Reopening a closed account is unsafe without preserving closure periods.
- Multi-year calculated month arrays may eventually need response range limits.
- Fee records must not be silently removed if a Player’s registration status later changes.
- The configured MongoDB topology has not yet been verified as transaction-capable; no environment values were inspected.

## 31. Final decisions and remaining technical blocker

The V1 business decisions needed to begin backend implementation are finalized:

- Initial rate: ₹1,500 from June 2026.
- Financial year: June through May.
- Maximum advance: 12 payable months.
- New-player FeeAccount creation: atomic with acceptance.
- Legacy Accepted players: one-time reviewed initialization.
- Billing start: admin-selected, from June 2026 through the current India month.
- Pauses: current/future only, at least one complete month, and never inside covered territory.
- Closure: terminal.

The remaining technical blocker is confirmation that the configured MongoDB deployment supports transactions. This is required to guarantee that Player acceptance and FeeAccount creation succeed or fail together. It is also recommended for atomically creating a pause while incrementing the FeeAccount concurrency version.

The application’s environment values must not be inspected or exposed. During implementation readiness checks, transaction capability should instead be verified safely against the configured database topology or confirmed from deployment documentation. MongoDB Atlas replica sets and properly configured replica sets support transactions; a standalone MongoDB server does not satisfy this atomicity requirement and would need to be converted to a replica set before release.

The following are accepted V1 limitations rather than implementation blockers:

- Financial-year paid totals cannot be reconstructed exactly from lifetime `totalPaid`.
- Covered-month historical rate allocations are unavailable.
- Rate creation and simultaneous coverage entry should be operationally serialized unless stronger coordination is separately approved.
- A later Player registration-status change does not silently delete or rewrite the FeeAccount; closure remains an explicit fee operation.

## 32. Implementation sequence after approval

### Requirements finalization

1. Confirm MongoDB transaction support without exposing environment values.
2. Refresh and confirm the approved Git base.
3. Confirm the dedicated fees branch is based on that approved commit.

### Models and validation utilities

1. Add the named financial-year configuration constant.
2. Implement pure month utilities.
3. Implement integer and request validators.
4. Add the three schemas and indexes.
5. Add schema/unit tests.

### Calculation services

1. Implement rate lookup.
2. Implement derived status.
3. Implement month classification.
4. Implement next-payable selection.
5. Implement June–May summaries.
6. Implement coverage and outstanding calculations.
7. Test rate, pause, closure, and prepayment boundaries.

### Admin controllers and routes

1. Integrate atomic FeeAccount creation into player acceptance.
2. Add the legacy uninitialized-player list and reviewed initialization endpoint.
3. Add account list/detail and overview.
4. Add FeeRate list/create.
5. Add coverage extension with CAS.
6. Add trusted correction override.
7. Add pause scheduling and reactivation.
8. Add terminal closure.
9. Add admin authorization and transaction tests.

### Player controller and route

1. Add ownership-bound `GET /player/fees`.
2. Reuse the calculation DTO.
3. Add authentication and ownership-isolation tests.

### Backend tests

1. Run all fee unit/controller tests.
2. Run the existing full suite.
3. Verify indexes and transactions against an isolated MongoDB environment.
4. Test India and June–May boundaries explicitly.

### Frontend integration later

1. Admin account/rate/coverage UI.
2. Pause, reactivation, closure, and trusted-correction confirmations.
3. Conflict refresh behavior.
4. Financial-year filters.
5. Read-only player fee view.
6. No frontend-authoritative amount calculations.

## Approval checkpoint

The business rules are finalized, MongoDB transaction support has been verified without exposing credentials, and backend implementation was explicitly approved on 2026-09-08. Commit, push, merge, and deployment remain separately gated.
