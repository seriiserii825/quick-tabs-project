import useGetFromLocalStorage from "./useGetFromLocalStorage";

export default function useExportLocalStorage() {
  const all_tabs = useGetFromLocalStorage();
  const blob = new Blob([JSON.stringify(all_tabs, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const file_name = `${day}-${month}-${year}_${hours}_${minutes}_${seconds}.json`;
  // @ts-ignore
  chrome.downloads.download({
    url: url,
    filename: file_name,
    saveAs: true,
  });
}
