<template>
  <v-container class="sublet-inspection mt-10">
    <!-- // * Title -->
    <div class="mb-4 display-2 font-weight-thin">Sublet Inspection</div>
    <!-- // * Table: Start -->
    <v-data-table
      :headers="$store.state.shop_headers"
      :items="sublet_inspection"
      class="elevation-1"
    >
      <template v-slot:item.numDays="{ item }">{{ numberDays(item) }}</template>
      <template v-slot:top>
        <!-- // * Information Dialog: Start -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <!-- // * Modal title -->
            <v-card-title>
              <span class="headline">VIN: {{ editedItem.vin }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <!-- // * Modal Information -->
                <v-row>
                  <!-- // * Year -->
                  <v-col cols="12">
                    <div class="title">Year: {{ editedItem.year }}</div>
                  </v-col>
                  <!-- // * Make -->
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
                </v-row>
                <!-- Horizontal row -->
                <v-divider></v-divider>
                <!-- // * Repair selctions -->
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.repairs"
                    :items="$store.state.sublet"
                    chips
                    label="Repairs to be completed"
                    multiple
                  ></v-select>
                </v-col>
                <!-- // * Comments -->
                <v-col cols="12">
                  <v-textarea
                    v-model="editedItem.comments"
                    :items="$store.state.sublet"
                    chips
                    label="Repairs to be completed"
                    multiple
                  ></v-textarea>
                </v-col>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="closeInfo">Cancel</v-btn>
              <v-btn @click="nosublet(editedItem)" color="success" text>No Sublet</v-btn>
              <v-btn color="blue darken-1" text @click="complete(editedItem)">Complete Inspection</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Information Dialog: End -->
        <!-- // * Edit Dialog: Start -->
        <v-dialog v-model="dialog1" max-width="500px">
          <v-card>
            <!-- // * Modal title -->
            <v-card-title>
              <span class="headline">VIN: {{ editedItem.vin }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <!-- // * Modal Information -->
                <v-row>
                  <!-- // * VIN -->
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.vin" label="VIN"></v-text-field>
                  </v-col>
                  <!-- // * Year -->
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.year" label="Year"></v-text-field>
                  </v-col>
                  <!-- // * Make -->
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.make" label="Make"></v-text-field>
                  </v-col>
                  <!-- // * Model -->
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.model" label="Model"></v-text-field>
                  </v-col>
                  <!-- // * Color -->
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedItem.color" label="Color"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="closeEdit">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save(editedItem)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Edit Dialog: End -->
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="orange" class="mr-2" @click="informationSublet(item)">mdi-information</v-icon>
        <v-icon color="blue" class="mr-2" @click="editSublet(item)">mdi-pencil</v-icon>
        <v-icon color="red" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <!-- // * Table: End -->
    <!-- // ! Structure for edit modal -->
    <div class="text-center ma-2">
      <v-snackbar timeout="2000" v-model="alert">
        Please make sure you fill out all fields.
        <v-btn color="error" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";
export default {
  name: "Shop",
  props: ["user"],
  data: () => ({
    //   * Database
    sublet_inspection: [],
    // * Information dialog
    dialog: false,
    dialog1: false,
    repairs: [],
    editedIndex: -1,
    editedItem: {},
    // * Edit dialog
    currentTime: Date.now(),
    state: "started",
    alert: false
  }),

  // ! Vuetify table dependency, DO NOT REMOVE UNLESS YOU KNOW WHAT YOU ARE DOING...
  watch: {
    dialog(val) {
      val || this.closeInfo();
    }
  },

  methods: {
    //   * Buttons
    editSublet(item) {
      this.editedIndex = this.sublet_inspection.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog1 = true;
    },
    informationSublet(item) {
      this.editedIndex = this.sublet_inspection.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      let answer = confirm("Are you sure you want to delete this item?");
      if (answer) {
        db.collection("tpo")
          .doc(item.id)
          .update({
            shop: "Deleted",
            sublet_inspection: "Deleted",
            sublet_inspection_delete_timestamp: Date.now()
          });
      }
    },
    // * Information modal
    complete(item) {
      // * Filters the sublet inspection array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtersubletinspection = this.sublet_inspection.filter(sublet => {
        return sublet.vin == item.vin;
      });
      if (item.comments) {
        db.collection("tpo")
          .doc(filtersubletinspection[0].id)
          .update({
            sublet_inspection: "Complete",
            sublet_inspection_complete_timestamp: Date.now(),
            sublet_instpection_associate: this.user.displayName,
            repairs: item.repairs,
            comments: item.comments
          });
        this.closeInfo();
      } else {
        this.alert = true;
      }
    },
    nosublet(item) {
      // * Filters the sublet inspection array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtersubletinspection = this.sublet_inspection.filter(sublet => {
        return sublet.vin == item.vin;
      });
      if (item.comments) {
        db.collection("tpo")
          .doc(filtersubletinspection[0].id)
          .update({
            sublet_inspection: "Complete",
            sublet_inspection_complete_timestamp: Date.now(),
            sublet_inspection_associate: this.user.displayName,
            sublet: "Complete",
            comments: item.comments,
            repairs: null
          });
      } else {
        db.collection("tpo")
          .doc(filtersubletinspection[0].id)
          .update({
            sublet_inspection: "Complete",
            sublet_inspection_complete_timestamp: Date.now(),
            sublet_inspection_associate: this.user.displayName,
            sublet: "Complete",
            repairs: null
          });
      }

      this.closeInfo();
    },
    closeInfo() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    // * Edit modal
    save(item) {
      // * Filters the sublet inspection array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtersubletinspection = this.sublet_inspection.filter(sublet => {
        return sublet.vin == item.vin;
      });
      db.collection("tpo")
        .doc(filtersubletinspection[0].id)
        .update({
          vin: item.vin,
          year: item.year,
          make: item.make,
          model: item.model,
          color: item.color,
          sublet_inspection_edit_timestamp: Date.now(),
          sublet_inspection_edit_associate: this.user.displayName
        });
      this.closeEdit();
    },
    closeEdit() {
      this.dialog1 = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
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
      sublet_inspection: db
        .collection("tpo")
        .where("sublet_inspection", "==", "In process")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped>
</style>
