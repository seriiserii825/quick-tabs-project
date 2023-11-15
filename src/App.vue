<script setup lang="ts">
import {onMounted, onUpdated, ref} from "vue";
import ListItem from "./components/list/ListItem.vue";
import {IList} from "./interfaces/list/IList";
import useGetFromLocalStorage from "./hooks/useGetFromLocalStorage";
import useAddToLocalStorage from "./hooks/useAddToLocalStorage";

const input_ref = ref<HTMLInputElement>();
const title = ref("");

const items = ref<IList[]>();

async function onSubmit() {
  const allTabs = await chrome.tabs.query({active: false, currentWindow: true});
  const all_tabs_urls = allTabs.reduce((acc, tab) => {
    acc.push({
      title: tab.title,
      url: tab.url
    });
    return acc;
  }, []);
  let project_title = title.value.replace(/ /g, '_');
  project_title = project_title.trim();
  const new_project = {
    id: Number(Date.now().toString()),
    title: project_title,
    items: all_tabs_urls
  }
  useAddToLocalStorage(new_project);
  title.value = "";
  updateFromLocalStorage();
}

function updateFromLocalStorage(){
  const all_tabs = useGetFromLocalStorage();
  if (all_tabs) {
    items.value = all_tabs;
    items.value = items.value.reverse();
  }
}

onMounted(() => {
  updateFromLocalStorage()
});
</script>
<template>
  <div class="popup">
    <header class="popup__header">
      <h2 class="popup__title">Create new project</h2>
      <input  :ref="input_ref" class="popup__input" type="text" v-model="title">
      <button @click="onSubmit" :disabled="title === ''" class="btn">Create</button>
    </header>
    <ul v-if="items && items.length > 0" class="list">
      <ListItem
          v-for="item in items"
          :key="item.title"
          :id="item.id"
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
