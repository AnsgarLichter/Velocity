/*
 * Velocity - your running companion: Website im Rahmen der Vorlesung "Webprogrammierung"
 *
 * © 2018 Ansgar Lichter, Patrick Fichtner, Toni Coric
 * Lizenz: Creative Commons Namensnennung 4.0 International
 *
 * Sie dürfen:
 *
 *     Teilen — das Material in jedwedem Format oder Medium vervielfältigen
 *     und weiterverbreiten
 *
 *     Bearbeiten — das Material remixen, verändern und darauf aufbauen
 *     und zwar für beliebige Zwecke, sogar kommerziell.
 *
 * Unter folgenden Bedingungen:
 *
 *     Namensnennung — Sie müssen angemessene Urheber- und Rechteangaben
 *     machen, einen Link zur Lizenz beifügen und angeben, ob Änderungen
 *     vorgenommen wurden. Diese Angaben dürfen in jeder angemessenen Art
 *     und Weise gemacht werden, allerdings nicht so, dass der Eindruck
 *     entsteht, der Lizenzgeber unterstütze gerade Sie oder Ihre Nutzung
 *     besonders.
 *
 *     Keine weiteren Einschränkungen — Sie dürfen keine zusätzlichen Klauseln
 *     oder technische Verfahren einsetzen, die anderen rechtlich irgendetwas
 *     untersagen, was die Lizenz erlaubt.
 *
 * Es werden keine Garantien gegeben und auch keine Gewähr geleistet.
 * Die Lizenz verschafft Ihnen möglicherweise nicht alle Erlaubnisse,
 * die Sie für die jeweilige Nutzung brauchen. Es können beispielsweise
 * andere Rechte wie Persönlichkeits- und Datenschutzrechte zu beachten
 * sein, die Ihre Nutzung des Materials entsprechend beschränken.
 */
"use strict";

import stylesheet from "./app.css";
import Navigo from "navigo/lib/navigo.js";
import RunDisplayEdit from "./run-display-edit/run-display-edit.js";
import RunOverview from "./run-overview/run-overview.js";
import RunNew from "./run-new/run-new.js"
import Database from "./database.js";

/**
 * Hauptklasse der Anwendung.
 * Diese Klasse hat die Aufgabe die angeforderten Bildschirmseiten
 * anzuzeigen und auszuführen.
 */
class App {
     //Konstruktor
    constructor() {
        //Titel deklarieren
        this._title = "Velocity";
        this._currentView = null;

        //Datenbank deklarieren
        this._runsDB = new Database.Runs();

        // Single Page Router aufsetzen
        this._router = new Navigo();
        this._currentUrl = "";
        this._navAborted = false;

        
        this._router.on({
            "*":                  () => this.showRunOverview(),
            "/run/new/":          () => this.showRunNew(),
            "/run/display/:id/":  params => this.showRunDisplayEdit(params.id, "display"),
            "/run/edit/:id/":     params => this.showRunDisplayEdit(params.id, "edit"),
        });

        this._router.hooks({
            after: (params) => {
                if (!this._navAborted) {
                    // Navigation durchführen, daher die neue URL merken
                    this._currentUrl = this._router.lastRouteResolved().url;
                } else {
                    /*
                    * Navigation abbrechen:
                    * Die URL in der Adresszeile auf den alten Wert der
                    * bisherigen View zurücksetzen.
                    */
                    this._router.pause(true);
                    this._router.navigate(this._currentUrl);
                    this._router.pause(false);

                    this._navAborted = false;
                }
            }
        });
    }

    /**
     * Anwendung starten
     */
    start() {
        this._router.resolve();
    }


    /*
    * Navigations-Methode, damit auch von einem Button aus eine neue Seitenwechsel
    * aufgerufen werden kann.
    */
    navigate(url) {
        this._router.navigate(url);
    }

    /*
     * Aufruf der Übersichtsseite der vorhandenen Laufergebnisse.
     * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
     */
    showRunOverview() {
        let view = new RunOverview(this);
        this._switchVisibleView(view);
    }

    /*
     * Aufruf der Detailseite zur genaueren Ansicht oder zur Bearbeitung
     * eines Trainingsergebnisses.
     *
     * @param  {String} id Run-ID
     * @param  {String} mode "display" oder "edit"
     * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
     */
    showRunDisplayEdit(id, mode) {
        let view = new RunDisplayEdit(this, id, mode);
        this._switchVisibleView(view);
    }
    //Aufruf der Seite zur Erstellung eines neuen Laufergebnisses
    showRunNew() {
        let view = new RunNew(this);
        this._switchVisibleView(view);
    }

    /**
     * Hilfsmethoden zum Anzeigen einer einer neuen Seite, falls diese
     * angefordert worden ist.
     * Sie ruft zunächst die Methode onLeave() der gerade sichtbaren View auf.
     * Dadruch wird geprüft, ob die View verlassen werden kann.
     * Falls diese verlassen werden darf, wird die Methode onShow() der neuen
     * Vie aufgerufen. Das Ergebnis wird an die eigene Methode
     * _switchVisibleContent() übergeben, um den sichtbaren Inhalt
     * der Seite auszutauschen.
     *
     * @param  {Object} view View-Objekt mit einer onShow()-Methode
     * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
     */
    async _switchVisibleView(view) {
        /*
        * Callback, mit dem die noch sichtbare View den Seitenwechsel zu einem
        * späteren Zeitpunkt fortführen kann, wenn sie in der Methode onLeave()
        * false zurückliefert. Dadurch erhält sie die Möglichkeit, den Benutzer
        * zum Beispiel zu fragen, ob er ungesicherte Daten speichern möchte,
        * bevor er die Seite verlässt.
        */
        let newUrl = this._router.lastRouteResolved().url;
        let goon = () => {
            // ?goon an die URL hängen, weil der Router sonst nicht weiternavigiert
            this._router.navigate(newUrl + "?goon");
        }

        // Aktuelle View fragen, ob eine neue View aufgerufen werden darf
        if (this._currentView) {
            let goonAllowed = await this._currentView.onLeave(goon);

            if (!goonAllowed) {
                this._navAborted = true;
                return false;
            }
        }

        // Aktuelle View darf gewechselt werden.
        document.title = `${this._title} – ${view.title}`;

        this._currentView = view;
        this._switchVisibleContent(await view.onShow());

        /*
        * Hier folgt nun der Suchalgorithmus, der das Suchfeld in der NavBar
        * steuert. Falls ein Treeffer für den angegeben Suchstring gefunden
        * worden ist, wird dieser auf der Seite mit Hilfe des <mark>-Elements
        * hervorgehoben.
        *
        * Das Suchfeld reagiert nur auf das Event onChange. Das bedeutet für
        * den Benutzer, dass er seine Eingabe mit der Enter-Taste bestaetigen
        * muss.
        */

        //Suchfeld in einer Variablen speichern
        let search = document.querySelector("#suche");
        //Dem Suchfeld einen EventLisener hinzufügen
        search.addEventListener("change", () => {
            //Definition der search-function
            let search = (element,zaehler) =>  {
                if(element.childElementCount > 0) {
                    //Element hat Kinder
                    element.childNodes.forEach(e=>zaehler=search(e,zaehler));
                }

                if(element.childElementCount == 0 || element.nodeName == "#text") {
                    //--> Inhalt überprüfen
                    if(element.textContent.match(searchString)) {
                        //Suchbegriff gefunden - Element hervorheben
                        //element.className = "searchResult";
                        if(element.nodeName == "#text") {
                            let index = element.parentNode.innerHTML.indexOf(searchString);
                            zaehler++;
                            element.parentNode.innerHTML = element.parentNode.innerHTML.substring(0, index) + "<mark>" + element.parentNode.innerHTML.substring(index, index+searchString.length) + "</mark>" + element.parentNode.innerHTML.substring(index+searchString.length);
                        }else{
                            let index = element.innerHTML.indexOf(searchString);
                            zaehler++;
                            element.innerHTML = element.innerHTML.substring(0, index) + "<mark>" + element.innerHTML.substring(index, index+searchString.length) + "</mark>" + element.innerHTML.substring(index+searchString.length);
                        }
                    }
                }
                return zaehler;
            }


            //Suchbegriff auslesen
            let searchString = document.getElementById("suche").value;

            //Alte Ergebnisse löschen
            let oldSearchResults = document.getElementsByTagName("mark");
            if (oldSearchResults.length > 0) {
                let i = 0;
                //for(i; i < oldSearchResults.length;) {
                while(oldSearchResults.length > 0) {
                    let innerHTML = oldSearchResults[i].parentNode.innerHTML;
                    innerHTML = innerHTML.replace("<mark>", "");
                    innerHTML = innerHTML.replace("</mark>", "");
                    oldSearchResults[i].parentNode.innerHTML = innerHTML;
                }
            }

            //Suchanfragen ohne Eingabe abfangen
            if(searchString == "") {
                return;
            }

            //In aktueller HTML-Seite nach dem Suchbegriff suchen
            let inhalt = document.querySelector("main");
            let zaehler= 0;
            inhalt.childNodes.forEach(e=>zaehler=search(e,zaehler));
            if(zaehler==0){
              alert("Kein Treffer!");
            }
        });

        /*
        * Dem Suchfeld ein EventListener für das Event "Reset" hinzufügen.
        * Hier müssen lediglich alte Suchergebnisse wieder gelöscht werden.
        */

        search.addEventListener("cancel", () => {
            let oldSearchResults = document.getElementsByTagName("mark");
            if (oldSearchResults.length > 0) {
                let i = 0;
                //for(i; i < oldSearchResults.length;) {
                while(oldSearchResults.length > 0) {
                    let innerHTML = oldSearchResults[i].parentNode.innerHTML;
                    innerHTML = innerHTML.replace("<mark>", "");
                    innerHTML = innerHTML.replace("</mark>", "");
                    oldSearchResults[i].parentNode.innerHTML = innerHTML;
                }
            }
        });
        return true;
    }

    /**
     * Auswechseln des sichtbaren Inhalts der App. Hierfür muss der Methode
     * ein Objekt mit folgendem Aufbau übergeben werden:
     *
     *   {
     *      className: "CSS-Klassenname",
     *      topbar: [DOM Element, DOM Element, DOM Element, ...],
     *      main: [DOM Element, DOM Element, DOM Element, ...],
     *   }
     *
     * Beide Attribute (topbar und main) sind optional, was dazu führt, dass
     * im jeweiligen Bereich einfach nichts angezeigt wird. Werden sie jedoch
     * mitgegeben, müssen sie mit forEach(element => { … }) iteriert werden
     * können, um ihren Inhalt in den DOM-Baum zu integrieren.
     *
     * Wichtig ist, dass die übergebenen Elemente noch an keiner Stelle im
     * DOM vorhanden sein dürfen. Werden die Elemente in der index.html
     * als Vorlage definiert, muss hier deshalb eine Kopie anstelle der
     * Elemente selbst übergeben werden!
     *
     * @param {Object} content Objekt mit den anzuzeigenden DOM-Elementen
     */
    _switchVisibleContent(content) {
        // <header> und <main> des HTML-Grundgerüsts ermitteln
        let app = document.querySelector("#app");
        let header = document.querySelector("#app > header");
        let main = document.querySelector("#app > main");

        // Zuvor angezeigte Inhalte entfernen
        // Bei der Topbar nur die untere Zeile, im Hauptbereich alles!
        app.className = "";
        header.querySelectorAll(".bottom").forEach(e => e.parentNode.removeChild(e));
        main.innerHTML = "";

        // CSS-Klasse übernehmen, um die viewspezifischen CSS-Regeln zu aktivieren
        if (content && content.className) {
            app.className = content.className;
        }

        // Neue Inhalte der Topbar einfügen
        if (content && content.topbar) {
            content.topbar.forEach(element => {
                element.classList.add("bottom");
                header.appendChild(element);
            });
        }

        // Neue Inhalte des Hauptbereichs einfügen
        if (content && content.main) {
            content.main.forEach(element => {
                main.appendChild(element);
            });
        }

        // Navigo an die Links in der View binden
        this._router.updatePageLinks();
    }
}

export default App;
