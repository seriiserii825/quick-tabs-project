<script setup lang="ts">
import {defineProps, PropType} from "vue";
import IconPlay from "../icons/IconPlay.vue";
import IconEdit from "../icons/IconEdit.vue";
import IconDelete from "../icons/IconDelete.vue";
import {IListItem} from "../../interfaces/list/IList";
import SubList from "./SubList.vue";

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
</script>

<template>
  <li class="list__item">
    <div class="list__title">{{ title }}</div>
    <div class="list__play">
      <IconPlay/>
    </div>
    <div class="list__edit">
      <IconEdit/>
    </div>
    <div class="list__delete">
      <IconDelete/>
    </div>
    <SubList :items="items"/>
  </li>
</template>
