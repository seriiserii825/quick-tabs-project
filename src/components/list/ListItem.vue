<script setup lang="ts">
import {defineProps, onMounted, PropType, ref} from "vue";
import IconPlay from "../icons/IconPlay.vue";
import IconDelete from "../icons/IconDelete.vue";
import {IListItem} from "../../interfaces/list/IList";
import SubList from "./SubList.vue";
import useGetFromLocalStorage from "../../hooks/useGetFromLocalStorage";
import useChangeLocalStorage from "../../hooks/useChangeLocalStorage";

const input_ref = ref<HTMLInputElement>();

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
    const index = all_tabs?.findIndex((item) => item.id === props.id);
    if (index !== undefined && index !== -1) {
      all_tabs[index].title = value.value;
      useChangeLocalStorage(all_tabs);
    }
  }
}

function onDelete() {
  const prompt = window.confirm("Are you sure you want to delete this tab?");
  if (!prompt) {
    return;
  }
  const all_tabs = useGetFromLocalStorage();
  const index = all_tabs?.findIndex((item) => item.id === props.id);
  if (index !== undefined && index !== -1) {
    all_tabs.splice(index, 1);
    useChangeLocalStorage(all_tabs);
  }
}

onMounted(() => {
  value.value = props.title;
});
</script>

<template>
  <li class="list__item">
    <input
        :ref="input_ref"
        type="text"
        v-model="value"
        class="list__input"
        @blur="onBlur"
    >
    <div class="list__play">
      <IconPlay/>
    </div>
    <div class="list__delete" @click="onDelete">
      <IconDelete/>
    </div>
    <SubList :list_id="id" :items="items"/>
  </li>
</template>
