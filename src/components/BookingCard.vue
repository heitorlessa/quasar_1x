<template>
  <q-dialog ref="modal">
    <div class="row booking__modal">
      <div
        class="col-12 booking__modal--passenger booking__modal--highlighted text-center q-pa-sm bg-grey-3"
      >
        <div class="text-h6 text-primary" data-test="booking-customer">
          {{ name }}
        </div>
        <div class="booking__modal--reference text-subtitle2">
          <span>Reference: </span>
          <span
            class="text-primary text-bold text-uppercase"
            data-test="booking-reference"
            >{{ reference }}</span
          >
        </div>
      </div>

      <div class="row booking__modal--timeline full-width">
        <q-timeline responsive color="primary" layout="loose">
          <q-timeline-entry
            :subtitle="departureDisplayDate"
            icon="flight_takeoff"
            side="right"
            :title="departureAirportName"
          >
            <div class="booking__timeline--info text-subtitle2">
              <p class="q-ma-none text-subtitle2 text-primary text-bold">
                <q-icon name="schedule" size="xs" left />
                <span class="text-dark" data-test="booking-departure-time">{{
                  departureTime
                }}</span>
              </p>
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            :subtitle="arrivalDisplayDate"
            icon="flight_land"
            :title="arrivalAirportName"
          >
            <div class="booking__timeline--info text-subtitle2">
              <p class="q-ma-none text-subtitle2 text-primary text-bold">
                <q-icon name="schedule" size="1.1rem" left />
                <span class="text-dark" data-test="booking-arrival-time">{{
                  arrivalTime
                }}</span>
              </p>
            </div>
          </q-timeline-entry>
        </q-timeline>
      </div>

      <div
        class="booking__modal--ctas booking__modal--highlighted row inline full-width bg-grey-1"
      >
        <div class="col-12 bg-primary">
          <q-btn
            class="full-width cta__button-check-in text-bold"
            flat
            color="white"
            label="Check-in"
            data-test="booking-check-in"
            @click="checkIn"
          />
        </div>
        <div class="col-12">
          <q-btn
            class="full-width cta__button-cancel text-bold"
            flat
            label="Cancel"
            data-test="booking-cancel"
            @click="cancelBooking"
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>
<style lang="sass">
@import '../css/app'

.booking__modal
  border-radius: 0.93rem !important

  &--title
    margin: 0 auto

  &--timeline
    background-color: white
    padding: 0 0.1rem


.q-timeline__title
  font-size: 1rem !important
  margin-bottom: 1vh !important

.booking__timeline--info
  body.screen--lg &
    font-size: 1rem !important
</style>
<script>
// @ts-ignore
import { date } from 'quasar'

export default {
  /**
   *
   * Booking Card component represents booking details
   * It uses data from both Flight and Booking for rendering
   */
  name: 'BookingCard',
  props: {
    /**
     * @param {string} reference - Sets Booking ID
     * @param {string} name - Passenger name
     * @param {string} departureDate - Departure date
     * @param {string} departureAirportName - Departure airport known name
     * @param {string} departureIata - Departure airport code
     * @param {string} arrivalDate - Arrival date
     * @param {string} arrivalIata - Arrival airport code
     */
    reference: String,
    name: String,
    departureDate: [String, Date],
    departureAirportName: String,
    departureIata: {
      type: String,
      validator: function (value) {
        return value.length == 3
      }
    },
    arrivalDate: [String, Date],
    arrivalAirportName: String,
    arrivalIata: {
      type: String,
      validator: function (value) {
        return value.length == 3
      }
    }
  },
  methods: {
    /**
     * Display modal
     *
     * @see BookingFlight
     */
    showCard: function () {
      // @ts-ignore
      this.$refs['modal'].show()
    },
    /**
     * Hides modal
     *
     * @see BookingFlight
     */
    hideCard: function () {
      // @ts-ignore
      this.$refs['modal'].hide()
    },
    checkIn() {
      this.$q.notify('Not implemented')
    },
    cancelBooking() {
      this.$q.notify('Not implemented')
    }
  },
  /**
   *
   * At mount lifecycle hook, it formats departure/arrival dates to be displayed
   *
   */
  mounted() {
    this.departureDisplayDate = date.formatDate(
      // @ts-ignore
      this.departureDate,
      'ddd, DD MMM YYYY'
    )
    // @ts-ignore
    this.departureTime = date.formatDate(this.departureDate, 'HH:mm')

    this.arrivalDisplayDate = date.formatDate(
      // @ts-ignore
      this.departureDate,
      'ddd, DD MMM YYYY'
    )
    // @ts-ignore
    this.arrivalTime = date.formatDate(this.arrivalDate, 'HH:mm')
  },
  data() {
    return {
      departureTime: null,
      departureDisplayDate: null,
      arrivalTime: null,
      arrivalDisplayDate: null
    }
  }
}
</script>
