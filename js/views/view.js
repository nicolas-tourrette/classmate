/// <reference path="../patterns/observer.ts" />
/// <reference path="../controllers/controller.ts" />
var View = /** @class */ (function () {
    /**
     * Constructor
     * @param controller
     */
    function View(controller) {
        this._controller = controller;
        this._controller.addObserver(this);
        this._container = document.getElementById("app");
        this._authHash = "";
        this.initView();
    }
    Object.defineProperty(View.prototype, "url", {
        get: function () { return this._url; },
        enumerable: false,
        configurable: true
    });
    /**
     * Initializes the view
     */
    View.prototype.initView = function () {
        var _this = this;
        window.addEventListener("hashchange", function () { _this._message = ""; _this._url = window.location.hash.substring(1); _this.notify(); });
        this._controller.getPollNames().catch(function () {
            console.error("No polls to load.");
        });
        this._controller.getVersions().catch(function () {
            console.warn("Versions history not found.");
        });
        var navitems = document.querySelectorAll("li[class*='nav-item']");
        for (var i = 0; i < navitems.length; ++i) {
            navitems[i].addEventListener("click", function () {
                for (var i_1 = 0; i_1 < navitems.length; ++i_1) {
                    navitems[i_1].classList.remove('active');
                }
                this.classList.add("active");
            });
        }
        this._url = window.location.hash.substring(1);
        this.notify();
    };
    /**
     * Notification function of the view
     */
    View.prototype.notify = function () {
        var _this = this;
        if (this._url === "") {
            var homeButton = document.querySelector("li[data-target='home']");
            homeButton.click();
        }
        else {
            var button = document.querySelector("li[data-target=\"" + this._url.split("/")[0] + "\"");
            button.click();
        }
        if (this._controller.versions.length > 0) {
            document.querySelectorAll("span.current-version-number").forEach(function (span) {
                span.innerHTML = "v" + _this._controller.versions[0].version;
            });
            document.querySelector("span.current-version-date").innerHTML = this._controller.versions[0].date;
        }
        if (this._controller.pollNames.length > 0) {
            var navbar_1 = document.querySelector("div.dropdown-menu[aria-labelledby='dropdown-polls']");
            navbar_1.innerHTML = "";
            this._controller.pollNames.forEach(function (poll) {
                if (poll.active) {
                    navbar_1.innerHTML += "<a class=\"dropdown-item\" href=\"#sondages/" + poll.id + "\">" + poll.name + "</a>";
                }
            });
        }
        document.querySelectorAll("a.dropdown-item").forEach(function (item) {
            item.classList.remove("active");
        });
        document.querySelector("a[href=\"#about/changelog\"] span.badge").classList.remove("text-light");
        this.router();
    };
    /**
     * Router of the view
     */
    View.prototype.router = function () {
        var _this = this;
        switch (true) {
            case /^$/.test(this._url):
                this.displayHome();
                break;
            case /^sondages\/[a-z0-9]+$/gi.test(this._url):
                this.displaySondage(this._url.split("/")[1]);
                break;
            case /^admin$/gi.test(this._url):
                this._controller.authenticate(this._controller.getCookie("auth")).then(function () {
                    _this.displayAdminLink();
                    _this.displayAdminHome();
                }).catch(function () {
                    _this.authenticate();
                });
                break;
            case /^admin\/polls\/[a-z0-9]+$/gi.test(this._url):
                this._controller.authenticate(this._controller.getCookie("auth")).then(function () {
                    _this.displayAdminLink();
                    _this.displayAdminPoll(_this._url.split("/")[2]);
                }).catch(function () {
                    _this.authenticate();
                });
                break;
            case /^logout$/gi.test(this._url):
                document.cookie = "auth=; expires=Mon, 02 Oct 2000 01:00:00 GMT; path=/classmate/";
                var adminLi = document.querySelector("li.nav-item[data-target='admin']");
                adminLi.classList.remove("dropdown");
                adminLi.innerHTML = "\n                    <a class=\"nav-link\" href=\"#admin\">Connexion</a>\n                ";
                this.displayHome();
                break;
            case /^about\/about$/gi.test(this._url):
                this.displayAbout();
                break;
            case /^about\/changelog$/gi.test(this._url):
                this.displayChangelog();
                break;
            default:
                this.displayError(404);
                break;
        }
    };
    View.prototype.displayAdminLink = function () {
        var adminLi = document.querySelector("li.nav-item[data-target='admin']");
        adminLi.classList.add("dropdown");
        adminLi.innerHTML = "\n            <a class=\"nav-link dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">Marion PELTE</a>\n            <div class=\"dropdown-menu\" aria-labelledby=\"dropdown-admin\">\n                <a class=\"dropdown-item\" href=\"#admin\">Administration</a>\n                <a class=\"dropdown-item\" href=\"#logout\">Se d\u00E9connecter</a>\n            </div>\n        ";
    };
    /**
     * Displays homepage
     */
    View.prototype.displayHome = function () {
        var content = "";
        if (this._url === "logout") {
            content = "\n                <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n                    <strong>D\u00E9connect\u00E9 !</strong> Vous avez \u00E9t\u00E9 d\u00E9connect\u00E9 avec succ\u00E8s.\n                    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                </div>\n            ";
        }
        content += "\n            <h1>Classmate</h1>\n            <p class=\"lead\">\n                Mme PELTE | Ann\u00E9e scolaire 2020-2021 | \u00C9cole Priv\u00E9e Sainte-Marie\n            </p>\n            <div class=\"media\">\n                <div class=\"media-body\">\n                    <h5 class=\"mt-0\">Bienvenue sur Classmate !</h5>\n        ";
        if (this._controller.versions[0] !== undefined && this._controller.versions[0].version.indexOf("rc") !== -1) {
            content += "\n                <div class=\"alert alert-secondary alert-dismissible fade show\" role=\"alert\">\n                    <h4 class=\"alert-heading\">Version candidate !</h4>\n                    <p>\n                        Attention, cette version est seulement candidate \u00E0 une mise en production. Il convient de valider son fonctionnement avant de basculer sur une version compl\u00E8tement op\u00E9rationnelle.\n                    </p>\n                    <hr>\n                    <p class=\"mb-0\"><small>\n                        Une fois le fonctionnement valid\u00E9, cette version sera bascul\u00E9e en production. Version " + this._controller.versions[0].version + "\n                    </small></p>\n                    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                </div>\n            ";
        }
        content += "\n                    <p class=\"text-justify\">\n                        Classmate permet de prendre rendez-vous. Pour cela, rendez-vous dans un sondage, choisissez un rendez-vous parmi les propositions, saisissez votre nom et votre adresse email puis validez. Votre rendez-vous est r\u00E9serv\u00E9 et vous recevez la confirmation par email.\n                    </p>\n                </div>\n                <img src=\"img/icone.png\" class=\"ml-5 img-fluid img-thumbnail\" style=\"width: 200px;\" alt=\"Classmate\">\n            </div>\n        ";
        this._container.innerHTML = content;
    };
    View.prototype.displayAbout = function () {
        document.querySelector("a[href=\"#about/about\"]").classList.add("active");
        this._container.innerHTML = "\n            <h1>\u00C0 propos de Classmate</h1>\n            <p>\n                Classmate est un logiciel web de prise de rendez-vous en ligne avec l'enseignant. Il ne demande que la s\u00E9lection d'un rendez-vous dans le planning d\u00E9j\u00E0 pr\u00E9vu par l'enseignant, le nom et d'adresse email du parent concern\u00E9. Cela facilite la vie de chacun !\n            </p>\n            <p class=\"text-center\">\n                <img src=\"img/icone.png\" class=\"ml-5 img-fluid img-thumbnail\" style=\"width: 200px;\" alt=\"Classmate\">\n            </p>\n\n            <h1 class=\"mt-3\">Mentions l\u00E9gales</h1>\n            <h2>R\u00E9alisation, publication et h\u00E9bergement du site</h2>\n            <ul>\n                <li>Raison sociale : Classmate</li>\n                <li>Application r\u00E9alis\u00E9e par : Nicolas TOURRETTE</li>\n                <li>Directeur de publication : Marion PELTE</li>\n                <li>Site h\u00E9berg\u00E9 par : Nicolas TOURRETTE</li>\n            </ul>\n            <h2>Respect de la vie priv\u00E9e et des donn\u00E9es personnelles</h2>\n            <p>\n                Conform\u00E9ment \u00E0 la Loi \u00AB Informatique et Libert\u00E9s \u00BB n\u00B0 78-17 du 6 janvier 1978, vous disposez d\u2019un droit d\u2019acc\u00E8s, de modification, de rectification et de suppression des donn\u00E9es qui vous concernent.\n            </p>\n            <p>\n                Ce site accepte le R\u00E8glement G\u00E9n\u00E9ral relatif \u00E0 la Protection des Donn\u00E9es (N\u00B02016/679, dit RGPD) du 24 mai 2016 en vigueur depuis le 25 mai 2018 dans toute l'Union Europ\u00E9enne. Vous avez donc un droit de regard sur la mani\u00E8re dont sont exploit\u00E9es vos donn\u00E9es personnelles.\n            </p>\n            <h2>Propri\u00E9t\u00E9 intellectuelle</h2>\n            <p>\n                L\u2019ensemble de ce site rel\u00E8ve de la l\u00E9gislation fran\u00E7aise et internationale sur les droits d\u2019auteur et de la propri\u00E9t\u00E9 intellectuelle. Les noms, marques et enseignes cit\u00E9s sur ce site sont la propri\u00E9t\u00E9 de leurs d\u00E9posants respectifs. Toute utilisation ou reproduction, totale ou partielle, du site, des \u00E9l\u00E9ments qui le composent et/ou des informations qui y figurent, par quelque proc\u00E9d\u00E9 que ce soit, constitue une contrefa\u00E7on sanctionn\u00E9e par le Code de la propri\u00E9t\u00E9 intellectuelle.\n            </p>\n        ";
    };
    View.prototype.displayChangelog = function () {
        var _this = this;
        document.querySelector("a[href=\"#about/changelog\"]").classList.add("active");
        document.querySelector("a[href=\"#about/changelog\"] span.badge").classList.add("text-light");
        var history = "";
        if (this._controller.versions.length > 0) {
            var iVersion_1 = 1;
            this._controller.versions.forEach(function (version) {
                history += "\n                    <p id=\"" + version.version + "\">\n                        <span class=\"badge rounded-pill bg-primary-soft\" style=\"margin-right: 30px;\">v" + version.version + "</span>Release du <i>" + version.date + "</i>\n                    </p>\n                    <p class=\"lead\">Changements apport\u00E9s</p>\n                    <ul class=\"text-gray-700\">\n                ";
                if (version.changes.length > 0) {
                    version.changes.forEach(function (change) {
                        history += "\n                            <li>" + change + ".</li>\n                        ";
                    });
                }
                else {
                    history += "\n                        <li>Aucun changement apport\u00E9.</li>\n                    ";
                }
                history += "        \n                    </ul>\n                    \n                    <p class=\"lead\">Probl\u00E8mes connus</p>\n                    <ul class=\"text-gray-700\">\n                ";
                if (version.issues.length > 0) {
                    version.issues.forEach(function (issue) {
                        history += "\n                            <li>" + issue + ".</li>\n                        ";
                    });
                }
                else {
                    history += "\n                        <li>Aucun probl\u00E8me \u00E0 signaler.</li>\n                    ";
                }
                history += " \n                    </ul>\n                ";
                if (iVersion_1 !== _this._controller.versions.length) {
                    history += " \n                        <hr>\n                    ";
                }
                iVersion_1++;
            });
        }
        else {
            history = "\n                <p>Un probl\u00E8me est survenu lors de la r\u00E9cup\u00E9ration du changelog.</p>\n            ";
        }
        this._container.innerHTML = "\n            <div class=\"row\">\n                <div class=\"col\">\n                    <h1 class=\"mb-5 display-4\">Changelog</h1>\n                    " + history + "\n                </div>\n            </div>\n        ";
    };
    /**
     * Displays the poll
     * @param sondage The poll ID to display
     */
    View.prototype.displaySondage = function (sondage) {
        var _this = this;
        try {
            document.querySelector("a[href=\"#sondages/" + sondage + "\"]").classList.add("active");
        }
        catch (error) {
            this.displayError(404);
            throw new Error("Unknown poll link.");
        }
        if (this._controller.poll.id !== sondage) {
            this._controller.getPoll(sondage)
                .then(function () {
                if (_this._controller.poll.appointments.length === 0) {
                    _this.displayError(204);
                    console.warn("No content to display.");
                }
                else {
                    _this.displaySondageContent(sondage);
                }
            })
                .catch(function () {
                _this.displayError(0);
                throw new Error("Unknown error in promise.");
            });
        }
        else {
            this.displaySondageContent(sondage);
        }
    };
    View.prototype.displaySondageContent = function (sondage) {
        var _this = this;
        var content = "<h1>" + this._controller.poll.name + "</h1>";
        content += "<form id=\"" + sondage + "\">";
        content += "\n        <div class=\"form-group row\">\n            <div class=\"col-sm-2\">S\u00E9lectionner un RDV</div>\n            <div class=\"col-sm-10\">\n        ";
        var iAppointment = 0;
        this._controller.poll.appointments.forEach(function (appointment) {
            if (appointment.parentName === "") {
                content += "\n                    <div class=\"form-check\">\n                        <input class=\"form-check-input\" type=\"radio\" name=\"" + sondage + "-possibility\" id=\"" + sondage + "-possibility-" + appointment.id + "\" value=\"" + appointment.id + "\" data-range='" + iAppointment + "' required>\n                        <label class=\"form-check-label\" for=\"" + sondage + "-possibility-" + appointment.id + "\">\n                            " + appointment.displayStart() + " - " + appointment.displayEnd() + "\n                        </label>\n                    </div>\n                ";
            }
            iAppointment++;
        });
        content += "\n                    </div>\n                </div>\n                <div class=\"form-group row\">\n                    <label for=\"name\" class=\"col-sm-2 col-form-label\">Votre nom</label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Votre nom\" required>\n                    </div>\n                </div>\n                <div class=\"form-group row\">\n                    <label for=\"email\" class=\"col-sm-2 col-form-label\">Votre e-mail <span title=\"Ceci restera confidentiel.\" style=\"cursor: help; color: gray; font-size: 75%;\">[?]</span></label>\n                    <div class=\"col-sm-10\">\n                        <input type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Votre e-mail\" required>\n                    </div>\n                </div>\n                <button type=\"submit\" class=\"btn btn-primary\">Valider</button>\n                <div id=\"error\" class=\"mt-3\"></div>\n            </form>\n        ";
        this._container.innerHTML = content;
        if (document.querySelectorAll("div.form-check").length === 0) {
            this._container.innerHTML = "\n                <h1>" + this._controller.poll.name + "</h1>\n                <div class=\"alert alert-warning fade show\" role=\"alert\">\n                    <strong>Oh oh...</strong> Il n'y a plus de rendez-vous disponible dans ce sondage.\n                </div>\n                <div id=\"error\" class=\"mt-3\"></div>\n            ";
        }
        else {
            var form_1 = document.querySelector("form#" + sondage);
            form_1.addEventListener("submit", function (event) {
                event.preventDefault();
                var button = document.querySelector("button[type='submit']");
                button.setAttribute("disabled", "true");
                button.innerHTML = "<span class=\"spinner-grow spinner-grow-sm\" role=\"status\" aria-hidden=\"true\"></span> Patientez...";
                if (/([\w.-]+@([\w-]+)\.+\w{2,})/gi.test(form_1.email.value)) {
                    var iAppointment_1 = document.querySelector("input[name='" + sondage + "-possibility']:checked").getAttribute("data-range");
                    var bookedAppointment = new BookedAppointment({
                        id: document.querySelector("input[name='" + sondage + "-possibility']:checked").value,
                        start: { date: _this._controller.poll.appointments[iAppointment_1].start.toUTCString() },
                        end: { date: _this._controller.poll.appointments[iAppointment_1].end.toUTCString() },
                        parent: form_1.name.value,
                        email: form_1.email.value
                    });
                    _this._controller.bookAppointment(bookedAppointment).then(function () {
                        button.innerHTML = "Valider";
                        button.setAttribute("disabled", "false");
                        _this._message = "\n                                    <div class=\"alert alert-success alert-dismissible fade show\" role=\"alert\">\n                                        <strong>Super !</strong> Votre rendez-vous a bien \u00E9t\u00E9 enregistr\u00E9. Vous allez recevoir un email pour le confirmer. \u00C0 bient\u00F4t !<br><i>Pensez \u00E0 v\u00E9rifier votre dossier des courriers ind\u00E9sirables si vous ne recevez pas l'email dans votre bo\u00EEte de r\u00E9ception.</i>\n                                        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                                            <span aria-hidden=\"true\">&times;</span>\n                                        </button>\n                                    </div>\n                                ";
                    }).catch(function () {
                        _this._message = "\n                                    <div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n                                        <strong>Ooops...</strong> Il semble que quelque chose se soit mal pass\u00E9 de notre c\u00F4t\u00E9. Veuillez r\u00E9essayer. Si le probl\u00E8me persiste, contactez le gestionnaire.\n                                        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                                            <span aria-hidden=\"true\">&times;</span>\n                                        </button>\n                                    </div>\n                                ";
                    });
                }
                else {
                    document.querySelector("div#error").innerHTML = "\n                                <div class=\"alert alert-warning alert-dismissible fade show\" role=\"alert\">\n                                    <strong>Ooops...</strong> Il semble que votre e-mail ne soit pas correct. Veuillez corriger ceci avant de pouvoir prendre rendez-vous.<br/>\n                                    <i>Nous vous rappelons que votre e-mail restera confidentiel.</i>\n                                    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                                        <span aria-hidden=\"true\">&times;</span>\n                                    </button>\n                                </div>\n                            ";
                }
            });
        }
        if (this._message !== "" && this._message !== undefined) {
            document.querySelector("div#error").innerHTML = this._message;
        }
    };
    /**
     * Authenticates a user
     */
    View.prototype.authenticate = function () {
        var _this = this;
        this._container.innerHTML = "\n            <h1>Administration</h1>\n            " + (this._url !== "admin" ?
            "\n                <div class=\"alert alert-warning alert-dismissible fade show mt-3 mb-3\" role=\"alert\">\n                    <strong>Attention !</strong> Cette partie n'est pas publique. Vous devez vous identifier.\n                    <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                </div>\n                "
            : "") + "\n            <form id=\"loginForm\" class=\"form-inline\">\n                <div class=\"form-group mb-2\">\n                    <label for=\"staticEmail2\" class=\"sr-only\">Utilisateur</label>\n                    <input type=\"text\" readonly class=\"form-control-plaintext\" id=\"staticEmail2\" value=\"Marion PELTE\">\n                </div>\n                <div class=\"form-group mx-sm-3 mb-2\">\n                    <label for=\"inputPassword2\" class=\"sr-only\">Mot de passge</label>\n                    <input type=\"password\" class=\"form-control\" id=\"inputPassword2\" placeholder=\"Mot de passe\">\n                </div>\n                <button id=\"loginButton\" type=\"submit\" class=\"btn btn-primary mb-2\">Connexion</button>\n            </form>\n        ";
        var authForm = document.querySelector("form#loginForm");
        authForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var button = document.querySelector("button[type='submit']");
            button.setAttribute("disabled", "true");
            button.innerHTML = "<span class=\"spinner-grow spinner-grow-sm\" role=\"status\" aria-hidden=\"true\"></span> Patientez...";
            var password = CryptoJS.SHA512(document.getElementById("inputPassword2").value).toString();
            _this._controller.authenticate(password).then(function () {
                _this._controller.setCookie("auth", password, 3);
                _this._authHash = password;
                _this.router();
            }).catch(function () {
                _this.authenticate();
            });
        });
    };
    /**
     * Displays the home for an administrator
     */
    View.prototype.displayAdminHome = function () {
        var _this = this;
        var that = this;
        var content = "\n            <h1>Administration</h1>\n            <p class=\"lead\">Bienvenue Marion PELTE !</p>\n            <h2>Sondages</h2>\n        ";
        this._controller.pollNames.forEach(function (poll) {
            content += "\n                <div class=\"row\">\n                    <div class=\"col-auto\">\n                        <div class=\"custom-control custom-switch\">\n                            <input type=\"checkbox\" class=\"custom-control-input\" id=\"switch-" + poll.id + "\" poll-id=\"" + poll.id + "\" " + (poll.active == true ? "checked" : "") + ">\n                            <label class=\"custom-control-label\" for=\"switch-" + poll.id + "\"></label>\n                        </div>\n                    </div>\n                    <div class=\"col-auto\">\n                        <a href=\"#admin/polls/" + poll.id + "\" class=\"badge badge-pill badge-secondary\">" + poll.name + "</a>\n                    </div>\n                </div>\n            ";
        });
        content += "\n            <button id=\"addPoll\" class=\"btn btn-sm btn-primary mt-2\"><i class=\"fas fa-plus\"></i></button>\n            <div id=\"newPoll\" class=\"d-none\">\n                <div class=\"row mt-3\">\n                    <div class=\"col-lg-12\">\n                        <h3>Nouveau sondage</h3>\n                        <div class=\"form-group\">\n                            <label for=\"name\">Nom du sondage</label>\n                            <input type=\"text\" class=\"form-control\" id=\"name\" aria-describedby=\"nameHelp\">\n                            <small id=\"beginHelp\" class=\"form-text text-muted\">Saisir le nom du nouveau sondage.</small>\n                        </div>\n                        <button id=\"submitNewPoll\" class=\"btn btn-success\">Cr\u00E9er le sondage</button>\n                        <button id=\"cancelNewPoll\" class=\"btn btn-danger\">Annuler</button>\n                    </div>\n                </div>\n            </div>\n        ";
        this._container.innerHTML = content;
        $("div.custom-control.custom-switch").tooltip({
            title: "Activer/Désactiver le sondage",
            placement: 'right',
            trigger: 'hover',
            container: 'body'
        });
        // Add a poll
        document.querySelector("button#addPoll").addEventListener("click", function () {
            document.querySelector("div#newPoll").classList.toggle("d-none");
        });
        document.querySelector("button#submitNewPoll").addEventListener("click", function () {
            if (document.querySelector("input#name").value !== "") {
                var poll_1 = new Poll({
                    id: _this.trimString(document.querySelector("input#name").value.trim().replace(/\s+/g, '').toLowerCase()),
                    name: document.querySelector("input#name").value
                });
                that._controller.addPoll(poll_1)
                    .then(function () {
                    window.location.hash = "admin/polls/" + poll_1.id;
                })
                    .catch(function (error) {
                    console.error(error);
                });
            }
            else {
                alert("Vous n'avez pas saisi le nom du nouveau sondage.");
            }
        });
        document.querySelector("button#cancelNewPoll").addEventListener("click", function () {
            document.querySelector("input#name").value = "";
            document.querySelector("div#newPoll").classList.toggle("d-none");
        });
        // Change poll status
        document.querySelectorAll("div.custom-control.custom-switch input").forEach(function (toggle) {
            toggle.addEventListener("click", function () {
                var pollId = toggle.getAttribute("poll-id");
                var active = toggle.checked;
                _this._controller.activatePoll(pollId, active).catch(function (error) {
                    console.error(error);
                });
            });
        });
    };
    /**
     * Displays the administrator view to manage a poll
     * @param pollID The poll ID to manage
     */
    View.prototype.displayAdminPoll = function (pollID) {
        var _this = this;
        if (this._controller.poll.id !== pollID) {
            this._controller.getPoll(pollID).catch(function () {
                _this.displayError(204);
                throw new Error("Error 204. No content.");
            });
        }
        var content = "\n            <h1>Administration</h1>\n            <p class=\"lead\">Bienvenue Marion PELTE !</p>\n            <div><h2 id=\"pollName\">" + this._controller.poll.name + "</h2></div>\n            <p>Les rendez-vous :</p>\n            <table class=\"appointments\">\n        ";
        var events = [];
        this._controller.poll.appointments.forEach(function (appointment) {
            content += "\n                <tr>\n                    <td>\n                        DU <span id=\"begin-" + appointment.id + "\" start=\"" + appointment.start.toISOString() + "\">" + appointment.displayStart() + "</span> AU <span id=\"end-" + appointment.id + "\" end=\"" + appointment.end.toISOString() + "\">" + appointment.displayEnd() + "</span>\n                    </td>\n                    <td>\n                        " + (appointment.parentName !== ""
                ? "<span class=\"badge badge-pill badge-danger ml-3\" data-toggle=\"tooltip\" data-html=\"true\" data-placement=\"top\" title=\"<a class='text-light' href='mailto:" + appointment.parentEmail + "'>M. ou Mme " + appointment.parentName + "</a>\">R\u00E9serv\u00E9</span>"
                : "<span class=\"badge badge-pill badge-success ml-3\">Libre</span>") + "\n                    </td>\n                    <td>\n                        " + (appointment.parentName === ""
                ? "<button class=\"btn btn-sm btn-primary ml-3 editAppointment\" app-id=\"" + appointment.id + "\"><i class=\"fas fa-pen\"></i></button>\n                                        <button class=\"btn btn-sm btn-danger ml-1\" data-app-id=\"" + appointment.id + "\" data-app-start=\"" + appointment.displayStart() + "\" data-app-end=\"" + appointment.displayEnd() + "\" data-toggle=\"modal\" data-target=\"#deleteAppointmentModal\"><i class=\"fas fa-minus\"></i></button>"
                : "<a href=\"https://www.terminsysteme.de/ics/execute/icsgeneration.php?title=Rendez-vous de parents&location=\u00C9cole Sainte-Marie, Auxerre&startdate=" + appointment.start.getUTCDate() + "." + (appointment.start.getUTCMonth() + 1) + "." + appointment.start.getUTCFullYear() + "&starthour=" + appointment.start.getHours() + "&startminute=" + appointment.start.getMinutes() + "&enddate=" + appointment.end.getUTCDate() + "." + (appointment.end.getUTCMonth() + 1) + "." + appointment.end.getUTCFullYear() + "&endhour=" + appointment.end.getHours() + "&endminute=" + appointment.end.getMinutes() + "&description=Avec M. ou Mme " + appointment.parentName + "&reminder=0&method=REQUEST&timezone=CET&filename=rdv-" + appointment.parentName.trim().replace(/\s+/g, "").toLowerCase() + "&todo=generate+ics-file\" class=\"btn btn-sm btn-primary ml-3\"><i class=\"fas fa-calendar-plus\"></i></a>") + "\n                    </td>\n                </tr>\n            ";
            events.push({
                title: "RDV de parents",
                description: appointment.parentName === "" ? "Toujours libre" : "Avec M. ou Mme " + appointment.parentName,
                start: appointment.start.toISOString(),
                end: appointment.end.toISOString(),
                allDay: false,
                backgroundColor: appointment.parentName === "" ? "#28a745" : "#dc3545",
                borderColor: appointment.parentName === "" ? "#28a745" : "#dc3545"
            });
        });
        content += "\n            </table>\n            <button id=\"addAppointment\" class=\"btn btn-sm btn-primary mt-2\"><i class=\"fas fa-plus\"></i></button>\n            <div id=\"newAppointment\" class=\"d-none\">\n                <div class=\"row mt-3\">\n                    <div class=\"col-lg-12\">\n                        <h3>Nouveau rendez-vous</h3>\n                        <div class=\"form-group\">\n                            <label for=\"begin\">Date de d\u00E9but</label>\n                            <input type=\"datetime-local\" class=\"form-control\" id=\"begin\" aria-describedby=\"beginHelp\">\n                            <small id=\"beginHelp\" class=\"form-text text-muted\">Saisir la date de d\u00E9but du RDV \u00E0 l'aide du calendrier ou au format jj/mm/aaaa hh:mm si l'aide n'est pas disponible.</small>\n                        </div>\n                        <div class=\"form-group\">\n                            <label for=\"end\">Date de fin</label>\n                            <input type=\"datetime-local\" class=\"form-control\" id=\"end\" aria-describedby=\"endHelp\">\n                            <small id=\"endHelp\" class=\"form-text text-muted\">Saisir la date de fin du RDV \u00E0 l'aide du calendrier ou au format jj/mm/aaaa hh:mm si l'aide n'est pas disponible.</small>\n                        </div>\n                        <button id=\"submitNewAppointment\" class=\"btn btn-success\">Cr\u00E9er le RDV</button>\n                        <button id=\"cancelNewAppointment\" class=\"btn btn-danger\">Annuler</button>\n                    </div>\n                </div>\n            </div>\n            <div id=\"calendar\" class=\"mt-5\"></div>\n\n            <div class=\"modal fade\" id=\"deleteAppointmentModal\" data-backdrop=\"static\" data-keyboard=\"false\" tabindex=\"-1\" aria-labelledby=\"staticBackdropLabel\" aria-hidden=\"true\">\n                <div class=\"modal-dialog modal-dialog-centered\">\n                    <div class=\"modal-content\">\n                    <div class=\"modal-header\">\n                        <h5 class=\"modal-title\" id=\"staticBackdropLabel\">Suppression d'un rendez-vous</h5>\n                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                        <span aria-hidden=\"true\">&times;</span>\n                        </button>\n                    </div>\n                    <div class=\"modal-body\">\n                        ...\n                    </div>\n                    <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">Annuler</button>\n                        <button type=\"button\" class=\"btn btn-danger\" id=\"deleteAppointment\" app-id=\"\">Supprimer d\u00E9finitivement</button>\n                    </div>\n                    </div>\n                </div>\n            </div>\n        ";
        this._container.innerHTML = content;
        $('[data-toggle="tooltip"]').tooltip({ delay: { "hide": 1500 } });
        $('#deleteAppointmentModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget); // Button that triggered the modal
            var appId = button.data('app-id'); // Extract info from data-* attributes
            var appStart = button.data('app-start'); // Extract info from data-* attributes
            var appEnd = button.data('app-end'); // Extract info from data-* attributes
            var modal = $(this);
            modal.find('.modal-body').text("Voulez-vous r\u00E9ellement supprimer le rendez-vous #" + appId + " planifi\u00E9 du " + appStart + " au " + appEnd + " ?");
            modal.find('.modal-footer button#deleteAppointment').attr("app-id", appId);
        });
        var calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
            themeSystem: 'bootstrap',
            initialView: 'timeGridWeek',
            events: events,
            locale: 'fr',
            firstDay: 1,
            businessHours: {
                daysOfWeek: [1, 2, 4, 5],
                startTime: '08:15',
                endTime: '17:30'
            },
            nowIndicator: true,
            buttonText: {
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine',
                day: 'Jour',
                list: 'Liste'
            },
            headerToolbar: {
                left: 'printButton prev,next today',
                center: 'title',
                right: 'timeGridDay,timeGridWeek,listWeek,dayGridMonth'
            },
            weekNumbers: true,
            weekText: "Sem. ",
            navLinks: true,
            eventDidMount: function (info) {
                var tooltip = $(info.el).popover({
                    title: info.event.title,
                    content: "<i style=\"font-size: 9px;\">Du " + info.event.start.toLocaleString("fr") + "<br>Au " + info.event.end.toLocaleString("fr") + "</i><br><strong>" + info.event.extendedProps.description + "</strong>",
                    placement: 'top',
                    trigger: 'hover',
                    container: 'body',
                    html: true,
                });
            },
            customButtons: {
                printButton: {
                    text: 'Imprimer',
                    click: function () {
                        var printContent = "\n                            <!doctype html>\n                            <html lang=\"fr\">\n                            <head>\n                                <meta charset=\"utf-8\">\n                                <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, shrink-to-fit=no\">\n\n                                <style>\n                                    table {\n                                        width: 100%;\n                                        border-collapse: collapse;\n                                        border: 1px solid #000000;\n                                    }\n\n                                    thead th {\n                                        font-weight: bold;\n                                        text-align: center;\n                                    }\n\n                                    th, td {\n                                        padding: 5px;\n                                        border: 1px solid #000000;\n                                    }\n                                </style>\n                                <title>Classmate | Mme PELTE</title>\n                            </head>\n\n                            <body>\n                                <h1>Liste des rendez-vous - " + that._controller.poll.name + "</h1>\n                                <table class=\"table table-striped\">\n                                    <thead>\n                                        <tr>\n                                            <th>D\u00E9but</th>\n                                            <th>Fin</th>\n                                            <th>Parent</th>\n                                            <th>Mail de contact</th>\n                                        </tr>\n                                    </thead>\n                                    <tbody>\n                        ";
                        that._controller.poll.appointments.forEach(function (appointment) {
                            if (appointment.parentName !== "") {
                                printContent += "\n                                    <tr>\n                                        <td>Le " + appointment.displayStart() + "</td>\n                                        <td>Le " + appointment.displayEnd() + "</td>\n                                        <td>M. ou Mme " + appointment.parentName + "</td>\n                                        <td>" + appointment.parentEmail + "</td>\n                                    <tr>\n                                ";
                            }
                        });
                        printContent += "\n                                        </tbody>\n                                    </table>\n                                </body>\n                            </html>\n                        ";
                        var printWindow = window.open(that._url, "Classmate | Mme PELTE");
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                        printWindow.print();
                        printWindow.close();
                    }
                }
            },
        });
        calendar.render();
        var that = this;
        // Change the name of the poll
        document.querySelector("h2#pollName").addEventListener("click", function () {
            var parent = this.parentNode;
            parent.innerHTML = "\n                <div class=\"row\">\n                    <div class=\"col-lg-6\">\n                        <input type=\"text\" class=\"form-control\" id=\"newPollName\" value=\"" + that._controller.poll.name + "\">\n                    </div>\n                    <div class=\"col-lg-6\">\n                        <button type=\"button\" id=\"submitNewName\" class=\"btn btn-danger\">Changer le nom</button>\n                        <button type=\"button\" id=\"cancelNewName\" class=\"btn btn-primary ml-2\">Annuler</button>\n                    </div>\n                </div>\n            ";
            document.querySelector("button#submitNewName").addEventListener("click", function () {
                var poll = new Poll({
                    id: that._controller.poll.id,
                    name: document.querySelector("input#newPollName").value,
                    active: that._controller.poll.active,
                    appointments: that._controller.poll.appointments.forEach(function (appointment) { appointment.toArray(); })
                });
                that._controller.savePoll(poll);
            });
            document.querySelector("button#cancelNewName").addEventListener("click", function () {
                that.displayAdminPoll(pollID);
            });
        });
        // Add an appointment
        document.querySelector("button#addAppointment").addEventListener("click", function () {
            document.querySelector("div#newAppointment").classList.toggle("d-none");
        });
        document.querySelector("button#submitNewAppointment").addEventListener("click", function () {
            if (document.querySelector("input#begin").value !== "" && document.querySelector("input#end").value !== "") {
                var appointment = new BookedAppointment({
                    start: {
                        date: document.querySelector("input#begin").value
                    },
                    end: {
                        date: document.querySelector("input#end").value
                    }
                });
                that._controller.addAppointment(appointment).catch(function (error) {
                    console.error(error);
                });
            }
            else {
                alert("Vous n'avez rien saisi pour créer un rendez-vous ou il manque une donnée.");
            }
        });
        document.querySelector("button#cancelNewAppointment").addEventListener("click", function () {
            document.querySelector("input#begin").value = "";
            document.querySelector("input#end").value = "";
            document.querySelector("div#newAppointment").classList.toggle("d-none");
        });
        // Edit an appointment
        document.querySelectorAll("button.editAppointment").forEach(function (button) {
            button.addEventListener("click", function () {
                var appId = button.getAttribute("app-id");
                var startDate = document.querySelector("span#begin-" + appId).getAttribute("start").substring(0, 10);
                var startHour = new Date(document.querySelector("span#begin-" + appId).getAttribute("start")).toLocaleTimeString("fr");
                var endDate = document.querySelector("span#end-" + appId).getAttribute("end").substring(0, 10);
                var endHour = new Date(document.querySelector("span#end-" + appId).getAttribute("end")).toLocaleTimeString("fr");
                document.querySelector("span#begin-" + appId).innerHTML = "\n                    <div class=\"row mb-1\">\n                        <div class=\"col-lg-12\">\n                            <input type=\"datetime-local\" class=\"form-control\" id=\"newBegin\" value=\"" + startDate + "T" + startHour + "\">\n                        </div>\n                    </div>\n                ";
                document.querySelector("span#end-" + appId).innerHTML = "\n                    <div class=\"row mb-1\">\n                        <div class=\"col-lg-12\">\n                            <input type=\"datetime-local\" class=\"form-control\" id=\"newEnd\" value=\"" + endDate + "T" + endHour + "\">\n                        </div>\n                    </div>\n                    <div class=\"row\">\n                        <div class=\"col-lg-12 text-center\">\n                            <button type=\"button\" id=\"submitDate\" class=\"btn btn-danger\">Valider</button>\n                            <button type=\"button\" id=\"cancelDate\" class=\"btn btn-primary ml-2\">Annuler</button>\n                        <div>\n                    </div>\n                ";
                document.querySelector("button#submitDate").addEventListener("click", function () {
                    var appointment = new BookedAppointment({
                        id: appId,
                        start: {
                            date: document.getElementById("newBegin").value
                        },
                        end: {
                            date: document.getElementById("newEnd").value
                        }
                    });
                    that._controller.editAppointment(appointment).catch(function (error) {
                        console.error(error);
                    });
                });
                document.querySelector("button#cancelDate").addEventListener("click", function () {
                    document.querySelector("span#begin-" + appId).innerHTML = new Date(startDate).toLocaleDateString("fr") + " \u00E0 " + startHour;
                    document.querySelector("span#end-" + appId).innerHTML = new Date(endDate).toLocaleDateString("fr") + " \u00E0 " + endHour;
                });
            });
        });
        // Delete an appointment
        document.querySelectorAll("button#deleteAppointment").forEach(function (button) {
            button.addEventListener("click", function () {
                $('#deleteAppointmentModal').modal('hide');
                that._controller.deleteAppointment(parseInt(button.getAttribute("app-id"))).catch(function (error) {
                    console.error(error);
                });
            });
        });
    };
    /**
     * Displays an error message
     * @param errorCode The error code to display the right error
     */
    View.prototype.displayError = function (errorCode) {
        switch (errorCode) {
            case 404:
                this._container.innerHTML =
                    "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n                        <strong>Ooops...</strong> Quelque chose s'est mal pass\u00E9, je n'ai pas r\u00E9ussi \u00E0 trouver ce que vous cherchiez. Si cette erreur se reproduit, contacter le gestionnaire.<br/>\n                        <i>Erreur n\u00B0404</i>\n                        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                            <span aria-hidden=\"true\">&times;</span>\n                        </button>\n                    </div>";
                break;
            case 204:
                this._container.innerHTML =
                    "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n                        <strong>Ooops...</strong> La requ\u00EAte a \u00E9t\u00E9 trait\u00E9e avec succ\u00E8s mais il n'y a pas d\u2019information \u00E0 renvoyer.<br/>\n                        <i>Erreur n\u00B0204</i>\n                        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                            <span aria-hidden=\"true\">&times;</span>\n                        </button>\n                    </div>";
                break;
            default:
                this._container.innerHTML =
                    "<div class=\"alert alert-danger alert-dismissible fade show\" role=\"alert\">\n                        <strong>Ooops...</strong> Quelque chose s'est mal pass\u00E9, mais je ne sais pas quoi. Si cette erreur se reproduit, contacter le gestionnaire.<br/>\n                        <i>Erreur n\u00B0520</i>\n                        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n                            <span aria-hidden=\"true\">&times;</span>\n                        </button>\n                    </div>";
                break;
        }
    };
    View.trimString = function (str) {
        var accent = [
            /[\300-\306]/g, /[\340-\346]/g,
            /[\310-\313]/g, /[\350-\353]/g,
            /[\314-\317]/g, /[\354-\357]/g,
            /[\322-\330]/g, /[\362-\370]/g,
            /[\331-\334]/g, /[\371-\374]/g,
            /[\321]/g, /[\361]/g,
            /[\307]/g, /[\347]/g,
        ];
        var noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];
        for (var i = 0; i < accent.length; i++) {
            str = str.replace(accent[i], noaccent[i]);
        }
        return str.replace(/([- #"@:.,;'%!²=÷+?\/\[\]{}*^$\\`¨€£¤µ§~ƒ„©°])/gi, '');
    };
    return View;
}());
//# sourceMappingURL=view.js.map