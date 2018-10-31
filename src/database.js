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

import Dexie from "dexie/dist/dexie.js";

/*
* Datenbankdefinition:
*
* ++id --> automatisch hochgezählter Datenbankschlüssel
* Name
* Strecke
* Dauer
* Minuten / km
* Art
* Datum
*
* Folgende Felder sind keine Indexfelder für WHERE-Abfragen, daher müssen diese
* nicht definiert werden:
*  Bewertung
*  Beschreibung
*  kilometerPerStd
*/

 let database = new Dexie("Velocity");

 database.version(1).stores({
    runs: "++id, name, strecke, dauer, minutenPerKm, art, datum, beschreibungstext, rating, kmPerStd",
 });

 /*
 * Datenbankzugriffsklasse: Diese Klasse bietet Methoden,
 * um Ergebnisse zu speichern, zu aktualisieren, auszulesen oder zu löschen.
 * Im Hintergrund wird hierfür Dexie bentuzt, um die Daten lokal im Browser oder
 * auf dem Endgerät zu speichern.
 */
class Runs {

    /*
     * Mit Hilfe der folgenden Methode soll ein neues Trainingsergebnis in
     * der Datenbank hinterlegt werden können.
     * Damit dies möglich ist, sollte ein Ergebnis den folgenden Aufbau
     * besitzen:
     *
     * {
     *     name: "Name des Trainings",
     *     strecke: "Strecke in Kilometern",
     *     minuten/km: "Minuten pro Kilometer"
     *     art: "Art des Trainings"
     *     dauer: "Dauer des Trainings",
     *     datum: "Datum des Trainings"
     *     beschreibung: "Beschreibung zum Training"
     *     bewertung: "Bewertung des Trainings"
     *     kmPerStd: "Kilometer pro Stunde"
     * }
     *
     * @param  {Object}  run Zu speicherndes Trainingsergebnis
     * @return {Promise} Asynchrones Promise-Objekt
    */
    async saveNew(run) {
        return database.runs.add(run);
    }

    /*
     * Bereits vorhandenes Trainingsergebnis aktualisieren. Ein Training sollte
     * folgenden Aufbau erfüllen:
     *
     * {
     *     name: "Name des Trainings",
     *     strecke: "Strecke in Kilometern",
     *     minuten/km: "Minuten pro Kilometer"
     *     art: "Art des Trainings"
     *     dauer: "Dauer des Trainings",
     *     datum: "Datum des Trainings"
     *     beschreibung: "Beschreibung zum Training"
     *     bewertung: "Bewertung des Trainings"
     *     kmPerStd: "Kilometer pro Stunde"
     * }
     *
     * @param  {Object}  run Zu speicherndes Trainingsergebnis
     * @return {Promise} Asynchrones Promise-Objekt
    */
    async update(run) {
        return database.runs.put(run);
    }

    /*
     *Vorhandenes Trainingsergebnis anhand seiner ID löschen.
     *
     *@param {Object} id zu löschende ID
     *@return {Promise} Asynchrones Promise Objekt
    */
    async delete(id) {
        return database.runs.delete(id);
    }

    /*
     *Eine Funktion zum Löschen ALLER Laufergebnisse
     *
     *@return {Promise} Asynchrones Promise-Objekt
    */
    async clear() {
        return database.runs.clear();
    }

    /*
     *Vorhandenes Trainingsergebnis anhand seiner ID auslesen.
     *
     *@param {String} id ID des zu lesenden Objekts
     *@return {Promise} Asynchrones Promise-Objekt mit dem gewünschten Ergebnis
    */
    async getByID(id) {
        return database.runs.get(id);
    }

    /*
     * Hier soll eine Liste mit allen vorhandenen Ergebnissen zurückgeben
     * werden, deren Strecke, Dauer, Minuten / km, Art oder Datum den
     * gesuchten Query enthalten.
     *
     *@param {String} query Suchbegriff
     *@return {Promise} Asynchrones Promise-Objekt mit dem Suchergebnise
    */

    async search(query) {
        //Query-Variable auf Inhalt prüfen
        if (!query)
            query = "";
        query = query.toUpperCase();

        //Ergebnis definieren
        let result = database.runs.filter(run => {
            let name = run.name.toUpperCase();
            let strecke = run.strecke.toUpperCase();
            let dauer = run.dauer.toUpperCase();
            let minutenPerKm = run.minutenPerKm.toUpperCase();
            let art = run.art.toUpperCase();
            let datum = run.datum.toUpperCase();
            return name.search(query) > -1 | strecke.search(query) > -1 |
            dauer.search(query) > -1  | minutenPerKm.search(query) > -1  |
            art.search(query) > -1  | datum.search(query) > -1;
        });

        // Ergebnis der Suche zurückgegeben
        return result.toArray();
    }

}

export default {
    database,
    Runs,
};
