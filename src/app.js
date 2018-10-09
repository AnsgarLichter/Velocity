/*
 * My Songbook - Beispielanwendung der Anleitung zur Entwicklung einer Browser App
 *
 * © 2018 Dennis Schulmeister-Zimolong <dhbw@windows3.de>
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
import "regenerator-runtime/runtime";

import stylesheet from "./app.css";

import Navigo from "navigo/lib/navigo.js";
import RunDisplayEdit from "./run-display-edit/run-display-edit.js";
import RunOverview from "./run-overview/run-overview.js";
import Database from "./database.js";

/**
 * Hauptklasse der Anwendung. Kümmert sich darum, die Anwendung auszuführen
 * und die angeforderten Bildschirmseiten anzuzeigen.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        this._title = "Velocity";
        this._currentView = null;

        // Single Page Router aufsetzen
        this._router = new Navigo();
        this._currentUrl = "";
        this._navAborted = false;

        this._router.on({
            "*":                       () => this.showRunOverview(),
            "/run/new/":              () => this.showRunDisplayEdit("", "new"),
            "/run/display/:id/":  params => this.showRunDisplayEdit(params.id, "display"),
            "/run/edit/:id/":     params => this.showRunDisplayEdit(params.id, "edit"),
        });

        //Test der Datenbankklasse für Laufergebnisse
        let test = async () => {
            let runsDB = new Database.Runs();
            await runsDB.clear();

            let runs = await runsDB.search();
            console.log("Alle Ergebnisse: ", runs);

            if(runs.length == 0) {
                console.log("Bisher noch keine Trainningsdaten vorhanden, lege daher Testdaten an");

                await Promise.all([
                    runsDB.saveNew({
                        strecke: "6km",
                        dauer: "30:00",
                        geschwindigkeitPerKm: "5:00",
                        art: "Joggen",
                        datum: "09.10.2018",
                        format: "html",
                        data: "HTML-Code für ...",
                    }),
                    runsDB.saveNew({
                        strecke: "8km",
                        dauer: "35:00",
                        geschwindigkeitPerKm: "4:30",
                        art: "Joggen",
                        datum: "10.10.2018",
                        format: "html",
                        data: "HTML-Code für ...",
                    }),
                    runsDB.saveNew({
                        strecke: "10km",
                        dauer: "50:10",
                        geschwindigkeitPerKm: "5:01",
                        art: "Joggen",
                        datum: "03.10.2018",
                        format: "html",
                        data: "HTML-Code für ...",
                    }),
                ]);

                let runs = await runsDB.search();
                console.log("Gespeicherte Traininsdaten: ", runs);
            }

            runs = await runsDB.search("6km");
            console.log("Suche nach 6km", runs);
        }

        test();
        //Ende des Testcodes

        this._router.hooks({
            after: (params) => {
                if (!this._navAborted) {
                    // Navigation durchführen, daher die neue URL merken
                    this._currentUrl = this._router.lastRouteResolved().url;
                } else {
                    // Navigation abbrechen, daher die URL in der Adresszeile
                    // auf den alten Wert der bisherigen View zurücksetzen
                    this._router.pause(true);
                    this._router.navigate(this._currentUrl);
                    this._router.pause(false);

                    this._navAborted = false;
                }
            }
        });
    }

    /**
     * Ab hier beginnt die Anwendung zu laufen.
     */
    start() {
        this._router.resolve();
    }

    /**
     * Aufruf der Übersichtsseite der vorhandenen Laufergebnisse.
     * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
     */
    showRunOverview() {
        let view = new RunOverview(this);
        this._switchVisibleView(view);
    }

    /**
     * Aufruf der Detailseite zur Anzeige oder zum Bearbeiten eines Songs.
     *
     * @param  {String} id Run-ID
     * @param  {String} mode "new", "display" oder "edit"
     * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
     */
    showRunDisplayEdit(id, mode) {
        let view = new RunDisplayEdit(this, id, mode);
        this._switchVisibleView(view);
    }

    /**
     * Hilfsklasse zum Umschalten auf eine neue Seite. Sie ruft zunächst die
     * Methode onLeave() der gerade sichtbaren View auf und prüft damit, ob
     * die View verlassen werden kann. Falls ja ruft sie die Methode onShow()
     * der neuen View auf und übergibt das Ergebnis an die eigene Methode
     * _switchVisibleContent(), um den sichtbaren Inhalt der Seite auszutauschen.
     *
     * @param  {Object} view View-Objekt mit einer onShow()-Methode
     * @return {Boolean} Flag, ob die neue Seite aufgerufen werden konnte
     */
    _switchVisibleView(view) {
        // Callback, mit dem die noch sichtbare View den Seitenwechsel zu einem
        // späteren Zeitpunkt fortführen kann, wenn sie in der Methode onLeave()
        // false zurückliefert. Dadurch erhält sie die Möglichkeit, den Anwender
        // zum Beispiel zu fragen, ob er ungesicherte Daten speichern will,
        // bevor er die Seite verlässt.
        let newUrl = this._router.lastRouteResolved().url;
        let goon = () => {
            // ?goon an die URL hängen, weil der Router sonst nicht weiternavigiert
            this._router.navigate(newUrl + "?goon");
        }

        // Aktuelle View fragen, ob eine neue View aufgerufen werden darf
        if (this._currentView && !this._currentView.onLeave(goon)) {
            this._navAborted = true;
            return false;
        }

        // Alles klar, aktuelle View nun wechseln
        document.title = `${this._title} – ${view.title}`;

        this._currentView = view;
        this._switchVisibleContent(view.onShow());
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
