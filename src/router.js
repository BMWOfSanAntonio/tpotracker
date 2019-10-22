import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";
import { db } from "./main";

// * Components
import Manager from "./views/Manager.vue";
import Shop from "./views/Shop.vue";
import SubletInspection from "./views/SubletInspection";
import Sublet from "./views/Sublet";
import AddVehicle from "./views/AddVehicle";
// * Sublet Components
import PDR from "./views/subviews/PDR";
import WheelRepair from "./views/subviews/WheelRepair";
import Windshield from "./views/subviews/Windshield";
import Interior from "./views/subviews/Interior";
import Ozone from "./views/subviews/Ozone";
import Paint from "./views/subviews/Paint";
// * Login
import Login from "./views/Login";

Vue.use(Router);

const router = new Router({
  routes: [
    // * Manager View
    {
      path: "/",
      name: "Manager",
      component: Manager,
      meta: {
        requiresAuth: true
      }
    },
    // * Shop View
    {
      path: "/shop",
      name: "Shop",
      component: Shop,
      meta: {
        requiresAuth: true
      }
    },
    // * Sublet Inspection
    {
      path: "/subletinspection",
      name: "SubletInspection",
      component: SubletInspection,
      meta: {
        requiresAuth: true
      }
    },
    // * Sublet
    {
      path: "/sublet",
      name: "Sublet",
      component: Sublet
    },
    // * AddVehicle
    {
      path: "/addvehicle",
      name: "AddVehicle",
      component: AddVehicle,
      meta: {
        requiresAuth: true
      }
    },
    // ! Sublet Subviews
    // * PDR
    {
      path: "/pdr",
      name: "PDR",
      component: PDR
    },
    // * Wheel Repair
    {
      path: "/wheels",
      name: "WheelRepair",
      component: WheelRepair
    },
    // * Windshield
    {
      path: "/windshield",
      name: "Windshield",
      component: Windshield
    },
    // * Interior
    {
      path: "/interior",
      name: "Interior",
      component: Interior
    },
    // * Ozone
    {
      path: "/ozone",
      name: "Ozone",
      component: Ozone
    },
    // * Paint
    {
      path: "/paint",
      name: "Paint",
      component: Paint
    },
    // * Login
    {
      path: "/login",
      name: "Login",
      component: Login
    }
  ]
});

router.beforeEach((to, from, next) => {
  let cred = firebase.auth().currentUser;
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    if (cred) {
      db.collection("users")
        .doc(cred.email)
        .get()
        .then(doc => {
          // check auth state of user
          if (
            (doc.data().access_level == "SalesManager" ||
              doc.data().access_level == "Admin") &&
            to.name == "Manager"
          ) {
            next();
          } else if (
            doc.data().access_level == "SubletInspection" &&
            to.name == "SubletInspection"
          ) {
            next();
          } else if (doc.data().access_level == "Shop" && to.name == "Shop") {
            next();
          } else if (
            doc.data().access_level == "Porter" &&
            to.name == "AddVehicle"
          ) {
          } else {
            next("/sublet");
          }
          // User is signed in. Proceed to route
        });
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
