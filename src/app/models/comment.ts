export class Comment{
    constructor(
        public _id: string,
        public publication: string,
        public user: string,
        public text: string,
        public created_at: string
    ){
    }
}