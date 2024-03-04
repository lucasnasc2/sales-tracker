<template>
  <v-app-bar title="Ventas CMI">
    <template v-slot:prepend>
      <v-icon>mdi-hammer-sickle</v-icon>
    </template>
  </v-app-bar>
  <FileUploader />
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
                <v-btn type="submit" color="primary" block>Login</v-btn>
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
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
} from "firebase/auth";
import firebaseApp from "../firebase.js";
const auth = getAuth(firebaseApp);
connectAuthEmulator(auth, "http://127.0.0.1:9099");

export default defineComponent({
  name: "Login",
  data() {
    return {
      password: "",
      email: "",
    };
  },
  methods: {
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        // Signed in
        const user = userCredential.user;
        console.log(user);
        this.$router.push('/')
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    },
  },
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
