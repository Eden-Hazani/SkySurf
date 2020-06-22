export class VacationModel{
    public constructor(
        public vacationId?:number,
        public description?:string,
        public destination?:string,
        public vacationImg?:string,
        public vacationDates?:string,
        public price?:number,
        public numberOfFollowers?:number
        ){}
}