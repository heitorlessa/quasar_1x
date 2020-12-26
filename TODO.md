# TODO

- [x] Recreate Profile isAuthenticated getter
- [x] Update `&&` to nullish coalescing `response.settings?.undefinedValue ?? 'some other default'`
- [x] Recreate FlightSelection
- [x] Recreate Booking
- [x] Recreate Loyalty
- [x] Recreate Profile
- [x] Update Notification actions to red
- [x] Sync Models
- [x] Recreate Auth
  - [x] Fix Sign-out Profile CSS
  - [x] Fix Authenticator CSS style
  - [x] Activate Route Guard
  - [x] Sign-out event should redirect to Authenticator page
  - [x] Mutate profile (set user) once signed-in
- [x] Revisit all Errors
- [x] Booking deduplication
- [x] Replace `src/views/` -> `src/pages/` doc strings
- [ ] Create new toolbar
  - [x] Create first sketch
  - [x] Apply new toolbar in Flight Results
  - [x] Apply new toolbar in Flight Selection
  - [x] Allow flight filter during results only
  - [x] Use Fields with labels on top
  - [x] Create Refine button
  - [x] Apply margin left to row
  - [x] Create dropdown with sorting buttons
    - [x] Lowest price
    - [x] Highest price
    - [x] Earliest Departure time
    - [x] Latest Departure time
    - [x] Highlighted current sorting to guide next selection
  - [x] Create Dialog for Filter
    - [x] Create range component time for Departure
    - [x] Create range component time for Arrival
    - [x] Match ranges with earliest/latest departure/arrival available
  - [x] Bring sticky/top bar to Dialog to reset filters/sorting
  - [x] Give breathing Refine toolbar section
  - [x] Fix time range filter
    - [x] Use price dropdown/select
    - [x] Use time only for departure and arrival window
    - [x] Remove icon avatar UI in favour of drop shadow only
    - [x] Remove now redundant getters
    - [x] Adjust time selection for 12 hours (info overhead)
    - [x] Add now button (hour)
    - [x] Add a close button
  - [ ] Create a bare minimum Filter component to reduce clutter in Toolbar
  - [ ] Create Reset filter functionality
  - [ ] Apply Filters
    - [ ] Create minimum/maximum price as getters in catalog
      - [ ] create mutations for filtering and ordering
      - [ ] move `filteredFlights` to store
      - [ ] add reset button to filter/sorted
      - [ ] use `actions` within Toolbar component to compartmentalize it
      - [ ] Highlight when Filters are applied
  - [ ] Apply Sorts
    - [ ] Lowest price
    - [ ] Highest price
    - [ ] Earliest Departure time
    - [ ] Latest Departure time
  - [ ] Bring search autocomplete (From, To)
  - [ ] Correct date format model (q-date)
  - [ ] Move Toolbar Dialog to own component
- [ ] Sync store modules
- [x] Bring Amplify
- [ ] Move sorting/filter outside views (Vue warning) -- revisit sorting/filtering location (model? mutation?)
- [ ] Convert into PWA
- [ ] Consider using `Logger`


**Outside the scope**

- [ ] PR for Amplify Vue docs on Auth standard types
- [ ] PR for Quasar boot
- [ ] PR for Amplify Hub docs on the new 'UI Auth' channel

Breaking changes

* Flight card
* Item list
* Stylus -> SASS
* Typography classes
* Notifications
* Modal -> Dialog
* Timeline
* Upgrade
* Amplify Authenticator



 Mask: hh[h and ]mm[ minutes (]A) 
