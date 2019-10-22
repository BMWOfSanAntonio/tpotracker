<template>
  <v-container class="detail mt-10">
    <!-- // * Title -->
    <div class="mb-4 display-2 font-weight-thin">Detail</div>
    <!-- // * Table: Start -->
    <v-data-table :headers="$store.state.shop_headers" :items="detail" class="elevation-1">
      <template v-slot:item.numDays="{ item }">{{ numberDays(item) }}</template>
      <template v-slot:item.action="{ item }">
        <v-icon color="green" class="mr-2" @click="complete(item)">mdi-check-circle</v-icon>
        <v-icon color="red" @click="deleteItem(item)">mdi-delete</v-icon>
        <v-icon @click="sendback(item)" class="ml-2" color="primary">mdi-arrow-left-circle</v-icon>
      </template>
    </v-data-table>
    <!-- // * Table: End -->
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";
export default {
  name: "Detail",
  data() {
    return {
      detail: [],
      currentTime: Date.now(),
      state: "started"
    };
  },
  methods: {
    deleteItem(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          detail: "Deleted",
          detail_delete_timestamp: Date.now(),
          detail_delete_associate: firebase.auth().currentUser.displayName
        });
    },
    complete(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          detail: "Complete",
          detail_complete_timestamp: Date.now(),
          detail_complete_associate: firebase.auth().currentUser.displayName
        });
    },
    sendback(i) {
      db.collection("tpo")
        .doc(i.id)
        .update({
          detail: "In process",
          sublet: "In process"
        });
    },
    numberDays(i) {
      return Math.floor((this.currentTime - i.initial_timestamp) / 86400000);
    },
    // * Other Methods
    updateCurrentTime: function() {
      if (this.$data.state == "started") {
        this.currentTime = Date.now();
      }
    },
    dateFormat(req) {
      return Math.floor((this.currentTime - req.initial_timestamp) / 60000);
    }
  },
  mounted() {
    this.interval = setInterval(this.updateCurrentTime, 1000);
    /* SmtpJS.com - v3.0.0 */
  },
  firestore() {
    return {
      detail: db
        .collection("tpo")
        .where("sublet", "==", "Complete")
        .where("shop", "==", "Complete")
        .where("detail", "==", "In process")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped>
</style>