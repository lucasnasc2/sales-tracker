<template>
  <v-app-bar :title="$globals.organizationName">
    <template v-slot:prepend>
      <v-icon>{{ $globals.organizationIcon }}</v-icon>
    </template>

    <template v-slot:append>
      <v-btn icon="mdi-github"
        @click="goToGithub"></v-btn>
    </template>
  </v-app-bar>
  <v-main class="custom-main">
    <v-container fluid class="fill-height">
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" sm="8" md="4">
          <v-card elevation="3">
            <v-card-title class="text-center">Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="login">
                <v-text-field v-model="email" label="email" required outlined></v-text-field>
                <v-text-field v-model="password" label="Password" type="password" required outlined></v-text-field>
                <v-btn block type="submit" color="primary" >Login</v-btn>
                <v-btn class="mt-3" block variant="tonal" size="x-small" @click="goToRecover">Recuperar contraseña</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/store/user";
import router from "@/router/index.js";

export default defineComponent({
  name: "Login",
  data() {
    return {
      password: "",
      email: "",
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    login() {
      this.userStore.login(this.email, this.password)
    },
    goToGithub() {
      window.open('https://github.com/lucasnasc2/sales-tracker?tab=readme-ov-file#sales-tracker', '_blank')
    },
    goToRecover() {
      router.push('/recovery')
    }

  },
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
