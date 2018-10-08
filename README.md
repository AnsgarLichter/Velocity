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

Die App richtet sich an Musiker, die anhand eines Lead Sheets neue Lieder
üben oder diese auf der Bühne vortragen wollen. Hierfür bietet sie eine
einfache Verwaltung von Songtexten mit der Möglichkeit, neue Texte online
zu suchen und der eigenen Sammlung hinzuzufügen.


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

Dieses Projekt ist lizenziert unter
[_Creative Commons Namensnennung 4.0 International_](http://creativecommons.org/licenses/by/4.0/)

© 2018 Toni Coric, Patrick Fichtner, Ansagar Lichter <br/>
