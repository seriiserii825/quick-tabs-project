<script setup lang="ts">
import {defineProps, PropType} from "vue";
import IconEdit from "../icons/IconEdit.vue";
import IconDelete from "../icons/IconDelete.vue";
import {IListItem} from "../../interfaces/list/IList";

const props = defineProps({
  items: {
    type: Array as PropType<IListItem[]>,
    required: true,
  }
});
</script>

<template>
  <ul class="sublist">
    <li
        v-for="item in items"
        :key="item.title"
        class="sublist__item">
      <span>{{ item.title }}</span>
      <div class="sublist__edit">
        <IconEdit/>
      </div>
      <div class="sublist__delete">
        <IconDelete/>
      </div>
    </li>
  </ul>
</template>
