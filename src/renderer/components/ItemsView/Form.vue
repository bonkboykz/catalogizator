<template>
  <v-form v-model="form.valid">
    <!-- <v-text-field
      label="Name"
      v-model="name"
      :rules="nameRules"
      :counter="10"
      required
    ></v-text-field>
    <v-text-field
      label="E-mail"
      v-model="email"
      :rules="emailRules"
      required
    ></v-text-field> -->
    <v-text-field
      label="Title"
      v-model="form.title"
    ></v-text-field>
    <v-text-field
      label="Type"
      v-model="form.type"
    ></v-text-field>
    <v-text-field
      label="Location"
      v-model="form.location"
      @keyup.enter="submit"
    ></v-text-field>
    <v-spacer></v-spacer>
    <v-btn color="blue darken-1" flat @click.native="close">Close</v-btn>
    <v-btn
      @click="submit"
      :disabled="!form.valid"
    >
      {{ (isEditForm) ? 'update' : 'submit' }}
    </v-btn>
  </v-form>
</template>

<script>
export default {
  props: [ 'item' ],
  data: () => ({
    form: {
      valid: true,
      title: '',
      type: '',
      location: '',
    },
    // name: '',
    // nameRules: [
    //   v => !!v || 'Name is required',
    //   v => v.length <= 10 || 'Name must be less than 10 characters',
    // ],
    // email: '',
    // emailRules: [
    //   v => !!v || 'E-mail is required',
    //   v =>
    //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    //     'E-mail must be valid',
    // ],
  }),
  computed: {
    isEditForm() {
      return (!!this.item);
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    submit() {
      this.$emit('submit', {
        title: this.form.title,
        type: this.form.type,
        location: this.form.location,
        _id: (this.isEditForm) ? this.item._id : null,
      });
    },
  },
  mounted() {
    if (this.isEditForm) {
      this.form.title = this.item.title;
      this.form.type = this.item.type;
      this.form.location = this.item.location;
    }
  },
};
</script>

<style scoped>

</style>