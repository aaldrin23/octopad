import Vue from "vue";
import "./plugins/axios";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VeeValidate from "vee-validate";
import PortalVue from "portal-vue";

import VuetifyToast from "vuetify-toast-snackbar";
import Storage from "vue-ls";
import { mapState } from "vuex";

Vue.config.productionTip = false;

Vue.use(VuetifyToast);
Vue.use(VeeValidate);
Vue.use(PortalVue);

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

Vue.mixin({
  computed: {
    ...mapState(["connected"]),
    $connected() {
      return this.connected;
    },
  },
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h("router-view"),
}).$mount("#app");
