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

import Database from "../database.js";

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

        //Datenbank deklarieren
        this._runsDB = new Database.Runs();
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
     * @return {Object} Darzustellende DOM-Elemente gemäß Beschreibung der
     * Methode App._switchVisibleContent()
     */
    async onShow() {
/*
        //Test der Datenbankklasse für Laufergebnisse
        console.log("1", this._runsDB);
        await this._runsDB.clear();
        console.log("2");

        let runs = await this._runsDB.search();
        console.log("Alle Ergebnisse: ", runs);
        console.log("3");

        if(runs.length == 0) {
            console.log("Bisher noch keine Trainningsdaten vorhanden, lege daher Testdaten an");

            await Promise.all([
                this._runsDB.saveNew({
                    name: "Test1",
                    strecke: "8,56",
                    dauer: "30:00",
                    minutenPerKm: "5:00",
                    art: "Joggen",
                    datum: "09.10.2018",
                }),
                this._runsDB.saveNew({
                    name: "Test2",
                    strecke: "8,21",
                    dauer: "35:00",
                    minutenPerKm: "4:30",
                    art: "Joggen",
                    datum: "09.11.2017",
                }),
                this._runsDB.saveNew({
                    name: "Test3",
                    strecke: "10,31",
                    dauer: "50:10",
                    minutenPerKm: "5:01",
                    art: "Joggen",
                    datum: "03.10.2018",
                }),
                this._runsDB.saveNew({
                    name: "Test4",
                    strecke: "15,31",
                    dauer: "90:34",
                    minutenPerKm: "5:54",
                    art: "Joggen",
                    datum: "03.01.2017",
                }),
            ]);

            let runs = await this._runsDB.search();
            console.log("Gespeicherte Trainingsdaten: ", runs);
        }

        runs = await this._runsDB.search("6km");
        console.log("Suche nach 6km", runs);
        //Ende des Testcodes
*/
        //Passende Elemente vom HTML aufrufen und in Sections speichern
        let section = document.querySelector("#run-overview").cloneNode(true);
        let tBody   = section.querySelector("#uebersicht");
        /*Datenbankergebnisse in lokaler Variable speichern
        *Abfrage aller vorhandenen Ergebnisse muss in eine async-Funktion
        *gepackt werden, damit auch auf das Ergebnis der Datenbankabfrage
        *gewartet wird.
        */

        let runsList = await this._runsDB.search();

        //e ist nun ein Array --> durchlaufen der einzelnen Ergebnissen
        //mit Hilfe einer forEach-Schleife.
        runsList.forEach(function(run) {
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

            //Text Content der einzelnen Zellen in Links für die Detailansicht einrahmen
            //Anzahl Kinder bestimen
            let i = newTR.childElementCount -1;

            //ChildNodes holen
            let children = newTR.childNodes;

            for(i; i > -1; i--) {
                //<a></a> erstelen und Attribute einsetzen
                let a = document.createElement("a");
                a.setAttribute("href", "/run/display/"+ run.id + "/");
                a.setAttribute("data-navigo", "");

                //textContent des Elternelements innerhalb des Links speichern
                a.textContent = children[i].textContent;
                children[i].textContent = "";
                //Link als Kind hinzufügen
                children[i].appendChild(a);
            }
            //Tabellenzeile zur Tabelle (Id: uebersicht) hinzufügen, damit
            // diese auch auf dem Bildschirm angezeigt wird
            tBody.appendChild(newTR);
        });

        /*Sortieren der Tabelle, falls vom Anwender gewünscht
        *n entspricht Spaltennummer:
        * Name = 1, Datum = 2, Distanz = 3, Zeit = 4, Art = 5, Velocity = 6
        *dir steht für die Sortierreihenfolge:
        * asc für ascendign und desc für descending
        *
        */
        let sortTable = (n) => {
            /*Boolean, ob getauscht wurde --> auf true setzen, damti überhaupt
            mit tauschen begonnen wird*/
            let switching = true;
            //Alle Tabellenzeilen
            let rows = tBody.rows;
            //Tabellenzeile 1 zum Verlgeichen
            let x;
            //Tabellenzeile 2 zum Vergleichen
            let y;
            //Boolean, ob getauscht werden soll
            let tauschen;
            //Zaehlervariable für die for-Schleife
            // Zeile mit Spaltennamen soll nicht mit soritert werden --> i = 1
            let i;
            //Standardmäßig wird ascendig sortiert, daher dir auf asc setzen
            let dir = "asc";
            /*Zähler, wie oft getauscht wurde
            * wird benötigt, damit, wenn kein Tausch bei "asc" vorgenommen wurde,
            * descendig sortiert werden kann*/
            let zaehler = 0;

            //Bevor das Tauschen beginnen kann, müssen die alten Triangle wieder
            //versteckt werden
            let triangles = document.getElementsByClassName("display");
            for(i=0; i < triangles.length; i++) {
                triangles[i].className = "hidden";
            }


            //While-Schleife bis nicht mehr getauscht wurde
            while(switching) {
                //Es wurde nicht getauscht
                switching = false;
                /*Über alle Zeilen drübergehen (außer die erste Zeile mit
                *den Spaltennamen)*/
                for(i = 1; i < (rows.length -1); i++) {
                    tauschen = false;
                    //Zellen holen, die verglichen werden scrollen
                    x = rows[i].getElementsByTagName("TD")[n];
                    y = rows[i+1].getElementsByTagName("TD")[n];

                    let stringX = x.firstChild.innerHTML.toLowerCase();
                    let stringY = y.firstChild.innerHTML.toLowerCase();

                    /*Datum können im Format TT.MM.YYYY nicht richtig Vergleichen.
                    * Daher muss das Datum in YYYYMMTT umgewandelt werden.
                    */
                    if(n == 1) {
                        stringX = stringX.substring(6,10)+stringX.substring(3,5)+stringX.substring(0,2);
                        stringY = stringY.substring(6,10)+stringY.substring(3,5)+stringY.substring(0,2);
                    }
                    /*Überprüfen, ob getasucht werden sollen in Abhängigkeit
                    *der Sortierreihenfolge*/
                    if (dir == "asc") {
                        if(stringX > stringY) {
                            //Elemente sollen getauscht werden --> markieren
                            tauschen = true;
                            break;
                        }
                    }
                    else if(dir = "desc") {
                        if(stringX < stringY) {
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
                    zaehler++;
                }else{
                    //Wenn kein Tausch erfolgt ist und dir Richtung "asc" ist,
                    //soll descendig sortiert werden
                    if(zaehler == 0 && dir == "asc") {
                        dir = "desc";
                        switching = true;
                    }
                }
            }

            //Abhängig von der Sortierrichtung die entsprechende Triangle einblenden
            if(dir == "asc") {
                //Triangle nach unten
                rows[0].getElementsByTagName("TD")[n].querySelector("#asc").className="display";
                rows[0].getElementsByTagName("TD")[n].querySelector("#desc").className="hidden";
            }else{
                //Triangle nach oben
                rows[0].getElementsByTagName("TD")[n].querySelector("#desc").className="display";
                rows[0].getElementsByTagName("TD")[n].querySelector("#asc").className="hidden";
            }
        };

        //EventListener für jede Spalte registrieren
        section.querySelector("#tdName").addEventListener("click",() => { sortTable(0)});
        section.querySelector("#tdDatum").addEventListener("click",() => { sortTable(1)} );
        section.querySelector("#tdDistanz").addEventListener("click",() => { sortTable(2)});
        section.querySelector("#tdZeit").addEventListener("click",() => { sortTable(3)});
        section.querySelector("#tdArt").addEventListener("click",() => { sortTable(4)});
        section.querySelector("#tdVelocity").addEventListener("click",() => { sortTable(5)});

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
    async onLeave(goon) {
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
