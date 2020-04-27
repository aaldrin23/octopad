<template>
  <section>
    <v-row>
      <v-col>
        <v-slider
          @change="show = true"
          v-model="model"
          label="Feed Rate %"
          :thumb-size="24"
          thumb-label="always"
          :max="200"
        ></v-slider>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="reset" color="primary" small>100%</v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="show" persistent max-width="500px">
      <v-card>
        <v-card-title class="pa-2">Confirm Changes</v-card-title>
        <v-card-text>{{`Apply new Feed rate ${model}% ? `}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel" text>Cancel</v-btn>
          <v-btn @click="confirmed" color="primary">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      default: null
    }
  },
  data() {
    return {
      show: false,
      model: 100,
      oldVal: 100
    };
  },
  methods: {
    reset() {
      this.model = 100;
      this.confirmed();
    },
    confirmed() {
      axios.post("printer/printhead", {
        command: "feedrate",
        factor: this.model
      });
      this.oldVal = this.model;
      this.show = false;
    },
    cancel() {
      this.model = this.oldVal;
      this.show = false;
    }
  }
};
</script>