// ! Default Vue.js settings
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
Vue.config.productionTip = false;

// * Import Firebase & Vuefire
import firebase from "firebase";
import { firestorePlugin } from "vuefire";
import "firebase/firestore";

// * Plugins
Vue.use(firestorePlugin);

// * Initialize Firebase
// * Setting database config
const config = {
  apiKey: "AIzaSyDLiWuwmqt0LUt96DQH1D6vacBBBObQkAI",
  authDomain: "keytracker-e176b.firebaseapp.com",
  databaseURL: "https://keytracker-e176b.firebaseio.com",
  projectId: "keytracker-e176b",
  storageBucket: "keytracker-e176b.appspot.com",
  messagingSenderId: "1084196062284",
  appId: "1:1084196062284:web:5d81b521c622eb31"
};

// * Initalizing Firebase
firebase.initializeApp(config);

// * Exporting the database
export const db = firebase.firestore();

let app = null;

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});

// * Initial Roll Out 10/2/19
