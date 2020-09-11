<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="blue-grey" dark flat>
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom></v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="register">
                  <v-text-field
                    v-model="first"
                    label="First name"
                    name="first"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="last"
                    label="Last name"
                    name="last"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-account"
                    type="email"
                  ></v-text-field>

                  <v-text-field
                    v-model="pass"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey lighten-3" to="/login">Login</v-btn>
                    <v-btn color="blue-grey" type="submit">Register</v-btn>
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
      first: "",
      last: "",
      email: "",
      pass: "",
    };
  },
  methods: {
    register() {
      auth.register(
        this.email,
        this.pass,
        this.first,
        this.last,
        (loggedIn) => {
          if (!loggedIn) {
            this.error = true;
          } else {
            this.$router.replace(this.$route.query.redirect || "/");
          }
        }
      );
    },
  },
};
</script>