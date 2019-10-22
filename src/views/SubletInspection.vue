<template>
  <v-container class="sublet-inspection">
    <Header :user="user" />
    <SubletInspection :user="user" />
    <Sublet :user="user" />
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";

// * Components
import Header from "@/components/Header";
import SubletInspection from "@/components/SubletInspection";
import Sublet from "@/components/Sublet";

export default {
  name: "Shop",
  components: {
    Header,
    SubletInspection,
    Sublet
  },
  props: ["user"],
  data: () => ({
    //   * Database
    sublet_inspection: [],
    // * Information dialog
    dialog: false,
    dialog1: false,
    repairs: [],
    editedIndex: -1,
    editedItem: {}
    // * Edit dialog
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
    }
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
