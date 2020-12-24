<template>
  <div class="bg-grey-2">
    <div
      class="flight__toolbar container row text-left justify-around items-baseline text-subtitle1"
    >
      <div class="flight__filters--departure col">
        <q-select
          class="search__options--input flight__departure--toolbar no-padding"
          label="From"
          borderless
          dense
          v-model="departure"
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
      <div class="flight__filters--arrival col">
        <q-select
          class="search__options--input flight__arrival--toolbar no-padding"
          label="To"
          borderless
          dense
          v-model="arrival"
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
                @click="filters = true"
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
              <q-dialog v-model="filters">
                <q-card style="width: 300px" class="">
                  <q-card-section class="filter__toolbar q-pa-none">
                    <div
                      class="row items-baseline filter__toolbar--header q-pa-sm"
                    >
                      <div class="text-subtitle1 text-white col">Filters</div>
                      <div class="text-subtitle1 text-right text-white col">
                        <q-btn
                          no-caps
                          class="text-white"
                          dense
                          flat
                          text-color="primary"
                          size="0.90rem"
                          label="Reset"
                          padding="0"
                          @click="filters = false"
                        />
                      </div>
                    </div>
                    <div
                      class="row items-baseline filter__toolbar--subheader q-pa-sm text"
                    >
                      <div class="text-caption col">
                        Results [filtered/total]
                      </div>
                      <div class="text-right col">
                        <q-btn
                          class="text-bold"
                          no-caps
                          dense
                          flat
                          text-color="primary"
                          size="0.90rem"
                          label="Apply"
                          padding="0"
                          @click="filters = false"
                        />
                      </div>
                    </div>
                  </q-card-section>

                  <q-item-label header>Price</q-item-label>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="attach_money" />
                    </q-item-section>
                    <q-item-section>
                      <q-range
                        color="secondary"
                        v-model="maxPriceFilter"
                        :min="minimumPrice"
                        :left-label-value="'Min: ' + maxPriceFilter.min"
                        :max="maximumPrice"
                        :right-label-value="'Max: ' + maxPriceFilter.max"
                        label
                        dense
                      />
                    </q-item-section>
                  </q-item>

                  <q-item-label header>Departure time</q-item-label>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="schedule" />
                    </q-item-section>
                    <q-item-section>
                      <q-range
                        color="secondary"
                        v-model="departureFilter"
                        :min="earliestDeparture"
                        :max="latestDeparture"
                        :left-label-value="`From: ${formatTimeRange(
                          departureFilter.min
                        )}`"
                        :right-label-value="`Until: ${formatTimeRange(
                          departureFilter.max
                        )}`"
                        label
                        dense
                      />
                    </q-item-section>
                  </q-item>

                  <q-item-label header>Arrival time</q-item-label>
                  <q-item dense class="q-mb-md">
                    <q-item-section avatar>
                      <q-icon name="schedule" />
                    </q-item-section>
                    <q-item-section>
                      <q-range
                        color="secondary"
                        v-model="arrivalFilter"
                        :min="earliestArrival"
                        :max="latestArrival"
                        :left-label-value="`From: ${formatTimeRange(
                          arrivalFilter.min
                        )}`"
                        :right-label-value="`Until: ${formatTimeRange(
                          arrivalFilter.max
                        )}`"
                        label
                        dense
                      />
                    </q-item-section>
                  </q-item>
                </q-card>
              </q-dialog>
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
      filters: false,
      options: [
        'London Heathrow',
        'Amsterdam Schipol',
        'London Gatwick',
        'Guarulhos Sao Paulo',
        'BCN'
      ],
      maxPriceFilter: {
        min: 100,
        max: 1000
      },
      departureFilter: {
        min: this.$store.getters['catalog/earliestDeparture'],
        max: this.$store.getters['catalog/latestDeparture']
      },
      arrivalFilter: {
        min: this.$store.getters['catalog/earliestArrival'],
        max: this.$store.getters['catalog/latestArrival']
      },
      sortSelection: '',
      SortPreference
    }
  },
  computed: {
    shortDate() {
      return date.formatDate(this.date, 'ddd, DD MMM')
    },
    ...mapGetters({
      minimumPrice: 'catalog/minimumPrice',
      maximumPrice: 'catalog/maximumPrice',
      earliestArrival: 'catalog/earliestArrival',
      earliestDeparture: 'catalog/earliestDeparture',
      latestArrival: 'catalog/latestArrival',
      latestDeparture: 'catalog/latestDeparture'
    })
  },
  methods: {
    formatTimeRange(time) {
      return date.formatDate(time, 'HH:mm')
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
  },
  mounted() {
    console.info(`Route -> ${this.$router.currentRoute.name}`)
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
</style>
