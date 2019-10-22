<template>
  <v-container>
    <div class="mt-5 text-center display-2 font-weight-thin">Sublet</div>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-container fluid>
          <v-row>
            <v-col
              v-for="(sub, i) in $store.state.subletalt"
              :key="i"
              class="d-flex child-flex"
              cols="4"
            >
              <v-card tile class="d-flex cardcard" :to="sub.path">
                <v-row justify="center" align="center">
                  <v-col cols="12">
                    <p>{{ sub.name }}</p>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Sublet",
  data() {
    return {};
  }
};
</script>

<style scoped>
.cardcard {
  padding: 20px;
  text-align: center;
}
</style>