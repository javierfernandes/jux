import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

import store from './store'
import App from './App.vue'


const app = createApp(App)

app.use(store)
app.use(PrimeVue)

app.mount('#app')


