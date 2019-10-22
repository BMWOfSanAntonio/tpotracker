<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>TPO</span>
        <span class="font-weight-light">Tracker</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="user" text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-content>
      <router-view :user="user"></router-view>
    </v-content>
  </v-app>
</template>

<script>
// * Imports
import { db } from "./main";
import firebase from "firebase";
export default {
  name: "App",
  data: () => ({
    user: firebase.auth().currentUser
  }),
  methods: {
    logout() {
      firebase.auth().signOut();
      this.$router.push("/login");
    }
  }
};
</script>
