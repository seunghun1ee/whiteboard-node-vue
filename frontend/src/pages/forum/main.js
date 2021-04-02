import Vue from 'vue'
import App from './App.vue'
import {router} from "@/common.js"
import io from "socket.io-client"
import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false
Vue.use(new VueSocketIO({
  debug: true,
  connection: io("http://localhost:3000")
}));

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
