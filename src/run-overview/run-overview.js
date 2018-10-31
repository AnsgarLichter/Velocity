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

import stylesheet from "./run-overview.css";

import Database from "../database.js";

/**
 * View mit der Übersicht der vorhandenen Trainingsergebnisse.
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
     * Folgende Methode wird von der Klasse App aufgerufen, um die Übersicht
     * der vorhandenen Ergebnisse anzuzeigen. Es sollen also die darzustellenden
     * DOM-Elemente zurückgegeben werden
     *
     * Desweiteren wird hier die Funktion, um die Tabelle auf der
     * Übersichtsseite zu sortieren, realisiert.
     *
     * @return {Object} Darzustellende DOM-Elemente gemäß Beschreibung der
     * Methode App._switchVisibleContent()
     */
    async onShow() {

        //Test der Datenbankklasse für Laufergebnisse
        await this._runsDB.clear();

        let runs = await this._runsDB.search();
        console.log("Alle Ergebnisse: ", runs);

        if(runs.length == 0) {
            console.log("Bisher noch keine Trainningsdaten vorhanden, lege daher Testdaten an");

            await Promise.all([
                this._runsDB.saveNew({
                    name: "Test1",
                    strecke: "8,56",
                    dauer: "30:00",
                    minutenPerKm: "5:00",
                    art: "Joggen",
                    datum: "2018-10-09",
                    rating: "1",
                }),
                this._runsDB.saveNew({
                    name: "Test2",
                    strecke: "8,21",
                    dauer: "35:00",
                    minutenPerKm: "4:30",
                    art: "Joggen",
                    datum: "2017-11-09",
                    rating: "3",
                }),
                this._runsDB.saveNew({
                    name: "Test3",
                    strecke: "10,31",
                    dauer: "50:10",
                    minutenPerKm: "5:01",
                    art: "Joggen",
                    datum: "2017-10-03",
                    rating: "4",
                }),
                this._runsDB.saveNew({
                    name: "Test4",
                    strecke: "15,31",
                    dauer: "90:34",
                    minutenPerKm: "5:54",
                    art: "Joggen",
                    datum: "2018-01-03",
                    rating: "5",
                }),
            ]);

            let runs = await this._runsDB.search();
            console.log("Gespeicherte Trainingsdaten: ", runs);
        }

        runs = await this._runsDB.search("6km");
        console.log("Suche nach 6km", runs);
        //Ende des Testcodes*/

        //Passende Elemente vom HTML suchen und eine Kopie in Section speichern
        let section = document.querySelector("#run-overview").cloneNode(true);
        /*
        * Tabelle in der Section suchen und speichern, um das Füllen der
        * Tabelle zu erleichtern.
        */
        let tBody   = section.querySelector("#uebersicht");

        /*
        * Datenbankergebnisse in lokaler Variable speichern
        * Abfrage aller vorhandenen Ergebnisse muss in eine async-Funktion
        * gepackt werden, damit auch auf das Ergebnis der Datenbankabfrage
        * gewartet wird.
        */
        let runsList = await this._runsDB.search();

        /*
        * runsList ist ein Array und enthaelt alle vorhandenen Trainings-
        * ergebnisse. Da jedes Ergebnis in der Tabelle auf der Uebersichts-
        * seite dargestellt werden soll, wird der Array mit Hilfe einer
        * forEach-Schleife durchlaufen.
        * Innerhalb dieser forEach-Schleife wird pro vorhandenem Trainings-
        * ergebnis eine Zeile mit den entsprechenden Daten hinzugefügt.
        */
        runsList.forEach((run) => {
            //Tabellenzeile für jedes Ergebnis erstellen
            let newTR = document.createElement("TR");

            /*
            * Einzelne Eigenschaften in <TD>-Elementen speichern
            * und der neuen Zeile als Kind hinzufügen
            * Eigenschaften / Spalten der Tabelle:
            * Name
            * Datum
            * Distanz in km
            * Zeit
            * Art
            * Velocity in min/km
            */
            let tdName = document.createElement("TD");
            let tdDatum = document.createElement("TD");
            let tdDistanz = document.createElement("TD");
            let tdZeit = document.createElement("TD");
            let tdArt = document.createElement("TD");
            let tdVelocity = document.createElement("TD");

            //Einzelne <TD>-Elemente mit dem entsprechenden Inhalt befüllen
            tdName.textContent      = run.name;
            tdDatum.textContent     = run.datum;
            tdDistanz.textContent   = run.strecke;
            tdZeit.textContent      = run.dauer;
            tdArt.textContent       = run.art;
            tdVelocity.textContent  = run.minutenPerKm;

            //Datum Format auf die duetsche Schreibweise verändern
            tdDatum.textContent = tdDatum.textContent.substring(8) + '.' + tdDatum.textContent.substring(5,7) + '.' + tdDatum.textContent.substring(0,4);


            /*
            * Einzelne <TD>-Elemente der Tabellenzeile als Kind hinzufügen:
            * Achtung: Reihenfolge der Tabellenspalten sollte mit der
            *          Reihenfolge der Anweisungen übereinstimmen
            */
            newTR.appendChild(tdName);
            newTR.appendChild(tdDatum);
            newTR.appendChild(tdDistanz);
            newTR.appendChild(tdZeit);
            newTR.appendChild(tdArt);
            newTR.appendChild(tdVelocity);

            /*
            * Text Content der einzelnen Zellen in Links für die Detailansicht
            * einrahmen. Damit wirrd gewährleistet, das mit einem Klick auf den
            * Text innerhalb einer Tabellenzelle auf die Detailansicht ge-
            * sprungen werden kann.
            */

            //Anzahl Kinder bestimen
            let i = newTR.childElementCount -1;
            //Alle Kinder holen und in einer Variablen speichern
            let children = newTR.childNodes;

            /*
            * In dieser for-Schleife wird innerhalb jeder Tabellenzelle
            * der eigentliche Inhalt mti einem <a>-Element "umrahmt".
            */
            for(i; i > -1; i--) {
                //<a>-Element erstelen und Attribute setzen
                let a = document.createElement("a");
                a.setAttribute("href", "/run/display/"+ run.id + "/");
                //Data-Navigo Attribut - ohne funktioniert der Router nicht.
                a.setAttribute("data-navigo", "");

                /*
                * textContent des Elternelements im textContent des <a>-Elements
                * speichern.
                */
                a.textContent = children[i].textContent;
                children[i].textContent = "";

                //<a>-Element der Tabellenzelle als Kind hinzufügen.
                children[i].appendChild(a);
            }
            /*
            * Tabellenzeile zur Tabelle (tBody) hinzufügen, damit
            * diese auch auf dem Bildschirm angezeigt wird
            */
            tBody.appendChild(newTR);
        });

        /*
        * Sortieren der Tabelle, falls vom Anwender gewünscht.
        * Der Parameter n entspricht Spaltennummer:
        * Name = 1, Datum = 2, Distanz = 3, Zeit = 4, Art = 5, Velocity = 6
        * dir steht für die Sortierreihenfolge:
        * asc für ascending und desc für descending
        *
        * Falls bereits ascendig sortiert ist, wird descendig sortiert.
        * Abhängig von der Sortierrichtung wird neben der sortierten Spalte
        * eine entsprechende Triangle eingeblendet
        */
        let sortTable = (n) => {
            /*
            * Boolean, ob getauscht wurde --> auf true setzen, damti überhaupt
            * mit tauschen begonnen wird
            */
            let switching = true;
            //Alle Tabellenzeilen
            let rows = tBody.rows;
            //Tabellenzeile 1 zum Verlgeichen
            let x;
            //Tabellenzeile 2 zum Vergleichen
            let y;
            //Boolean, ob getauscht werden soll
            let tauschen;
            /*
            * Zaehlervariable für die for-Schleife
            * Zeile mit Spaltennamen soll nicht mit soritert werden --> i = 1
            */
            let i;
            //Standardmäßig wird ascendig sortiert, daher dir auf asc setzen
            let dir = "asc";
            /*
            * Zähler, wie oft getauscht wurde, wird benötigt, damit descending
            * sortiert werden kann, wenn kein Tausch bei "asc" vorgenommen
            * wurde. Wenn bei Ascending kein Tausch vorgenommen wurde, bedeutet
            * dies, dass bereits ascendig sortiert ist.
            */
            let zaehler = 0;

            /*
            * Bevor das Tauschen beginnen kann, müssen die alten Triangle wieder
            * entfernt werden.
            */
            let triangles = document.getElementsByClassName("display");
            for(i=0; i < triangles.length; i++) {
                triangles[i].className = "hidden";
            }

            //While-Schleife bis nicht mehr getauscht wurde
            while(switching) {
                //switching auf false setzen, da noch kein Tausch
                switching = false;
                /*
                * Über alle Zeilen drübergehen (außer die erste Zeile mit
                * den Spaltennamen)
                */
                for(i = 1; i < (rows.length -1); i++) {
                    tauschen = false;
                    //Zellen holen, die verglichen werden sollen
                    x = rows[i].getElementsByTagName("TD")[n];
                    y = rows[i+1].getElementsByTagName("TD")[n];

                    //Zelleninhalt in einer Stringvariablen speichern
                    let stringX = x.firstChild.innerHTML.toLowerCase();
                    let stringY = y.firstChild.innerHTML.toLowerCase();

                    /*
                    * Datum können im Format TT.MM.YYYY nicht richtig Vergleichen.
                    * Daher muss das Datum in YYYYMMTT umgewandelt werden.
                    * Die Daten stehen in der 2. Spalte (n == 1). Wenn es sich
                    * diese Spalte handelt wird das Datum mittels subString in
                    * das geforderte Format umgewandelt.
                    */
                    if(n == 1) {
                        stringX = stringX.substring(6,10)+stringX.substring(3,5)+stringX.substring(0,2);
                        stringY = stringY.substring(6,10)+stringY.substring(3,5)+stringY.substring(0,2);
                    }

                    /*
                    * Überprüfen, ob getasucht werden sollen in Abhängigkeit
                    * der Sortierreihenfolge
                    */
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

                /*
                * Falls Elemente zum Tausch markiert wurden, wird der Tausch
                * hier vollzogen.
                */
                if(tauschen) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    zaehler++;
                }else{
                    /*
                    * Wenn kein Tausch erfolgt ist und die Richtung "asc" ist,
                    * soll descendig sortiert werden.
                    */
                    if(zaehler == 0 && dir == "asc") {
                        dir = "desc";
                        switching = true;
                    }
                }
            }

            //Abhängig von der Sortierrichtung die entsprechende Triangle einblenden
            if(dir == "asc") {
                //Triangle nach unten einblenden und nach oben ausblendne
                rows[0].getElementsByTagName("TD")[n].querySelector("#asc").className="display";
                rows[0].getElementsByTagName("TD")[n].querySelector("#desc").className="hidden";
            }else{
                //Triangle nach unten einblenden und nach oben ausbelden
                rows[0].getElementsByTagName("TD")[n].querySelector("#desc").className="display";
                rows[0].getElementsByTagName("TD")[n].querySelector("#asc").className="hidden";
            }
        };

        /*
        * EventListener für jede Tabellenzelle registrieren, damit der Sortier-
        * algorithmus auch mit dem passenden Parameter aufgerufen wird.
        * Achtung: n wie beim Array --> 1. Spalte hat den Wert 0, usw.
        */
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

    /*
     * Diese Methode wird von der Klasse App aufgerufen, um festzustellen, ob
     * der Seitenwechsel von der aktuellen Seite weg erlaubt ist.
     * Gibt diese Methode den Wert true zurück, kann der Seitenwechsel
     * vollzogen werden.
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
