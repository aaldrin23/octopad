<template>
  <v-btn @click="send" color="primary" v-bind="$attrs">
    <v-icon v-if="icon" :left="!!text">{{icon}}</v-icon>
    <slot>{{text}}</slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    text: String,
    icon: String,
    commands: Array
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