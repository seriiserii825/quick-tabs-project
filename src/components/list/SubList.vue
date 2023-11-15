<script setup lang="ts">
import {defineProps, PropType} from "vue";
import {IListItem} from "../../interfaces/list/IList";
import SublistItem from "./SublistItem.vue";

const props = defineProps({
  items: {
    type: Array as PropType<IListItem[]>,
    required: true,
  },
  list_id: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <ul class="sublist">
    <SublistItem
        v-for="item in items"
        :key="item.title"
        :item="item"
        :list_id="list_id"
    />
  </ul>
</template>
