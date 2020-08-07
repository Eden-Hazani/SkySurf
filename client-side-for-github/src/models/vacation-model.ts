export class VacationModel{
    public constructor(
        public vacationId?:number,
        public description?:string,
        public destination?:string,
        public vacationImg?:string,
        public startDate?:string,
        public endDate?:string,
        public price?:number,
        public numberOfFollowers?:number
        ){}
}