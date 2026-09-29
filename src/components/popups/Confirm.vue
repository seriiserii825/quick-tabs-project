<script setup lang="ts">
import {defineProps, defineEmits} from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
const emits = defineEmits(["emit_agree", "emit_close"]);

function onAgree() {
  emits("emit_agree");
}

function onClose() {
  emits("emit_close");
}
</script>

<template>
  <!-- teleport: .list__item has backdrop-filter, which would make position: fixed relative to the row -->
  <Teleport to="body">
    <div class="confirm">
      <h2 class="confirm__title">{{ title }}</h2>
      <div class="confirm__buttons">
        <button @click="onAgree" class="btn btn--error">Yes</button>
        <button @click="onClose" class="btn btn--success">No</button>
      </div>
    </div>
  </Teleport>
</template>
