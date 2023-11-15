<script setup lang="ts">
import {nextTick, onMounted, onUpdated, ref, watch} from "vue";
import ListItem from "./components/list/ListItem.vue";
import {IList} from "./interfaces/list/IList";
import useGetFromLocalStorage from "./hooks/useGetFromLocalStorage";
import useAddToLocalStorage from "./hooks/useAddToLocalStorage";

const input_ref = ref<HTMLInputElement>();
const title = ref("");

const items = ref<IList[]>();
const filtered = ref<IList[]>();

const search = ref("");

watch(search, (value) => {
  if (value === "") {
    filtered.value = items.value;
  } else {
    filtered.value = items.value.filter((item) => {
      return item.title.toLowerCase().includes(value.toLowerCase());
    });
  }
});

async function onSubmit() {
  const allTabs = await chrome.tabs.query({active: false, currentWindow: true});
  const all_tabs_urls = allTabs.reduce((acc, tab) => {
    acc.push({
      id: Number(Date.now().toString()) + Math.floor(Math.random() * 1000) + 1,
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

function updateFromLocalStorage() {
  const all_tabs = useGetFromLocalStorage();
  if (all_tabs) {
    items.value = all_tabs;
    items.value = items.value.reverse();
  }
}

onMounted(() => {
  updateFromLocalStorage()
  filtered.value = items.value;
  nextTick(() => {
    input_ref.value.focus();
  });
});
</script>
<template>
  <div class="popup">
    <header class="popup__header">
      <h2 class="popup__title">Create new project</h2>
      <input :ref="input_ref" class="popup__input" type="text" v-model="title">
      <button @click="onSubmit" :disabled="title === ''" class="btn">Create</button>
    </header>
    <input type="text" placeholder="Search project" class="popup__search" v-model="search">
    <ul v-if="items && items.length > 0" class="list">
      <ListItem
          v-for="item in filtered"
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
