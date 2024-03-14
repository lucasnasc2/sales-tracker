<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <template v-slot:append>
      <v-btn
								v-if=" modeStore.mode != 'reports' "
        class="searchBtn"
        :icon="searchStore.state ? 'mdi-close' : 'mdi-magnify'"
        @click="
          searchStore.state ? searchStore.close() : (searchStore.state = true)
        "
      ></v-btn>
    </template>
    <v-app-bar-title v-if="!searchStore.state || modeStore.mode == 'reports'">
      {{ $globals.organizationName }}
    </v-app-bar-title>
    <v-text-field
      v-model="searchStore.text"
      v-if="searchStore.state && modeStore.mode != 'reports' "
      hide-details
      single-line
      autofocus
      density="compact"
      variant="solo"
      rounded
    ></v-text-field>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" location="left">
    <v-list color="primary">
      <v-list-item
        :active="modeStore.mode == 'seller'"
        v-on:click="modeStore.changeMode('seller')"
      >
        <v-list-item-title>Vender</v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="modeStore.mode == 'manage'"
        v-on:click="modeStore.changeMode('manage')"
      >
        <v-list-item-title>Gestionar</v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="modeStore.mode == 'stock'"
        v-on:click="modeStore.changeMode('stock')"
      >
        <v-list-item-title>Stock</v-list-item-title>
      </v-list-item>
      <v-list-item
        :active="modeStore.mode == 'reports'"
        v-on:click="modeStore.changeMode('reports')"
      >
        <v-list-item-title>Informes</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block append-icon="mdi-logout" v-on:click="logout">
          logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  <v-main class="custom-main">
    <SellerMode v-if="modeStore.mode == 'seller'" />
    <ManageMode v-if="modeStore.mode == 'manage'" />
    <StockMode v-if="modeStore.mode == 'stock'" />
    <ReportsMode v-if="modeStore.mode == 'reports'" />
  </v-main>
</template>

<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useModeStore } from "@/store/modes.js";
import { useUserStore } from "@/store/user";
import { useSearchStore } from "@/store/search";

export default defineComponent({
  name: "Home",
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapStores(useModeStore, useUserStore, useSearchStore),
  },
  watch: {
    "modeStore.mode": {
      handler() {
        this.drawer = false;
      },
    },
  },
  methods: {
    logout() {
      this.userStore.logout();
    },
  },
});
</script>
<style scoped>
.custom-main {
  --v-layout-top: 0px !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
