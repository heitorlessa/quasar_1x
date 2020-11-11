<template>
  <q-page class="container blah">
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
        input-style="search__departure--suggestion"
        :min-characters="3"
        :options="suggestionList"
        option-label="name"
        option-value="code"
        map-options
        emit-value
        input-debounce="200"
        @filter="fuzzySearchFilter"
        display-value-sanitize
        use-input
        item-aligned
        hide-dropdown-icon
        clearable
        hide-hint
        hide-selected
        fill-input
      >
        <template v-slot:before>
          <q-icon name="flight_takeoff" color="primary" class="field-icon" />
        </template>
      </q-select>
      <q-select
        data-test="search-arrival"
        v-model="arrivalCity"
        stack-label
        label="Arrival airport"
        hint="Mininum 3 characters for autocomplete"
        class="home-icons search__options--input search__arrival text-bold"
        input-style="search__arrival--suggestion"
        :min-characters="3"
        :options="suggestionList"
        option-label="name"
        option-value="code"
        map-options
        emit-value
        input-debounce="200"
        @filter="fuzzySearchFilter"
        display-value-sanitize
        use-input
        item-aligned
        hide-dropdown-icon
        clearable
        hide-hint
        hide-selected
        fill-input
      >
        <template v-slot:before>
          <q-icon name="flight_land" color="primary" class="field-icon" />
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
                title="Flight departure"
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

/**
 * parse list of airports provided from Catalog module
 *
 * @return {object} - list of airports following auto-suggestion Quasar component contract
 */
const parseAirports = () => {
  return airports.map((country) => {
    return {
      city: country.city,
      name: country.name,
      code: country.code
    }
  })
}

const airportList = parseAirports()

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

// Fuzzy search config for Fuse
const fuzeOpts = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 10,
  minMatchCharLength: 3,
  keys: ['city', 'code', 'name']
}

export default {
  /**
   *
   * Search view displays options for searching a flight given a departure, arrival and a date.
   */
  name: 'Search',
  mixins: [validationMixin],
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
       * @param {object} departureCity - Departure city chosen by the customer
       * @param {object} arrivalCity - Arrival city chosen by the customer
       * @param {object} departureDate - Departure date chosen by the customer
       * @param {object} suggestionList - Parsed list of airports offered as auto-suggestion
       */
      departureCity: '',
      arrivalCity: '',
      departureDate: '',
      suggestionList: airportList
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
    },
    /**
     * fuzzySearchFilter method uses Fuse library to easily find airports whether that is city, IATA, initials, etc.
     */
    fuzzySearchFilter(value, update, abort) {
      console.log('entering filter...')
      // Min 3 chars for autocomplete
      if (value.length < 3) {
        abort()
        return
      }

      update(
        () => {
          // reset the list if search was cleared
          if (value === '') {
            this.suggestionList = airportList
          }

          let fuse = new Fuse(airportList, fuzeOpts)
          let result = fuse.search(value.toLowerCase())
          this.suggestionList = result.map((i) => i.item)
        },
        (ref) => {
          if (
            value !== '' &&
            ref.options.length > 0 &&
            ref.optionIndex === -1
          ) {
            ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
            ref.toggleOption(ref.options[ref.optionIndex], true) // toggle the focused option
          }
        }
      )
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
