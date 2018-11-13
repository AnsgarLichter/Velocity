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

import stylesheet from "./run-new.css";

import Database from "../database.js";

 /**
  * View zur Anzeige oder zum Bearbeiten eines Songs.
  */
class RunNew {
    /**
     * Konstruktor.
     *
     * @param {Objekt} app Zentrales App-Objekt der Anwendung
     * @param {String} id   ID des darzustellenden Songs
     * @param {String} mode "new", "display" oder "edit"
     */
    constructor(app) {
        this._app = app;

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
        let section = document.querySelector("#run-new").cloneNode(true);

        /*Event für Abbrechen-Button*/
        section.querySelector("#abbrechen").addEventListener("click",() => {
            this._app.navigate("/");
        });



        /*Event für Sichern-Button*/
        section.querySelector("#sichern").addEventListener("click",() => {
            /*
            * Eingebebene Werte aus den Eingabefeldern auslesen und
            * anschließend die Eingabe überprüfen.
            * Die Beschreibung ist dabei optional und muss nicht überprüft
            * werden.
            */
            let newName = document.querySelector("#Name").value;
            let newDatum = document.querySelector("#Datum").value;
            let newDistanz = document.querySelector("#Distanz").value;
            let distFloat = parseFloat(newDistanz).toFixed(3);
            let newZeit = document.querySelector("#Zeit").value;
            let newArt = document.querySelector("#Art").value;
            let newBeschreibung = document.querySelector("#Beschreibungstext").value;
            //Regex zur Überprüfung der Zeit
            let regexZeit = new RegExp("^\\d{1,3}:[0-5][0-9]$");
            //Abfrage der vergebenen Bewertung
            let star1 = document.getElementById("star1");
            let star2 = document.getElementById("star2");
            let star3 = document.getElementById("star3");
            let star4 = document.getElementById("star4");
            let star5 = document.getElementById("star5");

            let rating = 0;
            if(star5.checked) {
                rating = 5;
            }
            else if(star4.checked) {
                rating = 4;
            }
            else if(star3.checked) {
                rating = 3;
            }
            else if(star2.checked) {
                rating = 2;
            }
            else if(star1.checked) {
                rating = 1;
            }

            //Prüfen des Namens
            if(!newName) {
                alert("Bitte den Namen ausfüllen!");
            }
            //Prüfen des Datums
            else if(!newDatum) {
                alert("Bitte ein korrektes Datum eingeben!");
            }
            //Prüfen der Distanz
            else if(!newDistanz) {
                alert("Eingabefehler bei der Distanz, bitte einen korrekten Wert eingeben");
            }
            else if(!newZeit.match(regexZeit)) {
                alert("Bitte eine korrekte Zeit (mm:ss) eingeben!")
            }
            else{
                /*
                * Hier ist nun sichergestellt, dass alle Eingaben korrekt sind.
                * Nun sollen die Durchschnittsgeschwindigkeit und die
                * Geschwindigkeit in Minuten pro Kilometer berechnet werden.
                */

                //Kommazahl zur Berechnung der Km/h in Wert mit Punkt umwandeln
                let min      = newZeit.split(":")
                let sekunden = parseFloat(parseFloat(min[0]*60)+parseFloat(min[1]));
                let meter    = distFloat * 1000;
                let kmPerStd = ((meter/sekunden)/1000)/(1/3600);
                    kmPerStd = parseFloat(kmPerStd).toFixed(2);

                //Berechnung Minuten pro Kilometer
                let minPerKm = 3600 / kmPerStd / 60;
                let minPerKmDecimals = minPerKm - Math.floor(minPerKm);
                    minPerKmDecimals = minPerKmDecimals * 60;
                    minPerKmDecimals = parseInt(minPerKmDecimals);
                    minPerKm = "" + minPerKm.toFixed(0) + ":" + minPerKmDecimals;

                //Berechnete Werte in Eingabefelder schreiben
                document.querySelector("#minutenPerKm").value    = minPerKm;
                document.querySelector('#kilometerPerStd').value = kmPerStd;

                //Alle Werte in der Datenbank speichern.
                this._runsDB.saveNew({
                    name: newName,
                    strecke: newDistanz,
                    dauer: newZeit,
                    minutenPerKm: minPerKm,
                    kmPerStd: kmPerStd,
                    art: newArt,
                    datum: newDatum,
                    beschreibungstext: newBeschreibung,
                    rating: rating,
                });
                this._app.navigate("/");
            }
        });

        return {
            className: "RunNew",
            topbar: section.querySelectorAll("header > *"),
            main: section.querySelectorAll("main > *"),
        };

    }
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
        return "Neuen Run hinzufügen";
    }
}

export default RunNew;
