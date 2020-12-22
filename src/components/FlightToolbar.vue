<template>
  <div class="flight__options bg-grey-1">
    <div class="text-subtitle1 row">
      <div class="flight__orientation col-4 text-left">
        <span
          class="flight__departure--toolbar"
          data-test="toolbar-departure"
          >{{ departure }}</span
        >
        <q-icon name="chevron_right" flat dense size="1.3rem" />
        <span class="flight__arrival--toolbar" data-test="toolbar-arrival">{{
          arrival
        }}</span>
      </div>
      <div class="flight__schedule col-4 text-center">
        <q-btn flat round dense icon="event" size="xs" />
        <span class="">{{ shortDate }}</span>
      </div>
      <div class="flight__filters col-3 text-right q-ml-sm">
        <span class="q-mt-sm">Refine</span>
        <q-btn flat round dense icon="tune" size="xs" />
      </div>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'

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
  computed: {
    shortDate() {
      return date.formatDate(this.date, 'ddd, DD MMM')
    }
  }
}
</script>

<style lang="sass">
@import '../css/app'

.flight__options
  padding: 1.5vh 2vw
  @media only screen and (min-device-width: 700px)
      padding: 0.5vh 20vw
      margin: 0 20px

.flight__orientation
  margin-left: 0.9rem

.flight__filters,
.flight__schedule,
.flight__orientation
  @media only screen and (min-device-width: 700px)
    text-align: center
</style>
