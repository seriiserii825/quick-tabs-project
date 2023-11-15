export interface IList {
    id: number;
    title: string;
    items: IListItem[];
}

export interface IListItem {
    title: string;
    url: string;
}