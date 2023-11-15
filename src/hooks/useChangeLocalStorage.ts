export default function useChangeLocalStorage(value: any) {
    localStorage.setItem('all_tabs', JSON.stringify(value));
}
