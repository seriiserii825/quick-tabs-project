<script setup lang="ts">
import IconEdit from "../icons/IconEdit.vue";
import {ref} from "vue";
const emits = defineEmits(['emit_save']);
const title = ref("");

async function onSubmit() {
  emits('emit_save', title.value);
}
</script>

<template>
  <div class="current-tabs">
    <div class="current-tabs__left">
      <IconEdit/>
      <input type="text" placeholder="Create new tab" v-model="title"/>
    </div>
    <button @click="onSubmit" :disabled="title === ''" class="current-tabs__btn">Save</button>
  </div>
</template>
<style lang="scss">
.current-tabs {
  margin-bottom: 1.2rem;
  border-radius: 8px;
  padding: 1.4rem;
  border-bottom: 1px solid #ECECEC;
  background: rgba(255, 255, 255, 0.80);
  backdrop-filter: blur(24px);
  &__left {
    position: relative;
    flex: 1;
    svg {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  input {
    padding-left: 2.4rem;
    width: 100%;
    height: 3.2rem;
    font-size: 1.6rem;
    font-weight: 600;
    color: black;
    border: none;
    border-bottom: 1px solid #ECECEC;
  }
  &__btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 1.4rem;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--contrast);
    border: none;
    background: transparent;
    cursor: pointer;
  }
}
</style>
