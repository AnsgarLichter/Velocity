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

        //Icon für Rating anzeigen
        //let iconAnzahl = run.rating;
        /*if (iconAnzahl == 1){
            document.querySelectorAll(".icon1").forEach(e => e.style.display = "block");
            document.querySelectorAll(".icon2").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon3").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon4").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon5").forEach(e => e.style.display = "none");


        }
        else if (iconAnzahl == 2){
            document.querySelectorAll(".icon1").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon2").forEach(e => e.style.display = "block");
            document.querySelectorAll(".icon3").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon4").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon5").forEach(e => e.style.display = "none");


        }
        else if (iconAnzahl == 3){
            document.querySelectorAll(".icon1").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon2").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon3").forEach(e => e.style.display = "block");
            document.querySelectorAll(".icon4").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon5").forEach(e => e.style.display = "none");

        }
       else if (iconAnzahl == 4){
            document.querySelectorAll(".icon1").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon2").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon3").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon4").forEach(e => e.style.display = "block");
            document.querySelectorAll(".icon5").forEach(e => e.style.display = "none");


        }
        else if (iconAnzahl == 5){
            document.querySelectorAll(".icon1").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon2").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon3").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon4").forEach(e => e.style.display = "none");
            document.querySelectorAll(".icon5").forEach(e => e.style.display = "block");

      }

        });
        Event für Abbrechen-Button*/
        section.querySelector("#abbrechen").addEventListener("click",() => {

        });


        section.querySelector("#Rating").addEventListener("click", () => {
            let rate = document.querySelector("#Rating").value;
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

      /*      this._runsDB.update({
                id: changeId,
                name: changeName,
                strecke: changeDistanz,
                dauer: changeZeit,
                minutenPerKm: changeMinutenPerKm,
                art: changeArt,
                datum: changeDatum,
                beschreibungstext: changeBeschreibung,
                rating: changeRating,
            });*/
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
