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
                <q-card style="width: 300px">
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

                  <q-item-label
                    header
                    class="text-center q-pb-none text-primary"
                    >Price range
                  </q-item-label>
                  <div class="q-pa-lg pricing__range">
                    <div
                      class="col-12 pricing__range--content shadow-up-3 bg-white row text-center"
                    >
                      <div class="col-6">
                        <q-select
                          v-model="priceFilter.min"
                          class="pricing_minimum cursor-pointer"
                          color="primary"
                          :options="pricingOptions"
                          borderless
                          dense
                          hide-dropdown-icon
                          hide-bottom-space
                          item-aligned
                          input-class="pricing__range--input"
                        >
                          <template v-slot:before>
                            <span
                              class="text-left text-subtitle2 filter__option--before q-pl-xs"
                              >from:</span
                            >
                          </template>
                          <template v-slot:selected>
                            <div
                              class="text-bold filter__option--value text-subtitle2"
                            >
                              {{ priceFilter.min }}
                            </div>
                          </template>
                        </q-select>
                      </div>
                      <div class="col-6 pricing__max">
                        <q-select
                          v-model="priceFilter.max"
                          class="pricing_maximum cursor-pointer"
                          color="primary"
                          :options="pricingOptions"
                          borderless
                          dense
                          hide-dropdown-icon
                          hide-bottom-space
                          item-aligned
                          input-class="pricing__range--input"
                        >
                          <template v-slot:before>
                            <span
                              class="text-left text-subtitle2 filter__option--before text-dark q-pl-md"
                              >until:</span
                            >
                          </template>
                          <template v-slot:selected>
                            <div
                              class="text-bold filter__option--value text-subtitle2"
                            >
                              {{ priceFilter.max }}
                            </div>
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </div>
                  <q-separator />

                  <q-item-label
                    header
                    class="text-center q-pb-none text-primary"
                    >Departure window</q-item-label
                  >
                  <div class="q-pa-lg schedule__range">
                    <div
                      class="col-12 schedule__range--content shadow-up-3 bg-white row text-center"
                    >
                      <div class="col-6">
                        <q-field
                          class="departure__earliest cursor-pointer"
                          borderless
                          stack-label
                        >
                          <template v-slot:control>
                            <q-popup-proxy>
                              <div>
                                <q-time
                                  class="text-center"
                                  v-model="departureFilter.min"
                                  now-btn
                                >
                                  <q-btn
                                    label="Close"
                                    flat
                                    color="primary"
                                    v-close-popup
                                  />
                                </q-time>
                              </div>
                            </q-popup-proxy>
                            <span class="full-width text-center text-subtitle2"
                              >earliest:
                              <span
                                class="text-bold filter__option--value departure__earliest--value"
                                >{{ departureFilter.min }}
                              </span>
                            </span>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-6 departure__max">
                        <q-field
                          class="departure__latest cursor-pointer"
                          borderless
                          stack-label
                        >
                          <template v-slot:control>
                            <q-popup-proxy>
                              <div>
                                <q-time
                                  class="text-center"
                                  v-model="departureFilter.max"
                                  now-btn
                                >
                                  <q-btn
                                    label="Close"
                                    flat
                                    color="primary"
                                    v-close-popup
                                  />
                                </q-time>
                              </div>
                            </q-popup-proxy>
                            <span class="full-width text-center text-subtitle2"
                              >latest:
                              <span
                                class="text-bold filter__option--value departure__latest--value"
                                >{{ departureFilter.max }}
                              </span>
                            </span>
                          </template>
                        </q-field>
                      </div>
                    </div>
                  </div>
                  <q-separator />
                  <q-item-label
                    header
                    class="text-center q-pb-none text-primary"
                    >Arrival window</q-item-label
                  >
                  <div class="q-pa-lg schedule__range">
                    <div
                      class="col-12 schedule__range--content shadow-up-3 bg-white row text-center"
                    >
                      <div class="col-6">
                        <q-field
                          class="arrival__earliest cursor-pointer"
                          borderless
                          stack-label
                        >
                          <template v-slot:control>
                            <q-popup-proxy>
                              <div>
                                <q-time
                                  class="text-center"
                                  v-model="arrivalFilter.min"
                                  now-btn
                                >
                                  <q-btn
                                    label="Close"
                                    flat
                                    color="primary"
                                    v-close-popup
                                  />
                                </q-time>
                              </div>
                            </q-popup-proxy>
                            <span class="full-width text-center text-subtitle2"
                              >earliest:
                              <span
                                class="text-bold filter__option--value arrival__earliest--value"
                                >{{ arrivalFilter.min }}
                              </span>
                            </span>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-6 arrival__max">
                        <q-field
                          class="arrival__latest cursor-pointer"
                          borderless
                          stack-label
                        >
                          <template v-slot:control>
                            <q-popup-proxy>
                              <div>
                                <q-time
                                  class="text-center"
                                  v-model="arrivalFilter.max"
                                  now-btn
                                >
                                  <q-btn
                                    label="Close"
                                    flat
                                    color="primary"
                                    v-close-popup
                                  />
                                </q-time>
                              </div>
                            </q-popup-proxy>
                            <span class="full-width text-center text-subtitle2"
                              >latest:
                              <span
                                class="text-bold filter__option--value arrival__latest--value"
                                >{{ arrivalFilter.max }}
                              </span>
                            </span>
                          </template>
                        </q-field>
                      </div>
                    </div>
                  </div>
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
      priceFilter: {
        min: 0,
        max: 1000
      },
      departureFilter: {
        min: '06:00',
        max: '23:00'
      },
      arrivalFilter: {
        min: '06:00',
        max: '23:00'
      },
      sortSelection: '',
      SortPreference,
      pricingOptions: this.$store.getters['catalog/priceRange']
    }
  },
  computed: {
    shortDate() {
      return date.formatDate(this.date, 'ddd, DD MMM')
    }
  },
  filters: {
    formatDate: function (value, token) {
      console.info(`Formatting value: ${value}`)
      if (!value) return 'invalid date'
      if (!token) token = 'ddd, MMM D [at] hh:mm'

      return date.formatDate(value, token)
    }
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
