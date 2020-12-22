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
              <q-btn
                class="text-bold"
                dense
                flat
                text-color="primary"
                size="0.75rem"
                label="Sort"
                padding="0"
                @click="filters = true"
              >
              </q-btn>
              <q-dialog v-model="filters">
                <q-card style="width: 300px" class="q-px-sm q-pb-md">
                  <q-card-section>
                    <div class="text-h6">Volumes</div>
                  </q-card-section>

                  <q-item-label header>Media volume</q-item-label>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="volume_up" />
                    </q-item-section>
                    <q-item-section>
                      <q-slider color="teal" v-model="slideVol" :step="0" />
                    </q-item-section>
                  </q-item>

                  <q-item-label header>Alarm volume</q-item-label>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="alarm" />
                    </q-item-section>
                    <q-item-section>
                      <q-slider color="teal" v-model="slideAlarm" :step="0" />
                    </q-item-section>
                  </q-item>

                  <q-item-label header>Ring volume</q-item-label>
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon name="vibration" />
                    </q-item-section>
                    <q-item-section>
                      <q-slider
                        color="teal"
                        v-model="slideVibration"
                        :step="0"
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

    <!-- <div class="flight__filters col-3 text-center q-ml-sm">
        <q-btn
          dense
          icon="tune"
          size="0.75rem"
          label="Refine"
          outline
          :disable="this.$router.currentRoute.name != 'searchResults'"
          @click="filters = true"
        />

        <q-dialog v-model="filters">
          <q-card style="width: 300px" class="q-px-sm q-pb-md">
            <q-card-section>
              <div class="text-h6">Volumes</div>
            </q-card-section>

            <q-item-label header>Media volume</q-item-label>
            <q-item dense>
              <q-item-section avatar>
                <q-icon name="volume_up" />
              </q-item-section>
              <q-item-section>
                <q-slider color="teal" v-model="slideVol" :step="0" />
              </q-item-section>
            </q-item>

            <q-item-label header>Alarm volume</q-item-label>
            <q-item dense>
              <q-item-section avatar>
                <q-icon name="alarm" />
              </q-item-section>
              <q-item-section>
                <q-slider color="teal" v-model="slideAlarm" :step="0" />
              </q-item-section>
            </q-item>

            <q-item-label header>Ring volume</q-item-label>
            <q-item dense>
              <q-item-section avatar>
                <q-icon name="vibration" />
              </q-item-section>
              <q-item-section>
                <q-slider color="teal" v-model="slideVibration" :step="0" />
              </q-item-section>
            </q-item>
          </q-card>
        </q-dialog>
      </div> -->
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
  data() {
    return {
      filters: false,
      options: [
        'London Heathrow',
        'Amsterdam Schipol',
        'London Gatwick',
        'Guarulhos Sao Paulo',
        'BCN'
      ]
    }
  },
  computed: {
    shortDate() {
      return date.formatDate(this.date, 'ddd, DD MMM')
    }
  },
  mounted() {
    console.info(`Route -> ${this.router.currentRoute.name}`)
  }
}
</script>

<style lang="sass">
@import '../css/app'

.flight__toolbar
  padding: 0 1.5rem
  @media only screen and (min-device-width: 700px)
      padding: 0 15vw
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
</style>
