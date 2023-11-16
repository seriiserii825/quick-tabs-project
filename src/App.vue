<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import ListItem from "./components/list/ListItem.vue";
import useGetFromLocalStorage from "./hooks/useGetFromLocalStorage";
import useAddToLocalStorage from "./hooks/useAddToLocalStorage";
import useChangeLocalStorage from "./hooks/useChangeLocalStorage";
import useClearLocalStorage from "./hooks/useClearLocalStorage";
import {usePopupStore} from "./stores/popup-store";
import {storeToRefs} from "pinia";

const popup_store = usePopupStore();
const {
  search,
  items,
  filtered,
} = storeToRefs(popup_store);

const input_ref = ref();
const file_ref = ref();
const title = ref("");


async function onSubmit() {
  const tabs: any = [];
  //@ts-ignore
  await chrome.windows.getCurrent({populate: true}, function (window) {
    window.tabs.forEach(function (tab: any) {
      tabs.push(tab);
    });
    const all_tabs_urls = tabs.reduce((acc: any, tab: any) => {
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
    popup_store.updateFromLocalStorage();
  });
}


function importAll() {
  //@ts-ignore
  const file = file_ref.value.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      //@ts-ignore
      const fileContents = e.target.result;
      //@ts-ignore
      const tabs = JSON.parse(fileContents);
      useChangeLocalStorage(tabs);
      popup_store.updateFromLocalStorage();
    };
    //@ts-ignore
    const result = reader.readAsText(file);
  }
}

function exportAll() {
  const all_tabs = useGetFromLocalStorage();
  const blob = new Blob([JSON.stringify(all_tabs)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const file_name = `${hours}_${minutes}_${day}-${month}-${year}.json`;
  //@ts-ignore
  chrome.downloads.download({
    url: url,
    filename: file_name,
    saveAs: true
  });
}

function clearAll() {
  useClearLocalStorage();
  popup_store.updateFromLocalStorage();
}

onMounted(() => {
  popup_store.updateFromLocalStorage()
});
</script>
<template>
  <div class="popup">
    <header class="popup__header">
      <h2 class="popup__title">Create new project</h2>
      <input :ref="input_ref" class="popup__input" type="text" v-model="title">
      <button @click="onSubmit" :disabled="title === ''" class="btn">Create</button>
      <button @click="clearAll" class="btn btn--error">Clear</button>
      <div class="btn popup__import">
        <span>Import</span>
        <input @change="importAll" ref="file_ref" type="file" id="fileInput"/>
      </div>
      <button @click="exportAll" class="btn btn--success">Export</button>
    </header>
    <input v-if="filtered && filtered.length > 0" type="text" placeholder="Search project" class="popup__search"
           v-model="search">
    <ul v-if="items && items.length > 0" class="list">
      <ListItem
          v-for="item in filtered"
          :key="item.id"
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
