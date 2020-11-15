import Amplify from 'aws-amplify'
import awsconfig from '../../aws-exports'
import '@aws-amplify/ui-vue'

Amplify.configure(awsconfig)

Amplify.Logger.LOG_LEVEL = 'DEBUG'
