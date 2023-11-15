<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import ListItem from "./components/list/ListItem.vue";
import {IList} from "./interfaces/list/IList";
import useGetFromLocalStorage from "./hooks/useGetFromLocalStorage";
import useAddToLocalStorage from "./hooks/useAddToLocalStorage";
import useChangeLocalStorage from "./hooks/useChangeLocalStorage";
import useClearLocalStorage from "./hooks/useClearLocalStorage";

const input_ref = ref<HTMLInputElement>();
const file_ref = ref<HTMLInputElement>();
const title = ref("");

const items = ref<IList[]>();
const filtered = ref<IList[]>();

const search = ref("");

watch(search, (value) => {
  if (value === "") {
    filtered.value = items.value;
  } else {
    const filtered_lc = items.value.filter((item) => {
      return item.title.toLowerCase().includes(value.toLowerCase());
    });
    if(filtered_lc.length > 0){
      filtered.value = filtered_lc;
    }
  }
});

async function onSubmit() {
  const tabs = [];
  await chrome.windows.getCurrent({populate: true}, function (window) {
    window.tabs.forEach(function (tab) {
      tabs.push(tab);
    });
    const all_tabs_urls = tabs.reduce((acc, tab) => {
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
  });
}

function updateFromLocalStorage() {
  const all_tabs = useGetFromLocalStorage();
  if (all_tabs) {
    items.value = all_tabs;
    items.value = items.value.reverse();
    filtered.value = items.value;
  }else{
    items.value = [];
    filtered.value = [];
  }
}

function importAll() {
  const file = file_ref.value.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContents = e.target.result;
      const tabs = JSON.parse(fileContents);
      console.log(tabs, 'tabs')
      useChangeLocalStorage(tabs);
      updateFromLocalStorage();
    };
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
  chrome.downloads.download({
    url: url,
    filename: file_name,
    saveAs: true
  });
}

function clearAll(){
  useClearLocalStorage();
  updateFromLocalStorage();
}

onMounted(() => {
  updateFromLocalStorage()
  filtered.value = items.value;
});
</script>
<template>
  <div class="popup">
    <header class="popup__header">
      <h2 class="popup__title">Create new project</h2>
      <input :ref="input_ref" class="popup__input" type="text" v-model="title">
      <div class="btn popup__import">
        <span>Import</span>
        <input @change="importAll" ref="file_ref" type="file" id="fileInput"/>
      </div>
      <button @click="exportAll" class="btn btn--success">Export</button>
      <button @click="clearAll" class="btn btn--error">Clear</button>
      <button @click="onSubmit" :disabled="title === ''" class="btn">Create</button>
    </header>
    <input v-if="filtered && filtered.length > 0" type="text" placeholder="Search project" class="popup__search" v-model="search">
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
