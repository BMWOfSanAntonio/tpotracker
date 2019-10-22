<template>
  <v-container class="sublet mt-10">
    <!-- // * Title -->
    <div class="mb-4 display-2 font-weight-thin">Interior</div>
    <!-- // * Table: Start -->
    <v-data-table :headers="$store.state.shop_headersalt" :items="sublet" class="elevation-1">
      <template v-slot:item.comments="{ item }">{{ item.comments }}</template>
      <!-- Buttons -->
      <template v-slot:item.action="{ item }">
        <v-icon color="success" class="mr-2" @click="completeRepair(item)">mdi-check</v-icon>
      </template>
    </v-data-table>
    <!-- // * Table: End -->
  </v-container>
</template>

<script>
// * Imports
import { db } from "../../main";
import firebase from "firebase";

export default {
  name: "PDR",
  props: ["user"],
  data: () => ({
    sublet: []
  }),

  methods: {
    // * Modal Functions
    completeRepair(item) {
      console.log(item);
      // * Filters the sublet array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filterrepair = this.sublet.filter(sublet => {
        return sublet.vin == item.vin;
      });

      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          repairs: firebase.firestore.FieldValue.arrayUnion(
            "Interior - Complete"
          )
        });
      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          repairs: firebase.firestore.FieldValue.arrayRemove("Interior")
        });
    }
  },
  // * Database
  firestore() {
    return {
      sublet: db
        .collection("tpo")
        .where("shop", "==", "Complete")
        .where("sublet_inspection", "==", "Complete")
        .where("sublet", "==", "In process")
        .where("repairs", "array-contains", "Interior")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped>
.inline {
  display: inline-block;
}
</style>