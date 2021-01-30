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
- [x] Create new toolbar
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
  - [x] Give breathing room for Refine toolbar section
  - [x] Fix time range filter
    - [x] Use price dropdown/select
    - [x] Use time only for departure and arrival window
    - [x] Remove icon avatar UI in favour of drop shadow only
    - [x] Remove now redundant getters
    - [x] Adjust time selection for 12 hours (info overhead)
    - [x] Add now button (hour)
    - [x] Add a close button
  - [x] Create a bare minimum Filter component to reduce clutter in Toolbar
    - [x] Create FlightToolbarFilters component
    - [x] Create toggle method and link reference
    - [x] Emit event from FlightToolbarFilters to FlightToolbar parent component
    - [x] Register FlightToolbarFilters component
    - [x] Listen to `apply` event from FlightToolbarFilters component
    - [x] Create ISO 8601 datetime object in UTC from time filters and current date displayed
  - [x] Create Reset filter functionality
  - [x] Apply Sorts
    - [x] Lowest price
    - [x] Highest price
    - [x] Earliest Departure time
    - [x] Latest Departure time
    - [x] Create action for sorting 
    - [x] Create mutation for sorting 
    - [x] Replace shared sorter mixing with plain functions
    - [x] Sort `fetchFlights` action results by earliest departure
    - [x] Remove filter and sorter mixins
    - [x] Clean up FlightResults methods, mixins, data, and template
  - [x] Bring search autocomplete (From, To)
    - [x] Fix autosuggestion position
    - [x] Use long airport name as label
    - [x] Change icon for currently selected from auto-suggested list
    - [x] Pair Search and Toolbar autosuggestion style for consistency
  - [x] Make autocomplete and fuzzy searching reusable
    - [x] Create mixin
    - [x] bring: `parseAirports` fn, `airportList`, `suggestionList`, `fuzzySearchFilter`
    - [x] Update `FlightToolbar` and `Search`
  - [x] Correct date format model (q-date)
  - [x] Create visible cue that toolbar fields can be edited
- [x] Fix flight card component
  - [x] Remove long airport name
  - [x] Baseline items
  - [x] Use Euro sign for price
  - [x] Fix ticket price contrast
  - [x] Fix max width
  - [x] Fix min margin
  - [x] Remove rounded corners
  - [x] Correct contrast 
  - [x] Invert drop shadow
  - [x] Ensure booking style has flight timings
  - [x] Feature card when hovered
- [x] Fix Flight selection wording (e.g. Agree and Pay Now -> Book Flight)
  - [x] Fix Pre-authorization wording when processing payment
- [x] Fix booking card
  - [x] Fix booking dialog header info
  - [x] Fix booking dialog width
  - [x] Create header for quick info lookup
  - [x] Bring flight no data (prop and header)
  - [x] Convert mounted hook into computed properties
  - [x] Remove unused `hideCard` method in favour of v-close directive
- [x] Fix search page
  - [x] Emphasize each field
  - [x] Move any distraction to the far right (e.g. icons)
  - [x] Group departure and arrival separately from outbound date
  - [x] Give extra room for future fields (e.g. return date, class, etc.)
  - [x] Provide mechanism to swap directions (e.g. from<->to)
  - [x] Fix keyboard shortcut directions
  - [x] Fix autosuggestion not being picked up with `enter` key
  - [x] Show `no results` if airport isn't found
  - [x] Disable past search dates
  - [x] Add today's date as initial value for outbound field
- [x] Fix broken swap destination in Search page
  - [x] Replicate in codesandbox before opening issue in Quasar
  - [x] Remove emit-value and use object instead to correct reactivity
- [x] Update search when toolbar is updated
  - [x] Remove FlightToolbar props in favour of data
  - [x] Ensures browser history aligns with customer intention
    - [x] Customers should be able to use `back` button
    - [x] If flight fetch fails for any reason, a page refresh should lead to the intended behaviour too
  - [x] Update FlightResults to reflect new FlightToolbar behaviour
- [ ] Replace mock console.log w/ an actual `Logger`
- [ ] Sync store modules

**Non-workshop version**

- [ ] Apply Filters - Non-workshop version
  - [ ] Refactor fetchFlights to use additional filters
  - [ ] Create a separate function to build Filters
  - [x] Test date range between query
  - [ ] Filter flights with dynamic dep/arr and price range altogether
  - [ ] Highlight when Filters are applied
- [ ] Convert into PWA


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
* Amplify Authenticator
* Autosuggestion keyboard navigation and auto-selection
* QSelect labels
* Fuse fuzzy search props and behaviour

## Query between dates

```graphql
mutation flight1 {
  __typename
}

query fetchFlights {
  getFlightBySchedule(
      departureAirportCode: "LGW",
      arrivalAirportCodeDepartureDate: { 
          beginsWith: {
              arrivalAirportCode: "MAD",
              departureDate: "2020-02-06"
          }
      },
      filter: {
          departureDate: {
              between: ["2020-02-06T06:00:00+0000", "2020-02-06T11:00:00+0000"]
          }
      }
  ) 

  {
    nextToken
    items {
      id
      departureDate
    }
  }
}
```

```javascript
const flightFilter = {
    departureDate: {
      between: ['2020-02-06T08:00', '2020-02-06T10:45']
    },
    arrivalDate: {
      between: ['2020-02-06T12:00', '2020-02-06T14:45']
    },
    departureAirportCode: {
      eq: 'LGW'
    },
    arrivalAirportCode: {
      eq: 'MAD'
    }
}
```
