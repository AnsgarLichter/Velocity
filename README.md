Projekt im Rahmen der Vorlesung Web-Programmierung "Veloctiy"
===============================

Kurzbeschreibung
----------------

Dies ist eine Browser App, die im Rahmen des Studiums der Wirtschaftsinformatik
in der Vorlesung Webprogrammierung entwickelt wurde.
Die Anwendung läuft läuft ohne einen Server im Hintergrund komplett im Browser.
Es handelt sich dabei um eine sogenannte Single Page App, da die App nur einmal
durch Aufrufen der HTML-Datei gestartet und dann bis zum Verlassen
der App nicht wieder neugeladen.


Verwendete Technologien
-----------------------

Die App nutzt den Node Package Manager npm als Paketverwaltung. Auf diese
Weise werden der Application Bundler ParcelJS sowie eine Hand voll externe
Bibliotheken für die Anwendung installiert. Jedoch wird kein übergreifendes
Framework wie Angular oder React verwendet.

Folgende Entwicklungswerkzeuge kommen stattdessen zum Einsatz:

 * [Atom:](https://atom.io/) Spezieller Texteditor für Webentwickler und Programmierer
 * [git:](https://git-scm.com/") Versionsverwaltung zur gemeinsamen Arbeit am Quellcode
 * [npm:](https://nodejs.org/") Paketverwaltung zum automatischen Download abhängiger Bibliotheken
 * [Parcel:](https://parceljs.org/") Web Application Bundler und Entwicklungsserver

Zusätzlich werden folgende Bibliotheken genutzt:

 * [Navigo:](https://github.com/krasimir/navigo) Single Page Router zur Vereinfachung der Navigation innerhalb der App

UI-Skizzen und Screenshots
--------------------------

Die App richtet sich an Läufer, die ihre Laufergebnisse dokumentieren und
verwalten möchten. Dadurch erlangen sie eine Übersicht der vergangenen Trainingsleistungen.
Zum Start der Anwendung ist es notwendig, dass der Projektordner lokal abgespeichert wird.
In der Eingabeaufforderung muss danach auf das Projektverzeichnis "Velocity", in dem
die Dokumente abgelegt sind, gewechselt wechseln.
Sobald der Dateipfad der Eingabeaufforderung korrekt angezeigt wird,
kann mit dem Befehl "npm run start" die Anwendung im Browser gestartet werden.



<table style="max-width: 100%;">
    <tr>
        <td>
            <img src="mockup1.png" style="display: block; width: 100%;" />
        </td>
        <td>
            <img src="mockup2.png" style="display: block; width: 100%;" />
        </td>
        <td>
            <img src="mockup3.png" style="display: block; width: 100%;" />
        </td>
    </tr>
    <tr>
        <td>
            Mobile Darstellung
        </td>
        <td>
            Übersicht der Songtexte
        </td>
        <td>
            Anzeige eines Songtexts
        </td>
    </tr>
</table>

Copyright
---------
