export interface Theme {
    id: string;
    title: string;
    description: string;

}


export interface ThemeWithSubscription {
    id: string;
    title: string;
    description: string;
    isSubscribed: boolean;
}
