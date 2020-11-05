/// <reference path="../controllers/controller.ts" />
/// <reference path="../views/view.ts" />

class App
{
    //Controller
    private _controller: Controller;

    //View responsible for the app
    private _view: View;

    private _userHash: string;

    /**
     * Constructor
     */
    constructor()
    {
        this._controller = new Controller();
        if (typeof View != "undefined") {
            this._view = new View(this._controller);
        }
    }
}

window.onload = () =>
{
    let app = new App();
}
