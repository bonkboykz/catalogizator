<template>
  <v-card class="mb-2 mx-1">
    <v-card-title>
      <h5 class="subheading">{{title}}</h5>
      <v-spacer></v-spacer>
      <v-btn color="primary"
      :loading="processing"
      :disabled="!allHandled"
      @click="mergeItems">
        Merge
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-list dense v-for="(item, index) in duplicates" v-bind:key="item._id">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>Title: {{ item.title }}</v-list-tile-title>
          <v-list-tile-sub-title>Location: {{ item.location }}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <!-- <v-btn icon ripple>
            <v-icon color="grey lighten-1">info</v-icon>
          </v-btn> -->
          <v-checkbox v-model="handledItemsCheckBoxes[index]">
          </v-checkbox>
        </v-list-tile-action>
      </v-list-tile>
      <v-divider v-if="!isLastItem(item)"></v-divider>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: ['duplicates', 'title', 'index', 'processing'],
  data() {
    return {
      handledItemsCheckBoxes: [],
      loading: false,
    };
  },
  computed: {
    allHandled() {
      let allChecked = true;
      this.handledItemsCheckBoxes.forEach(cb => {
        if (!cb) allChecked = false;
      });
      return allChecked;
    },
  },
  methods: {
    isLastItem(item) {
      const lastItem = this.duplicates[this.duplicates.length - 1];
      return lastItem._id === item._id;
    },
    mergeItems() {
      console.log("Mergin' duplicates");
      this.duplicates.forEach(item => {
        console.log(item._id);
        console.log(item.title);
      });
      // this.loading = true;
      this.$emit('mergeRequested', this.duplicates);
    },
  },
  created() {
    this.duplicates.forEach(item => {
      this.handledItemsCheckBoxes.push(false);
    });
  },
};
</script>

<style scoped>

</style>