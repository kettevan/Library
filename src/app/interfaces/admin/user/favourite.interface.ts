export interface FavouriteInterface {
  id?: number;
  bookId: number;
  userId: number;
  bookinfo?: {
    title: string;
    author: string;
  }
  note?: string;
}
