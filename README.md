# Haute Wetter Deutschland

Eine einfache Wetter-Website fuer Deutschland. Sie nutzt kostenlose Live-Wetterdaten von Open-Meteo und kann ueber GitHub mit Vercel veroeffentlicht werden.

## So starten Sie die Website auf Ihrem Computer

1. Oeffnen Sie diesen Ordner in VS Code.
2. Installieren Sie die VS-Code-Erweiterung **Live Server**.
3. Klicken Sie mit der rechten Maustaste auf `index.html`.
4. Waehlen Sie **Open with Live Server**.

Sie koennen `index.html` auch direkt im Browser oeffnen. Live Server ist aber besser, weil es eher wie eine echte Website funktioniert.

## Standort-Wetter

Beim ersten Besuch fragt der Browser den Besucher nach Standort-Erlaubnis. Wenn der Besucher zustimmt, zeigt die Website automatisch das Wetter fuer seinen ungefaehren Standort. Wenn der Besucher ablehnt, zeigt die Website Berlin als sichere Standardstadt.

Wichtig: Die Standortabfrage funktioniert auf echten Websites nur mit HTTPS. Vercel stellt HTTPS automatisch bereit, deshalb funktioniert diese Funktion nach der Vercel-Veroeffentlichung richtig.

## So laden Sie die Website zu GitHub hoch

1. Erstellen Sie ein kostenloses GitHub-Konto auf https://github.com/.
2. Erstellen Sie ein neues Repository mit dem Namen `haute-wetter`.
3. Oeffnen Sie in VS Code den Bereich **Source Control**.
4. Waehlen Sie **Initialize Repository**.
5. Schreiben Sie eine Nachricht wie `Erste Wetter Website`.
6. Speichern Sie die Aenderung mit **Commit**.
7. Waehlen Sie **Publish Branch** und verbinden Sie das Projekt mit GitHub.

## So veroeffentlichen Sie die Website mit Vercel

1. Erstellen Sie ein kostenloses Vercel-Konto auf https://vercel.com/.
2. Klicken Sie auf **Add New Project**.
3. Importieren Sie Ihr GitHub-Repository.
4. Lassen Sie das Framework auf **Other**.
5. Lassen Sie die Build-Einstellungen leer.
6. Klicken Sie auf **Deploy**.

## So verbinden Sie Ihre Domain

1. Oeffnen Sie Ihr Projekt in Vercel.
2. Gehen Sie zu **Settings > Domains**.
3. Fuegen Sie `hautewetter.com` oder die exakt richtige Schreibweise Ihrer Domain hinzu.
4. Vercel zeigt Ihnen DNS-Eintraege.
5. Gehen Sie zu dem Anbieter, bei dem Sie die Domain gekauft haben.
6. Tragen Sie dort die DNS-Eintraege von Vercel ein.
7. Warten Sie. Es dauert oft nur ein paar Minuten, manchmal bis zu 24 Stunden.

## Wie diese Website Geld verdienen kann

Bauen Sie zuerst Besucher auf. Hilfreiche Wetterseiten koennen bei Google Besucher gewinnen, wenn sie schnell, nuetzlich und klar auf ein Thema fokussiert sind.

Gute naechste Schritte:

- Erstellen Sie eigene Seiten fuer grosse Staedte, zum Beispiel Wetter Berlin, Wetter Hamburg und Wetter Muenchen.
- Schreiben Sie hilfreiche Artikel, zum Beispiel beste Reisezeit Deutschland, regenreichste Staedte Deutschlands und Weihnachtsmarkt-Wetter.
- Bewerben Sie sich fuer Google AdSense, sobald die Website genug nuetzliche Inhalte und erste Besucher hat.
- Ergaenzen Sie Affiliate-Links fuer Hotels, Reiseversicherungen, Bahntickets, Regenschirme, Jacken und Outdoor-Produkte.
- Nutzen Sie Google Search Console, damit Sie sehen, welche Suchanfragen Besucher bringen.

## Wichtiger Hinweis

Die Wetterdaten kommen von Open-Meteo. Zeigen Sie die Datenquelle immer an, wenn Sie die kostenlose API nutzen.
