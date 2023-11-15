export default function useAddToLocalStorage(value) {
    const lc = localStorage.getItem('all_tabs');
    if (lc) {
        localStorage.setItem('all_tabs', JSON.stringify([...JSON.parse(lc), value]));
    } else {
        localStorage.setItem('all_tabs', JSON.stringify([value]));
    }
}