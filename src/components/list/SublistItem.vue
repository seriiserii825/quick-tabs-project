<script setup lang="ts">
import {onMounted, ref, defineProps, PropType} from "vue";
import useGetFromLocalStorage from "../../hooks/useGetFromLocalStorage";
import IconEdit from "../icons/IconEdit.vue";
import IconDelete from "../icons/IconDelete.vue";
import {IListItem} from "../../interfaces/list/IList";
import useChangeLocalStorage from "../../hooks/useChangeLocalStorage";

const input_ref = ref<HTMLInputElement>();
const value = ref("");
const disabled = ref(true);
const props = defineProps({
  item: {
    type: Object as PropType<IListItem>,
    required: true,
  },
  list_id: {
    type: Number,
    required: true,
  },
});

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
    const list_index = all_tabs?.findIndex((item) => item.id === props.list_id);
    const index = all_tabs[list_index].items.findIndex((item) => item.id === props.item.id);
    if (index !== undefined && index !== -1) {
      all_tabs[list_index].items[index].title = value.value;
      useChangeLocalStorage(all_tabs);
    }
  }
}

function onDelete(){
  const prompt = window.confirm("Are you sure you want to delete this tab?");
  if (!prompt) {
    return;
  }
  const all_tabs = useGetFromLocalStorage();
  const list_index = all_tabs?.findIndex((item) => item.id === props.list_id);
  const index = all_tabs[list_index].items.findIndex((item) => item.id === props.item.id);
  if (index !== undefined && index !== -1) {
    all_tabs[list_index].items.splice(index, 1);
    useChangeLocalStorage(all_tabs);
  }
}

onMounted(() => {
  value.value = props.item.title;
});
</script>

<template>
  <div class="sublist__item">
    <input
        :ref="input_ref"
        type="text"
        v-model="value"
        class="list__input"
        :class="{'active': !disabled}"
        @blur="onBlur"
        :disabled="disabled">
    <div class="sublist__edit" @click="toggleDisabled">
      <IconEdit/>
    </div>
    <div class="sublist__delete" @click="onDelete">
      <IconDelete/>
    </div>
  </div>
</template>
