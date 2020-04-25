import Vue from "vue";
import Vuetify, { VSnackbar } from "vuetify/lib";
import { preset } from "vue-cli-plugin-vuetify-preset-rally/preset";

Vue.use(Vuetify);

Vue.component("v-snackbar", VSnackbar);

export default new Vuetify({
  preset,
});
