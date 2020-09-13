<template>
  <div>

<v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" lg="8" sm="6" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="blue-grey" dark flat>
                <v-toolbar-title>Profile</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom></v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="update">
                  <v-text-field
                    v-model="first_name"
                    label="First name"
                    name="first"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="last_name"
                    label="Last name"
                    name="last"
                    prepend-icon="mdi-account"
                    type="text"
                  ></v-text-field>

                  <v-text-field
                    v-model="email"
                    label="Email"
                    name="email"
                    prepend-icon="mdi-email"
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
                    <v-btn color="blue-grey" type="submit">Update</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

  </div>
</template>

<script>
import auth from "../services/auth";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      pass: null,
      id: "",
    };
  },
  methods: {
    update() {
      auth.update(
        this.email,
        this.pass,
        this.first_name,
        this.last_name,
        (res) => {
          console.log(res)
        }
      );
    },
  },
  created() {
    auth.whoAmI((res, resErr) => {
      if (!resErr) {
        this.first_name = res.data.first_name;
        this.last_name = res.data.last_name;
        this.email = res.data.email;
        this.id = res.data.id;
      } else {
        console.log(resErr);
      }
    });
  },
};
</script>