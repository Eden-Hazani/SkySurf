export class UsersModel{
    public constructor(
        public userId?:number,
        public uuid?:string,
        public userName?:string,
        public passWord?:string,
        public firstName?:string,
        public lastName?:string,
        public isAdmin?:number,
        ){}
}