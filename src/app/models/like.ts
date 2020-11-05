export class Like{
    constructor(
        public _id: string,
        public publication: string,
        public user: string,
        public created_at: string
    ){
    }
}