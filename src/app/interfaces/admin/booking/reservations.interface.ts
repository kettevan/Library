export interface ReservationsInterface {
  active: boolean,
  bookCopy?: {
    active: boolean,
    bookId?: number,
    bookedDates?: [],
    code?: string,
    createDate?: Date,
    description?: string,
    id?: number,
    status?: string,
    updateDate?: Date
  },
  bookCopyId?: number
  bookinfo?: {
    title?: string,
    author?: string
  }
  confirmerAdminId?: number,
  createDate?: Date,
  endDate?: Date
  id?: number,
  lenderAdminId?: number,
  startDate?: number,
  status?: string,
  updateDate?: Date,
  userId?: number
}
