/// <reference path="../patterns/observer.ts" />
/// <reference path="../controllers/controller.ts" />

class View implements Observer {
    //Controller
    private _controller: Controller;

    //URL of the page
    private _url: string;
    public get url(): string { return this._url; }

    //Container
    private _container: HTMLElement;

    //Message
    private _message: string;

    //Authentication hash for user
    private _authHash: string;

    /**
     * Constructor
     * @param controller
     */
    constructor(controller: Controller) {
        this._controller = controller;
        this._controller.addObserver(this);
        this._container = document.getElementById("app");
        this._authHash = "";
        this.initView();
    }

    /**
     * Initializes the view
     */
    initView() {
        window.addEventListener("hashchange", () => { this._message = ""; this._url = window.location.hash.substring(1); this.notify(); });

        this._controller.getPollNames().catch(() => {
            console.error("No polls to load.");
        });

        this._controller.getVersions().catch(() => {
            console.warn("Versions history not found.");
        });

        let navitems = document.querySelectorAll("li[class*='nav-item']");

        for (let i = 0; i < navitems.length; ++i) {
            navitems[i].addEventListener("click", function () {
                for (let i = 0; i < navitems.length; ++i) { navitems[i].classList.remove('active'); }
                this.classList.add("active");
            });
        }

        this._url = window.location.hash.substring(1);

        this.notify();
    }

    /**
     * Notification function of the view
     */
    notify() {
        if (this._url === "") {
            let homeButton: HTMLElement = document.querySelector("li[data-target='home']");
            homeButton.click();
        }
        else {
            let button: HTMLElement = document.querySelector(`li[data-target="${this._url.split("/")[0]}"`);
            button.click();
        }

        if(this._controller.versions.length > 0){
            document.querySelectorAll("span.current-version-number").forEach((span) => {
                span.innerHTML = "v" + this._controller.versions[0].version;
            });
            document.querySelector("span.current-version-date").innerHTML = this._controller.versions[0].date;
        }

        if (this._controller.pollNames.length > 0) {
            let navbar = document.querySelector("div.dropdown-menu[aria-labelledby='dropdown-polls']");
            navbar.innerHTML = "";
            this._controller.pollNames.forEach((poll) => {
                if(poll.active){
                    navbar.innerHTML += `<a class="dropdown-item" href="#sondages/${poll.id}">${poll.name}</a>`;
                }
            });
        }

        document.querySelectorAll(`a.dropdown-item`).forEach((item) => {
            item.classList.remove("active");
        });
        document.querySelector(`a[href="#about/changelog"] span.badge`).classList.remove("text-light");

        this.router();
    }

    /**
     * Router of the view
     */
    router(){
        switch (true) {
            case /^$/.test(this._url):
                this.displayHome();
                break;

            case /^sondages\/[a-z0-9]+$/gi.test(this._url):
                this.displaySondage(this._url.split("/")[1]);
                break;

            case /^admin$/gi.test(this._url):
                this._controller.authenticate(this._controller.getCookie("auth")).then(() => {
                    this.displayAdminLink();
                    this.displayAdminHome();
                }).catch(() => {
                    this.authenticate();
                });
                break;

            case /^admin\/polls\/[a-z0-9]+$/gi.test(this._url):
                this._controller.authenticate(this._controller.getCookie("auth")).then(() => {
                    this.displayAdminLink();
                    this.displayAdminPoll(this._url.split("/")[2]);
                }).catch(() => {
                    this.authenticate();
                });
                break;
            
            case /^logout$/gi.test(this._url):
                document.cookie = "auth=; expires=Mon, 02 Oct 2000 01:00:00 GMT; path=/classmate/";
                let adminLi = document.querySelector("li.nav-item[data-target='admin']");
                adminLi.classList.remove("dropdown");
                adminLi.innerHTML = `
                    <a class="nav-link" href="#admin">Connexion</a>
                `;
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
    }

    displayAdminLink(){
        let adminLi = document.querySelector("li.nav-item[data-target='admin']");
        adminLi.classList.add("dropdown");
        adminLi.innerHTML = `
            <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Marion PELTE</a>
            <div class="dropdown-menu" aria-labelledby="dropdown-admin">
                <a class="dropdown-item" href="#admin">Administration</a>
                <a class="dropdown-item" href="#logout">Se déconnecter</a>
            </div>
        `;
    }

    /**
     * Displays homepage
     */
    displayHome() {
        let content = "";
        if (this._url === "logout") {
            content = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Déconnecté !</strong> Vous avez été déconnecté avec succès.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `;
        }

        content += `
            <h1>Classmate</h1>
            <p class="lead">
                Mme PELTE | Année scolaire 2020-2021 | École Privée Sainte-Marie
            </p>
            <div class="media">
                <div class="media-body">
                    <h5 class="mt-0">Bienvenue sur Classmate !</h5>
                    <div class="alert alert-secondary alert-dismissible fade show" role="alert">
                        <h4 class="alert-heading">Version candidate !</h4>
                        <p>
                            Attention, cette version est seulement candidate à une mise en production. Il convient de valider son fonctionnement avant de basculer sur une version complètement opérationnelle.
                        </p>
                        <hr>
                        <p class="mb-0"><small>
                            Une fois le fonctionnement validé, cette version sera basculée en production. Version 1.0.0-rc2
                        </small></p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <p class="text-justify">
                        Classmate permet de prendre rendez-vous. Pour cela, rendez-vous dans un sondage, choisissez un rendez-vous parmi les propositions, saisissez votre nom et votre adresse email puis validez. Votre rendez-vous est réservé et vous recevez la confirmation par email.
                    </p>
                </div>
                <img src="img/icone.png" class="ml-5 img-fluid img-thumbnail" style="width: 200px;">
            </div>
        `;
        this._container.innerHTML = content;
    }

    displayAbout(){
        document.querySelector(`a[href="#about/about"]`).classList.add("active");

        this._container.innerHTML = `
            <h1>À propos de Classmate</h1>
            <p>
                Classmate est un logiciel web de prise de rendez-vous en ligne avec l'enseignant. Il ne demande que la sélection d'un rendez-vous dans le planning déjà prévu par l'enseignant, le nom et d'adresse email du parent concerné. Cela facilite la vie de chacun !
            </p>
            <p class="text-center">
                <img src="img/icone.png" class="ml-5 img-fluid img-thumbnail" style="width: 200px;">
            </p>

            <h1 class="mt-3">Mentions légales</h1>
            <h2>Réalisation, publication et hébergement du site</h2>
            <ul>
                <li>Raison sociale : Classmate</li>
                <li>Application réalisée par : Nicolas TOURRETTE</li>
                <li>Directeur de publication : Marion PELTE</li>
                <li>Site hébergé par : Nicolas TOURRETTE</li>
            </ul>
            <h2>Respect de la vie privée et des données personnelles</h2>
            <p>
                Conformément à la Loi « Informatique et Libertés » n° 78-17 du 6 janvier 1978, vous disposez d’un droit d’accès, de modification, de rectification et de suppression des données qui vous concernent.
            </p>
            <p>
                Ce site accepte le Règlement Général relatif à la Protection des Données (N°2016/679, dit RGPD) du 24 mai 2016 en vigueur depuis le 25 mai 2018 dans toute l'Union Européenne. Vous avez donc un droit de regard sur la manière dont sont exploitées vos données personnelles.
            </p>
            <h2>Propriété intellectuelle</h2>
            <p>
                L’ensemble de ce site relève de la législation française et internationale sur les droits d’auteur et de la propriété intellectuelle. Les noms, marques et enseignes cités sur ce site sont la propriété de leurs déposants respectifs. Toute utilisation ou reproduction, totale ou partielle, du site, des éléments qui le composent et/ou des informations qui y figurent, par quelque procédé que ce soit, constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
        `;
    }

    
    displayChangelog(){
        document.querySelector(`a[href="#about/changelog"]`).classList.add("active");
        document.querySelector(`a[href="#about/changelog"] span.badge`).classList.add("text-light");

        let history = ``;

        if(this._controller.versions.length > 0){
            let iVersion = 1;
            this._controller.versions.forEach((version) => {
                history += `
                    <p id="${version.version}">
                        <span class="badge rounded-pill bg-primary-soft">v${version.version}</span>
                        <span>- ${version.date}</span>
                    </p>
                    <p class="lead">Changements apportés</p>
                    <ul class="text-gray-700">
                `;

                if(version.changes.length > 0){
                    version.changes.forEach((change) => {
                        history += `
                            <li>${change}.</li>
                        `;
                    });
                }
                else{
                    history += `
                        <li>Aucun changement apporté.</li>
                    `;
                }

                history += `        
                    </ul>
                    
                    <p class="lead">Problèmes connus</p>
                    <ul class="text-gray-700">
                `;

                if (version.issues.length > 0) {
                    version.issues.forEach((issue) => {
                        history += `
                            <li>${issue}.</li>
                        `;
                    });
                }
                else {
                    history += `
                        <li>Aucun problème à signaler.</li>
                    `;
                }

                history += ` 
                    </ul>
                `;

                if(iVersion !== this._controller.versions.length){
                    history += ` 
                        <hr>
                    `;
                }

                iVersion++;
            });
        }
        else{
            history = `
                <p>Un problème est survenu lors de la récupération du changelog.</p>
            `;
        }

        this._container.innerHTML = `
            <div class="row">
                <div class="col">
                    <h1 class="mb-5 display-4">Changelog</h1>
                    ${history}
                </div>
            </div>
        `;
    }

    /**
     * Displays the poll
     * @param sondage The poll ID to display
     */
    displaySondage(sondage: string) {
        try {
            document.querySelector(`a[href="#sondages/${sondage}"]`).classList.add("active");
        } catch (error) {
            this.displayError(404);
            throw new Error("Unknown poll link.");
        }

        if (this._controller.poll.id !== sondage) {
            this._controller.getPoll(sondage)
                .then(() => {
                    if (this._controller.poll.appointments.length === 0) {
                        this.displayError(204);
                        console.warn("No content to display.");
                    }
                    else{
                        this.displaySondageContent(sondage);
                    }
                })
                .catch(() => {
                    this.displayError(0);
                    throw new Error("Unknown error in promise.");
                });
        }
        else{
            this.displaySondageContent(sondage);
        }
    }

    displaySondageContent(sondage: string){        
        let content = `<h1>${this._controller.poll.name}</h1>`;
        content += `<form id="${sondage}">`;
        content += `
        <div class="form-group row">
            <div class="col-sm-2">Sélectionner un RDV</div>
            <div class="col-sm-10">
        `;

        let iAppointment = 0;
        this._controller.poll.appointments.forEach((appointment) => {
            if (appointment.parentName === "") {
                content += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="${sondage}-possibility" id="${sondage}-possibility-${appointment.id}" value="${appointment.id}" data-range='${iAppointment}' required>
                        <label class="form-check-label" for="${sondage}-possibility-${appointment.id}">
                            ${appointment.displayStart()} - ${appointment.displayEnd()}
                        </label>
                    </div>
                `;
            }
            iAppointment++;
        });

        content += `
                    </div>
                </div>
                <div class="form-group row">
                    <label for="name" class="col-sm-2 col-form-label">Votre nom</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="name" placeholder="Votre nom" required>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="email" class="col-sm-2 col-form-label">Votre e-mail <span title="Ceci restera confidentiel." style="cursor: help; color: gray; font-size: 75%;">[?]</span></label>
                    <div class="col-sm-10">
                        <input type="email" class="form-control" id="email" placeholder="Votre e-mail" required>
                    </div>
                    <p class="text-danger font-italic ml-3 mt-2" style="font-size: 75%;">Attention : les adresses Gmail ne reçoivent pas les confirmations du fait d'un filtrage réalisé par Google.</p>
                </div>
                <button type="submit" class="btn btn-primary">Valider</button>
                <div id="error" class="mt-3"></div>
            </form>
        `;

        this._container.innerHTML = content;

        if (document.querySelectorAll("div.form-check").length === 0) {
            this._container.innerHTML = `
                <h1>${this._controller.poll.name}</h1>
                <div class="alert alert-warning fade show" role="alert">
                    <strong>Oh oh...</strong> Il n'y a plus de rendez-vous disponible dans ce sondage.
                </div>
                <div id="error" class="mt-3"></div>
            `;
        }
        else {
            let form = document.querySelector(`form#${sondage}`);
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                let button = document.querySelector("button[type='submit']");
                button.setAttribute("disabled", "true");
                button.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Patientez...`;
                if (/([\w.-]+@([\w-]+)\.+\w{2,})/gi.test(form.email.value)) {
                    let iAppointment = document.querySelector(`input[name='${sondage}-possibility']:checked`).getAttribute("data-range");
                    let bookedAppointment = new BookedAppointment({
                        id: document.querySelector(`input[name='${sondage}-possibility']:checked`).value,
                        start: { date: this._controller.poll.appointments[iAppointment].start.toUTCString() },
                        end: { date: this._controller.poll.appointments[iAppointment].end.toUTCString() },
                        parent: form.name.value,
                        email: form.email.value
                    });

                    this._controller.bookAppointment(bookedAppointment).then(() => {
                        button.innerHTML = `Valider`;
                        button.setAttribute("disabled", "false");
                        this._message = `
                                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                                        <strong>Super !</strong> Votre rendez-vous a bien été enregistré. Vous allez recevoir un email pour le confirmer. À bientôt !<br><i>Pensez à vérifier votre dossier des courriers indésirables si vous ne recevez pas l'email dans votre boîte de réception.</i>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `;
                    }).catch(() => {
                        this._message = `
                                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                        <strong>Ooops...</strong> Il semble que quelque chose se soit mal passé de notre côté. Veuillez réessayer. Si le problème persiste, contactez le gestionnaire.
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                `;
                    });
                }
                else {
                    document.querySelector("div#error").innerHTML = `
                                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    <strong>Ooops...</strong> Il semble que votre e-mail ne soit pas correct. Veuillez corriger ceci avant de pouvoir prendre rendez-vous.<br/>
                                    <i>Nous vous rappelons que votre e-mail restera confidentiel.</i>
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            `;
                }
            });
        }

        if (this._message !== "" && this._message !== undefined) {
            document.querySelector("div#error").innerHTML = this._message;
        }
    }

    /**
     * Authenticates a user
     */
    authenticate() {
        this._container.innerHTML = `
            <h1>Administration</h1>
            ${this._url !== "admin" ?
                `
                <div class="alert alert-warning alert-dismissible fade show mt-3 mb-3" role="alert">
                    <strong>Attention !</strong> Cette partie n'est pas publique. Vous devez vous identifier.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `
            : ``
            }
            <form id="loginForm" class="form-inline">
                <div class="form-group mb-2">
                    <label for="staticEmail2" class="sr-only">Utilisateur</label>
                    <input type="text" readonly class="form-control-plaintext" id="staticEmail2" value="Marion PELTE">
                </div>
                <div class="form-group mx-sm-3 mb-2">
                    <label for="inputPassword2" class="sr-only">Mot de passge</label>
                    <input type="password" class="form-control" id="inputPassword2" placeholder="Mot de passe">
                </div>
                <button id="loginButton" type="submit" class="btn btn-primary mb-2">Connexion</button>
            </form>
        `;

        let authForm = document.querySelector("form#loginForm");
        authForm.addEventListener("submit", (event) => {
            event.preventDefault();
            let button = document.querySelector("button[type='submit']");
            button.setAttribute("disabled", "true");
            button.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Patientez...`;
            let password = CryptoJS.SHA512(document.getElementById("inputPassword2").value).toString();

            this._controller.authenticate(password).then(() => {
                this._controller.setCookie("auth", password, 3);
                this._authHash = password;
                this.router();
            }).catch(() => {
                this.authenticate();
            });
        });
    }


    /**
     * Displays the home for an administrator
     */
    displayAdminHome() {
        let that = this;
        let content = `
            <h1>Administration</h1>
            <p class="lead">Bienvenue Marion PELTE !</p>
            <h2>Sondages</h2>
        `;

        this._controller.pollNames.forEach(poll => {
            content += `
                <div class="row">
                    <div class="col-auto">
                        <div class="custom-control custom-switch">
                            <input type="checkbox" class="custom-control-input" id="switch-${poll.id}" poll-id="${poll.id}" ${poll.active == true ? "checked" : ""}>
                            <label class="custom-control-label" for="switch-${poll.id}"></label>
                        </div>
                    </div>
                    <div class="col-auto">
                        <a href="#admin/polls/${poll.id}" class="badge badge-pill badge-secondary">${poll.name}</a>
                    </div>
                </div>
            `;
        });

        content += `
            <button id="addPoll" class="btn btn-sm btn-primary mt-2"><i class="fas fa-plus"></i></button>
            <div id="newPoll" class="d-none">
                <div class="row mt-3">
                    <div class="col-lg-12">
                        <h3>Nouveau sondage</h3>
                        <div class="form-group">
                            <label for="name">Nom du sondage</label>
                            <input type="text" class="form-control" id="name" aria-describedby="nameHelp">
                            <small id="beginHelp" class="form-text text-muted">Saisir le nom du nouveau sondage.</small>
                        </div>
                        <button id="submitNewPoll" class="btn btn-success">Créer le sondage</button>
                        <button id="cancelNewPoll" class="btn btn-danger">Annuler</button>
                    </div>
                </div>
            </div>
        `;

        this._container.innerHTML = content;

        $(`div.custom-control.custom-switch`).tooltip({
            title: "Activer/Désactiver le sondage",
            placement: 'right',
            trigger: 'hover',
            container: 'body'
        });

        // Add a poll
        document.querySelector("button#addPoll").addEventListener("click", () => {
            document.querySelector("div#newPoll").classList.toggle("d-none");
        });

        document.querySelector("button#submitNewPoll").addEventListener("click", () => {
            if (document.querySelector("input#name").value !== "") {
                let poll = new Poll({
                    id: document.querySelector("input#name").value.trim().replace(/\s+/g, '').toLowerCase(),
                    name: document.querySelector("input#name").value
                });

                that._controller.addPoll(poll)
                    .then(() => {
                        window.location.hash = `admin/polls/${poll.id}`;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            else {
                alert("Vous n'avez pas saisi le nom du nouveau sondage.");
            }
        });

        document.querySelector("button#cancelNewPoll").addEventListener("click", () => {
            document.querySelector("input#name").value = "";
            document.querySelector("div#newPoll").classList.toggle("d-none");
        });

        // Change poll status
        document.querySelectorAll("div.custom-control.custom-switch input").forEach((toggle) => {
            toggle.addEventListener("click", () => {
                let pollId = toggle.getAttribute("poll-id");
                let active = toggle.checked;

                this._controller.activatePoll(pollId, active).catch((error) => {
                    console.error(error);
                });
            });
        });
    }

    /**
     * Displays the administrator view to manage a poll
     * @param pollID The poll ID to manage
     */
    displayAdminPoll(pollID: string) {
        if (this._controller.poll.id !== pollID) {
            this._controller.getPoll(pollID).catch(() => {
                this.displayError(204);
                throw new Error("Error 204. No content.");
            });
        }

        let content = `
            <h1>Administration</h1>
            <p class="lead">Bienvenue Marion PELTE !</p>
            <div><h2 id="pollName">${this._controller.poll.name}</h2></div>
            <p>Les rendez-vous :</p>
            <table class="appointments">
        `;

        let events = [];
        this._controller.poll.appointments.forEach((appointment: BookedAppointment) => {
            content += `
                <tr>
                    <td>
                        DU <span id="begin-${appointment.id}" start="${appointment.start.toISOString()}">${appointment.displayStart()}</span> AU <span id="end-${appointment.id}" end="${appointment.end.toISOString()}">${appointment.displayEnd()}</span>
                    </td>
                    <td>
                        ${appointment.parentName !== ""
                            ? `<span class="badge badge-pill badge-danger ml-3" data-toggle="tooltip" data-html="true" data-placement="top" title="<a class='text-light' href='mailto:${appointment.parentEmail}'>M. ou Mme ${appointment.parentName}</a>">Réservé</span>`
                            : `<span class="badge badge-pill badge-success ml-3">Libre</span>`
                        }
                    </td>
                    <td>
                        ${appointment.parentName === ""
                            ? `<button class="btn btn-sm btn-primary ml-3 editAppointment" app-id="${appointment.id}"><i class="fas fa-pen"></i></button>
                                        <button class="btn btn-sm btn-danger ml-1" data-app-id="${appointment.id}" data-app-start="${appointment.displayStart()}" data-app-end="${appointment.displayEnd()}" data-toggle="modal" data-target="#deleteAppointmentModal"><i class="fas fa-minus"></i></button>`
                            : `<a href="https://www.terminsysteme.de/ics/execute/icsgeneration.php?title=Rendez-vous de parents&location=École Sainte-Marie, Auxerre&startdate=${appointment.start.getUTCDate()}.${appointment.start.getUTCMonth() + 1}.${appointment.start.getUTCFullYear()}&starthour=${appointment.start.getHours()}&startminute=${appointment.start.getMinutes()}&enddate=${appointment.end.getUTCDate()}.${appointment.end.getUTCMonth() + 1}.${appointment.end.getUTCFullYear()}&endhour=${appointment.end.getHours()}&endminute=${appointment.end.getMinutes()}&description=Avec M. ou Mme ${appointment.parentName}&reminder=0&method=REQUEST&timezone=CET&filename=rdv-${appointment.parentName.trim().replace(/\s+/g, "").toLowerCase()}&todo=generate+ics-file" class="btn btn-sm btn-primary ml-3"><i class="fas fa-calendar-plus"></i></a>`
                        }
                    </td>
                </tr>
            `;
            events.push({
                title: "RDV de parents",
                description: appointment.parentName === "" ? "Toujours libre" : "Avec M. ou Mme" + appointment.parentName,
                start: appointment.start.toISOString(),
                end: appointment.end.toISOString(),
                allDay: false,
                backgroundColor: appointment.parentName === "" ? "#28a745" : "#dc3545",
                borderColor: appointment.parentName === "" ? "#28a745" : "#dc3545"
            });
        });

        content += `
            </table>
            <button id="addAppointment" class="btn btn-sm btn-primary mt-2"><i class="fas fa-plus"></i></button>
            <div id="newAppointment" class="d-none">
                <div class="row mt-3">
                    <div class="col-lg-12">
                        <h3>Nouveau rendez-vous</h3>
                        <div class="form-group">
                            <label for="begin">Date de début</label>
                            <input type="datetime-local" class="form-control" id="begin" aria-describedby="beginHelp">
                            <small id="beginHelp" class="form-text text-muted">Saisir la date de début du RDV à l'aide du calendrier ou au format jj/mm/aaaa hh:mm si l'aide n'est pas disponible.</small>
                        </div>
                        <div class="form-group">
                            <label for="end">Date de fin</label>
                            <input type="datetime-local" class="form-control" id="end" aria-describedby="endHelp">
                            <small id="endHelp" class="form-text text-muted">Saisir la date de fin du RDV à l'aide du calendrier ou au format jj/mm/aaaa hh:mm si l'aide n'est pas disponible.</small>
                        </div>
                        <button id="submitNewAppointment" class="btn btn-success">Créer le RDV</button>
                        <button id="cancelNewAppointment" class="btn btn-danger">Annuler</button>
                    </div>
                </div>
            </div>
            <div id="calendar" class="mt-5"></div>

            <div class="modal fade" id="deleteAppointmentModal" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Suppression d'un rendez-vous</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-danger" id="deleteAppointment" app-id="">Supprimer définitivement</button>
                    </div>
                    </div>
                </div>
            </div>
        `;

        this._container.innerHTML = content;

        $('[data-toggle="tooltip"]').tooltip({ delay: { "hide": 1500 } });

        $('#deleteAppointmentModal').on('show.bs.modal', function (event) {
            let button = $(event.relatedTarget); // Button that triggered the modal
            let appId = button.data('app-id'); // Extract info from data-* attributes
            let appStart = button.data('app-start'); // Extract info from data-* attributes
            let appEnd = button.data('app-end'); // Extract info from data-* attributes
            let modal = $(this);
            modal.find('.modal-body').text(`Voulez-vous réellement supprimer le rendez-vous #${appId} planifié du ${appStart} au ${appEnd} ?`);
            modal.find('.modal-footer button#deleteAppointment').attr("app-id", appId);
        })

        let calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
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
                let tooltip = $(info.el).popover({
                    title: info.event.title,
                    content: `<i style="font-size: 9px;">Du ${info.event.start.toLocaleString("fr")}<br>Au ${info.event.end.toLocaleString("fr")}</i><br><strong>${info.event.extendedProps.description}</strong>`,
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
                        let printContent = `
                            <!doctype html>
                            <html lang="fr">
                            <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

                                <style>
                                    table {
                                        width: 100%;
                                        border-collapse: collapse;
                                        border: 1px solid #000000;
                                    }

                                    thead th {
                                        font-weight: bold;
                                        text-align: center;
                                    }

                                    th, td {
                                        padding: 5px;
                                        border: 1px solid #000000;
                                    }
                                </style>
                                <title>Classmate | Mme PELTE</title>
                            </head>

                            <body>
                                <h1>Liste des rendez-vous - ${that._controller.poll.name}</h1>
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Début</th>
                                            <th>Fin</th>
                                            <th>Parent</th>
                                            <th>Mail de contact</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                        `;
                        that._controller.poll.appointments.forEach((appointment: BookedAppointment) => {
                            if (appointment.parentName !== "") {
                                printContent += `
                                    <tr>
                                        <td>Le ${appointment.displayStart()}</td>
                                        <td>Le ${appointment.displayEnd()}</td>
                                        <td>M. ou Mme ${appointment.parentName}</td>
                                        <td>${appointment.parentEmail}</td>
                                    <tr>
                                `;
                            }
                        });
                        printContent += `
                                        </tbody>
                                    </table>
                                </body>
                            </html>
                        `;

                        let printWindow = window.open(that._url, "Classmate | Mme PELTE");
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                        printWindow.print();
                        printWindow.close();
                    }
                }
            },
        });

        calendar.render();

        let that = this;
        // Change the name of the poll
        document.querySelector("h2#pollName").addEventListener("click", function () {
            let parent = this.parentNode;
            parent.innerHTML = `
                <div class="row">
                    <div class="col-lg-6">
                        <input type="text" class="form-control" id="newPollName" value="${that._controller.poll.name}">
                    </div>
                    <div class="col-lg-6">
                        <button type="button" id="submitNewName" class="btn btn-danger">Changer le nom</button>
                        <button type="button" id="cancelNewName" class="btn btn-primary ml-2">Annuler</button>
                    </div>
                </div>
            `;

            document.querySelector("button#submitNewName").addEventListener("click", () => {
                let poll = new Poll({
                    id: that._controller.poll.id,
                    name: document.querySelector("input#newPollName").value,
                    active: that._controller.poll.active,
                    appointments: that._controller.poll.appointments.forEach((appointment: Appointment) => { appointment.toArray(); })
                });
                that._controller.savePoll(poll);
            });

            document.querySelector("button#cancelNewName").addEventListener("click", () => {
                that.displayAdminPoll(pollID);
            });
        });

        // Add an appointment
        document.querySelector("button#addAppointment").addEventListener("click", () => {
            document.querySelector("div#newAppointment").classList.toggle("d-none");
        });

        document.querySelector("button#submitNewAppointment").addEventListener("click", () => {
            if (document.querySelector("input#begin").value !== "" && document.querySelector("input#end").value !== "") {
                let appointment = new BookedAppointment({
                    start: {
                        date: document.querySelector("input#begin").value
                    },
                    end: {
                        date: document.querySelector("input#end").value
                    }
                });

                that._controller.addAppointment(appointment).catch((error) => {
                    console.error(error);
                });
            }
            else {
                alert("Vous n'avez rien saisi pour créer un rendez-vous ou il manque une donnée.");
            }
        });

        document.querySelector("button#cancelNewAppointment").addEventListener("click", () => {
            document.querySelector("input#begin").value = "";
            document.querySelector("input#end").value = "";
            document.querySelector("div#newAppointment").classList.toggle("d-none");
        });

        // Edit an appointment
        document.querySelectorAll("button.editAppointment").forEach((button) => {
            button.addEventListener("click", () => {
                let appId = button.getAttribute("app-id");
                let startDate = document.querySelector("span#begin-" + appId).getAttribute("start").substring(0, 10);
                let startHour = new Date(document.querySelector("span#begin-" + appId).getAttribute("start")).toLocaleTimeString("fr");
                let endDate = document.querySelector("span#end-" + appId).getAttribute("end").substring(0, 10);
                let endHour = new Date(document.querySelector("span#end-" + appId).getAttribute("end")).toLocaleTimeString("fr");

                document.querySelector("span#begin-" + appId).innerHTML = `
                    <div class="row mb-1">
                        <div class="col-lg-12">
                            <input type="datetime-local" class="form-control" id="newBegin" value="${startDate}T${startHour}">
                        </div>
                    </div>
                `;
                document.querySelector("span#end-" + appId).innerHTML = `
                    <div class="row mb-1">
                        <div class="col-lg-12">
                            <input type="datetime-local" class="form-control" id="newEnd" value="${endDate}T${endHour}">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12 text-center">
                            <button type="button" id="submitDate" class="btn btn-danger">Valider</button>
                            <button type="button" id="cancelDate" class="btn btn-primary ml-2">Annuler</button>
                        <div>
                    </div>
                `;

                document.querySelector("button#submitDate").addEventListener("click", () => {
                    let appointment = new BookedAppointment({
                        id: appId,
                        start: {
                            date: document.getElementById("newBegin").value
                        },
                        end: {
                            date: document.getElementById("newEnd").value
                        }
                    });

                    that._controller.editAppointment(appointment).catch((error) => {
                        console.error(error);
                    });
                });

                document.querySelector("button#cancelDate").addEventListener("click", () => {
                    document.querySelector("span#begin-" + appId).innerHTML = `${new Date(startDate).toLocaleDateString("fr")} à ${startHour}`;
                    document.querySelector("span#end-" + appId).innerHTML = `${new Date(endDate).toLocaleDateString("fr")} à ${endHour}`;
                });
            });
        });


        // Delete an appointment
        document.querySelectorAll("button#deleteAppointment").forEach((button) => {
            button.addEventListener("click", () => {
                $('#deleteAppointmentModal').modal('hide');
                that._controller.deleteAppointment(parseInt(button.getAttribute("app-id"))).catch((error) => {
                    console.error(error);
                });
            });
        });
    }

    /**
     * Displays an error message
     * @param errorCode The error code to display the right error
     */
    displayError(errorCode: number) {
        switch (errorCode) {
            case 404:
                this._container.innerHTML =
                    `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Ooops...</strong> Quelque chose s'est mal passé, je n'ai pas réussi à trouver ce que vous cherchiez. Si cette erreur se reproduit, contacter le gestionnaire.<br/>
                        <i>Erreur n°404</i>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                break;

            case 204:
                this._container.innerHTML =
                    `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Ooops...</strong> La requête a été traitée avec succès mais il n'y a pas d’information à renvoyer.<br/>
                        <i>Erreur n°204</i>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                break;

            default:
                this._container.innerHTML =
                    `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Ooops...</strong> Quelque chose s'est mal passé, mais je ne sais pas quoi. Si cette erreur se reproduit, contacter le gestionnaire.<br/>
                        <i>Erreur n°520</i>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                break;
        }
    }
}
