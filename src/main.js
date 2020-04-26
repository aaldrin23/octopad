import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VeeValidate from "vee-validate";

import VuetifyToast from "vuetify-toast-snackbar";
import Storage from "vue-ls";

Vue.config.productionTip = false;

Vue.use(VuetifyToast);
Vue.use(VeeValidate);

const options = {
  namespace: "vuejs__", // key prefix
  name: "ls", // name variable Vue.[ls] or this.[$ls],
  storage: "local", // storage name session, local, memory
};
Vue.use(Storage, options);

Vue.use({
  install(Vue, options) {
    const _eventBus = new Vue();

    Object.defineProperties(Vue.prototype, {
      $eventBus: {
        get() {
          return _eventBus;
        },
      },
    });
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
