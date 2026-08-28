<script setup lang="ts">
import IconImport from "../icons/IconImport.vue";
import IconExport from "../icons/IconExport.vue";
import {usePopupStore} from "../../stores/popup-store.ts";
import useChangeLocalStorage from "../../hooks/useChangeLocalStorage.ts";
import useExportLocalStorage from "../../hooks/useExportLocalStorage.ts";
import {ref} from "vue";

const emits = defineEmits(['emit_create_project']);

const file_ref = ref();
const popup_store = usePopupStore();

function newProject() {
  emits('emit_create_project');
}

function importAll() {
  //@ts-ignore
  const file = file_ref.value.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      //@ts-ignore
      const fileContents = e.target.result;
      //@ts-ignore
      const tabs = JSON.parse(fileContents);
      useChangeLocalStorage(tabs);
      popup_store.updateFromLocalStorage();
    };
    //@ts-ignore
    const result = reader.readAsText(file);
  }
}

function exportAll() {
  useExportLocalStorage();
}

</script>

<template>
  <div class="json">
    <h3 class="json__title">Json</h3>
    <div class="json__actions">
      <button @click="newProject" class="json__btn"><strong>+</strong> Create new project</button>
      <button class="json__btn" @click="importAll">
        <IconImport/>
        <span>Import</span>
        <input @change="importAll" ref="file_ref" type="file" id="fileInput"/>
      </button>
      <button class="json__btn" @click="exportAll">
        <IconExport/>
        <span>Export</span>
      </button>
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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1.6rem;
    border: none;
    background: transparent;
    cursor: pointer;
    strong {
      margin-right: 0.8rem;
      font-size: 1.8rem;
      color: var(--accent);
    }
    input {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
    }
  }
}
</style>
