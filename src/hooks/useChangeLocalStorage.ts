export default function useChangeLocalStorage(value) {
    localStorage.setItem('all_tabs', JSON.stringify(value));
}