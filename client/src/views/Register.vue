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
                <v-form @submit.prevent="register" v-model="valid">
                  <v-text-field
                    v-model="first"
                    label="First name"
                    name="first"
                    :rules="[rules.required]"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="last"
                    label="Last name"
                    name="last"
                    :rules="[rules.required]"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    label="Email"
                    name="email"
                    :rules="[rules.required, rules.email]"
                    prepend-icon="mdi-email"
                    type="email"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    id="password"
                    label="Password"
                    name="password"
                    :rules="[rules.required, rules.password]"
                    prepend-icon="mdi-lock"
                    :append-icon="hidePass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="() => (hidePass = !hidePass)"
                    :type="hidePass ? 'password' : 'text'"
                  ></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-grey lighten-3" to="/login">Login</v-btn>
                    <v-btn :disabled="!valid" color="blue-grey" type="submit">Register</v-btn>
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
      password: "",
      hidePass: true,
      valid: false,
      rules: {
        required: (value) => !!value || "Required.",
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
        password: (value) => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
          return (
            pattern.test(value) ||
            "Min. 8 characters with at least one capital letter, a number and a special character."
          );
        },
      },
    };
  },
  methods: {
    register() {
      console.log(this.email, this.password, this.first, this.last);
      auth.register(
        this.email,
        this.password,
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