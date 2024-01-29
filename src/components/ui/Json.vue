<script setup lang="ts">
import IconImport from "../icons/IconImport.vue";
import IconExport from "../icons/IconExport.vue";
</script>

<template>
  <div class="json">
    <h3 class="json__title">Json</h3>
    <div class="json__actions">
      <div class="json__btn">
        <IconImport/>
        <span>Import</span>
      </div>
      <div class="json__btn">
        <IconExport/>
        <span>Export</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.json {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4rem;
  &__title {
    font-size: 1.4rem;
    font-weight: bold;
  }
  &__actions {
    display: flex;
    align-items: center;
  }
  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1.6rem;
  }
}
</style>
