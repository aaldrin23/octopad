<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-avatar size="40" color="transparent">
        <v-img src="@/assets/logo.svg"></v-img>
      </v-avatar>
      <span class="px-2">OctoCon</span>
      <v-spacer></v-spacer>
      <v-dialog v-model="showSettings" scrollable persistent max-width="500px">
        <template #activator="{on}">
          <v-btn v-on="on" icon>
            <v-icon>mdi-tune</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="pa-2">
            <v-icon left>mdi-tune</v-icon>Settings
            <v-spacer></v-spacer>
            <v-btn @click="showSettings = false" icon>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-3">Coming soon!</v-card-text>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>
<script>
export default {
  data() {
    return {
      showSettings: false
    };
  }
};
</script>
