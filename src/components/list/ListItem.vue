<script setup lang="ts">
import {defineProps, onMounted, PropType, ref} from "vue";
import IconPlay from "../icons/IconPlay.vue";
import IconDelete from "../icons/IconDelete.vue";
import {IListItem} from "../../interfaces/list/IList";
import SubList from "./SubList.vue";
import useGetFromLocalStorage from "../../hooks/useGetFromLocalStorage";
import useChangeLocalStorage from "../../hooks/useChangeLocalStorage";

import {usePopupStore} from "../../stores/popup-store";
import Confirm from "../popups/Confirm.vue";

const popup_store = usePopupStore();

const confirm_status = ref(false);
const delete_status = ref(false);
const input_ref = ref();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array as PropType<IListItem[]>,
    required: true,
  }
});
const value = ref("");

function onBlur() {
  if (value.value !== "") {
    value.value = value.value.trim();
    value.value = value.value.replace(/ /g, '_');
    const all_tabs = useGetFromLocalStorage();
    const index = all_tabs?.findIndex((item: any) => item.id === props.id);
    if (index !== undefined && index !== -1) {
      all_tabs[index].title = value.value;
      useChangeLocalStorage(all_tabs);
    }
  }
}

function onDelete() {
  confirm_status.value = true;
}

function emitAgree() {
  delete_status.value = true;
  if(delete_status.value){
    const all_tabs = useGetFromLocalStorage();
    const index = all_tabs?.findIndex((item: any) => item.id === props.id);
    if (index !== undefined && index !== -1) {
      all_tabs.splice(index, 1);
      useChangeLocalStorage(all_tabs);
    }
    popup_store.updateFromLocalStorage();
    delete_status.value = false;
  }
  confirm_status.value = false;
}

async function openAll() {
  const all_tabs = useGetFromLocalStorage();
  const index = all_tabs?.findIndex((item: any) => item.id === props.id);
  if (index !== undefined && index !== -1) {
    // @ts-ignore
    const allTabs = await chrome.tabs.query({active: false, currentWindow: true});
    // @ts-ignore
    const all_tabs_urls = allTabs.reduce((acc, tab) => {
      acc.push({
        id: tab.id,
        title: tab.title,
        url: tab.url
      });
      return acc;
    }, []);
    let queryOptions = {active: true, lastFocusedWindow: true};
    // @ts-ignore
    const [tab] = await chrome.tabs.query(queryOptions)
    const tabs = all_tabs[index].items;
    // @ts-ignore
    tabs.forEach((item) => {
      // @ts-ignore
      chrome.tabs.create({url: item.url});
    });
    setTimeout(() => {
      // @ts-ignore
      chrome.tabs.remove(tab.id)
      // @ts-ignore
      all_tabs_urls.forEach((item) => {
      // @ts-ignore
        chrome.tabs.remove(item.id)
      });
    }, 1000);
  }
}

onMounted(() => {
  value.value = props.title;
});
</script>

<template>
  <li class="list__item">
    <Confirm
        v-if="confirm_status"
        title="Are you sure?"
        @emit_agree="emitAgree"
        @emit_close="confirm_status = false"
    />
    <input
        :ref="input_ref"
        type="text"
        v-model="value"
        class="list__input"
        @blur="onBlur"
    >
    <div class="list__play" @click="openAll">
      <IconPlay/>
    </div>
    <div class="list__delete" @click="onDelete">
      <IconDelete/>
    </div>
    <SubList :list_id="id" :items="items"/>
  </li>
</template>
