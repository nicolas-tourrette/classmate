var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BookedAppointment = /** @class */ (function (_super) {
    __extends(BookedAppointment, _super);
    function BookedAppointment(data) {
        if (data === void 0) { data = null; }
        var _this = _super.call(this, data) || this;
        _this._parentName = "";
        _this._parentEmail = "";
        _this.fromArray(data);
        return _this;
    }
    Object.defineProperty(BookedAppointment.prototype, "parentName", {
        get: function () { return this._parentName; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BookedAppointment.prototype, "parentEmail", {
        get: function () { return this._parentEmail; },
        enumerable: false,
        configurable: true
    });
    BookedAppointment.prototype.fromArray = function (data) {
        if (data) {
            _super.prototype.fromArray.call(this, data);
            this._parentName = data.parent !== undefined ? data.parent : this._parentName;
            this._parentEmail = data.email !== undefined ? data.email : this._parentEmail;
        }
    };
    BookedAppointment.prototype.toArray = function () {
        return {
            id: this._id,
            start: this._start.toString(),
            end: this._end.toString(),
            parentName: this._parentName,
            parentEmail: this._parentEmail
        };
    };
    BookedAppointment.prototype.toPHPArray = function () {
        return {
            ID: this._id,
            START: this._start.toLocaleDateString("en") + "T" + this._start.toLocaleTimeString("fr"),
            END: this._end.toLocaleDateString("en") + "T" + this._end.toLocaleTimeString("fr"),
            PARENT: this._parentName,
            PARENT_EMAIL: this._parentEmail
        };
    };
    return BookedAppointment;
}(Appointment));
//# sourceMappingURL=booked-appointment.js.map