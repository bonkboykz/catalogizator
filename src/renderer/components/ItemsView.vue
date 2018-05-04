<template>
  <v-layout row wrap justify-center>
    <v-flex xs12 class="text-xs-center centered">
      <h2>List items</h2>
    </v-flex>
    <v-flex xs12>
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
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 v-for="item in items" :key="item._id">
            <v-card>
              <!-- <v-card-media src="/static/doc-images/cards/desert.jpg" height="200px">
              </v-card-media> -->
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
    };
  },
  methods: {
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
        console.log('Before load items setted');
        console.log('Items count: ' + this.items.length);
        this.items = items;
        console.log('After load items setted');
        console.log('Items count: ' + this.items.length);
      });
    },
    submitNewItem(newItem) {
      items
        .createItem(newItem)
        .then(result => {
          // console.log(result);
          this.closeNewForm();
          console.log('Before next tick');
          console.log('Item count:' + this.items.length);
          this.$nextTick(() => {
            console.log('View updated');
            console.log('Item count:' + this.items.length);
          });
          console.log('Before update');
          console.log('Items count: ' + this.items.length);
          this.loadItems();
          console.log('After load items');
          console.log('Items count: ' + this.items.length);
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
  },
};
</script>

<style scoped>

</style>