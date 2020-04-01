import Vue from 'vue'
import App from './App.vue'

import Buefy from 'buefy'
//import 'vue-material-design-icons/styles.css';
//import 'buefy/dist/buefy.css'
Vue.use(Buefy, {
  defaultIconPack: 'fas',
})

import vueNumeralFilterInstaller from 'vue-numeral-filter';
Vue.use(vueNumeralFilterInstaller, { locale: 'de' });

Vue.config.productionTip = true

new Vue({
  render: h => h(App),
}).$mount('#app')

