<template>
  <v-container>
    <v-row>
      <v-col cols>
        <temp-graph :options="cahrtOptions" :chart-data="chartData"></temp-graph>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SockJS from "sockjs-client";
import TempGraph from "@/components/charts/Temp";
import clone from "lodash.clone";
export default {
  components: {
    TempGraph
  },
  data() {
    return {
      cahrtOptions: {
        esponsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              ticks: {
                maxTicksLimit: 10
              }
            }
          ]
        }
      },
      chartData: {
        labels: [""],
        datasets: [
          {
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
            borderColor: "red",
            data: []
          },
          {
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
            borderColor: "rgba(255,0,0,0.5)",
            data: []
          },
          {
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
            borderColor: "blue",
            data: []
          },
          {
            fill: false,
            pointRadius: 0,
            borderWidth: 1,
            borderColor: "rgba(0,0,255,0.5)",
            data: []
          }
        ]
      }
    };
  },
  async created() {
    let vm = this;
    const { data } = await this.$axios.post("/login", {
      passive: true
    });
    var sock = new SockJS("http://octopi.local/sockjs");

    sock.onopen = function() {
      sock.send(
        JSON.stringify({
          auth: "aaldrin:" + data.session
        })
      );
    };

    sock.onmessage = function({ data }) {
      if (data.current) {
        vm.updateStatus(data.current);
      }
    };

    sock.onclose = function() {};
  },
  methods: {
    updateStatus(e) {
      if (e.temps.length) {
        this.updateTemp(e.temps[0]);
      }
    },
    updateTemp(temp) {
      const data = clone(this.chartData);

      const tool = temp.tool0;
      const bed = temp.bed;

      /*  if (data.datasets[0].data.length == 50) {
        for (let i = 0; i < 4; i++) {
          data.datasets[i].data.splice(0, 1);
        }
        data.labels.splice(0, 1);
      } */
      data.labels.push("");
      data.datasets[0].data.push(tool.actual);
      data.datasets[1].data.push(tool.target);
      data.datasets[2].data.push(bed.actual);
      data.datasets[3].data.push(bed.target);

      this.chartData = data;
    }
  }
};
</script>
