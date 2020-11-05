class Poll {
    private _id: string;
    public get id(): string { return this._id; }

    private _name: string;
    public get name(): string { return this._name; }

    private _active: boolean;
    public get active(): boolean { return this._active; }
    public set active(active: boolean) { this._active = active; }

    private _appointments: Array<BookedAppointment>;
    public get appointments(): Array<BookedAppointment> { return this._appointments; }

    /**
     * Constructor
     * @param data
     */
    constructor(data: any = null){
        this._id = "";
        this._name = "";
        this._active = true;
        this._appointments = new Array<BookedAppointment>();
        
        this.fromArray(data);
    }

    /**
     * Imports data from JS object
     * @param data
     */
    fromArray(data: any) {
        if (data) {
            this._id = data.id !== undefined ? data.id : this._id;
            this._name = data.name !== undefined ? data.name : this._name;
            this._active = data.active !== undefined ? data.active : this._active;
            if(data.appointments !== undefined){
                data.appointments.forEach((appointment) => {
                    this._appointments.push(new BookedAppointment(appointment));
                });
            }
        }
    }

    /**
     * Exports data to JS object
     */
    toArray(): any {
        return {
            id: this._id,
            name: this._name,
            active: this._active,
            appointments: this._appointments.forEach((element) => { element.toArray(); })
        };
    }

    toPHPArray(): any {
        return {
            ID: this._id,
            NAME: this._name,
            ACTIVE: this._active,
            appointments: this._appointments.forEach((element) => { element.toArray(); })
        }
    }
}
