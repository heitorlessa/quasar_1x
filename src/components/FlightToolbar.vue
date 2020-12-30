<template>
  <div class="bg-grey-2">
    <div
      class="flight__toolbar container row text-left justify-around items-baseline text-subtitle1"
    >
      <div class="flight__filters--departure col">
        <q-select
          v-model="departure"
          class="search__options--input flight__departure--toolbar no-padding"
          :options="options"
          label="From"
          borderless
          dense
          use-input
          item-aligned
          hide-selected
          hide-dropdown-icon
          hide-hint
          fill-input
          hide-bottom-space
          input-class="search__options--content"
          :disable="this.$router.currentRoute.name != 'searchResults'"
        />
      </div>
      <div class="flight__filters--arrival col">
        <q-select
          v-model="arrival"
          class="search__options--input flight__arrival--toolbar no-padding"
          label="To"
          borderless
          dense
          :options="options"
          use-input
          item-aligned
          hide-selected
          hide-dropdown-icon
          hide-hint
          fill-input
          hide-bottom-space
          input-class="search__options--content"
          :disable="this.$router.currentRoute.name != 'searchResults'"
        />
      </div>
      <div class="flight__filters--date col-4">
        <q-field
          class="text-bold flight__departure--date cursor-pointer"
          borderless
          label="Date"
          stack-label
          hide-bottom-space
          :disable="this.$router.currentRoute.name != 'searchResults'"
        >
          <template v-slot:control>
            <q-popup-proxy ref="qDateProxy">
              <div>
                <q-date
                  v-model="date"
                  mask="dddd, MMM D, YYYY"
                  today-btn
                  @input="() => $refs.qDateProxy.hide()"
                />
              </div>
            </q-popup-proxy>
            <span class="text-primary text-bold">{{ shortDate }}</span>
          </template>
        </q-field>
      </div>
      <div class="flight__filters--filter">
        <q-field
          borderless
          label="Refine"
          stack-label
          hide-bottom-space
          :disable="this.$router.currentRoute.name != 'searchResults'"
        >
          <template v-slot:control>
            <div>
              <q-btn
                class="text-bold"
                dense
                flat
                text-color="primary"
                size="0.75rem"
                label="Filter"
                padding="0"
                @click="toggleFilters"
              >
              </q-btn>
              <span> | </span>
              <q-btn-dropdown
                class="text-bold"
                flat
                text-color="primary"
                size="0.75rem"
                label="Sort"
                padding="0"
                auto-close
              >
                <q-list separator>
                  <q-item
                    clickable
                    @click="sortResults(SortPreference.LowestPrice)"
                    :active="sortSelection == SortPreference.LowestPrice"
                    active-class="bg-cyan-2 text-dark"
                  >
                    <q-item-section>
                      <q-item-label class="text-subtitle1"
                        >Lowest price</q-item-label
                      >
                      <q-item-label caption
                        >Lowest to highest ticket price</q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    @click="sortResults(SortPreference.EarliestDeparture)"
                    :active="sortSelection == SortPreference.EarliestDeparture"
                    active-class="bg-cyan-2 text-dark"
                  >
                    <q-item-section>
                      <q-item-label class="text-subtitle1"
                        >Earliest departure</q-item-label
                      >
                      <q-item-label caption
                        >Earliest to latest departure time
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    @click="sortResults(SortPreference.HighestPrice)"
                    :active="sortSelection == SortPreference.HighestPrice"
                    active-class="bg-cyan-2 text-dark"
                  >
                    <q-item-section>
                      <q-item-label class="text-subtitle1"
                        >Highest price</q-item-label
                      >
                      <q-item-label caption
                        >Highest to lowest ticket price</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    @click="sortResults(SortPreference.LatestDeparture)"
                    :active="sortSelection == SortPreference.LatestDeparture"
                    active-class="bg-cyan-2 text-dark"
                  >
                    <q-item-section>
                      <q-item-label class="text-subtitle1"
                        >Latest departure</q-item-label
                      >
                      <q-item-label caption
                        >Latest to earliest departure time</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <flight-toolbar-filters ref="filters" @apply="applyFilters" />
            </div>
          </template>
        </q-field>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
import { mapGetters } from 'vuex'
import FlightToolbarFilters from './FlightToolbarFilters.vue'

const SortPreference = Object.freeze({
  LowestPrice: 'lowestPrice',
  HighestPrice: 'highestprice',
  EarliestDeparture: 'earliestdeparture',
  LatestDeparture: 'latestdeparture'
})

export default {
  /**
   *
   * Flight Toolbar component represents flight direction when searching/paying for a given flight
   *
   * @example
   *
   * const flight = new Flight(flightData)
   *
   * <flight-toolbar
   *  :departure="flight.departureAirportCode"
   *  :arrival="flight.arrivalAirportCode">
   * </flight-toolbar>
   */
  name: 'FlightToolbar',
  components: {
    FlightToolbarFilters
  },
  props: {
    /**
     * @param {string} departure - Sets departure airport code (IATA)
     */
    departure: { type: String, required: true },
    /**
     * @param {string} arrival - Sets arrival airport code (IATA)
     */
    arrival: { type: String, required: true },
    date: { type: String, required: true }
  },
  data() {
    return {
      options: [
        'London Heathrow',
        'Amsterdam Schipol',
        'London Gatwick',
        'Guarulhos Sao Paulo',
        'BCN'
      ],
      sortSelection: '',
      SortPreference
    }
  },
  computed: {
    shortDate() {
      return date.formatDate(this.date, 'ddd, DD MMM')
    }
  },
  methods: {
    /**
     * Apply flight filters
     *
     * @param {object} obj - Object containing flight filters
     * @param {object} obj.pricing - Price filters
     * @param {number} obj.pricing.min - Minimum flight ticket price
     * @param {number} obj.pricing.max - Maximum flight ticket price
     * @param {object} obj.departure - Departure filters
     * @param {number} obj.departure.min - Earliest departure time
     * @param {number} obj.departure.max - Latest departure time
     * @param {object} obj.arrival - Arrival filters
     * @param {number} obj.arrival.min - Earliest arrival time
     * @param {number} obj.arrival.max - Latest arrival time
     * @todo Apply hour to current date set in Toolbar
     * @todo Call fetchFlights action with filters
     *
     * @see FlightToolbarFilters - Event emitter
     */
    async applyFilters({ pricing, departure, arrival }) {
      let format = 'YYYY-MM-DD[T]HH:mm'

      let filters = {
        departureRange: {
          min: date.formatDate(`${this.date}T${departure.min}`, format),
          max: date.formatDate(`${this.date}T${departure.max}`, format)
        },
        arrivalRange: {
          min: date.formatDate(`${this.date}T${arrival.min}`, format),
          max: date.formatDate(`${this.date}T${arrival.max}`, format)
        },
        pricingRange: pricing
      }

      console.info('Applying filters')
      console.table(filters)
    },
    toggleFilters() {
      this.$refs['filters'].show()
    },
    /**
     * Sort flight results by a given preference e.g. price, schedule
     *
     * @param {SortPreference} preference - Array of Flight Class to sort on
     * @example
     * // return flights sorted from least to most expensive
     * sortResults('lowestPrice')
     */
    sortResults(preference) {
      switch (preference) {
        case preference.LowestPrice:
          console.info('Sorting by lowest price')
          break

        case preference.HighestPrice:
          console.info('Sorting by highest price')
          break

        case preference.EarliestDeparture:
          console.info('Sorting by earliest departure')
          break

        case preference.LatestDeparture:
          console.info('Sorting by latest departure')
          break

        default:
          break
      }
      this.sortSelection = preference
    }
  }
}
</script>

<style lang="sass">
@import '../css/app'

.flight__toolbar
  padding: 0 0.8rem
  @media only screen and (min-device-width: 700px)
      padding: 0 17vw
      margin: 0 20px

.q-field__native
  padding-top: 0 !important

.search__options--input
  width: 17vw !important
  cursor: text

.search__options--content
  color: $primary
  font-weight: bold

.q-field__label
  top: 24px

.filter__toolbar
  &--header
    background-color: #044389
  &--subheader
    background-color: $grey-2

.filter__option
  &--value
    border-bottom: 1px dotted grey
  &--before
    color: rgba(0, 0, 0, 0.87) !important


.pricing__range
  &--input
    color: $primary

.q-field__marginal
  min-width: 35px !important
</style>
