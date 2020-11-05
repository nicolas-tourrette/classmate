/// <reference path="../controllers/controller.ts" />
/// <reference path="../views/view.ts" />
var App = /** @class */ (function () {
    /**
     * Constructor
     */
    function App() {
        this._controller = new Controller();
        if (typeof View != "undefined") {
            this._view = new View(this._controller);
        }
    }
    return App;
}());
window.onload = function () {
    var app = new App();
};
//# sourceMappingURL=app.js.map