<template>
  <div class="row">
    <amplify-authenticator
      v-if="authState !== 'signedin'"
      :form-fields.prop="formFields"
      username-alias="username"
      data-test="authenticator"
    >
      <amplify-sign-up
        slot="sign-up"
        username-alias="username"
        :form-fields.prop="formFields"
      ></amplify-sign-up>
      <amplify-totp-setup
        header-text="My Custom TOTP Setup Text"
        slot="totp-setup"
      ></amplify-totp-setup>
    </amplify-authenticator>

    <amplify-sign-out v-if="authState == 'signedin'"></amplify-sign-out>
  </div>
</template>

<script>
// @ts-ignore
import { onAuthUIStateChange, AuthState } from '@aws-amplify/ui-components'

/**
 * Authentication view authenticates a customer and redirects to desired page if successful
 * Non-authenticated users are redirected to this view via Route Guards
 */
export default {
  name: 'Authentication',
  /**
   * @param {string} redirectTo - Sets Route one must go once authenticated
   */
  props: {
    redirectTo: String
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      //   this.authState = authState
      //   this.user = authData

      if (nextAuthState === AuthState.SignedIn) {
        console.log('user successfully signed in!')
        console.log('user data: ', authData)
        this.$router.push({ name: this.redirectTo })
      }
    })
  },
  beforeDestroy() {
    return onAuthUIStateChange
  },
  data() {
    return {
      authState: '',
      formFields: [
        {
          type: 'given_name',
          label: 'First name',
          placeholder: 'First name',
          name: 'given_name',
          required: true
        },
        {
          type: 'family_name',
          label: 'Family name',
          placeholder: 'Last name',
          name: 'family_name',
          required: true
        },
        {
          type: 'username',
          name: 'username',
          label: 'Username',
          placeholder: 'demo',
          required: true
        },
        {
          type: 'password',
          required: true
        },
        {
          type: 'email',
          required: true
        }
      ]
    }
  }
}
</script>

<style lang="sass">
@import '../css/app'

amplify-authenticator
    display: flex
    justify-content: center
    align-items: center
    height: 100vh
    font-family: 'Raleway', 'Open Sans', sans-serif
    min-width: 80vw
    padding: 10vmin

    --amplify-font-family: $typography-font-family
    --amplify-primary-color: #FA3336

    @media only screen and (min-device-width: 700px)
        margin: auto
        padding: 15vmin
        min-width: 100%

// amplify-authenticator
//     display: flex
//     justify-content: center
//     align-items: center
//     height: 100vh
//     font-family: 'Raleway', 'Open Sans', sans-serif
//     min-width: 80vw
//     padding: 10vmin

//     @media only screen and (min-device-width: 700px)
//         margin: auto
//         padding: 15vmin
//         min-width: 100%

//     --amplify-font-family: $typography-font-family
//     --amplify-primary-color: #FA3336
</style>
