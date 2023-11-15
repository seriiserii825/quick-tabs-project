<script setup lang="ts">
import {onUpdated, ref} from "vue";
import ListItem from "./components/list/ListItem.vue";
import {IList} from "./interfaces/list/IList";

const input_ref = ref<HTMLInputElement>();
const title = ref("");

const items = ref<IList[]>([
  {
    title: "Borgoluce",
    items: [
      {
        title: "Sub list url",
        url: "https://borgoluce.it",
      },
      {
        title: "Sub list url",
        url: "https://borgoluce.it",
      }
    ]
  },
  {
    title: "Altufianco",
    items: [
      {
        title: "Sub list url",
        url: "https://borgoluce.it",
      },
      {
        title: "Sub list url",
        url: "https://borgoluce.it",
      }
    ]
  }
]);
onUpdated(() => {
  input_ref.value?.focus();
});
</script>

<template>
  <div class="popup">
    <header class="popup__header">
      <h2 class="popup__title">Create new project</h2>
      <input :ref="input_ref" class="popup__input" type="text" v-model="title">
    </header>
    <h2 class="popup__subtitle">Projects list</h2>
    <ul class="list">
      <ListItem
          v-for="item in items"
          :key="item.title"
          :title="item.title"
          :items="item.items"/>
    </ul>
  </div>
</template>

<style>
#app {
  width: 780px;
}
</style>
