<template>
  <section>
    <v-row align="center">
      <v-col cols="auto" class="mr-auto">
        {{label}} -
        <span class="title">{{actual}}&deg;C</span>
      </v-col>
      <v-col cols="5" class="pa-0">
        <number-input :placeholder="`${target || '0'}°C`" v-model.number="newTarget"></number-input>
      </v-col>
      <v-col cols="auto">
        <v-btn
          @click="setNewTarget(newTarget)"
          color="primary"
          class="pa-0"
          style="min-width : 40px"
        >
          <v-icon>mdi-check-bold</v-icon>
        </v-btn>
        <v-menu offset-y>
          <template #activator="{on}">
            <v-btn v-on="on" color="primary" class="pa-0 elevation-0" style="min-width : 10px">
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item @click="setNewTarget(0)">
              <v-list-item-title>Off</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              @click="setNewTarget(profile.value)"
              v-for="(profile,i) in profiles"
              :key="i"
            >
              <v-list-item-title>{{profile.name}}</v-list-item-title>
              <span class="mx-1">-</span>
              ({{profile.value}}&deg;C)
              <v-list-item-action>
                <v-btn @click="removeProfile(profile)" icon>
                  <v-icon small color="red">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-list-item @click="addProfileDialog =true" :disabled="disabledAdd">
              <v-list-item-title>
                <v-icon :disabled="disabledAdd" small left>mdi-plus</v-icon>Add
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-dialog v-model="addProfileDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="pa-2">Add to Profile</v-card-title>
        <v-card-text class="pa-2">
          <div align="center" class="display-1 ma-2">{{`${newTarget}&deg;C`}}</div>
          <v-text-field v-model="newProfileName" label="Name" hide-details solo></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addProfileDialog = false" text>Cancel</v-btn>
          <v-btn @click="saveNewProfile" color="primary">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import clone from "lodash.clone";
import NumberInput from "@/components/NumberInput";
import { mapState } from "vuex";
export default {
  props: {
    label: {
      type: String
    },
    dataKey: {
      type: String
    }
  },
  components: {
    NumberInput
  },
  data() {
    return {
      profiles: [],
      newTarget: undefined,
      addProfileDialog: false,
      newProfileName: ""
    };
  },
  computed: {
    ...mapState({
      actual(state) {
        return state.temp[this.dataKey].actual;
      },
      target(state) {
        return state.temp[this.dataKey].target;
      }
    }),
    disabledAdd() {
      return (
        !this.newTarget ||
        this.profiles.findIndex(e => e.value == this.newTarget) >= 0
      );
    }
  },
  created() {
    const profile = this.$ls.get(`temp_profiles.${this.dataKey}`) || [];
    this.profiles.push(...profile);
  },
  methods: {
    saveNewProfile() {
      const data = {
        name: this.newProfileName,
        value: this.newTarget
      };

      const key = this.dataKey;
      const profiles = this.$ls.get(`temp_profiles.${key}`) || [];

      profiles.push(data);

      this.$ls.set(`temp_profiles.${key}`, profiles);

      this.profiles.push(data);
      this.addProfileDialog = false;
      this.newTarget = undefined;
    },
    removeProfile(profile) {
      const index = this.profiles.findIndex(e => e.name == profile.name);
      this.profiles.splice(index, 1);

      this.$ls.set(`temp_profiles.${this.dataKey}`, this.profiles);
    },
    setNewTarget(value) {
      this.$emit("update", value);
      this.newTarget = undefined;
    }
  }
};
</script>