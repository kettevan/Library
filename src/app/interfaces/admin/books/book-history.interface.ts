export interface BookHistoryInterface {
  active?: boolean,
  bookCopyCode: string
  bookCopyId: number,
  bookId: number,
  createDate?: Date,
  id?: number,
  lendDate?: Date,
  lenderAdminFullName?: string,
  note?: string,
  readerFullName?: string
  reservationId?: number,
  returnDate?: Date,
  updateDate?: Date,
  userId: number
}
