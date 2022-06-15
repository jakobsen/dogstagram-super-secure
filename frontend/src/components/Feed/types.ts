export interface IPost {
  author: string;
  authorImage: string;
  authorId: number;
  body: string;
  comments: IComment[];
  created: string;
  id: number;
  imageurl: string;
  likes: string[];
}

export interface IComment {
  body: string;
  created: string;
  username: string;
  id: number;
}
