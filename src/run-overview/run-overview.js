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

import stylesheet from "./run-overview.css";

/**
 * View mit der Übersicht der vorhandenen Songs.
 */
class RunOverview {
    /**
     * Konstruktor,
     * @param {Objekt} app Zentrales App-Objekt der Anwendung
     */
    constructor(app) {
        this._app = app;
    }

    /**
     * Von der Klasse App aufgerufene Methode, um die Seite anzuzeigen. Die
     * Methode gibt daher ein passendes Objekt zurück, das an die Methode
     * _switchVisibleContent() der Klasse App übergeben werden kann, um ihr
     * die darzustellenden DOM-Elemente mitzuteilen.
     *
     * @param {Object} runsDB Datenbank mit Ergebnissen als Inhalt
     * @return {Object} Darzustellende DOM-Elemente gemäß Beschreibung der
     * Methode App._switchVisibleContent()
     */
    onShow(runsDB) {
        //Passende Elemente vom HTML aufrufen und in Sections speichern
        let section = document.querySelector("#run-overview").cloneNode(true);
        let tBody   = section.querySelector("#uebersicht");
        /*Datenbankergebnisse in lokaler Variable speichern
        *Abfrage aller vorhandenen Ergebnisse muss in eine async-Funktion
        *gepackt werden, damit auch auf das Ergebnis der Datenbankabfrage
        *gewartet wird.
        */

        //!!! Problem: nur beim Debuggen funktioniert der Algorithmus,
        //ohne Debuggen werdn keine Erggebnisse angezeigt:
        //Grund: ohne beim Debuggen in die async-Funktion getRunsList
        //zu gehen, wird in Zeile 128 (TR der section hinzufügen)
        //ein Fehler geworfen
        //!!!!


        let getRunsList = async () => {
            let runsList = await runsDB.search();
            return runsList;
        }
        let runsList = getRunsList();

        //Ergebnisse verarbeiten
        //Then-Methode eines Promise-Objekts liefert Zugriff auf Value
        //die im Promise gespeichert sind.
        runsList.then(function(e) {

            //e ist nun ein Array --> durchlaufen der einzelnen Ergebnissen
            //mit Hilfe einer forEach-Schleife.
            e.forEach(function(run) {
                //Tabellenzeile für jedes Ergebnis erstellen
                let newTR = document.createElement("TR");
                /*Einzelne Eigenschaften in <TD>-Elementen speichern
                *und der neuen Zeile als Kind hinzufügen
                *Eigenschaften / Spalten der Tabelle:
                *Name
                *Datum
                *Distanz in km
                *Zeit
                *Art
                *Velocity in min/km*/
                let tdName = document.createElement("TD");
                let tdDatum = document.createElement("TD");
                let tdDistanz = document.createElement("TD");
                let tdZeit = document.createElement("TD");
                let tdArt = document.createElement("TD");
                let tdVelocity = document.createElement("TD");
                //Einzelne Elemente mit Inhalt befüllen
                tdName.textContent      = run.name;
                tdDatum.textContent     = run.datum;
                tdDistanz.textContent   = run.strecke;
                tdZeit.textContent      = run.dauer;
                tdArt.textContent       = run.art;
                tdVelocity.textContent  = run.minutenPerKm;

                //Einzelne TDs der Table Row als Kind hinzufügen:
                //Reihenfolge der Tabellenspalten sollte mit der
                //Reihenfolge der Anweisungen übereinstimmen1
                newTR.appendChild(tdName);
                newTR.appendChild(tdDatum);
                newTR.appendChild(tdDistanz);
                newTR.appendChild(tdZeit);
                newTR.appendChild(tdArt);
                newTR.appendChild(tdVelocity);

                //Tabellenzeile zur Tabelle (Id: uebersicht) hinzufügen, damit
                // diese auch auf dem Bildschirm angezeigt wird
                tBody.appendChild(newTR);
            });
        });

        return {
            className: "run-overview",
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
    onLeave(goon) {
        return true;
    }

    /**
     * @return {String} Titel für die Titelzeile des Browsers
     */
    get title() {
        return "Übersicht";
    }
}

export default RunOverview;
