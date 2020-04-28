import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
    temp: {
      tool0: { actual: 0, target: 0 },
      bed: { actual: 0, target: 0 },
    },
  },
  mutations: {
    setTemp(state, payload) {
      state.temp = payload;
    },
    setConnected(state, flag) {
      state.connected = flag;
    },
  },
  actions: {},
  modules: {},
});
