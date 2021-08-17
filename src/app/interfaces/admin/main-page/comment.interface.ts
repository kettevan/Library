export interface CommentInterface {
  id?: number;
  active?: boolean;
  comment: string;
  createDate?: Date;
  updateDate?: Date;
  userId: number;
  bookId: number;
}
