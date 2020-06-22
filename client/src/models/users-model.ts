export class UsersModel{
    public constructor(
        public userId?:number,
        public userName?:string,
        public passWord?:string,
        public isAdmin?:number,
        public followsVacations?:string
        ){}
}