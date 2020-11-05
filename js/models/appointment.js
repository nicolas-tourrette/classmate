var Appointment = /** @class */ (function () {
    /**
     * Constructor
     * @param data The data constructing the Appointment object
     */
    function Appointment(data) {
        if (data === void 0) { data = null; }
        this._id = 0;
        this._start = new Date("0000-00-00 00:00");
        this._end = new Date("0000-00-00 00:00");
        this.fromArray(data);
    }
    Object.defineProperty(Appointment.prototype, "id", {
        get: function () { return this._id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Appointment.prototype, "start", {
        get: function () { return this._start; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Appointment.prototype, "end", {
        get: function () { return this._end; },
        enumerable: false,
        configurable: true
    });
    Appointment.prototype.fromArray = function (data) {
        if (data) {
            this._id = data.id !== undefined ? data.id : this._id;
            this._start = data.start !== undefined ? new Date(Date.parse(data.start.date)) : this._start;
            this._end = data.end !== undefined ? new Date(Date.parse(data.end.date)) : this._end;
        }
    };
    Appointment.prototype.toArray = function () {
        return {
            id: this._id,
            start: this._start.toString(),
            end: this._end.toString()
        };
    };
    Appointment.prototype.displayStart = function () {
        return "" + this._start.toLocaleString("fr");
    };
    Appointment.prototype.displayEnd = function () {
        return "" + this._end.toLocaleString("fr");
    };
    return Appointment;
}());
//# sourceMappingURL=appointment.js.map