import {ref, watch} from "vue";
import {defineStore} from "pinia";
import useGetFromLocalStorage from "../hooks/useGetFromLocalStorage";

export const usePopupStore = defineStore("popup", () => {
    const items = ref<IList[]>();
    const filtered = ref<IList[]>();
    const search = ref("");

    watch(search, (value) => {
        if (value === "") {
            filtered.value = items.value;
        } else {
            const filtered_lc = items.value?.filter((item) => {
                return item.title.toLowerCase().includes(value.toLowerCase());
            });
            if (filtered_lc && filtered_lc.length > 0) {
                filtered.value = filtered_lc;
            }
        }
    });

    function updateFromLocalStorage() {
        const all_tabs = useGetFromLocalStorage();
        if (all_tabs) {
            items.value = all_tabs;
            items.value = items.value?.reverse();
            filtered.value = items.value;
        } else {
            items.value = [];
            filtered.value = [];
        }
    }

    return {
        items,
        filtered,
        search,
        updateFromLocalStorage,
    };
});
