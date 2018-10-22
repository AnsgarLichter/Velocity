"use strict";

import Dexie from "dexie/dist/dexie.js";

//Datenbankdefinition:
//
// ++id --> automatisch hochgezählter Datenbankschlüssel
// Name
// Strecke
// Dauer
// Minuten / km
// Art
// Datum
//
// Folgende Felder sind keine Indexfelder für WHERE-Abfragen,
// daher müssen diese nicht definiert werden:
//  Bewertung
//  Beschreibung
//
//

let database = new Dexie("Velocity");

database.version(1).stores({
    runs: "++id, name, strecke, dauer, minutenPerKm, art, datum",
});

/**
    *Datenbankzugriffsklasse für die einzelnen Ergebnisse. Diese Klasse bietet Methoden,
    *um Ergebnisse zu speichern und danach wieder auszulesen. Im Hintergrund
    *wird hierfür Dexie zur lokalen Speicherung im Browser / auf dem Endgerät benutzt.
    */
class Runs {

    /**
     * Ein neues Ergebnis zu hinterlegen oder ein vorhandenes Ergebnis zu
     * aktualisieren, soll mit Hilfe dieser Methode integriert werden.
     * Ein Ergebnis-Aufbau soll daher folgende Eigenschaften besitzen:
     *
     * {
     *     name: "Name des Trainings",
     *     strecke: "Strecke in Kilometern",
     *     minuten/km: "Minuten pro Kilometer"
     *     dauer: "Dauer des Trainings",
     *     datum: "Datum des Trainings"
     * }
     *
     * @param  {Object}  run Zu speichernder Songtext
     * @return {Promise} Asynchrones Promise-Objekt
    */
    async saveNew(run) {
        return database.runs.add(run);
    }

    /**
     * Bereits vorhandenes Trainings aktualisieren.
     * @param  {Object}  run Zu speichernder Songtext
     * @return {Promise} Asynchrones Promise-Objekt
    */
    async update(run) {
        return database.runs.put(run);
    }

    /**
     *Vorhandenes Ergebnis anhand seiner ID löschen.
     *
     *@param {Object} id zu löschende ID
     *@return {Promise} Asynchrones Promise Objekt
    */
    async delete(id) {
        return database.runs.delete(id);
    }

    /**
     *Eine Funktion zum Löschen ALLER Laufergebnisse
     *@return {Promise} Asynchrones Promise-Objekt
    */
    async clear() {
        return database.runs.clear();
    }

    /**
     *Vorhandenes Ergebnis anhand seiner ID lesen.
     *@param {String} id ID des zu lesenden Objekts
     *@return {Promise} Asynchrones Promise-Objekt mit dem gewünschten Ergebnis
    */
    async getByID(id) {
        return database.runs.get(id);
    }

    /**
     *Liste mit allen vorhandenen Ergebnissen zurückgeben, deren
     *Strecke, Dauer, Minuten / km, Art, Datum den gewünschten weiter
     *enthalten.
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
            return name.search(query) > -1 | strecke.search(query) > -1 | dauer.search(query) > -1  | minutenPerKm.search(query) > -1  | art.search(query) > -1  | datum.search(query) > -1;
        });

        // Suchergebnis zurückgegeben
        return result.toArray();
    }

}

export default {
    database,
    Runs,
};
