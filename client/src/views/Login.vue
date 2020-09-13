<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="blue-grey" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom></v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="login" v-model="valid">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    name="email"
                    :rules="[rules.required, rules.email]"
                    prepend-icon="mdi-account"
                    type="email"
                  ></v-text-field>

                  <v-text-field
                    v-model="pass"
                    id="password"
                    label="Password"
                    name="password"
                    :rules="[rules.required]"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey lighten-3" to="/register">Register</v-btn>
                    <v-btn :disabled="!valid" color="blue-grey" type="submit">Login</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import auth from "../services/auth";
export default {
  data() {
    return {
      email: "",
      pass: "",
      error: false,
      valid: false,
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
      },
    };
  },
  methods: {
    login() {
      auth.login(this.email, this.pass, (loggedIn) => {
        if (!loggedIn) {
          this.error = true;
        } else {
          this.$router.replace(this.$route.query.redirect || "/");
        }
      });
    },
  },
};
</script>