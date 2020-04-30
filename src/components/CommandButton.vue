<template>
  <v-btn @click="send" :color="color" v-bind="$attrs">
    <v-icon v-if="icon" :left="!!text">{{icon}}</v-icon>
    <slot>{{text}}</slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    text: String,
    icon: String,
    commands: Array,
    color: {
      default: "primary"
    }
  },
  methods: {
    send() {
      axios
        .post("/printer/command", {
          commands: this.commands,
          parameters: {}
        })
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