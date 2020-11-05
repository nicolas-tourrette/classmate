/// <reference path="../patterns/subject.ts" />
/// <reference path="../models/poll.ts" />
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
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    /**
     * Constructor
     */
    function Controller() {
        var _this = _super.call(this) || this;
        _this._pollNames = new Array();
        _this._poll = new Poll();
        _this._versions = new Array();
        return _this;
    }
    Object.defineProperty(Controller.prototype, "pollNames", {
        get: function () { return this._pollNames; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "poll", {
        get: function () { return this._poll; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Controller.prototype, "versions", {
        get: function () { return this._versions; },
        enumerable: false,
        configurable: true
    });
    /**
     * Methods
     */
    Controller.prototype.reinitPoll = function () {
        this._poll = null;
    };
    Controller.prototype.getVersions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "assets/versions.json");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    var data = JSON.parse(xhr.responseText);
                    if (data) {
                        _this._versions = data;
                        _this.notify();
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
                else {
                    reject();
                }
            };
            xhr.send();
        });
    };
    /**
     * Authenticates a user with a password hash
     * @param password Password hash to authenticate
     */
    Controller.prototype.authenticate = function (password) {
        return new Promise(function (resolve, reject) {
            var data = { password: password };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/auth.php");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    /**
     * Get all poll names to create the menu
     */
    Controller.prototype.getPollNames = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "api/polls.php?action=getPollNames");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    var data = JSON.parse(xhr.responseText);
                    if (data) {
                        _this._pollNames = data.map(function (item) { return new Poll(item); });
                        _this.notify();
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
                else {
                    reject();
                }
            };
            xhr.send();
        });
    };
    /**
     * Get the poll corresponding to the ID parameter
     * @param id The poll ID
     */
    Controller.prototype.getPoll = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "api/polls.php?action=getPoll&id=" + id);
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        _this._poll = new Poll(data);
                    }
                    catch (error) {
                        console.error(error);
                        reject(error);
                    }
                    _this.notify();
                    resolve();
                }
                else {
                    reject();
                }
            };
            xhr.send();
        });
    };
    /**
     * Save a poll
     * @param poll The poll to save
     */
    Controller.prototype.savePoll = function (poll) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = { poll: poll.toPHPArray() };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/polls.php?action=save");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    _this.getPollNames();
                    _this.getPoll(poll.id);
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    /**
     * Adds a new poll
     * @param poll The new poll to save
     */
    Controller.prototype.addPoll = function (poll) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = { poll: poll.toPHPArray() };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/polls.php?action=add");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    _this.getPollNames();
                    _this.getPoll(poll.id);
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    Controller.prototype.activatePoll = function (pollId, status) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = { poll: pollId, active: status };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/polls.php?action=activate");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    _this.getPollNames();
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    /**
     * Books an appointment
     * @param appointment The appointment to book in database
     */
    Controller.prototype.bookAppointment = function (appointment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = { appointment: appointment.toPHPArray() };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/appointments.php?action=book&poll=" + encodeURIComponent(_this._poll.name));
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    _this.getPoll(_this._poll.id);
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    /**
     * Books an appointment
     * @param appointment The appointment to add in database
     */
    Controller.prototype.addAppointment = function (appointment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = { appointment: appointment.toPHPArray() };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/appointments.php?action=add&pollId=" + _this._poll.id);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    _this.getPoll(_this._poll.id);
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    /**
     * Saves an edited appointment
     * @param appointment The edited appointment to save
     */
    Controller.prototype.editAppointment = function (appointment) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = { appointment: appointment.toPHPArray() };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/appointments.php?action=edit");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    _this.getPoll(_this._poll.id);
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    /**
     * Deletes an appointement
     * @param id The appointement ID to delete
     */
    Controller.prototype.deleteAppointment = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var data = { id: id };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', "api/appointments.php?action=delete");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    _this.getPoll(_this._poll.id);
                    resolve();
                }
                reject();
            };
            xhr.send('data=' + JSON.stringify(data));
        });
    };
    /**
     * Sets a cookie
     * @param cname Cookie's name
     * @param cvalue Cookie's value
     * @param exdays Number of days for cookie validity
     */
    Controller.prototype.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/classmate/";
    };
    /**
     * Get the value of a cookie
     * @param cname Cookie's name
     */
    Controller.prototype.getCookie = function (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    return Controller;
}(Subject));
//# sourceMappingURL=controller.js.map