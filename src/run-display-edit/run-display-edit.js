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
        //alert(id);
        this._id = parseInt(this._id);
        let run = await this._runsDB.getByID(this._id);
        /*while(run == undefined){
            run = await this._runsDB.getByID(this._id-1);
        }*/

        /*alert(run.name);
        alert(run.datum);
        alert(run.strecke);
        alert(run.dauer);
        alert(run.art);
        alert(run.minutenPerKm);*/

        /*section.getElementById('Name').value=run.name;
        section.getElementById('Datum').value=run.datum;
        section.getElementById('Distanz').value=run.strecke;
        section.getElementById('Art').value=run.art;
        section.getElementById('Zeit').value=run.dauer;
        section.getElementById('minutenPerKm').value=run.minutenPerKm;*/

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

        /*document.getElementById('kilometerPerStd').value=kmPerStd;*/
        section.querySelector('#kilometerPerStd').value=kmPerStd;

        //document.getElementById('Beschreibung').value=
        //document.getElementById('Bewertung').value=

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

            document.getElementById('sichern').style.display="block";
            document.getElementById('div_aendern').style.display="block";
            document.getElementById('div_ergebnis_wechseln').style.display="none";
            document.getElementById('bearbeiten').style.display="none";



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

            document.getElementById('div_aendern').style.display="none";
            document.getElementById('div_ergebnis_wechseln').style.display="block";
            document.getElementById('bearbeiten').style.display="block";
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
            document.getElementById('div_ergebnis_wechseln').style.display="block";
            document.getElementById('bearbeiten').style.display="block";
            document.getElementById('sichern').style.display="none";
            document.getElementById('abbrechen').style.display="none";


            let url = document.URL;
            let changeId = url.substring(url.lastIndexOf('/') + 1);
                changeId = parseInt(changeId);
            this._runsDB.update({
                id: changeId,
                name: changeName,
                strecke: changeDistanz,
                dauer: changeZeit,
                minutenPerKm: changeMinutenPerKm,
                art: changeArt,
                datum: changeDatum,
                beschreibungstext: changeBeschreibung,
            });

            //alert(run);
            //run.datum.update("1");
            //alert(run.datum);
            //update(this._runsDB);
            //alert(this._runsDB);

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
            //let url = document.URL;
            //let changeId = url.substring(url.lastIndexOf('/') + 1);
            //    changeId = parseInt(changeId);

            //let getList = async () => {
            //    return await this._runsDB.search();
            //}
            //let listId = getList();
            //let current = parseInt(listId[0].id);
            let redirectID = this._predId;
            this._app.navigate("/run/display/"+ redirectID + "/");

                /*alert(changeId);
            let preId = changeId-1;

             while (typeof(preId) == "undefined"){
                 preId = preId-1;
                 alert("keine ID vorhanden");
             }
            alert("PreId"+preId);
             preId = parseInt(preId);
             let preRun = this._runsDB.getByID(preId);
             alert("PreRun:"+preRun.name);*/
/*
             document.getElementById('Name').value=preRun.name;
             document.getElementById('Datum').value=preRun.datum;
             document.getElementById('Distanz').value=preRun.strecke;
             document.getElementById('Art').value=preRun.art;
             document.getElementById('Zeit').value=preRun.dauer;
             document.getElementById('minutenPerKm').value=preRun.minutenPerKm;

             /*Kommazahl zur Berechnung der Km/h in Wert mit Punkt umwandeln*/
            /* let meter = preRun.strecke.replace( /,/,"." );
                 meter = parseFloat(meter)*1000;
             let sekunde = preRun.dauer.replace( /,/,"." );
                 sekunde = parseFloat(preRun.dauer)*60;
             let kmPerStd = ((meter/sekunde)/1000)/(1/3600);

             document.getElementById('kilometerPerStd').value=kmPerStd;*/


         });

         //Nachster

          /*current = parseInt(listId[0].id);
         listId.forEach((run) =>{
             let runId = parseInt(run.id);
             if ((current-this._id) > (runId-this._id)){
                 if (runId > this._id){
                     current = runId;
                 }
             }
         });
         this._postId = current;

         section.querySelector("#naechste").addEventListener("click",() => {

             let redirectID = this._postId;
             this._app.navigate("/run/display/"+ redirectID + "/");
        });*/


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
