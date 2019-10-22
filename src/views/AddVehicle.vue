<template>
  <v-container>
    <div>
      <v-alert
        v-model="alert1"
        border="left"
        close-text="Close Alert"
        color="green darken-2"
        dark
        dismissible
      >Vehicle has been added!</v-alert>
    </div>
    <v-card class="mt-5">
      <v-card-title>
        <div class="display-2 font-weight-thin">Add a Vehicle</div>
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
      </v-card-text>
      <v-card-actions>
        <v-container>
          <v-row>
            <v-col>
              <v-btn @click="addCar" large color="success">Submit</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>
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
  name: "AddVehicle",
  props: ["user"],
  data() {
    return {
      // * Snackbar
      alert: false,
      alert1: false,
      text: "Make sure you fill out all required fields.",
      timeout: 3000,
      // * Form Variables
      vin: null,
      year: null,
      make: null,
      model: null,
      color: null
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
        // * Start Alert
        this.alert1 = true;
      } else {
        // * Shows the snackbar if you did not fill out the form completely. Snack bar is located at the bottom on the component.
        this.alert = true;
      }
    }
  }
};
</script>

 