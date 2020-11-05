var Poll = /** @class */ (function () {
    /**
     * Constructor
     * @param data
     */
    function Poll(data) {
        if (data === void 0) { data = null; }
        this._id = "";
        this._name = "";
        this._active = true;
        this._appointments = new Array();
        this.fromArray(data);
    }
    Object.defineProperty(Poll.prototype, "id", {
        get: function () { return this._id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Poll.prototype, "name", {
        get: function () { return this._name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Poll.prototype, "active", {
        get: function () { return this._active; },
        set: function (active) { this._active = active; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Poll.prototype, "appointments", {
        get: function () { return this._appointments; },
        enumerable: false,
        configurable: true
    });
    /**
     * Imports data from JS object
     * @param data
     */
    Poll.prototype.fromArray = function (data) {
        var _this = this;
        if (data) {
            this._id = data.id !== undefined ? data.id : this._id;
            this._name = data.name !== undefined ? data.name : this._name;
            this._active = data.active !== undefined ? data.active : this._active;
            if (data.appointments !== undefined) {
                data.appointments.forEach(function (appointment) {
                    _this._appointments.push(new BookedAppointment(appointment));
                });
            }
        }
    };
    /**
     * Exports data to JS object
     */
    Poll.prototype.toArray = function () {
        return {
            id: this._id,
            name: this._name,
            active: this._active,
            appointments: this._appointments.forEach(function (element) { element.toArray(); })
        };
    };
    Poll.prototype.toPHPArray = function () {
        return {
            ID: this._id,
            NAME: this._name,
            ACTIVE: this._active,
            appointments: this._appointments.forEach(function (element) { element.toArray(); })
        };
    };
    return Poll;
}());
//# sourceMappingURL=poll.js.map