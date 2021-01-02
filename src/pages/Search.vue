<template>
  <q-page class="container">
    <div class="wrapper">
      <div class="heading">
        <div class="text-h4 search__headline" data-test="search-headline">
          Where next?
        </div>
      </div>
    </div>
    <div class="search__options q-pa-sm">
      <q-select
        data-test="search-departure"
        v-model="departureCity"
        stack-label
        label="Departure airport"
        hint="Minimum 3 characters for autocomplete"
        class="home-icons search__options--input search__departure text-bold"
        input-class="search__options--input"
        :min-characters="3"
        :options="$data.airportSearch_suggestionList"
        option-label="name"
        option-value="code"
        map-options
        emit-value
        input-debounce="200"
        @filter="$airportSearch_fuzzySearch"
        display-value-sanitize
        use-input
        hide-dropdown-icon
        clearable
        hide-hint
        hide-selected
        fill-input
        behavior="menu"
      >
        <template v-slot:before>
          <q-icon name="flight_takeoff" color="primary" class="field-icon" />
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section avatar>
              <q-icon name="local_airport" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
              <q-item-label class="text-subtitle1"
                >{{ scope.opt.name }} ({{ scope.opt.code }})</q-item-label
              >
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-select
        data-test="search-arrival"
        v-model="arrivalCity"
        stack-label
        label="Arrival airport"
        hint="Mininum 3 characters for autocomplete"
        class="home-icons search__options--input search__arrival text-bold"
        input-class="search__options--input"
        :min-characters="3"
        :options="$data.airportSearch_suggestionList"
        option-label="name"
        option-value="code"
        map-options
        emit-value
        input-debounce="200"
        @filter="$airportSearch_fuzzySearch"
        display-value-sanitize
        use-input
        item-aligned
        hide-dropdown-icon
        clearable
        hide-hint
        hide-selected
        fill-input
        behavior="menu"
      >
        <template v-slot:before>
          <q-icon name="flight_land" color="primary" class="field-icon" />
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section avatar>
              <q-icon name="local_airport" />
            </q-item-section>
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
              <q-item-label class="text-subtitle1"
                >{{ scope.opt.name }} ({{ scope.opt.code }})</q-item-label
              >
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-field
        class="search__date search__options--input"
        label="Pick a date"
        stack-label
      >
        <template v-slot:before>
          <q-icon name="event" color="primary" class="field-icon" />
        </template>

        <template v-slot:control>
          <q-popup-proxy ref="qDateProxy">
            <div>
              <q-date
                v-model="departureDate"
                mask="dddd, MMM D, YYYY"
                color="primary"
                today-btn
                @input="() => $refs.qDateProxy.hide()"
              />
            </div>
          </q-popup-proxy>

          {{ departureDate }}
        </template>
      </q-field>
    </div>
    <div class="wrapper">
      <q-btn
        @click="search"
        class="cta__button"
        color="secondary"
        label="Search flights"
        :disable="
          !$v.departureCity.isAirport ||
          !$v.arrivalCity.isAirport ||
          $v.departureCity.$invalid ||
          $v.arrivalCity.$invalid ||
          $v.departureDate.$invalid
        "
      >
        <q-icon
          class="cta__button--direction"
          name="keyboard_arrow_right"
          size="2.6rem"
        />
      </q-btn>
    </div>
  </q-page>
</template>

<script>
// @ts-nocheck
import airports from '../store/catalog/airports.json'
import Fuse from 'fuse.js'
import { date } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'
import { airportList } from '../shared/mixins/airportSearch'
import { airportSearchMixin } from '../shared/mixins'

/**
 * Validate given input against list of valid IATA airports
 * @param {string} value - Given airport input by customer
 * @return {boolean} - Boolean whether given airport is a valid IATA airport from airport list
 */
const isAirport = (value) => {
  value = value ?? ''

  if (value.length < 3) {
    return false
  }

  return airportList.some((airport) => airport.code === value)
}

export default {
  /**
   *
   * Search view displays options for searching a flight given a departure, arrival and a date.
   */
  name: 'Search',
  mixins: [validationMixin, airportSearchMixin],
  validations: {
    departureCity: {
      required,
      minLength: minLength(3),
      isAirport
    },
    arrivalCity: {
      required,
      minLength: minLength(3),
      isAirport
    },
    departureDate: {
      required
    }
  },
  data() {
    return {
      /**
       * @param {string} departureCity - Departure city chosen by the customer
       * @param {string} arrivalCity - Arrival city chosen by the customer
       * @param {string} departureDate - Departure date chosen by the customer
       */
      departureCity: '',
      arrivalCity: '',
      departureDate: ''
    }
  },
  methods: {
    /**
     * search method collects form data, create queryStrings, and redirects to Search Results view
     */
    search() {
      this.$router.push({
        name: 'searchResults',
        query: {
          date: date.formatDate(this.departureDate, 'YYYY-MM-DD'),
          departure: this.departureCity,
          arrival: this.arrivalCity
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import '../css/app'

.search__options--input
  padding: 1.3em 0.5em
  max-width: 30em
  min-width: 15em
  margin: auto
</style>
