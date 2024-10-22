import './assets/style.css'

import { createApp } from 'vue'
import router from './router/router'
import App from './App.vue'

const app = createApp(App)

// Utilise le router Vue
app.use(router)

// Monte l'application
app.mount('#app')
