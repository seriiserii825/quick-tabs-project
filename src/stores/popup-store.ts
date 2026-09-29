import {ref, watch} from "vue";
import {defineStore} from "pinia";
import useGetFromLocalStorage from "../hooks/useGetFromLocalStorage";
import useChangeLocalStorage from "../hooks/useChangeLocalStorage";
import {IList} from "../interfaces/list/IList";

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

    // Projects are looked up by id, so duplicate ids (e.g. from an edited JSON import)
    // make actions on one project hit another. Give every duplicate a fresh id.
    function fixDuplicateIds(all_tabs: IList[]) {
        const seen = new Set<number>();
        let next_id = Date.now();
        let changed = false;
        all_tabs.forEach((item) => {
            if (seen.has(item.id)) {
                while (seen.has(next_id)) next_id++;
                item.id = next_id;
                changed = true;
            }
            seen.add(item.id);
        });
        if (changed) useChangeLocalStorage(all_tabs);
    }

    function updateFromLocalStorage() {
        const all_tabs = useGetFromLocalStorage();
        if (all_tabs) {
            fixDuplicateIds(all_tabs);
            items.value = all_tabs;
            items.value = items.value?.reverse();
            filtered.value = items.value;
            filtered.value = filtered.value.sort((a, b) => {
                return b.updated_at - a.updated_at;
            });
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
