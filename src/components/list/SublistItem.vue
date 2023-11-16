<script setup lang="ts">
import {onMounted, ref, defineProps, PropType} from "vue";
import useGetFromLocalStorage from "../../hooks/useGetFromLocalStorage";
import IconDelete from "../icons/IconDelete.vue";
import {IListItem} from "../../interfaces/list/IList";
import useChangeLocalStorage from "../../hooks/useChangeLocalStorage";
import Confirm from "../popups/Confirm.vue";
import {usePopupStore} from "../../stores/popup-store";

const popup_store = usePopupStore();

const confirm_status = ref(false);
const delete_status = ref(false);
const input_ref = ref();
const value = ref("");
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

function onBlur() {
  if (value.value !== "") {
    value.value = value.value.trim();
    value.value = value.value.replace(/ /g, '_');
    const all_tabs = useGetFromLocalStorage();
    const list_index = all_tabs?.findIndex((item: any) => item.id === props.list_id);
    // @ts-ignore
    const index = all_tabs[list_index].items.findIndex((item: any) => item.id === props.item.id);
    if (index !== undefined && index !== -1) {
      all_tabs[list_index].items[index].title = value.value;
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
    // @ts-ignore
    const list_index = all_tabs?.findIndex((item) => item.id === props.list_id);
    // @ts-ignore
    const index = all_tabs[list_index].items.findIndex((item) => item.id === props.item.id);
    if (index !== undefined && index !== -1) {
      all_tabs[list_index].items.splice(index, 1);
      useChangeLocalStorage(all_tabs);
    }
    popup_store.updateFromLocalStorage();
    delete_status.value = false;
  }
  confirm_status.value = false;
}

onMounted(() => {
  value.value = props.item.title;
});
</script>

<template>
  <div class="sublist__item">
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
    <div class="sublist__delete" @click="onDelete">
      <IconDelete/>
    </div>
  </div>
</template>
