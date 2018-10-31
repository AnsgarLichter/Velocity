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

        /*Laufergbnisse aus Datenbank auslesen*/
        this._id = parseInt(this._id);
        let run = await this._runsDB.getByID(this._id);

        section.querySelector('#Name').value=run.name;
        section.querySelector('#Datum').value=run.datum;
        section.querySelector('#Distanz').value=run.strecke;
        section.querySelector('#Art').value=run.art;
        section.querySelector('#Zeit').value=run.dauer;
        section.querySelector('#minutenPerKm').value=run.minutenPerKm;

        //wenn Beschreibungstext undefined, leeren String anzeigen
        if(run.beschreibungstext == undefined){
           run.beschreibungstext = "";
        }
        section.querySelector('#Beschreibungstext').value=run.beschreibungstext;

        /*Kommazahl zur Berechnung der Km/h in Wert mit Punkt umwandeln*/
        let meter = run.strecke.replace( /,/,"." );
            meter = parseFloat(meter)*1000;
        let sekunde = run.dauer.replace( /,/,"." );
            sekunde = parseFloat(run.dauer)*60;
        let kmPerStd = ((meter/sekunde)/1000)/(1/3600);
            kmPerStd = parseInt(kmPerStd);

        /*Berechnung Minuten pro Kilometer*/
        let minPerKm = 3600 / kmPerStd / 60;
        section.querySelector("#minutenPerKm").value=minPerKm;
        section.querySelector('#kilometerPerStd').value=kmPerStd;
        //section.querySelector('#output').value = run.rating;

        //Wenn Rating undefined, leeren String anzeigen
        if(run.rating == undefined){
           run.rating = "";
        }
        section.querySelector('#Rating').value = run.rating;

        /*
        * Sterne entsprechend dem Rating anzeigen lassen. Bei Rating von 5
        * werden 5 Sterne angezeigt, bei einem Rating von 3 3 Sterne, usw.
        */
        let iconAnzahl = run.rating;
        if (iconAnzahl == 1){
            section.querySelectorAll("#icon1").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon2").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon3").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon4").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon5").forEach(e => e.style.display = "none");
        }
        else if (iconAnzahl == 2){
            section.querySelectorAll("#icon1").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon2").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon3").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon4").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon5").forEach(e => e.style.display = "none");
        }
        else if (iconAnzahl == 3){
            section.querySelectorAll("#icon1").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon2").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon3").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon4").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon5").forEach(e => e.style.display = "none");
        }
        else if (iconAnzahl == 4){
            section.querySelectorAll("#icon1").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon2").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon3").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon4").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon5").forEach(e => e.style.display = "none");
        }
        else if (iconAnzahl == 5){
            section.querySelectorAll("#icon1").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon2").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon3").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon4").forEach(e => e.style.display = "inline");
            section.querySelectorAll("#icon5").forEach(e => e.style.display = "inline");
        }
        else{
            section.querySelectorAll("#icon1").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon2").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon3").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon4").forEach(e => e.style.display = "none");
            section.querySelectorAll("#icon5").forEach(e => e.style.display = "none");
        }


        /*Event für Bearbeiten-Button*/
        section.querySelector("#bearbeiten").addEventListener("click",() => {
            document.getElementById('Name').removeAttribute('disabled');
            document.getElementById('Datum').removeAttribute('disabled');
            document.getElementById('Distanz').removeAttribute('disabled');
            document.getElementById('Zeit').removeAttribute('disabled');
            document.getElementById('Art').removeAttribute('disabled');
            document.getElementById('minutenPerKm').setAttribute('disabled', true);
            document.getElementById('kilometerPerStd').setAttribute('disabled', true);
            document.getElementById('Beschreibungstext').removeAttribute('disabled');
            document.getElementById('Rating').removeAttribute('disabled');

            document.getElementById('Rating').style.display= "inline";
            document.getElementById('sichern').style.display="block";
            document.getElementById('div_aendern').style.display="block";
            document.getElementById('div_ergebnis_wechseln').style.display="none";
            document.getElementById('bearbeiten').style.display="none";
            document.getElementById('abbrechen').style.display="block";



        });
        /*Event für Abbrechen-Button*/
        section.querySelector("#abbrechen").addEventListener("click",() => {
            document.getElementById('Name').setAttribute('disabled', true);
            document.getElementById('Datum').setAttribute('disabled', true);
            document.getElementById('Distanz').setAttribute('disabled', true);
            document.getElementById('Zeit').setAttribute('disabled', true);
            document.getElementById('Art').setAttribute('disabled', true);
            document.getElementById('minutenPerKm').setAttribute('disabled', true);
            document.getElementById('kilometerPerStd').setAttribute('disabled', true);
            document.getElementById('Beschreibungstext').setAttribute('disabled', true);
            document.getElementById('Rating').setAttribute('disabled', true);

            document.getElementById('div_aendern').style.display="none";
            document.getElementById('div_ergebnis_wechseln').style.display="block";
            document.getElementById('bearbeiten').style.display="block";
        });


        section.querySelector("#Rating").addEventListener("click", () => {
            let rate = document.querySelector("#Rating").value;
            //document.getElementById('output').value = rate;
        });

        /*Event für Sichern-Button*/
        section.querySelector("#sichern").addEventListener("click",() => {
            let changeName = document.querySelector("#Name").value;
            let changeDatum = document.querySelector("#Datum").value;
            let changeDistanz = document.querySelector("#Distanz").value;
            let changeZeit = document.querySelector("#Zeit").value;
            let changeArt = document.querySelector("#Art").value;
            let changeMinutenPerKm = document.querySelector("#minutenPerKm").value;

            //let changeKilometerperStd = document.querySelector("#KilometerPerStd").value;
            let changeBeschreibung = document.querySelector("#Beschreibungstext").value;

            /*section.querySelector("#Rating").addEventListener("click", () => {
                let rate = document.querySelector("#Rating").value;
                document.getElementById('output').value = rate;
            });*/

            let changeRating = document.querySelector("#Rating").value;
            alert(changeRating);
            if (changeRating == undefined){
                run.rating = "";
            }

            changeRating=parseInt(changeRating);

            document.getElementById('div_ergebnis_wechseln').style.display="block";
            document.getElementById('bearbeiten').style.display="block";
            document.getElementById('sichern').style.display="none";
            document.getElementById('abbrechen').style.display="none";


            let url = document.URL;
            /*let changeId = url.substring(url.lastIndexOf('/') + 1);*/
            let changeId = this._id;
                changeId = parseInt(changeId);

                if(changeName == "" || changeDatum == "" || changeDistanz == "" || changeZeit == "" || changeArt == "" || changeMinutenPerKm == "" || changeBeschreibung == "") {
                return;
            }

            this._runsDB.update({
                id: changeId,
                name: changeName,
                strecke: changeDistanz,
                dauer: changeZeit,
                minutenPerKm: changeMinutenPerKm,
                art: changeArt,
                datum: changeDatum,
                beschreibungstext: changeBeschreibung,
                rating: changeRating,
            });


            /*Eingabefelder nach dem Sichern grau hinterlegen,
            sodass keine Bearbeitung mehr möglich ist*/
            document.getElementById('Name').setAttribute('disabled', true);
            document.getElementById('Datum').setAttribute('disabled', true);
            document.getElementById('Distanz').setAttribute('disabled', true);
            document.getElementById('Zeit').setAttribute('disabled', true);
            document.getElementById('Art').setAttribute('disabled', true);
            document.getElementById('minutenPerKm').setAttribute('disabled', true);
            document.getElementById('kilometerPerStd').setAttribute('disabled', true);
            document.getElementById('Beschreibungstext').setAttribute('disabled', true);
        });

        /*Loeschen-Event Deatailergebnis löschen aus Datenbank*/
        section.querySelector("#loeschen").addEventListener("click",() => {

            let feedback = confirm("Wollen Sie die Eingabe wirklich löschen?");
            if (feedback == true){
            let url = document.URL;
            let changeId = url.substring(url.lastIndexOf('/') + 1);
                changeId = parseInt(changeId);
            this._runsDB.delete(changeId);
            alert("Die Id "+changeId+" wurde gelöscht!");
            window.location.href = "/run/display/";
            }
        });

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


        section.querySelector("#vorherige").addEventListener("click",() => {
            let redirectID = this._predId;
            this._app.navigate("/run/display/"+ redirectID + "/");
         });

         //Nachster
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

        section.querySelector("#naechste").addEventListener("click",() => {
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
