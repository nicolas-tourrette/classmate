/// <reference path="../patterns/subject.ts" />
/// <reference path="../models/poll.ts" />

class Controller extends Subject
{
    /**
     * Attributes
     */
    private _pollNames: Array<Poll>;
    public get pollNames(): Array<Poll> { return this._pollNames; }
    
    private _poll: Poll;
    public get poll(): Poll { return this._poll; }

    private _versions: Array<Version>;
    public get versions(): Array<Version> { return this._versions; }

    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._pollNames = new Array<Poll>();
        this._poll = new Poll();
        this._versions = new Array<Version>();
    }

    /**
     * Methods
     */

    reinitPoll(){
        this._poll = null;
    }

    getVersions(): Promise<Array<Version>> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', `assets/versions.json`);

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    if (data) {
                        this._versions = data;
                        this.notify();
                        resolve();
                    }
                    else {
                        reject();
                    }
                }
                else {
                    reject();
                }
            }
            xhr.send();
        });
    }

    /**
     * Authenticates a user with a password hash
     * @param password Password hash to authenticate
     */
    authenticate(password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { password: password };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/auth.php`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    /**
     * Get all poll names to create the menu
     */
    getPollNames(): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', `api/polls.php?action=getPollNames`);

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    let data = JSON.parse(xhr.responseText);
                    if(data){
                        this._pollNames = data.map((item: any) => { return new Poll(item); });
                        this.notify();
                        resolve();
                    }
                    else{
                        reject();
                    }
                }
                else {
                    reject();
                }
            }
            xhr.send();
        });
    }

     /**
      * Get the poll corresponding to the ID parameter
      * @param id The poll ID
      */
    getPoll(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', `api/polls.php?action=getPoll&id=${id}`);

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    try {
                        let data = JSON.parse(xhr.responseText);
                        this._poll = new Poll(data);
                    }
                    catch(error){
                        console.error(error);
                        reject(error);
                    }
                    this.notify();
                    resolve();
                }
                else{
                    reject();
                }
            }

            xhr.send();
        });
    }

    /**
     * Save a poll
     * @param poll The poll to save
     */
    savePoll(poll: Poll): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { poll: poll.toPHPArray() };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/polls.php?action=save`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getPollNames();
                    this.getPoll(poll.id);
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    /**
     * Adds a new poll
     * @param poll The new poll to save
     */
    addPoll(poll: Poll): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { poll: poll.toPHPArray() };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/polls.php?action=add`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getPollNames();
                    this.getPoll(poll.id);
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    activatePoll(pollId: string, status: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { poll: pollId, active: status };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/polls.php?action=activate`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getPollNames();
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    /**
     * Books an appointment
     * @param appointment The appointment to book in database
     */
    bookAppointment(appointment: BookedAppointment): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { appointment: appointment.toPHPArray() };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/appointments.php?action=book&poll=${encodeURIComponent(this._poll.name)}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getPoll(this._poll.id);
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    /**
     * Books an appointment
     * @param appointment The appointment to add in database
     */
    addAppointment(appointment: BookedAppointment): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { appointment: appointment.toPHPArray() };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/appointments.php?action=add&pollId=${this._poll.id}`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getPoll(this._poll.id);
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    /**
     * Saves an edited appointment
     * @param appointment The edited appointment to save
     */
    editAppointment(appointment: BookedAppointment): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { appointment: appointment.toPHPArray() };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/appointments.php?action=edit`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getPoll(this._poll.id);
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    /**
     * Deletes an appointement
     * @param id The appointement ID to delete
     */
    deleteAppointment(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let data = { id: id };
            let xhr = new XMLHttpRequest();

            xhr.open('POST', `api/appointments.php?action=delete`);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onload = () => {
                if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                    this.getPoll(this._poll.id);
                    resolve();
                }
                reject();
            }

            xhr.send('data=' + JSON.stringify(data));
        });
    }

    /**
     * Sets a cookie
     * @param cname Cookie's name
     * @param cvalue Cookie's value
     * @param exdays Number of days for cookie validity
     */
    setCookie(cname: string, cvalue: string, exdays: number) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/classmate/";
    }


    /**
     * Get the value of a cookie
     * @param cname Cookie's name
     */
    getCookie(cname: string): string {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}
