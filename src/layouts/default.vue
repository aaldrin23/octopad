<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <!-- <v-avatar size="40" color="transparent">
        <v-img src="@/assets/logo.svg"></v-img>
      </v-avatar>-->
      <v-icon x-large>mdi-gamepad-square-outline</v-icon>
      <span class="px-2">OctoPad</span>
      <v-spacer></v-spacer>
      <div class="d-flex" style="flex-direction : column">
        <span class="caption">
          <v-icon x-small>mdi-printer-3d-nozzle</v-icon>
          {{temp.tool0}}&deg;C
        </span>
        <span class="caption">
          <v-icon x-small>mdi-radiator</v-icon>
          {{temp.bed}}&deg;C
        </span>
      </div>
      <v-dialog v-model="showSettings" scrollable persistent max-width="500px">
        <template #activator="{on}">
          <v-btn v-on="on" icon>
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="pa-2">
            <v-icon left>mdi-tune</v-icon>Settings
            <v-spacer></v-spacer>
            <v-btn v-if="!!server_ip && !!api_key" @click="showSettings = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-3">
            <v-text-field
              v-model="server_ip"
              v-validate="'ip'"
              :error-messages="errors.collect('Server IP')"
              name="Server IP"
              label="Octoprint Server IP"
              placeholder="192.x.x.x"
            ></v-text-field>
            <v-text-field
              v-model="api_key"
              v-validate="'required'"
              :error-messages="errors.collect('API Key')"
              name="API Key"
              label="Octoprint API Key"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!server_ip || !api_key" @click="saveSettings" color="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <v-dialog :value="!connected && disconected" persistent max-width="500px">
      <v-card>
        <v-card-title class="error pa-2">No Connection!</v-card-title>
        <v-card-text>Disconected from Server</v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>
<script>
import SockJS from "sockjs-client";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      disconected: false,
      api_key: "",
      server_ip: "",
      session_id: "",
      showSettings: false
    };
  },
  computed: {
    ...mapState({
      connected: state => state.connected,
      temp(state) {
        return {
          tool0: state.temp.tool0.actual,
          bed: state.temp.bed.actual
        };
      }
    })
  },
  async mounted() {
    this.api_key = this.$ls.get("api_key");
    this.server_ip = this.$ls.get("server_ip");

    this.showSettings = !this.server_ip || !this.api_key;

    if (this.server_ip && this.api_key) {
      await this.login();
      this.startServerEventListener();
    }
  },
  methods: {
    ...mapMutations(["setConnected"]),
    async saveSettings() {
      const valid = this.$validator.validateAll();

      if (valid) {
        this.$ls.set("api_key", this.api_key);
        this.$ls.set("server_ip", this.server_ip);
        window.createAxios(this.server_ip);
        await this.login();
        this.startServerEventListener();
        this.showSettings = false;
      }
    },
    async login() {
      console.log(`Obtaining session id using ${this.api_key}`);

      try {
        const { data } = await axios
          .post("/login", {
            passive: true
          })
          .catch(e => {});

        this.session_id = data.session;
        this.$ls.set("session_id", this.session_id);
        this.setConnected(true);
      } catch (error) {
        console.log(error);

        this.$toast.error("Unable to connect to server!");
      }
    },
    startServerEventListener() {
      let vm = this;
      const server_ip = this.$ls.get("server_ip");
      var sock = new SockJS(`http://${server_ip}/sockjs`);

      sock.onopen = function() {
        console.log("Authenticating push message..");
        sock.send(
          JSON.stringify({
            auth: "aaldrin:" + vm.session_id
          })
        );
      };

      let timeout = null;
      sock.onmessage = function(e) {
        vm.setConnected(true);
        vm.disconected = false;
        vm.$eventBus.$emit("server_message", e);

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          vm.setConnected(false);
          vm.disconected = true;
        }, 20000);
      };

      sock.onclose = function() {
        console.log("Connection closed!");
      };
    }
  }
};
</script>
