export interface FavouriteResponseInterface {
  createDate: Date,
  updateDate: Date,
  active: boolean,
  id: number,
  userId: number,
  bookId: number,
  note?: string
}
