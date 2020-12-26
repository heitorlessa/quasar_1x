// getters fn

import Flight from '../../shared/models/FlightClass'

/**
 * Catalog [Vuex Module getter](https://vuex.vuejs.org/guide/getters.html) - priceRange
 * @param {object} state - Catalog state
 * @returns {Number} - Range of flight prices (100-1000)
 */
export const priceRange = (state) => {
  let range = Array(11)
    .fill()
    .map((_, i) => i * 100)

  range.shift()

  return range
}
