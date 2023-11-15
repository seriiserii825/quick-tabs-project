<script setup lang="ts">
import {defineProps, onMounted, PropType, ref} from "vue";
import IconPlay from "../icons/IconPlay.vue";
import IconEdit from "../icons/IconEdit.vue";
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
const disabled = ref(true);

function toggleDisabled() {
  disabled.value = !disabled.value;
  if (disabled.value) {
    input_ref.value?.blur();
  } else {
    input_ref.value?.focus();
  }
}

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
        :class="{'active': !disabled}"
        @blur="onBlur"
        :disabled="disabled">
    <div class="list__play">
      <IconPlay/>
    </div>
    <div class="list__edit" @click="toggleDisabled">
      <IconEdit/>
    </div>
    <div class="list__delete">
      <IconDelete/>
    </div>
    <SubList :items="items"/>
  </li>
</template>
