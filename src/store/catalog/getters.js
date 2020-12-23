// getters fn

import Flight from '../../shared/models/FlightClass'

/**
 * Catalog [Vuex Module getter](https://vuex.vuejs.org/guide/getters.html) - minimumPrice
 * @param {object} state - Catalog state
 * @returns {boolean} - Least expensive flight, defaults to 100 if empty
 */
export const minimumPrice = (state) => {
  return Math.min(...state.flights.map((filter) => filter.ticketPrice), 100)
}

/**
 * Catalog [Vuex Module getter](https://vuex.vuejs.org/guide/getters.html) - maximumPrice
 * @param {object} state - Catalog state
 * @returns {boolean} - Most expensive flight, defaults to 500 if empty
 */
export const maximumPrice = (state) => {
  return Math.max(...state.flights.map((filter) => filter.ticketPrice), 1000)
}

/**
 * Catalog [Vuex Module getter](https://vuex.vuejs.org/guide/getters.html) - earliestDeparture
 * @param {object} state - Catalog state
 * @param {Flight[]} state.flights - Catalog flights
 * @returns {Number} - Earliest departure time in epoch
 */
export const earliestDeparture = (state) => {
  return Math.min(
    ...state.flights.map((flight) => flight.departureDate.getTime())
  )
}

/**
 * Catalog [Vuex Module getter](https://vuex.vuejs.org/guide/getters.html) - latestDeparture
 * @param {object} state - Catalog state
 * @param {Flight[]} state.flights - Catalog flights
 * @returns {Number} - Latest departure time in epoch
 */
export const latestDeparture = (state) => {
  return Math.max(
    ...state.flights.map((flight) => flight.departureDate.getTime())
  )
}

/**
 * Catalog [Vuex Module getter](https://vuex.vuejs.org/guide/getters.html) - earliestArrival
 * @param {object} state - Catalog state
 * @param {Flight[]} state.flights - Catalog flights
 * @returns {Number} - Earliest arrival time in epoch
 */
export const earliestArrival = (state) => {
  return Math.min(
    ...state.flights.map((flight) => flight.arrivalDate.getTime())
  )
}

/**
 * Catalog [Vuex Module getter](https://vuex.vuejs.org/guide/getters.html) - latestArrival
 * @param {object} state - Catalog state
 * @param {Flight[]} state.flights - Catalog flights
 * @returns {Number} - Latest arrival time in epoch
 */
export const latestArrival = (state) => {
  return Math.max(
    ...state.flights.map((flight) => flight.arrivalDate.getTime())
  )
}
