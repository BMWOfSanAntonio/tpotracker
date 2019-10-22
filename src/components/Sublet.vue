<template>
  <v-container class="sublet mt-10">
    <!-- // * Title -->
    <div class="mb-4 display-2 font-weight-thin">Sublet</div>
    <!-- // * Table: Start -->
    <v-data-table
      :headers="$store.state.sublet_headers"
      :items="sublet"
      class="elevation-1"
    >
      <template v-slot:item.numDays="{ item }">{{ numberDays(item) }}</template>
      <template v-slot:top>
        <!-- // * Dialog: Start -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <!-- Dialog title -->
            <v-card-title>
              <span class="headline">Additional Information</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <!-- // * Vehicle Information -->
                <v-row>
                  <!-- // * VIN -->
                  <v-col cols="12">
                    <div class="title">VIN: {{ editedItem.vin }}</div>
                  </v-col>
                  <!-- // * Year -->
                  <v-col cols="12">
                    <div class="title">Year: {{ editedItem.year }}</div>
                  </v-col>
                  <!-- // * Make-->
                  <v-col cols="12">
                    <div class="title">Make: {{ editedItem.make }}</div>
                  </v-col>
                  <!-- // * Model -->
                  <v-col cols="12">
                    <div class="title">Model: {{ editedItem.model }}</div>
                  </v-col>
                  <!-- // * Color -->
                  <v-col cols="12">
                    <div class="title">Color: {{ editedItem.color }}</div>
                  </v-col>
                  <!-- // * Comments -->
                  <v-col cols="12">
                    <div class="title">
                      Comments:
                      <span class="comment-text">{{
                        editedItem.comments
                      }}</span>
                    </div>
                  </v-col>
                  <!-- // * Repair Information -->
                  <v-col cols="12">
                    <!-- Title -->
                    <div class="title">
                      Repairs:
                      <template v-for="repair in editedItem.repairs">
                        <!-- // * If the repair string contains the word "Complete" then this will show, will be green -->
                        <v-chip
                          v-if="repair.includes('Complete')"
                          @click="completeRepair(repair, editedItem)"
                          dark
                          class="mr-1"
                          color="success"
                          :key="repair"
                          >{{ repair }}</v-chip
                        >

                        <!-- // * If the repair has not been completed then it will show up gray -->
                        <v-chip
                          v-else
                          @click="completeRepair(repair, editedItem)"
                          dark
                          class="mr-1"
                          color="null"
                          :key="repair"
                          >{{ repair }}</v-chip
                        >
                      </template>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn @click="sendback(editedItem)" color="blue darken-1" text
                >Send Back</v-btn
              >
              <v-btn color="blue darken-1" text @click="complete(editedItem)"
                >Complete</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Dialog: End -->
      </template>
      <!-- // * Chips for the table -->
      <template v-slot:item.repairs="{ item }">
        <v-progress-linear :value="progress(item)" height="25" reactive>
          <strong>{{ Math.ceil(progress(item)) }}%</strong>
        </v-progress-linear>
        <!-- <v-progress-linear :value="progress(item)"></v-progress-linear> -->
      </template>
      <template v-slot:item.action="{ item }">
        <!-- // * Will show the dialog window -->
        <v-icon color="blue" class="mr-2" @click="editItem(item)"
          >mdi-information</v-icon
        >
        <!-- // * Delete an item -->
        <v-icon color="red" @click="deleteItem(item)">mdi-delete</v-icon>
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
  name: "Sublet",
  props: ["user"],
  data: () => ({
    sublet: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {},
    repairColor: null,
    // * Progress bar
    level: "",
    currentTime: Date.now(),
    state: "started"
  }),

  // ! Vuetify table dependency, DO NOT REMOVE UNLESS YOU KNOW WHAT YOU ARE DOING...
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  methods: {
    //   * Buttons
    editItem(item) {
      this.editedIndex = this.sublet.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let answer = confirm("Are you sure you want to delete this item?");
      if (answer) {
        db.collection("tpo")
          .doc(item.id)
          .update({
            sublet: "Deleted",
            sublet_inspection: "Deleted",
            shop_delete_timestamp: Date.now()
          });
      }
    },
    // * Modal Functions
    completeRepair(repair, item) {
      console.log(item);
      // * Filters the sublet array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filterrepair = this.sublet.filter(sublet => {
        return sublet.vin == item.vin;
      });

      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          repairs: firebase.firestore.FieldValue.arrayUnion(
            repair + " - Complete"
          )
        });
      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          repairs: firebase.firestore.FieldValue.arrayRemove(repair)
        })
        .then(() => {
          filterrepair = this.sublet.filter(sublet => {
            return sublet.vin == item.vin;
          });
          this.editedIndex = this.sublet.indexOf(filterrepair[0]);
          this.editedItem = Object.assign({}, filterrepair[0]);
        });
    },
    complete(item) {
      let progress = this.progress(item);
      // * Filters the sublet array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filterrepair = this.sublet.filter(sublet => {
        return sublet.vin == item.vin;
      });
      console.log(progress);
      if (progress == 100) {
        console.log(progress);
        db.collection("tpo")
          .doc(filterrepair[0].id)
          .update({
            sublet: "Complete",
            sublet_complete_timestamp: Date.now()
          })
          .then(() => {
            db.collection("mail").add({
              to: "james.shiflett@principleauto.com",
              message: {
                subject: "Sublet Complete: " + filterrepair[0].vin + "",
                text:
                  "This vehicle has been completed in sublet, will now be taken to detail."
              }
            });
          });
        this.close();
      }
    },
    sendback(i) {
      let filterrepair = this.sublet.filter(sublet => {
        return sublet.vin == i.vin;
      });
      db.collection("tpo")
        .doc(filterrepair[0].id)
        .update({
          sublet: "In process",
          shop: "In process",
          sublet_inspection: "In process"
        });
      this.close();
    },
    // * Essentials
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    // * Other
    progress(item) {
      let count = 0;
      let length = item.repairs.length;
      item.repairs.forEach(element => {
        console.log(element);
        if (element.includes("Complete")) {
          count++;
        }
      });
      this.level = (count / length) * 100;
      return (count / length) * 100;
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
  // * Database
  firestore() {
    return {
      sublet: db
        .collection("tpo")
        .where("shop", "==", "Complete")
        .where("sublet_inspection", "==", "Complete")
        .where("sublet", "==", "In process")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped>
.inline {
  display: inline-block;
}

.comment-text {
  font-size: 16px;
  color: black;
  font-weight: normal;
  display: block;
}
</style>