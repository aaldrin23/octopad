<template>
  <v-container>
    <div v-if="$store.state.connected">
      <v-tabs-items v-model="tab" style="background : transparent">
        <v-tab-item>
          <job-panel></job-panel>
        </v-tab-item>
        <v-tab-item>
          <v-expansion-panels mandatory>
            <v-expansion-panel>
              <v-expansion-panel-header>Temperature</v-expansion-panel-header>
              <v-expansion-panel-content>
                <temp-control
                  @update="sendCommand('heat_tools',{targets : {tool0 : $event}})"
                  label="Tool"
                  data-key="tool0"
                ></temp-control>
                <temp-control
                  @update="sendCommand('heat_bed',{target : $event})"
                  label="Bed"
                  data-key="bed"
                ></temp-control>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Control</v-expansion-panel-header>
              <v-expansion-panel-content>
                <portal-target name="controls"></portal-target>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Filament</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="4">
                    <v-text-field
                      v-model.number="extruder_moveLength"
                      label="Length"
                      placeholder="5"
                      hide-details
                      dense
                      solo
                    >
                      <template #append>mm</template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      @click="sendCommand('tool',{amount : extruder_moveLength})"
                      color="primary"
                    >Extrude</v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      @click="sendCommand('tool',{amount : -extruder_moveLength})"
                      color="primary"
                    >Retract</v-btn>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-end">
                    <cmd-button text="Change" :commands="['M600']"></cmd-button>
                  </v-col>
                  <v-col cols="6" class="d-flex justify-start">
                    <cmd-button text="Load" :commands="['LOAD_FILAMENT']"></cmd-button>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Mesg Bed Leveling</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="4" class="d-flex justify-center">
                    <cmd-button
                      text="Start"
                      icon="mdi-play"
                      :commands="['G28', 'BED_MESH_CALIBRATE', 'TESTZ Z=-5']"
                    ></cmd-button>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-center">
                    <cmd-button text="Next" icon="mdi-skip-next" :commands=" ['ACCEPT']"></cmd-button>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-center">
                    <cmd-button text="Abort" icon="mdi-cancel" :commands=" ['ABORT']"></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button icon="mdi-arrow-up-bold-box-outline" :commands=" ['TESTZ Z=0.20']"></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button icon="mdi-arrow-up-bold-box-outline" :commands=" ['TESTZ Z=0.10']"></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button icon="mdi-arrow-up-bold-box-outline" :commands=" ['TESTZ Z=0.05']"></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button icon="mdi-arrow-up-bold-box-outline" :commands=" ['TESTZ Z=0.001']"></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">200&micro;</v-col>
                  <v-col cols="3" class="d-flex justify-center">100&micro;</v-col>
                  <v-col cols="3" class="d-flex justify-center">50&micro;</v-col>
                  <v-col cols="3" class="d-flex justify-center">10&micro;</v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button
                      icon="mdi-arrow-down-bold-box-outline"
                      :commands=" ['TESTZ Z=0.20']"
                    ></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button
                      icon="mdi-arrow-down-bold-box-outline"
                      :commands=" ['TESTZ Z=0.10']"
                    ></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button
                      icon="mdi-arrow-down-bold-box-outline"
                      :commands=" ['TESTZ Z=0.05']"
                    ></cmd-button>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <cmd-button
                      icon="mdi-arrow-down-bold-box-outline"
                      :commands=" ['TESTZ Z=0.001']"
                    ></cmd-button>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>Bed Corners Leveling</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="4" class="d-flex justify-end">
                    <cmd-button icon="mdi-play" :commands=" ['BED_SCREWS_ADJUST']">Start</cmd-button>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-center">
                    <cmd-button icon="mdi-skip-next" :commands=" ['ACCEPT']">Next</cmd-button>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-start">
                    <cmd-button icon="mdi-cancel" :commands=" ['ABORT']">Abort</cmd-button>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>Motors & Fan</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="auto">
                    <cmd-button
                      text="Motors Off"
                      icon="mdi-engine-off-outline"
                      :commands=" ['M18']"
                    ></cmd-button>
                  </v-col>
                  <v-col cols="auto">
                    <cmd-button text="Fa On" icon="mdi-fan" :commands=" ['M106 S255']"></cmd-button>
                  </v-col>
                  <v-col cols="auto">
                    <cmd-button text="Fa Off" icon="mdi-fan-off" :commands=" ['M106 S0']"></cmd-button>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
        <v-tab-item>
          <v-row justify="center" class="ma-0 d-flex">
            <v-card
              outlined
              class="d-flex justify-center align-center"
              style="height: 304px;min-height: 304px;width: 95%"
            >
              <v-row v-if="noCam" justify="center" style="position : absolute">
                <v-icon x-large>mdi-camera-off</v-icon>
              </v-row>
              <v-img
                v-show="!noCam"
                @error="cameraStreamError"
                @load="() => {noCam = false;loadingCamera = false}"
                :src="`http://${server_ip}/webcam/?action=stream`"
                height="304"
                class="d-flex"
              ></v-img>
            </v-card>
            <portal-target name="controls"></portal-target>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <v-img v-else src="@/assets/octoprint.png"></v-img>
    <portal to="controls">
      <controls></controls>
    </portal>
    <v-bottom-navigation v-model="tab" app fixed active-class="primary">
      <v-btn>
        <v-icon>mdi-printer-3d-nozzle</v-icon>
        <span>Job</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-controller-classic-outline</v-icon>
        <span>Control</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-camera</v-icon>
        <span>Camera</span>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<script>
// @ is an alias to /src
import clonedeep from "lodash.clonedeep";

import CmdButton from "@/components/CommandButton";
import TempControl from "@/components/TempControl";
import JobPanel from "@/components/JobPanel";
import Controls from "@/components/Controls";

import { mapMutations, mapState } from "vuex";
export default {
  name: "home",
  components: {
    CmdButton,
    TempControl,
    JobPanel,
    Controls
  },
  data() {
    return {
      tab: 0,
      noCam: false,
      loadingCamera: true,
      printhead_moveValue: 10,
      extruder_moveLength: 5,
      currentZ: 0,
      commandList: {
        home: {
          api: "printer/printhead",
          params: {
            command: "home"
          }
        },
        moveAxis: {
          api: "printer/printhead",
          params: {
            absolute: false,
            command: "jog"
          }
        },
        tool: {
          api: "printer/tool",
          params: { command: "extrude" }
        },
        command: {
          api: "printer/command"
        },
        heat_tools: {
          api: "printer/tool",
          params: {
            command: "target"
          }
        },
        heat_bed: {
          api: "printer/bed",
          params: {
            command: "target"
          }
        }
      }
    };
  },
  computed: {
    server_ip() {
      return this.$ls.get("server_ip");
    }
  },
  async created() {
    let vm = this;
    this.$eventBus.$on("server_message", e => {
      const { data } = e;
      const { current } = data;

      if (current) {
        if (current.temps && current.temps.length) {
          vm.setTemp(current.temps[0]);
        }
      }
    });
  },
  methods: {
    ...mapMutations(["setTemp"]),
    sendCommand(cmd, args) {
      const command = clonedeep(this.commandList[cmd]);
      const params = Object.assign(command.params || {}, args);

      axios
        .post(command.api, params)
        .then(res => {})
        .catch(e => {
          this.$toast.error("Something went wrong!", {
            x: "center",
            color: "red"
          });
        });
    },
    cameraStreamError() {
      this.noCam = true;
    }
  }
};
</script>
