<template>
  <v-layout row wrap>
    <v-flex d-flex xs12 class="text-xs-center centered mb-3">
      <h3 class="headline">This section will help you find duplicates in Your library</h3>
    </v-flex>
      <v-progress-linear v-if="!rendered" :indeterminate="true"></v-progress-linear>
      <v-container fluid grid-list-md>
        <v-data-iterator
          :items="exact"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row
          wrap
        >
          <v-flex
            slot="item"
            slot-scope="props"
            xs12
            sm6
            md6
            lg3
          >
            <duplicate-items
              :duplicates="props.item"
              :processing="processing"
              v-on:mergeRequested="performMerge"
              title="Exact">
            </duplicate-items>
          </v-flex>
        </v-data-iterator>
      </v-container>
      <v-container fluid grid-list-md>
        <v-data-iterator
          :items="possible"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          content-tag="v-layout"
          row
          wrap
        >
          <v-flex
            slot="item"
            slot-scope="props"
            xs12
            sm6
            md6
            lg3
          >
            <duplicate-items
              :duplicates="props.item"
              :processing="processing"
              v-on:mergeRequested="performMerge"
              title="Possible">
            </duplicate-items>
          </v-flex>
        </v-data-iterator>
      </v-container>
  </v-layout>
</template>

<script>
import { items } from '@/db/controllers/index';
import DuplicateItems from './AnalyzeView/DuplicateItemsView.vue';
export default {
  data() {
    return {
      processing: false,
      items: [],
      exact: [],
      possible: [],
      rowsPerPageItems: [6, 12, 18],
      pagination: {
        rowPerPage: 6,
        totalItems: 0,
      },
      activeTab: null,
      rendered: false,
      page: 1
    };
  },
  components: { DuplicateItems },
  methods: {
    performMerge(duplicatesArr) {
      this.processing = true;
      items
        .mergeDuplicates(duplicatesArr.slice())
        .then(result => {
          console.log('done');
          this.loadDuplicateItems();
        })
        .catch(e => console.error(e));
    },
    next() {
      const active = parseInt(this.activeTab);
      this.activeTab = (active < 2 ? active + 1 : 0).toString();
    },
    loadDuplicateItems() {
      items
        .findDuplicates()
        .then(obj => {
          this.exact = obj.exact;
          this.possible = obj.possible;
          this.processing = false;
          this.$nextTick(() => {
            this.rendered = true;
          })
        })
        .catch(e => console.error(e));
    },
  },
  created() {
    this.loadDuplicateItems();
  },
  updated() {
  }
};
</script>

<style scoped>

</style>