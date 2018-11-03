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

        //Input Felder für die Sternebewertung holen und speichern
        let star1 = section.querySelector("#star1");
        let star2 = section.querySelector("#star2");
        let star3 = section.querySelector("#star3");
        let star4 = section.querySelector("#star4");
        let star5 = section.querySelector("#star5");
        star1.setAttribute("disabled", true);
        star2.setAttribute("disabled", true);
        star3.setAttribute("disabled", true);
        star4.setAttribute("disabled", true);
        star5.setAttribute("disabled", true);

        /*Attribute zu dem jeweiligen Laufergebnis anhand der ID aus Datenbank auslesen*/
        this._id = parseInt(this._id);
        let run = await this._runsDB.getByID(this._id);
        run.strecke = run.strecke.replace(",", ".");
        run.strecke = parseFloat(run.strecke);
        section.querySelector('#Name').value=run.name;
        section.querySelector('#Datum').value=run.datum;
        section.querySelector('#Distanz').value=run.strecke;
        section.querySelector('#Art').value=run.art;
        section.querySelector('#Zeit').value=run.dauer;
        section.querySelector('#minutenPerKm').value=run.minutenPerKm;
        section.querySelector('#kilometerPerStd').value = run.kmPerStd;

        //Wenn Beschreibungstext undefined, leeren String anzeigen
        if(run.beschreibungstext == undefined){
           run.beschreibungstext = "";
        }else{
           section.querySelector('#Beschreibungstext').value=run.beschreibungstext;
        }

        //Rating auslesen
        run.rating = parseInt(run.rating);
        if(run.rating == 5) {
            star5.checked = true;
        }
        else if(run.rating == 4) {
            star4.checked = true;
        }
        else if(run.rating == 3) {
            star3.checked = true;
        }
        else if(run.rating == 2) {
            star2.checked = true;
        }
        else if(run.rating == 1) {
            star1.checked = true;
        }

        /*Event für Bearbeiten-Button: Alle Felder außer minPerKm und kilometerPerStd können bearbeitet werden*/
        section.querySelector("#bearbeiten").addEventListener("click",() => {
            document.getElementById('Name').removeAttribute('disabled');
            document.getElementById('Datum').removeAttribute('disabled');
            document.getElementById('Distanz').removeAttribute('disabled');
            document.getElementById('Zeit').removeAttribute('disabled');
            document.getElementById('Art').removeAttribute('disabled');
            document.getElementById('minutenPerKm').setAttribute('disabled', true);
            document.getElementById('kilometerPerStd').setAttribute('disabled', true);
            document.getElementById('Beschreibungstext').removeAttribute('disabled');

            document.getElementById('star1').removeAttribute('disabled');
            document.getElementById('star2').removeAttribute('disabled');
            document.getElementById('star3').removeAttribute('disabled');
            document.getElementById('star4').removeAttribute('disabled');
            document.getElementById('star5').removeAttribute('disabled');

            document.getElementById('sichern').style.display="inline";
            document.getElementById('div_aendern').style.display="inline";
            document.getElementById('div_ergebnis_wechseln').style.display="none";
            document.getElementById('bearbeiten').style.display="none";
            document.getElementById('abbrechen').style.display="inline";
        });

        /*Event für Abbrechen-Button: Alle Input-Felder werden grau hinterlegt.*/
        section.querySelector("#abbrechen").addEventListener("click",() => {
            document.getElementById('Name').setAttribute('disabled', true);
            document.getElementById('Datum').setAttribute('disabled', true);
            document.getElementById('Distanz').setAttribute('disabled', true);
            document.getElementById('Zeit').setAttribute('disabled', true);
            document.getElementById('Art').setAttribute('disabled', true);
            document.getElementById('minutenPerKm').setAttribute('disabled', true);
            document.getElementById('kilometerPerStd').setAttribute('disabled', true);
            document.getElementById('Beschreibungstext').setAttribute('disabled', true);

            document.getElementById('div_aendern').style.display="none";
            document.getElementById('div_ergebnis_wechseln').style.display="inline";
            document.getElementById('bearbeiten').style.display="inline";
        });

        /*Event für Sichern-Button*/
        section.querySelector("#sichern").addEventListener("click",() => {
            /*
            * Eingebebene Werte aus den Eingabefeldern auslesen und
            * anschließend die Eingabe überprüfen.
            * Die Beschreibung ist dabei optional und muss nicht überprüft
            * werden.
            */
            let changeName = document.querySelector("#Name").value;
            let changeDatum = document.querySelector("#Datum").value;
            let changeDistanz = document.querySelector("#Distanz").value;
                changeDistanz = parseFloat(changeDistanz).toFixed(3);
            let changeZeit = document.querySelector("#Zeit").value;
            let changeArt = document.querySelector("#Art").value;
            let changeBeschreibung = document.querySelector("#Beschreibungstext").value;

            //Regex zur Überprüfung der Zeit
            let regexZeit = new RegExp("^\\d{1,3}:\\d{1,2}$");

            //Abfrage der vergebenen Bewertung
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
            if(!changeName) {
                alert("Bitte den Namen ausfüllen!");
            }
            //Prüfen des Datums
            else if(!changeDatum) {
                alert("Bitte ein korrektes Datum eingeben!");
            }
            //Prüfen der Distanz
            else if(!changeDistanz) {
                alert("Eingabefehler bei der Distanz, bitte einen korrekten Wert eingeben");
            }
            else if(!changeZeit.match(regexZeit)) {
                alert("Bitte eine korrekte Zeit (mm:ss) eingeben!")
            }
            else{
                /*
                * Hier ist nun sichergestellt, dass alle Eingaben korrekt sind.
                * Nun sollen die Durchschnittsgeschwindigkeit und die
                * Geschwindigkeit in Minuten pro Kilometer berechnet werden.
                */

                //Kommazahl zur Berechnung der Km/h in Wert mit Punkt umwandeln
                let min      = changeZeit.split(":")
                let sekunden = parseFloat(parseFloat(min[0]*60)+parseFloat(min[1]));
                let meter    = changeDistanz * 1000;
                let kmPerStd = ((meter/sekunden)/1000)/(1/3600);
                    kmPerStd = parseFloat(kmPerStd).toFixed(2);

                //Berechnung Minuten pro Kilometer
                let minPerKm = 3600 / kmPerStd / 60;
                let minPerKmDecimals = minPerKm - Math.floor(minPerKm);
                    minPerKmDecimals = parseInt(minPerKmDecimals * 60);
                    minPerKm = "" + minPerKm.toFixed(0) + ":" + minPerKmDecimals;

                //Berechnete Werte in Eingabefelder schreiben
                document.querySelector("#minutenPerKm").value    = minPerKm;
                document.querySelector('#kilometerPerStd').value = kmPerStd;

                //Alle Werte in der Datenbank speichern.
                this._runsDB.update({
                    id: this._id,
                    name: changeName,
                    strecke: changeDistanz,
                    dauer: changeZeit,
                    minutenPerKm: minPerKm,
                    kmPerStd: kmPerStd,
                    art: changeArt,
                    datum: changeDatum,
                    beschreibungstext: changeBeschreibung,
                    rating: rating,
                });

                /*
                * Eingabefelder nach dem Sichern grau hinterlegen,
                * sodass keine Bearbeitung mehr möglich ist.
                */
                document.getElementById('Name').setAttribute('disabled', true);
                document.getElementById('Datum').setAttribute('disabled', true);
                document.getElementById('Distanz').setAttribute('disabled', true);
                document.getElementById('Zeit').setAttribute('disabled', true);
                document.getElementById('Art').setAttribute('disabled', true);
                document.getElementById('minutenPerKm').setAttribute('disabled', true);
                document.getElementById('kilometerPerStd').setAttribute('disabled', true);
                document.getElementById('Beschreibungstext').setAttribute('disabled', true);
                /*
                * Die Buttons Sichern und abbrechen wieder verstecken und die
                * Buttons für die detaillierte Ansicht wieder anzeigen.
                */
                document.getElementById('div_ergebnis_wechseln').style.display="inline";
                document.getElementById('bearbeiten').style.display="inline";
                document.getElementById('sichern').style.display="none";
                document.getElementById('abbrechen').style.display="none";
            }
        });

        /*Loeschen-Event Deatailergebnis löschen aus Datenbank*/
        section.querySelector("#loeschen").addEventListener("click",() => {
            //Sicherheitsabfrage vor dem endgültigen Löschen
            let feedback = confirm("Wollen Sie das Ergebnis wirklich löschen?");
            if (feedback == true){
            let url = document.URL;
            let changeId = url.substring(url.lastIndexOf('/') + 1);
                changeId = parseInt(changeId);
            this._runsDB.delete(changeId);
        //Navigation auf die Übersichtsseite
            this._app.navigate("/");
            }
        });

        /*ID finden, die sich direkt vor der aktuell angezeigen ID befindet
        und durch Vorher-Button aufgerufen werden kann*/
        let listId = await this._runsDB.search();
        let current = parseInt(listId[0].id);
        listId.forEach((run) =>{
            let runId = parseInt(run.id);
            if ((this._id - current) > (this._id - runId)){
                if (runId < this._id){
                    current = runId;
                }
            }
        });
        this._predId = current;

        /*Vorher-Button für Desktop-Darstellung*/
        section.querySelector("#vorherige").addEventListener("click",() => {
            let redirectID = this._predId;
            this._app.navigate("/run/display/"+ redirectID + "/");
         });

        /*Vorher-Button für Mobile Darstellung */
         section.querySelector("#vorherigeMobile").addEventListener("click",() => {
             let redirectID = this._predId;
             this._app.navigate("/run/display/"+ redirectID + "/");
          });

         /*ID finden, die sich direkt nach der aktuell angezeigen ID befindet
         und durch Nächste-Button aufgerufen werden kann*/
        listId = await this._runsDB.search();
         current = 100000;
         listId.forEach((run) =>{
            let runId = parseInt(run.id);
            if(runId > this._id) {
                let diff1 = Math.abs((this._id - runId));
                let diff2 = Math.abs((this._id - current));

                if (diff1 < diff2) {
                    current = runId;
                }
            }
         });
         if(current == 100000) {
            this._postID = this._id;
         }else{
            this._postId = current;
         }

         /*Nächste-Button für Desktop-Darstellung*/
        section.querySelector("#naechste").addEventListener("click",() => {
            let redirectID;
            if(this._postId == undefined) {
                redirectID = this._id;
            }else{
                redirectID = this._postId;
            }
             this._app.navigate("/run/display/"+ redirectID + "/");
        });

        /*Nächste-Button für Mobile Darstellung */
        section.querySelector("#naechsteMobile").addEventListener("click",() => {
            let redirectID;
            if(this._postId == undefined) {
                redirectID = this._id;
            }else{
                redirectID = this._postId;
            }
             this._app.navigate("/run/display/"+ redirectID + "/");
        });


        return {
            className: "run-display-edit",
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
