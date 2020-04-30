<template>
  <v-row justify="center" class="ma-0">
    <v-card>
      <v-card-text>
        <graph :chart-data="cahrtData" :options="chartOptions"></graph>
      </v-card-text>
    </v-card>
    <v-col cols="12" class="pa-0 mt-3">
      <v-card>
        <v-card-text>
          <temp-control
            @update="sendCommand('heat_tools',{targets : {tool0 : $event}})"
            label="Tool"
            data-key="tool0"
          ></temp-control>
          <v-divider class="my-2"></v-divider>
          <temp-control
            @update="sendCommand('heat_bed',{target : $event})"
            label="Bed"
            data-key="bed"
          ></temp-control>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import clone from "lodash.clone";
import Graph from "./TempGraph";

import TempControl from "@/components/TempControl";
export default {
  components: {
    Graph,
    TempControl
  },
  data() {
    return {
      chartOptions: {
        legend: {
          labels: {
            boxWidth: 10
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: true
              },
              ticks: {
                beginAtZero: true,
                stepSize: 50,
                suggestedMax: 300
              }
            }
          ]
        }
      },
      cahrtData: {
        datasets: [
          {
            backgroundColor: "#f87979",
            data: [1, 2, 3, 4]
          },
          {
            backgroundColor: "#f87979",
            data: [1, 2, 3, 4]
          }
        ]
      }
    };
  },
  async created() {
    const [{ data: tool }, { data: bed }] = await Promise.all([
      axios.get("printer/tool?history=true&limit=30"),
      axios.get("printer/bed?history=true&limit=30")
    ]);

    let cahrtData = {
      datasets: []
    };
    const heaters = {};

    tool.history.forEach(e => {
      Object.keys(e).forEach(t => {
        heaters[t] = heaters[t] ? [...heaters[t], e[t]] : [e[t]];
      });
    });
    bed.history.forEach(e => {
      Object.keys(e).forEach(t => {
        heaters[t] = heaters[t] ? [...heaters[t], e[t]] : [e[t]];
      });
    });

    const colors = ["255,0,0", "0,0,255"];

    Object.keys(heaters).forEach((toolKey, IData) => {
      const toolData = heaters[toolKey];

      let actual = [];
      let target = [];

      for (let i = 0; i < toolData.length; i++) {
        const temp = toolData[i];

        actual.push(temp.actual);
        target.push(temp.target);
      }

      cahrtData.labels = target.map(e => ``);
      cahrtData.datasets.push({
        label: `Actual ${toolKey}`,
        backgroundColor: "transparent",
        borderColor: `rgba(${colors[IData]},1)`,
        pointRadius: 0,
        borderWidth: "1",
        data: actual
      });
      cahrtData.datasets.push({
        label: `Target ${toolKey}`,
        backgroundColor: "transparent",
        borderColor: `rgba(${colors[IData]},.5)`,
        pointRadius: 0,
        borderWidth: "1",
        data: target
      });
    });

    this.cahrtData = cahrtData;

    let vm = this;
    this.$eventBus.$on("server_message", e => {
      const { data } = e;
      const { current } = data;

      if (current) {
        if (current.temps && current.temps.length) {
          let temp = current.temps[0];

          let cData = clone(this.cahrtData);

          cData.datasets[0].data.push(temp.tool0.actual);
          cData.datasets[0].data.shift();
          cData.datasets[1].data.push(temp.tool0.target);
          cData.datasets[1].data.shift();

          cData.datasets[2].data.push(temp.bed.actual);
          cData.datasets[2].data.shift();
          cData.datasets[3].data.push(temp.bed.target);
          cData.datasets[3].data.shift();

          this.cahrtData = cData;
        }
      }
    });
  },
  methods: {
    sendCommand(cmd, args) {
      const command = {
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
      }[cmd];
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