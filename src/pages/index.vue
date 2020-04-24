<template>
  <div class="home">
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <tab-temperature></tab-temperature>
      </v-tab-item>
    </v-tabs-items>
    <v-bottom-navigation v-model="tab" fixed>
      <v-btn>
        <v-icon left>mdi-file-code-outline</v-icon>Files
      </v-btn>
      <v-btn>
        <v-icon left>mdi-thermometer-plus</v-icon>Temperature
      </v-btn>
      <v-btn>
        <v-icon left>mdi-controller-classic-outline</v-icon>Control
      </v-btn>
      <v-btn>
        <v-icon left>mdi-console</v-icon>Terminal
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script>
// @ is an alias to /src
import TabTemperature from "./__tabs__/temperature";
export default {
  name: "home",
  components: {
    TabTemperature
  },
  data() {
    return {
      tab: 0
    };
  }
};
</script>
