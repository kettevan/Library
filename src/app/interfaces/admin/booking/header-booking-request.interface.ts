export class HeaderBookingRequestInterface {
  userId: number;
  bookCopies: {
    bookCopyId: number;
    startDate: Date;
    endDate: Date;
  }[]
}

export class BookCopiesReserveInterface {
  bookCopyId: number;
  startDate: Date;
  endDate: Date;
}
