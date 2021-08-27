export interface BookHistoryInterface {
  active?: boolean,
  bookCopyCode: string
  bookCopyId: number,
  bookId: number,
  createDate?: string,
  id?: number,
  lendDate?: string,
  lenderAdminFullName?: string,
  note?: string,
  readerFullName?: string
  reservationId?: number,
  returnDate?: string,
  updateDate?: string,
  userId: number
}
