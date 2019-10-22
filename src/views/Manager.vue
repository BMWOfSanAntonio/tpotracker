<template>
  <v-container class="manager">
    <Header :user="user" />
    <Shop :user="user" />
    <SubletInspection :user="user" />
    <Sublet :user="user" />
    <Detail :user="user" />
  </v-container>
</template>

<script>
// * Components
import Header from "@/components/Header";
import Shop from "@/components/Shop";
import SubletInspection from "@/components/SubletInspection";
import Sublet from "@/components/Sublet";
import Detail from "@/components/Detail";

export default {
  name: "Manager",
  props: ["user"],
  components: {
    Header,
    Shop,
    SubletInspection,
    Sublet,
    Detail
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
