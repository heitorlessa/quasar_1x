<template>
  <div class="row">
    <div class="col-12 wrapper">
      <div class="heading">
        <div
          class="text-primary text-h4 loyalty__heading--name"
          data-test="loyalty-name"
        >
          {{ fullName }}
        </div>
        <div class="loyalty__heading--tier">
          <div
            class="text-h6 loyalty__heading-tier-name"
            data-test="loyalty-level"
          >
            {{ loyalty.level || 'bronze' }}
          </div>
        </div>
      </div>
      <div class="wrapper">
        <div class="row loyalty__progress">
          <div class="col-7 loyalty__progress--points">
            <div class="text-h4 loyalty__points" data-test="loyalty-points">
              {{ loyalty.points || 0 }}
            </div>
            <div class="text-h6 text-primary text-bold">Points</div>
          </div>
          <div class="col-5 loyalty__progress--next-tier">
            <div class="text-h4" data-test="loyalty-next-tier">
              {{ loyalty.percentage || 0 }}%
            </div>
            <div class="text-h6 text-primary text-bold">Tier Progress</div>
            <q-linear-progress
              size="1vh"
              :value="progressPercentage"
              color="secondary"
            />
          </div>
        </div>
        <div class="row">
          <div class="profile__preferences--heading col-12 text-left q-mt-lg">
            <h6 class="bg-grey-1 text-bold q-mb-sm q-mt-md q-pa-sm q-pl-lg">
              Preferences
            </h6>
          </div>
          <div class="profile__preferences--options col-12">
            <q-list highlight no-border class="q-ml-md" link>
              <q-item
                clickable
                v-ripple
                @click="choosePreference('diet')"
                class="q-pa-none q-mt-sm profile__preferences--option"
              >
                <q-item-section avatar>
                  <q-icon name="tune" size="2.6rem" />
                </q-item-section>
                <q-item-section class="text-h6 text-left"
                  >Dietary requirements</q-item-section
                >
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="choosePreference('luggage')"
                class="q-pa-none q-mt-sm profile__preferences--option"
              >
                <q-item-section avatar>
                  <q-icon name="tune" size="2.6rem" />
                </q-item-section>
                <q-item-section class="text-h6 text-left"
                  >Luggage</q-item-section
                >
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
      <amplify-sign-out></amplify-sign-out>
    </div>
  </div>
</template>

<script>
// @ts-nocheck
import { mapState, mapGetters } from 'vuex'
// import { AmplifyEventBus } from 'aws-amplify-vue'

const defaultDialogOpts = {
  cancel: true,
  preventClose: true,
  color: 'secondary'
}

const luggageDialog = {
  title: 'Luggage preference',
  message: 'Number of check-in luggages.',
  options: {
    type: 'radio',
    model: 'opt2',
    items: [
      { label: '1', value: '1', color: 'primary' },
      { label: '2', value: '2' },
      { label: '3', value: '3' }
    ]
  }
}

const dietaryDialog = {
  title: 'Dietary preference',
  message: 'Choose your dietary requirement.',
  options: {
    type: 'radio',
    model: 'opt2',
    items: [
      { label: 'Vegatarian', value: 'vegetarian', color: 'secondary' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Dairy-free', value: 'dairy-free' },
      { label: 'Regular', value: 'regular' }
    ]
  }
}

/**
 *
 * Profile view displays a current Loyalty progress and points, and allow customers to set preferences.
 */
export default {
  name: 'Profile',
  /**
   * @param {object} user - Current authenticated user from Profile module
   * @param {boolean} isAuthenticated - Getter from Profile module
   * @param {Loyalty} loyalty - Loyalty data from Loyalty module
   */
  computed: {
    ...mapState({
      user: (state) => state.profile.user,
      loyalty: (state) => state.loyalty.loyalty
    }),
    ...mapGetters({
      isAuthenticated: 'profile/isAuthenticated',
      firstName: 'profile/firstName',
      lastName: 'profile/lastName'
    }),
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },
    progressPercentage() {
      return this.loyalty.percentage / 100 || 0
    }
  },
  methods: {
    choosePreference(option) {
      let dialog = {
        ...defaultDialogOpts,
        ...(option === 'luggage' ? luggageDialog : dietaryDialog)
      }

      this.$q
        .dialog(dialog)
        .onOk((choice) => {
          this.$q.notify({ type: 'positive', message: `${option}: ${choice}` })
        })
        .onCancel(() => 'No option selected')
    }
  },
  async mounted() {
    /** Amplify clears out cookies and any storage that can map to users
     * However it is on us to clear out our own store and redirect to Auth
     * If customer decides to sign out we redirect it to home, and subsequentially to authentication
     */
    // AmplifyEventBus.$on('authState', (info) => {
    //   if (info === 'signedOut') {
    //     this.$store
    //       .dispatch('profile/getSession')
    //       .catch(
    //         this.$router.push({ name: 'auth', query: { redirectTo: 'home' } })
    //       )
    //   }
    // })

    // authentication guards prevent authenticated users to view Profile
    // however, the component doesn't stop from rendering asynchronously
    // this guarantees we attempt talking to Loyalty service
    // if our authentication guards && profile module have an user in place
    try {
      if (this.isAuthenticated) {
        await this.$store.dispatch('loyalty/fetchLoyalty')
      }
    } catch (error) {
      console.error(error)
      this.$q.notify(
        `Error while fetching Loyalty - Check browser console messages`
      )
    }
  }
}
</script>

<style lang="sass">
/**
 * Amplify authenticatior HOC as of now doesn't provide overriding mechanisms for UI
 * we use CSS Root variables along with an authentication-form injected class for consistent experience
 */
@import '../css/app'

a
  text-decoration: none
  color: black

.loyalty__heading
  &--tier
    margin: $between-content-margin

.loyalty__progress
  &--points > *
    margin: $between-content-margin

  &--next-tier
    margin: $between-content-margin

.q-linear-progress
  width: 90% !important

.profile__preferences-option
  &:hover
    cursor: pointer
</style>
