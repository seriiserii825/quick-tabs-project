export default function useGetFromLocalStorage() {
    const lc = localStorage.getItem('all_tabs');
    if (lc) {
        return  JSON.parse(lc);
    }
}