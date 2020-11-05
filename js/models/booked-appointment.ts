class BookedAppointment extends Appointment {
    private _parentName: string;
    public get parentName(): string { return this._parentName; }
    
    private _parentEmail: string;
    public get parentEmail(): string { return this._parentEmail; }

    constructor(data: any = null){
        super(data);
        this._parentName = "";
        this._parentEmail = "";

        this.fromArray(data);
    }

    fromArray(data: any){
        if(data){
            super.fromArray(data);
            this._parentName = data.parent !== undefined ? data.parent : this._parentName;
            this._parentEmail = data.email !== undefined ? data.email : this._parentEmail;
        }
    }

    toArray(): any{
        return {
            id: this._id,
            start: this._start.toString(),
            end: this._end.toString(),
            parentName: this._parentName,
            parentEmail: this._parentEmail
        }
    }

    toPHPArray(): any {
        return {
            ID: this._id,
            START: this._start.toLocaleDateString("en") + "T" + this._start.toLocaleTimeString("fr"),
            END: this._end.toLocaleDateString("en") + "T" + this._end.toLocaleTimeString("fr"),
            PARENT: this._parentName,
            PARENT_EMAIL: this._parentEmail
        }
    }
}