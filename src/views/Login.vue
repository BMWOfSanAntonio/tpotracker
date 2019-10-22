<template>
  <v-container>
    <v-row class="test" justify="center" align="center">
      <v-col cols="12">
        <v-card class="mx-auto" max-width="500">
          <v-card-title>TPO Tracker Login</v-card-title>
          <v-card-text>Please login with your Principle Auto account.</v-card-text>
          <v-card-actions>
            <v-btn @click="login" text>Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { db } from "../main";
import firebase from "firebase";

export default {
  name: "Login",
  data() {
    return {};
  },
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(cred => {
          let ref = db.collection("users").doc(cred.user.email);
          ref.get().then(doc => {
            if (doc.exists) {
              if (
                doc.data().email == "barry.laird@principleauto.com" ||
                doc.data().access_level == "Admin"
              ) {
                this.$router.push("/");
              } else if (doc.data().access_level == "Shop") {
                this.$router.push("/shop");
              } else if (doc.data().access_level == "SubletInspection") {
                this.$router.push("/subletinspection");
              } else {
                this.$router.push("/sublet");
              }
            } else {
              console.log(cred);
              ref.set({
                display_name: cred.user.displayName,
                user_id: cred.user.uid,
                email: cred.user.email,
                access_level: "Unidentified"
              });
              this.$router.push("/sublet");
            }
          });
        })
        .catch(err => {
          alert("Oops. " + err.message);
        });
      console.log("done");
    }
  }
};
</script>

<style scoped>
.test {
  margin-top: 30%;
}
</style>