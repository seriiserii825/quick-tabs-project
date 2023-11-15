<script setup lang="ts">
import {defineProps, onMounted, PropType, ref} from "vue";
import IconPlay from "../icons/IconPlay.vue";
import IconEdit from "../icons/IconEdit.vue";
import IconDelete from "../icons/IconDelete.vue";
import {IListItem} from "../../interfaces/list/IList";
import SubList from "./SubList.vue";

const input_ref = ref<HTMLInputElement>();

const props = defineProps({
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
