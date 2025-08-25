<script setup lang="ts">
import { defineProps, onMounted, PropType, ref } from "vue";
import IconPlay from "../icons/IconPlay.vue";
import IconDelete from "../icons/IconDelete.vue";
import { IListItem } from "../../interfaces/list/IList";
import SubList from "./SubList.vue";
import useGetFromLocalStorage from "../../hooks/useGetFromLocalStorage";
import useChangeLocalStorage from "../../hooks/useChangeLocalStorage";
import { usePopupStore } from "../../stores/popup-store";
import Confirm from "../popups/Confirm.vue";
import IconToggle from "../icons/IconToggle.vue";
import IconPlus from "../icons/IconPlus.vue";
import IconPlayBlue from "../icons/IconPlayBlue.vue";

const popup_store = usePopupStore();
const confirm_status = ref(false);
const delete_status = ref(false);
const input_ref = ref();
const list_status = ref(false);
const sublist_title = ref("");
const sublist_url = ref("");
const sublist_url_error = ref("");
const sublist_add_status = ref(false);
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
  },
});
const value = ref("");

function onBlur() {
  if (value.value !== "") {
    value.value = value.value.trim();
    value.value = value.value.replace(/ /g, "_");
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
  if (delete_status.value) {
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

async function openAll(id, keep = false) {
  const lc_tabs = useGetFromLocalStorage();
  const lc_index = lc_tabs?.findIndex((item: any) => item.id === id);
  if (lc_index !== undefined && lc_index !== -1) {
    lc_tabs[lc_index].updated_at = Number(Date.now().toString());
    useChangeLocalStorage(lc_tabs);
    popup_store.updateFromLocalStorage();
  }
  const all_tabs = useGetFromLocalStorage();
  const index = all_tabs?.findIndex((item: any) => item.id === props.id);
  if (index !== undefined && index !== -1) {
    // @ts-ignore
    const allTabs = await chrome.tabs.query({
      active: false,
      currentWindow: true,
    });
    // @ts-ignore
    const all_tabs_urls = allTabs.reduce((acc, tab) => {
      acc.push({
        id: tab.id,
        title: tab.title,
        url: tab.url,
      });
      return acc;
    }, []);
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    let queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);
    if (tabs?.[0]?.["vivExtData"]) {
      const tabs = all_tabs[index].items;
      tabs.forEach((item) => {
        chrome.tabs.create({ url: item.url });
      });
      if (!keep) {
        setTimeout(() => {
          chrome.tabs.remove(tab.id);
          all_tabs_urls.forEach((item) => {
            chrome.tabs.remove(item.id);
          });
        }, 1000);
      }
    } else {
      const tabs = all_tabs[index].items;
      if (!keep) {
        tabs.forEach((item) => {
          chrome.tabs.create({ url: item.url });
        });
        all_tabs_urls.forEach((item) => {
          chrome.tabs.remove(item.id);
        });
        chrome.tabs.remove(tab.id);
      }else{
      tabs.forEach((item) => {
        chrome.tabs.create({ url: item.url });
      });
      }
    }
  }
}

function addSublist() {
  if (
    sublist_url.value !== "" &&
    sublist_title.value !== "" &&
    sublist_url_error.value === ""
  ) {
    const new_sublist = {
      id: Date.now(),
      title: sublist_title.value,
      url: sublist_url.value,
    };
    const all_tabs = useGetFromLocalStorage();
    const index = all_tabs?.findIndex((item: any) => item.id === props.id);
    if (index !== undefined && index !== -1) {
      all_tabs[index].items.push(new_sublist);
      useChangeLocalStorage(all_tabs);
    }
    sublist_url.value = "";
    sublist_title.value = "";
    sublist_add_status.value = false;
    popup_store.updateFromLocalStorage();
  }
}

function onBlurUrl() {
  //check sublist_url for https and http
  if (
    sublist_url.value.includes("https://") ||
    sublist_url.value.includes("http://")
  ) {
    sublist_url_error.value = "";
  } else {
    sublist_url.value = "";
    sublist_url_error.value = "Url must contain https:// or http://";
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
    <button class="list__play" @click="openAll(id)" title="remove current">
      <IconPlay />
    </button>
    <button class="list__play" @click="openAll(id, true)" title="keep current">
      <IconPlayBlue />
    </button>
    <button
      :class="{ active: list_status }"
      @click="list_status = !list_status"
      class="list__toggle"
    >
      <IconToggle />
    </button>
    <input
      :ref="input_ref"
      type="text"
      v-model="value"
      class="list__input"
      @blur="onBlur"
    />
    <button
      @click="sublist_add_status = !sublist_add_status"
      class="list__plus"
    >
      <IconPlus />
    </button>
    <button class="list__delete" @click="onDelete">
      <IconDelete />
    </button>
    <div class="list__body">
      <div v-if="sublist_add_status" class="list__add">
        <input
          type="text"
          v-model="sublist_title"
          class="list__input"
          placeholder="Title"
        />
        <input
          type="text"
          v-model="sublist_url"
          class="list__input"
          :class="{ error: sublist_url_error }"
          :placeholder="sublist_url_error ? sublist_url_error : 'Url'"
          @blur="onBlurUrl"
        />
        <button @click="addSublist" class="btn">Add</button>
      </div>
      <SubList v-if="list_status" :list_id="id" :items="items" />
    </div>
  </li>
</template>
