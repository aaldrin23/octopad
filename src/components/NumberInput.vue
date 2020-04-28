<template>
  <v-text-field
    v-model.number="model"
    type="number"
    hide-details
    dense
    solo
    v-bind="$attrs"
    class="number_input pt-0 mt-0"
  >
    <template v-if="showControl" #prepend-inner>
      <v-btn @click.stop="decrement" icon>
        <v-icon small>mdi-arrow-left-thick</v-icon>
      </v-btn>
    </template>
    <template v-if="showControl" #append>
      <v-btn @click.stop="increment" icon>
        <v-icon small>mdi-arrow-right-thick</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: {
    value: {
      type: Number | String
    },
    showControl: {
      type: Boolean
    }
  },
  data() {
    return {
      model: undefined
    };
  },
  methods: {
    increment() {
      if (typeof this.model == "undefined") {
        this.model = 0;
      }
      this.model++;
    },
    decrement() {
      if (typeof this.model != "undefined" && this.model > 0) {
        this.model--;
      }
    }
  },
  watch: {
    model(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.model = val;
    }
  }
};
</script>
<style  lang="scss">
.number_input {
  .v-input__slot {
    padding: 0 !important;

    input {
      text-align: center;
    }
  }
}
</style>