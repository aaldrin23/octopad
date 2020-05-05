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
              label="User API Key"
              append-icon="mdi-qrcode-scan"
              @click:append="scanQR = true"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :disabled="!server_ip || !api_key " @click="saveSettings" color="primary">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <v-dialog v-model="scanQR" max-width="500px">
      <v-card>
        <v-card-text class="pa-2">
          <div width="100%" id="camera" autoplay></div>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn @click="scanQR = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
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
      scanQR: false,
      disconected: false,
      api_key: "",
      server_ip: "",
      session_id: "",
      user_id: "",
      showSettings: false,
      scanner: null,
      socket: null
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
    this.user_id = this.$ls.get("user_id");

    this.showSettings = !this.server_ip || !this.api_key;

    if (this.server_ip && this.api_key && this.user_id) {
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

        createAxios(this.server_ip);

        await this.login();

        this.showSettings = false;
      }
    },
    async login() {
      try {
        const { data } = await axios
          .post("/login", {
            passive: true
          })
          .catch(e => {
            throw e;
          });

        if (data.name && data.user) {
          this.connect(data);
        } else {
          this.disconect();
          this.$toast.error("Pleas use a valid User API key!");
        }
      } catch (error) {
        this.disconect();
        this.$toast.error("Unable to connect to server!");
      }
    },
    connect(data) {
      this.session_id = data.session;
      this.$ls.set("session_id", this.session_id);
      this.$ls.set("user_id", data.name);
      this.$toast.success(`You are logged in as "${data.name}"`);
      this.setConnected(true);
      this.startServerEventListener();
    },
    disconect() {
      if (this.socket) this.socket.close();
      this.$ls.set("session_id", null);
      this.$ls.set("user_id", null);
      this.setConnected(false);
    },
    startServerEventListener() {
      let vm = this,
        sock = vm.socket;

      const server_ip = this.$ls.get("server_ip");

      sock = new SockJS(`http://${server_ip}/sockjs`);

      sock.onopen = function() {
        sock.send(
          JSON.stringify({
            auth: vm.user_id + ":" + vm.session_id
          })
        );
      };

      let timeout = null;
      sock.onmessage = function(e) {
        vm.$eventBus.$emit("server_message", e);

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          vm.setConnected(false);
        }, 30000);
        vm.setConnected(true);
      };

      sock.onclose = function() {
        vm.setConnected(false);
      };
    }
  },
  watch: {
    scanQR(val) {
      let vm = this;
      if (val) {
        // element to render video
        var video = document.getElementById("camera");

        // start device video
        app.camera.init(video, {
          video: true,
          audio: false
        });

        // scan and read qrcode
        Html5Qrcode.getCameras().then(cameras => {
          if (cameras && cameras.length) {
            var cameraId = cameras[0].id;
            vm.scanner = new Html5Qrcode(/* element id */ "camera");
            try {
              vm.scanner.start(cameraId, {}, e => {
                vm.api_key = e;
                vm.scanQR = false;
                vm.$toast.success("QR Detected!");
              });
            } catch (error) {}
          }
        });
      } else {
        vm.scanner.stop();
      }
    }
  }
};
</script>
