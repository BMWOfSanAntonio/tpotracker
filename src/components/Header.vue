<template>
  <v-container>
    <!-- // ! Header: Start -->
    <v-toolbar class="mt-5 mb-5" flat>
      <!-- // * User Avatar -->
      <v-avatar class="mr-2">
        <img :src="user.photoURL" alt="Principle Auto Employee" />
      </v-avatar>
      <!-- // * User Name -->
      <v-toolbar-title>{{ user.displayName }}</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <!-- // * Add a vehicle modal: Start -->
      <template>
        <v-dialog v-model="dialog" max-width="600px">
          <!-- // * Add button -->
          <template
            v-slot:activator="{ on }"
          >
            <v-btn v-on="on" icon>
              <v-icon large color="blue">mdi-plus-circle</v-icon>
            </v-btn>
          </template>
          <!-- // * Form: Start -->
          <v-card>
            <v-card-title>
              <span class="headline">Add New Pre-Owned Vehicle</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <!-- // * VIN -->
                  <v-col cols="12" sm="12">
                    <v-text-field v-model="vin" label="VIN*"></v-text-field>
                  </v-col>

                  <!-- // * Year -->
                  <v-col cols="12" sm="4">
                    <v-select v-model="year" :items="$store.state.years" label="Year*" required></v-select>
                  </v-col>

                  <!-- // * Make -->
                  <v-col cols="12" sm="6" md="4">
                    <v-select v-model="make" :items="$store.state.makes" label="Make*"></v-select>
                  </v-col>

                  <!-- // * Model -->
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="model"
                      label="Model*"
                      hint="430i, F150, Silverado 1500, etc."
                      persistent-hint
                      required
                    ></v-text-field>
                  </v-col>

                  <!-- // * Color -->
                  <v-col cols="12" sm="12">
                    <v-select v-model="color" :items="$store.state.colors" label="Color*"></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <!-- // * Modal buttons: Form submit -->
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
              <v-btn @click="addCar" color="blue darken-1" text>Submit</v-btn>
            </v-card-actions>
          </v-card>
          <!-- // * Form: End -->
        </v-dialog>
      </template>
      <!-- // * Add a vehicle modal: End -->
    </v-toolbar>
    <!-- // ! Header: End -->
    <!-- // ! Snackbar: Start -->
    <div class="text-center">
      <v-snackbar v-model="alert" :timeout="timeout">
        {{ text }}
        <v-btn color="blue" text @click="alert = false">Close</v-btn>
      </v-snackbar>
    </div>
    <!-- // ! Snackbar: End -->
  </v-container>
</template>

<script>
// * Imports
import { db } from "../main";
import firebase from "firebase";

export default {
  name: "Header",
  props: ["user"],
  data() {
    return {
      // * Snackbar
      alert: false,
      text: "Make sure you fill out all required fields.",
      timeout: 3000,
      // * Form Variables
      vin: null,
      year: null,
      make: null,
      model: null,
      color: null,
      //   * Dialog
      dialog: false,
      // * Database pullins
      tpo: []
    };
  },
  methods: {
    // * Adding a car to the database
    addCar() {
      // Only when the entire form is filled out can the form be submitted
      if (
        this.vin !== null &&
        this.year !== null &&
        this.make !== null &&
        this.model !== null &&
        this.color !== null
      ) {
        db.collection("tpo").add({
          // * Form Values
          vin: this.vin,
          year: this.year,
          make: this.make,
          model: this.model,
          color: this.color,
          // * Timestamps
          initial_timestamp: Date.now(),
          // * Statuses
          shop: "In process",
          sublet_inspection: "In process",
          sublet: "In process",
          detail: "In process",
          // * Extras
          repairs: []
        });
        // Resetting the values to null
        this.vin = null;
        this.year = null;
        this.make = null;
        this.model = null;
        this.color = null;
        // * Closes the modal window
        this.dialog = false;
      } else {
        // * Shows the snackbar if you did not fill out the form completely. Snack bar is located at the bottom on the component.
        this.alert = true;
      }
    }
  }
};
</script>
