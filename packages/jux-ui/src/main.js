import { createApp } from 'vue'
import PrimeVue from 'primevue/config'

import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

import App from './App.vue'
import store from './store'

const app = createApp(App)
app.config.devtools = true

app.use(store)
app.use(PrimeVue)

app.mount('#app')


