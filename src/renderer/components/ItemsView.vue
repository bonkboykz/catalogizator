<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 class="text-xs-center centered mb-3">
      <h2 class="headline">List items</h2>
    </v-flex>
    <v-flex xs12 sm2>
      <v-dialog v-model="showNewForm" persistent max-width="500px">
        <v-btn color="primary" dark slot="activator">New item</v-btn>
        <v-card>
          <v-card-text>
            <item-form @submit="submitNewItem" @close="closeNewForm"></item-form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-if="showEditForm" v-model="showEditForm" persistent max-width="500px">
        <v-card>
          <v-card-text>
            <item-form :item="editedItem" @submit="submitUpdatedItem" @close="closeEditForm"></item-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
    <v-flex xs12 sm3>
      <v-btn color="secondary" dark :to="{path: '/analyze'}">Analyze</v-btn>
    </v-flex>
    <v-flex xs12 sm3>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-flex>
    <v-spacer></v-spacer>
    <v-flex xs12 sm3>
      <v-select
        :items="defaultTypes"
        v-model="selectedType"
        label="Type"
        single-line
        item-text="text"
        item-value="value"
      ></v-select>
    </v-flex>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <!-- <v-flex xs12 v-for="item in items" :key="item._id">
            <v-card>
              <v-card-media src="/static/v.png" height="200px">
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-2">{{ item.title }}</h3>
                  <p>Type: <b>{{item.type}}</b></p>
                  <p>Location: <b>{{item.location}}</b></p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="red" @click="deleteItem(item._id)">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat color="orange" @click="editItem(item)">Edit</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex> -->
          <v-flex xs12>
            <v-data-table
              :headers="itemsHeaders"
              :items="filteredItems"
              :search="search"
              :pagination.sync="pagination"
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td>{{ props.item.title }}</td>
                <td class="text-xs-right">{{ props.item.type }}</td>
                <td class="text-xs-right">{{ props.item.location }}</td>
                <td class="justify-center layout px-0">
                  <v-btn icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="teal">edit</v-icon>
                  </v-btn>
                  <v-btn icon class="mx-0" @click="deleteItem(props.item._id)">
                    <v-icon color="pink">delete</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
            <div class="text-xs-center pt-2">
              <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    
  </v-layout>
</template>

<script>
import { items } from '@/db/controllers/index';
import bus from '@/bus';
import ItemForm from './ItemsView/Form.vue';
export default {
  name: 'items',
  components: { ItemForm },
  data() {
    return {
      editedItem: null,
      showEditForm: false,
      showNewForm: false,
      items: [],
      defaultTypes: [
        { text: 'All', value: null },
        { text: 'Movies', value: 'Movies' },
        { text: 'Books', value: 'Books' },
        { text: 'TV Series', value: 'TV Series' },
        { text: 'Cartoons', value: 'Cartoons' },
        { text: 'Comics', value: 'Comics' },
        { text: 'Anime', value: 'Anime' },
        { text: 'Tutorials', value: 'Tutorials' },
      ],
      selectedType: null,
      itemsHeaders: [
        {
          text: 'Title',
          value: 'title',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Location',
          value: 'location',
        },
        {
          text: 'Actions',
          value: 'name',
          sortable: false
        },
      ],
      search: null,
      pagination: {
        rowsPerPage: 50,
        totalItems: 0,
      },
    };
  },
  computed: {
    pages() {
      if (this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null) return 0;

      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    },
    filteredItems() {
      return this.items.filter(el => !this.selectedType || el.type === this.selectedType);
    }
  },
  methods: {
    // filterItems() {
    //   // this.items = this.itemsCopy;
    //   // if (this.selectedType) {
    //   //   this.items = this.items.filter(el => el.type === this.selectedType);
    //   // }
    //   return this.items.filter(el => el.type === this.selectedType);
    // },
    editItem(item) {
      this.editedItem = item;
      this.showEditForm = true;
    },
    closeEditForm() {
      this.showEditForm = false;
    },
    submitUpdatedItem(updItem) {
      items
        .updateItem(updItem)
        .then(result => {
          this.closeEditForm();
          this.loadItems();
        })
        .catch(e => console.error(e));
    },
    closeNewForm() {
      this.showNewForm = false;
    },
    loadItems() {
      items.getList().then(items => {
        // console.log('Before load items setted');
        // console.log('Items count: ' + this.items.length);
        this.items = items;
        this.pagination.totalItems = items.length;
        // console.log('After load items setted');
        // console.log('Items count: ' + this.items.length);
      });
    },
    submitNewItem(newItem) {
      items
        .createItem(newItem)
        .then(result => {
          // console.log(result);
          this.closeNewForm();
          // console.log('Before next tick');
          // console.log('Item count:' + this.items.length);
          // this.$nextTick(() => {
          //   // console.log('View updated');
          //   // console.log('Item count:' + this.items.length);
          // });
          // console.log('Before update');
          // console.log('Items count: ' + this.items.length);
          this.loadItems();
          // console.log('After load items');
          // console.log('Items count: ' + this.items.length);
        })
        .catch(e => console.error(e));
    },
    deleteItem(itemId) {
      items
        .destroyItem(itemId)
        .then(result => {
          console.log(result);
          this.loadItems();
        })
        .catch(e => console.error(e));
    },
  },
  created() {
    this.loadItems();
  },
  mounted() {
    bus.$on('item:new', () => {
      this.showNewForm = !this.showNewForm;
    });
    bus.$on('item:list_updated', () => {
      this.loadItems();
    });
  },
};
</script>

<style scoped>

</style>