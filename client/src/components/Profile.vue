<template>
  <div>
    <div>{{ first_name }} {{ last_name }}</div>
    <div>{{ id }} {{ email }}</div>
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
      id: "",
    };
  },
  created() {
    auth.whoAmI((res, resErr) => {
      if (!resErr) {
        this.first_name = res.first_name;
        this.last_name = res.last_name;
        this.email = res.email;
        this.id = res.id;
      } else {
        console.log(resErr);
      }
    });
  },
};
</script>