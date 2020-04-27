<template>
  <v-row>
    <v-col cols="8">
      <v-row justify="center">
        <v-col cols="12" class="ma-0 d-flex justify-center">
          <v-btn
            @click="sendCommand('moveAxis',{y : printhead_moveValue})"
            color="primary"
            class="pa-0"
          >
            <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn
            @click="sendCommand('moveAxis',{x : -printhead_moveValue})"
            color="primary"
            class="d-flex ml-auto"
          >
            <v-icon>mdi-arrow-left-bold-box-outline</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4" class="d-flex justify-center">
          <v-btn @click="sendCommand('home',{axes : ['x','y']})" color="primary">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn
            @click="sendCommand('moveAxis',{x : printhead_moveValue})"
            color="primary"
            class="justify-start"
          >
            <v-icon>mdi-arrow-right-bold-box-outline</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" class="d-flex justify-center">
          <v-btn
            @click="sendCommand('moveAxis',{y : -printhead_moveValue})"
            color="primary"
            class="pa-0"
          >
            <v-icon>mdi-arrow-down-bold-box-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="sendCommand('moveAxis',{z : printhead_moveValue})" color="primary">
          <v-icon>mdi-arrow-up-bold-box-outline</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="sendCommand('home',{axes : ['z']})" color="primary">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-btn @click="sendCommand('moveAxis',{z : -printhead_moveValue})" color="primary">
          <v-icon>mdi-arrow-down-bold-box-outline</v-icon>
        </v-btn>
      </v-col>
    </v-col>
    <v-col cols="12" class="d-flex justify-center">
      <v-btn-toggle v-model="printhead_moveValue">
        <v-btn :value="0.1">0.1</v-btn>
        <v-btn :value="1">1</v-btn>
        <v-btn :value="10">10</v-btn>
        <v-btn :value="100">100</v-btn>
        <v-btn :value="200">200</v-btn>
      </v-btn-toggle>
    </v-col>
    <v-col cols="12">
      <feed-rate-slider></feed-rate-slider>
    </v-col>
    <v-col cols="12">
      <flow-rate-slider></flow-rate-slider>
    </v-col>
  </v-row>
</template>

<script>
import clonedeep from "lodash.clonedeep";
import FeedRateSlider from "@/components/FeedRateSlider";
import FlowRateSlider from "@/components/FlowRateSlider";
export default {
  components: {
    FeedRateSlider,
    FlowRateSlider
  },
  data() {
    return {
      printhead_moveValue: 10,
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
        }
      }
    };
  },
  methods: {
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
    }
  }
};
</script>