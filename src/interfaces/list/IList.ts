export interface IList {
    id: number;
    title: string;
    items: IListItem[];
    updated_at: number;
}

export interface IListItem {
    title: string;
    url: string;
}