<template>
  <div>
    <v-expansion-panels :value="0">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div v-if="val(state,'flags.printing')">
            <v-icon>mdi-printer-3d-nozzle</v-icon>
          </div>
          <div v-else align="center">{{state.text || '--'}}</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="pa-0">
          <v-card :loading="loading">
            <v-card-text class="pa-0">
              <v-simple-table>
                <tbody>
                  <tr>
                    <th>File</th>
                    <td>{{val(job,'file.name','--')}}</td>
                  </tr>
                  <tr>
                    <th>Size</th>
                    <td>{{val(job,'file.size','--',(e) => (e/1000)+' kb')}}</td>
                  </tr>
                  <tr>
                    <th>Filament</th>
                    <td>{{val(job,'filament.tool0.length','--',(e) => (e/1000).toFixed(2)+' m') }}</td>
                  </tr>
                  <tr>
                    <th>Approx. Total Print Time:</th>
                    <td>{{val(job,'averagePrintTime','--',(e) => Math.round(e / 60) + ' minutes')}}</td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div
                        align="center"
                      >{{val(progress,'completion','--',(e) => e.toFixed(2))+' %'}}</div>
                      <v-progress-linear :value="val(progress,'completion',0)"></v-progress-linear>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
              <v-row justify="center">
                <v-col cols="auto">
                  <v-btn @click="issueJobCommand('start')" :disabled="!canPrint" color="primary">
                    <v-icon>mdi-printer</v-icon>Print
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    @click="issueJobCommand('pause',{action :  val(state,'flags.printing') ? 'pause' : 'resume'})"
                    :disabled="!canPause"
                    color="primary"
                  >
                    <v-icon>{{val(state,'flags.printing')? 'mdi-pause' : 'mdi-play'}}</v-icon>
                    {{val(state,'flags.printing') ? 'Pause' : 'Resume'}}
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn @click="issueJobCommand('cancel')" :disabled="!canCancel" color="primary">
                    <v-icon>mdi-cancel</v-icon>Cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card class="mt-2">
      <file-list></file-list>
    </v-card>
  </div>
</template>

<script>
import clone from "lodash.clone";
import FileList from "@/components/FileList";
export default {
  components: {
    FileList
  },
  data() {
    return {
      loading: true,
      job: {},
      progress: {},
      state: {}
    };
  },
  computed: {
    canPrint() {
      const f = this.state.flags;
      return !!f && f.ready && !f.cancelling && !f.printing && !f.paused;
    },
    canPause() {
      const f = this.state.flags;
      return !!f && ((f.printing && !f.cancelling && !f.pausing) || f.paused);
    },
    canCancel() {
      const f = this.state.flags;

      return !!f && ((f.printing && !f.cancelling) || f.paused);
    }
  },
  created() {
    this.$eventBus.$on("server_message", e => {
      const { data } = e;
      const { current } = data;

      if (current) {
        this.job = current.job;
        this.progress = current.progress;
        this.state = current.state;

        this.loading = false;
      }
    });
  },
  methods: {
    val(obj, path, def = "", transform) {
      const arrPath = path.split(".");

      let value = clone(obj);
      for (let i = 0; i < arrPath.length; i++) {
        const k = arrPath[i];
        value = value[k];
        if (value == null || typeof value == "undefined") {
          return def;
        }
      }

      if (transform) {
        return transform(value);
      }

      return value;
    },
    issueJobCommand(cmd, params) {
      axios.post("/job", {
        command: cmd,
        ...params
      });
    },
    flag(k) {
      return this.val(this.state.flags, "k", false);
    }
  }
};
</script>