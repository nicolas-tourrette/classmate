class Appointment {
    protected _id: number;
    public get id(): number { return this._id; }

    protected _start: Date;
    public get start(): Date { return this._start; }

    protected _end: Date;
    public get end(): Date { return this._end; }

    /**
     * Constructor
     * @param data The data constructing the Appointment object
     */
    constructor(data: any = null){
        this._id = 0;
        this._start = new Date("0000-00-00 00:00");
        this._end = new Date("0000-00-00 00:00");

        this.fromArray(data);
    }

    fromArray(data: any){
        if(data){
            this._id = data.id !== undefined ? data.id : this._id;
            this._start = data.start !== undefined ? new Date(Date.parse(data.start.date)) : this._start;
            this._end = data.end !== undefined ? new Date(Date.parse(data.end.date)) : this._end;
        }
    }

    toArray(): any{
        return {
            id: this._id,
            start: this._start.toString(),
            end: this._end.toString()
        };
    }

    displayStart(): string {
        return `${this._start.toLocaleString("fr")}`;
    }

    displayEnd(): string {
        return `${this._end.toLocaleString("fr")}`;
    }
}