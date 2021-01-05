export interface Chat {
    employee_id:string;
    start_time:Date;
    end_time:Date;
    rating:number;
    messages:object;
    reported:boolean;
}
