# TableReserve Bot — Bot specification

**Archetype:** booking

**Voice:** professional and friendly — write every user-facing message, button label, error, and empty state in this voice.

A Telegram bot for restaurant table bookings with real-time availability, guest confirmations, rescheduling/cancellation via inline buttons, and an owner dashboard for managing bookings and tracking no-shows. Features include automated reminders, capacity enforcement, and conflict-free scheduling.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- restaurant guests
- restaurant owner/manager

## Success criteria

- Zero double-bookings through real-time capacity checks
- 100% accurate reminder delivery based on configured lead time
- Owner dashboard shows today's remaining capacity at a glance
- Guests can reschedule/cancel via inline buttons without re-entering details

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu with booking options and policy info
- **Book Table** (button, actor: user, callback: booking:start) — Initiate booking flow with date/time selection
  - inputs: date, time slot, party size
  - outputs: booking confirmation with code
- **/owner_setup** (command, actor: owner, command: /owner_setup) — Configure restaurant settings and table inventory

## Flows

### Guest Booking Flow
_Trigger:_ /start or 'Book Table' button

1. Show available dates
2. Select time slot with available capacity
3. Choose party size
4. Collect optional guest info
5. Confirm booking with code and inline actions

_Data touched:_ booking, restaurant profile, tables

### Owner Dashboard Flow
_Trigger:_ /owner_setup or 'View Bookings' button

1. Display today's capacity summary
2. List upcoming bookings with quick actions
3. Handle no-show marking

_Data touched:_ restaurant profile, bookings

### Reschedule Flow
_Trigger:_ Reschedule button from booking confirmation

1. Show available dates for same party size
2. Select new time slot
3. Update booking with new details

_Data touched:_ booking, restaurant profile, tables

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **restaurant_profile** _(retention: persistent)_ — Restaurant configuration including time zone, opening hours, seating duration, and reminder lead time
  - fields: name, time_zone, opening_hours, seating_duration, reminder_lead_time
- **tables** _(retention: persistent)_ — Inventory of tables with capacity and count
  - fields: table_id, capacity, count
- **booking** _(retention: persistent)_ — Confirmed/cancelled/rescheduled table reservations
  - fields: guest_name, phone, party_size, date, time_slot, table_ids, booking_code, status
- **guest_session** _(retention: session)_ — Ephemeral state for in-progress bookings
  - fields: current_step, temp_data

## Integrations

- **Telegram** (required) — Bot API messaging for guest interactions and owner notifications
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- /owner_setup command for configuration
- Dashboard commands to view bookings and mark no-shows
- Configurable reminder lead time and seating duration

## Notifications

- Automated guest reminders based on configured lead time
- Owner notifications for new bookings and no-shows
- Inline button updates for reschedule/cancel actions

## Permissions & privacy

- Guest contact info stored privately and only accessible to restaurant owner
- Booking data encrypted at rest
- No third-party data sharing

## Edge cases

- Concurrent booking attempts handled with real-time availability checks
- Invalid date/time inputs constrained to restaurant hours
- Party size exceeding available capacity shown with alternatives

## Required tests

- End-to-end booking flow with conflict resolution
- Owner dashboard shows accurate remaining capacity
- Reminder delivery at configured lead time

## Assumptions

- Default seating duration is 90 minutes
- Owner receives notifications in private Telegram chat
- Guest phone is optional but recommended for reminders
