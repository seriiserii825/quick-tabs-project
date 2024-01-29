<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import ListItem from "./components/list/ListItem.vue";
import useGetFromLocalStorage from "./hooks/useGetFromLocalStorage";
import useAddToLocalStorage from "./hooks/useAddToLocalStorage";
import useChangeLocalStorage from "./hooks/useChangeLocalStorage";
import useClearLocalStorage from "./hooks/useClearLocalStorage";
import {usePopupStore} from "./stores/popup-store";
import {storeToRefs} from "pinia";
import Confirm from "./components/popups/Confirm.vue";
import MainHeader from "./components/header/MainHeader.vue";
import Json from "./components/ui/Json.vue";
import IconSearch from "./components/icons/IconSearch.vue";
import CurrentTabs from "./components/tabs/CurrentTabs.vue";

const popup_store = usePopupStore();
const {
  search,
  items,
  filtered,
} = storeToRefs(popup_store);
const input_ref = ref();
const file_ref = ref();
const title = ref("");
const confirm_status = ref(false);
const delete_status = ref(false);

async function onSubmit() {
  const tabs: any = [];
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
      items: all_tabs_urls,
      updated_at: Number(Date.now().toString())
    }
    useAddToLocalStorage(new_project);
    title.value = "";
    popup_store.updateFromLocalStorage();
  });
}

function emitAgree() {
  delete_status.value = true;
  if (delete_status.value) {
    confirm_status.value = false;
    useClearLocalStorage();
    popup_store.updateFromLocalStorage();
  }
}

function clearAll() {
  confirm_status.value = true;
}

onMounted(() => {
  popup_store.updateFromLocalStorage()
});
</script>
<template>
  <div class="popup">
    <Confirm
        v-if="confirm_status"
        title="Are you sure?"
        @emit_agree="emitAgree"
        @emit_close="confirm_status = false"
    />
    <MainHeader/>
    <div class="popup__body">
      <Json/>
      <CurrentTabs/>
      <div class="popup__search">
        <IconSearch/>
        <input type="text" placeholder="Search saved tabs" v-model="search">
      </div>
      <ul v-if="items && items.length > 0" class="list">
        <ListItem
            v-for="item in filtered"
            :key="item.id"
            :id="item.id"
            :title="item.title"
            :items="item.items"/>
      </ul>
    </div>
  </div>
</template>
<style>
#app {
  width: 580px;
  border-radius: 16px;
  border: 1px solid #ECECEC;
  box-shadow: 0 3.2rem 6.4rem 0 rgba(0, 0, 0, 0.05);
}
</style>
