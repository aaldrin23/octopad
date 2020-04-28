<template>
  <section>
    <v-progress-linear v-if="loading && $store.state.connected" indeterminate></v-progress-linear>
    <div v-else>
      <span class="title primary--text px-3">Files</span>
      <v-list rippl>
        <v-list-item @click="stack.pop()" v-if="items.children">
          <v-list-item-title>
            <v-icon>mdi-arrow-left</v-icon>
            ...{{`/${items.name}`}}
          </v-list-item-title>
        </v-list-item>
        <template v-for="file in items.children || items">
          <v-list-item v-if="file.type == 'machinecode'" :key="file.date" :ripple="false">
            <v-list-item-action>
              <v-icon>mdi-file-document</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <span
                :class="file.prints ? (file.prints.last.success? 'primary--text' : 'red--text') : ''"
              >{{file.name}}</span>
            </v-list-item-content>
            <v-list-item-action>
              <v-menu offset-x left>
                <template #activator="{on}">
                  <v-btn v-on="on" icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item @click="loadFile(file)">
                    <v-list-item-title>
                      <v-icon left small color="primary">mdi-file</v-icon>Load
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <v-icon left small color="red">mdi-delete</v-icon>Delete
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
          <v-list-item @click="stack.push(file)" v-else :key="file.name">
            <v-list-item-action>
              <v-icon color="primary">mdi-folder</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{file.name}}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      loading: true,
      stack: [],
      files: []
    };
  },
  computed: {
    ...mapState(["connected"]),
    items() {
      const s = this.stack;
      return s[s.length - 1];
    },
    server_ip() {
      return this.$ls.get("server_ip");
    }
  },
  created() {
    if (this.connected) {
      this.getFiles();
    }
  },
  methods: {
    getFiles() {
      axios.get("files", { params: { recursive: true } }).then(({ data }) => {
        data.files.sort(function(a, b) {
          return a.type == "folder" ? -1 : 1;
        });
        this.files = data;
        this.stack.push(this.files.files);
        this.loading = false;
      });
    },
    loadFile(file) {
      axios.post(`/files/${file.origin}/${file.path}`, {
        command: "select"
      });
    }
  },
  watch: {
    connected: "getFiles"
  }
};
</script>