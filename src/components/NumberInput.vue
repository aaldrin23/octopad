<template>
  <v-text-field
    v-model.number="model"
    type="number"
    hide-details
    dense
    solo
    class="pt-0 mt-0"
    v-bind="$attrs"
  >
    <template #prepend-inner>
      <v-btn @click.stop="decrement" icon>
        <v-icon>mdi-arrow-left-thick</v-icon>
      </v-btn>
    </template>
    <template #append>
      <v-btn @click.stop="increment" icon>
        <v-icon>mdi-arrow-right-thick</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: {
    value: {
      type: Number | String
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