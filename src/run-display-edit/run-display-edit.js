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

import stylesheet from "./run-display-edit.css";

import Database from "../database.js";

 /**
  * View zur Anzeige oder zum Bearbeiten eines Songs.
  */
class RunDisplayEdit {
    /**
     * Konstruktor.
     *
     * @param {Objekt} app Zentrales App-Objekt der Anwendung
     * @param {String} id   ID des darzustellenden Songs
     * @param {String} mode "new", "display" oder "edit"
     */
    constructor(app, id, mode) {
        this._app = app;
        this._id = id;
        this._mode = mode;

        //Datenbank deklarieren
        this._runsDB = new Database.Runs();
    }



    /**
     * Von der Klasse App aufgerufene Methode, um die Seite anzuzeigen. Die
     * Methode gibt daher ein passendes Objekt zurück, das an die Methode
     * _switchVisibleContent() der Klasse App übergeben werden kann, um ihr
     * die darzustellenden DOM-Elemente mitzuteilen.
     *
     * @return {Object} Darzustellende DOM-Elemente gemäß Beschreibung der
     * Methode App._switchVisibleContent()
     */
    async onShow() {
        let section = document.querySelector("#run-display-edit").cloneNode(true);

        //TODO: Datenbank auslesen für Anzeige bei mode == display oder edit
        /*Laufergbis aus Übersichtstabelle auslesen*/
        //let url = document.URL;
        //let id = url.substring(url.lastIndexOf('/') + 1);

        this._id = parseInt(this._id);
        let run = await this._runsDB.getByID(this._id);
        /*alert(run.name);
        alert(run.datum);
        alert(run.strecke);
        alert(run.dauer);
        alert(run.art);
        alert(run.minutenPerKm);*/

        document.getElementById('Name').value=run.name;
        document.getElementById('Datum').value=run.datum;
        document.getElementById('Distanz').value=run.strecke;
        document.getElementById('Art').value=run.art;
        document.getElementById('Zeit').value=run.dauer;
        document.getElementById('minutenPerKm').value=run.minutenPerKm;
        //alert(run.strecke);

        /*Kommazahl zur Berechnung der Km/h in Wert mit Punkt umwandeln*/
        let meter = run.strecke.replace( /,/,"." );
            meter = parseFloat(meter)*1000;
        let sekunde = run.dauer.replace( /,/,"." );
            sekunde = parseFloat(run.dauer)*60;
        let kmPerStd = ((meter/sekunde)/1000)/(1/3600);

        document.getElementById('kilometerPerStd').value=kmPerStd;
        //document.getElementById('Beschreibung').value=
        //document.getElementById('Bewertung').value=

        /*Event für Bearbeiten-Button*/
        section.querySelector("#bearbeiten").addEventListener("click",() => {
            document.getElementById('Name').removeAttribute('disabled');
            document.getElementById('Datum').removeAttribute('disabled');
            document.getElementById('Distanz').removeAttribute('disabled');
            document.getElementById('Zeit').removeAttribute('disabled');
            document.getElementById('Art').removeAttribute('disabled');
            document.getElementById('minutenPerKm').removeAttribute('disabled');
            document.getElementById('kilometerPerStd').removeAttribute('disabled');
            document.getElementById('Beschreibungstext').removeAttribute('disabled');
        });
        /*Event für Abbrechen-Button*/
        section.querySelector("#abbrechen").addEventListener("click",() => {
            document.getElementById('Name').setAttribute('disabled', 'disabled');
            document.getElementById('Datum').setAttribute('disabled', 'disabled');
            document.getElementById('Distanz').setAttribute('disabled', 'disabled');
            document.getElementById('Zeit').setAttribute('disabled', 'disabled');
            document.getElementById('Art').setAttribute('disabled', 'disabled');
            document.getElementById('minutenPerKm').setAttribute('disabled', 'disabled');
            document.getElementById('kilometerPerStd').setAttribute('disabled', 'disabled');
            document.getElementById('Beschreibungstext').setAttribute('disabled', 'disabled');
        });
        /*Event für Sichern-Button*/
        section.querySelector("#sichern").addEventListener("click",() => {
            //alert(run.datum);
            let changeName = document.querySelector("#Name").value;
            let changeDatum = document.querySelector("#Datum").value;
            let changeDistanz = document.querySelector("#Distanz").value;
            let changeZeit = document.querySelector("#Distanz").value;
            let changeArt = document.querySelector("#Art").value;
            let changeMinutenPerKm = document.querySelector("#minutenPerKm").value;
            //let changeKilometerperStd = document.querySelector("#KilometerPerStd").value;
            let changeBeschreibung = document.querySelector("#Beschreibungstext").value;


            this._runsDB.update({
                name: changeName,
                strecke: changeDistanz,
                dauer: changeZeit,
                minutenPerKm: changeMinutenPerKm,
                art: changeArt,
                datum: changeDatum,
            });
            //alert(run.name);
            //run.datum.update("1");
            //alert(run.datum);
            //update(this._runsDB);
            //alert(this._runsDB);
        });


        return {
            className: "run-display-edit",
            topbar: section.querySelectorAll("header > *"),
            main: section.querySelectorAll("main > *"),
        };

    }








    /*let getRunsList = async () => {
        let runsList = await runsDB.search();
        return runsList;
    }
    let runsList = getRunsList();*/


    /**
     * Von der Klasse App aufgerufene Methode, um festzustellen, ob der Wechsel
     * auf eine neue Seite erlaubt ist. Wird hier true zurückgegeben, wird der
     * Seitenwechsel ausgeführt.
     *
     * @param  {Function} goon Callback, um den Seitenwechsel zu einem späteren
     * Zeitpunkt fortzuführen, falls wir hier false zurückgeben
     * @return {Boolean} true, wenn der Seitenwechsel erlaubt ist, sonst false
    */
    async onLeave(goon) {
        return true;
    }

    /**
     * @return {String} Titel für die Titelzeile des Browsers
     */
    get title() {
        switch (this._mode) {
            //TODO: Sobald Klasse für Run hinzufügen existiert, muss case "new" entfernt werden
            case "new":
                return "Run hinzufügen";
            case "edit":
                return "Run bearbeiten";
            default:
                return "Run anzeigen";
        }
    }
}

export default RunDisplayEdit;
