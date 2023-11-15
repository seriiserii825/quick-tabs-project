export default function useChangeLocalStorage(value) {
    const lc = localStorage.getItem('all_tabs');
    if (lc) {
        localStorage.setItem('all_tabs', JSON.stringify(value));
    }
}