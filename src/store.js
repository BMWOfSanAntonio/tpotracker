import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // * Lists
    sublet: [
      "Paintless Dent Removal",
      "Wheel Repair",
      "Windshield",
      "Interior",
      "Ozone",
      "Paint"
    ],
    subletalt: [
      {
        name: "Paintless Dent Removal",
        path: "/pdr"
      },
      {
        name: "Wheel Repair",
        path: "/wheels"
      },
      {
        name: "Windshield",
        path: "/windshield"
      },
      {
        name: "Interior",
        path: "/interior"
      },
      {
        name: "Ozone",
        path: "/ozone"
      },
      {
        name: "Paint",
        path: "/paint"
      }
    ],
    shop_headers: [
      {
        text: "No. Days",
        value: "numDays"
      },
      {
        text: "VIN",
        value: "vin"
      },
      {
        text: "Year",
        value: "year"
      },
      {
        text: "Make",
        value: "make"
      },
      {
        text: "Model",
        value: "model"
      },
      {
        text: "Color",
        value: "color"
      },
      {
        text: "Actions",
        value: "action"
      }
    ],
    sublet_headers: [
      {
        text: "No. Days",
        value: "numDays"
      },
      {
        text: "VIN",
        value: "vin"
      },
      {
        text: "Year",
        value: "year"
      },
      {
        text: "Make",
        value: "make"
      },
      {
        text: "Model",
        value: "model"
      },
      {
        text: "Color",
        value: "color"
      },
      {
        text: "Repairs",
        value: "repairs"
      },
      {
        text: "Actions",
        value: "action"
      }
    ],
    shop_headersalt: [
      {
        text: "VIN",
        value: "vin"
      },
      {
        text: "Year",
        value: "year"
      },
      {
        text: "Make",
        value: "make"
      },
      {
        text: "Model",
        value: "model"
      },
      {
        text: "Color",
        value: "color"
      },
      {
        text: "Comments",
        value: "comments"
      },
      {
        text: "Actions",
        value: "action"
      }
    ],
    years: [
      "2020",
      "2019",
      "2018",
      "2017",
      "2016",
      "2015",
      "2014",
      "2013",
      "2012",
      "2011",
      "2010",
      "2009",
      "2008",
      "2007",
      "2006",
      "2005",
      "2004",
      "2003",
      "2002",
      "2001",
      "2000",
      "1999",
      "1998",
      "1997",
      "1996",
      "1995",
      "1994",
      "1993",
      "1992",
      "1991",
      "1990"
    ],
    makes: [
      "AMC",
      "Acura",
      "Alfa Romeo",
      "Anadol",
      "Aston Martin",
      "Audi",
      "Avanti",
      "BMW",
      "Bentley",
      "Buick",
      "Cadillac",
      "Chevrolet",
      "Chrysler",
      "Dacia",
      "Daewoo",
      "Daihatsu",
      "Datsun",
      "DeLorean",
      "Dodge",
      "Eagle",
      "FIAT",
      "Ferrari",
      "Fisker",
      "Ford",
      "Freightliner",
      "GMC",
      "Geely",
      "Geo",
      "HUMMER",
      "Honda",
      "Hyundai",
      "Infiniti",
      "Isuzu",
      "Jaguar",
      "Jeep",
      "Kia",
      "Lamborghini",
      "Lancia",
      "Land Rover",
      "Lexus",
      "Lincoln",
      "Lotus",
      "MG",
      "MINI",
      "Maserati",
      "Maybach",
      "Mazda",
      "McLaren",
      "Mercedes-Benz",
      "Mercury",
      "Merkur",
      "Mitsubishi",
      "Nissan",
      "Oldsmobile",
      "Opel",
      "Peugeot",
      "Plymouth",
      "Pontiac",
      "Porsche",
      "Proton",
      "RAM",
      "Renault",
      "Rolls-Royce",
      "Rover",
      "SRT",
      "Saab",
      "Saturn",
      "Scion",
      "Skoda",
      "Sterling",
      "Subaru",
      "Suzuki",
      "Tesla",
      "Tofaş",
      "Toyota",
      "Triumph",
      "Volkswagen",
      "Volvo",
      "Yugo",
      "smart"
    ],
    colors: [
      "Black",
      "White",
      "Red",
      "Blue",
      "Silver",
      "Green",
      "Yellow",
      "Orange",
      "Purple",
      "Gray"
    ]
  },
  mutations: {},
  actions: {}
});
