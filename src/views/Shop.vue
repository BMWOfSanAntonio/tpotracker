<template>
  <v-container class="shop">
    <Header :user="user" />
    <!-- // * Title -->
    <div class="mb-4 display-2 font-weight-thin">Shop</div>
    <!-- // * Table: Start -->
    <v-data-table :headers="$store.state.shop_headers" :items="shop" class="elevation-1">
      <template v-slot:item.numDays="{ item }">{{ numberDays(item) }}</template>
      <template v-slot:top>
        <!-- // * Edit Dialog: Start -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit Vehicle</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedItem.vin" label="VIN"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedItem.year" label="Year"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedItem.make" label="Make"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedItem.model" label="Model"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedItem.color" label="Color"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save(editedItem)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- // * Edit Dialog: End -->
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon color="green" class="mr-2" @click="complete(item)">mdi-check-circle</v-icon>
        <v-icon color="blue" class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
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

// * Components
import Header from "@/components/Header";

export default {
  name: "Shop",
  components: {
    Header
  },
  props: ["user"],
  data: () => ({
    shop: [],
    dialog: false,
    editedIndex: -1,
    editedItem: {},
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
      this.editedIndex = this.shop.indexOf(item);
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
            shop_delete_timestamp: Date.now()
          });
      }
    },
    complete(item) {
      db.collection("tpo")
        .doc(item.id)
        .update({
          shop: "Complete",
          shop_complete_timestamp: Date.now(),
          shop_associate: this.user.displayName
        });
    },
    // * Modal
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save(item) {
      // * Filters the shop array for a vin match, returns all matches (ideally one) to an array. You have to access it through an index [0]
      let filtershop = this.shop.filter(shop => {
        return shop.vin == item.vin;
      });
      db.collection("tpo")
        .doc(filtershop[0].id)
        .update({
          vin: item.vin,
          year: item.year,
          make: item.make,
          model: item.model,
          color: item.color,
          shop_edit_timestamp: Date.now()
        });
      this.close();
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
      shop: db
        .collection("tpo")
        .where("shop", "==", "In process")
        .orderBy("initial_timestamp")
    };
  }
};
</script>

<style scoped>
</style>