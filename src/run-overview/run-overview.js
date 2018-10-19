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
     * Desweiteren wird hier die Funktion, um die Tabelle auf der
     * Übersichtsseite zu sortieren, realisiert.
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

        /*Sortieren der Tabelle, falls vom Anwender gewünscht
        *n entspricht Spaltennummer:
        * Name = 1, Datum = 2, Distanz = 3, Zeit = 4, Art = 5, Velocity = 6
        *dir steht für die Sortierreihenfolge:
        * asc für ascendign und desc für descending
        *
        */
        let sortTable = (n, dir) => {
            /*Boolean, ob getauscht wurde --> auf true setzen, damti überhaupt
            mit tauschen begonnen wird*/
            let switching = true;
            //Alle Tabellenzeilen
            let rows;
            //Tabellenzeile 1 zum Verlgeichen
            let x;
            //Tabellenzeile 2 zum Vergleichen
            let y;
            //Boolean, ob getauscht werden soll
            let tauschen;
            //Zaehlervariable für die for-Schleife
            // Zeile mit Spaltennamen soll nicht mit soritert werden --> i = 1
            let i;

            //While-Schleife bis nicht mehr getauscht wurde
            while(switching) {
                //Es wurde nicht getauscht
                switching = false;
                rows = tBody.rows;
                /*Über alle Zeilen drübergehen (außer die erste Zeile mit
                *den Spaltennamen)*/
                for(i = 1; i < (rows.lenght -1); i++) {
                    tauschen = false;
                    //Zellen holen, die verglichen werden scrollen
                    x = rows[i].getElementsByTagName("TD")[n];
                    x = rows[i+1].getElementsByTagName("TD")[n];
                    /*Überprüfen, ob getasucht werden sollen in Abhängigkeit
                    *der Sortierreihenfolge*/
                    if (dir == "asc") {
                        if(x.innerHTML.toLowerCase() > y.innerhTML.toLowerCase()) {
                            //Elemente sollen getauscht werden --> markieren
                            tauschen = true;
                            break;
                        }
                    }
                    else if(dir = "desc") {
                        if(x.innerHTML.toLowerCase() < y.innerhTML.toLowerCase()) {
                            //Elemente sollen getauscht werden --> markieren
                            tauschen = true;
                            break;
                        }
                    }
                }
                //Ende for-Schleife
                if(tauschen) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                }
            }
        };

        //EventListener für jede Spalte registrieren
        document.querySelector("#tdName").addEventListener("click", alert("Click"));
        //document.querySelector("#tdName").addEventListener("click", sortTable(1, "asc"));
        document.querySelector("#tdDatum").addEventListener("click", sortTable(2, "asc"));
        document.querySelector("#tdDistanz").addEventListener("click", sortTable(3, "asc"));
        document.querySelector("#tdZeit").addEventListener("click", sortTable(4, "asc"));
        document.querySelector("#tdArt").addEventListener("click", sortTable(5, "asc"));
        document.querySelector("#tdVelocity").addEventListener("click", sortTable(6, "asc"));

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
