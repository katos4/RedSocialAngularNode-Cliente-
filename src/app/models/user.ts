export class User{
    constructor(
        public _id: string,
        public name: string,
        public surname: string,
        public nick: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string,
        public work: string,
        public study: string,
        public city: string,
        public birth: string,
        public gender: string,
        public relationship: boolean,
        public biography: String
    ){}

}