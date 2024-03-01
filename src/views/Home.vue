<template>
  <v-app-bar title="Ventas CMI">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-btn icon v-on:click="logout">
      <v-icon>mdi-logout</v-icon>
    </v-btn>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" location="left">
    <v-list>
      <v-list-item v-on:click="mode = 'seller'">
        <v-list-item-title>Vender</v-list-item-title>
      </v-list-item>
      <v-list-item v-on:click="mode = 'manage'">
        <v-list-item-title>Gestionar</v-list-item-title>
      </v-list-item>
      <v-list-item v-on:click="mode = 'reports'">
        <v-list-item-title>Informes</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main class="custom-main">
    <SellerMode v-if="mode == 'seller'" />
    <ManageMode v-if="mode == 'manage'" />
    <ReportsMode v-if="mode == 'reports'" />
  </v-main>
</template>

<script>
import { defineComponent } from "vue";
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from "../firebase.js";

const auth = getAuth(firebaseApp);

export default defineComponent({
  name: "Home",
  data() {
    return {
      drawer: false,
      mode: "seller",
    };
  },
  watch: {
    mode() {
      this.drawer = false;
    },
  },
  methods: {
    logout() {
      signOut(auth)
        .then(() => {
          this.$router.push("login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
</script>
<style scoped>
.custom-main {
  --v-layout-top: 20px !important;
}
</style>