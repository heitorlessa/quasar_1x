// getters fn

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
