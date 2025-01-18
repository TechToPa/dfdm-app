# Charakterbogen-App für "Das Feuer des Mondes"

<img src="https://dasfeuerdesmondes.de/wp-content/uploads/2017/11/Cover-2.-Auflage-201x300.jpg" alt="Das Feuer des Mondes" width="300"/>

Willkommen zur offiziellen Charakterbogen-App für das Spielbuch **"Das Feuer des Mondes"** von Christian und Florian Sussner. Diese App wurde speziell entwickelt, um das Erlebnis mit dem Spielbuch zu unterstützen und zu erweitern. Sie bietet umfangreiche Funktionen, um die Verwaltung deines Charakters, deiner Ausrüstung und deines Fortschritts zu erleichtern.

Homepage des Spiels: **[www.dasfeuerdesmondes.de](http://www.dasfeuerdesmondes.de)**

---

# App über folgenden Link starten

**[START!](https://rawcdn.githack.com/TechToPa/dfdm-app/master/build/index.html)**

## Funktionen der App

### 1. **Charakterbogen**
- Eingabe des Charakternamens.
- Verwaltung von Lebensenergie, Agilität und Menschlichkeit.
- Automatische Speicherung deines Fortschritts im lokalen Speicher (Local Storage).
- Anpassung der maximalen Lebensenergie und der aktuellen Lebenspunkte.

### 2. **Rucksack**
- Hinzufügen und Entfernen von Gegenständen.
- Verwaltung von Gegenständen mit Effekten/Werten.
- Limitierung auf maximal 6 Gegenstände im Rucksack.

### 3. **Ausrüstung**
- Verwaltung der aktiven Ausrüstung (Waffe, Schild, Körper, Kopf, Hände, Ringe, Amulett, und zusätzliche Slots).
- Anpassung von Schaden und Rüstung für jeden Ausrüstungsgegenstand.
- Anzeige der Gesamtwerte für Schaden und Rüstung.

### 4. **Gold-Management**
- Hinzufügen und Entfernen von Gold in flexiblen Schritten.
- Direkte Anpassung des Goldwertes durch Eingabe.

### 5. **Kampfsystem**
- Eingabe der Kampfkraft, des Schadens, der Rüstung und der Lebensenergie des Gegners.
- Automatischer Ablauf von Kämpfen mit Würfelwürfen und Berechnung von Schaden.
- Anzeige eines detaillierten Kampfprotokolls.

### 6. **Würfelsystem**
- Würfelfunktion mit zwei sechsseitigen Würfeln.
- Animierte Würfelwürfe mit realistischen Ergebnissen.
- Würfelergebnisse werden in Form von Würfelsymbolen (⚀, ⚁, ⚂, ⚃, ⚄, ⚅) angezeigt.

### 7. **Zusätzliche Funktionen**
- Reset-Button, um den Charakterbogen vollständig zurückzusetzen.
- Fortschrittsspeicherung in Local Storage zur automatischen Wiederherstellung der Daten.

---

## Benutzeranleitung

### **Einfach über den Link oben öffnen und loslegen oder...**

### **Installation**
1. Lade das Repository herunter oder klone es:
   ```bash
   git clone https://github.com/dein-benutzername/charakterbogen-feuer-des-mondes.git
   ```
2. Navigiere in das Verzeichnis:
   ```bash
   cd charakterbogen-feuer-des-mondes
   ```
3. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```
4. Starte die App:
   ```bash
   npm start
   ```
5. Öffne deinen Browser und gehe zu `http://localhost:3000`, um die App zu nutzen.

---

### **Verwendung**

#### **Charakterbogen**
1. Gib den Namen deines Charakters in das Namensfeld ein.
2. Passe die Lebensenergie (maximal und aktuell), Agilität und Menschlichkeit nach Bedarf an.
3. Deine Eingaben werden automatisch gespeichert und beim nächsten Öffnen der App wiederhergestellt.

#### **Rucksack**
1. Füge neue Gegenstände hinzu, indem du den Namen und den Effekt des Gegenstands eingibst und auf das `+`-Symbol klickst.
2. Entferne Gegenstände aus dem Rucksack, indem du auf das `×`-Symbol neben dem Gegenstand klickst.
3. Hinweis: Der Rucksack kann maximal 6 Gegenstände enthalten.

#### **Ausrüstung**
1. Wähle die Ausrüstungsteile aus (z. B. Waffe, Schild, Ringe) und gib deren Namen, Schaden und Rüstung ein.
2. Passe die zusätzlichen Slots an, um weitere Gegenstände mit Schaden und Rüstung hinzuzufügen.
3. Die Gesamtsummen für Schaden und Rüstung werden automatisch berechnet und angezeigt.

#### **Gold**
1. Passe den Goldbetrag durch direkte Eingabe oder über die Buttons an (`+/- 1`, `+/- 5`, `+/- 10`, `+/- 20`, `+50`).

#### **Lebensenergie**
1. Reduziere oder erhöhe die Lebensenergie durch Buttons (`+/- 1`, `+/- 5`, `+/- 10`).
2. Setze die Lebensenergie auf das Maximum, indem du auf `voll` klickst.

#### **Kampf**
1. Gib die Werte des Gegners ein (Kampfkraft, Schaden, Rüstung, Lebensenergie).
2. Klicke auf `Kampf!`, um eine Runde zu starten.
3. Lies die Ergebnisse im Kampfprotokoll nach.
4. Beende den Kampf oder starte weitere Runden.

#### **Würfeln**
1. Klicke auf `Würfeln!`, um zwei sechsseitige Würfel zu werfen.
2. Die Würfelergebnisse werden animiert angezeigt und anschließend als Symbole dargestellt (⚀, ⚁, ⚂, ⚃, ⚄, ⚅).

#### **Reset**
1. Klicke auf `Reset`, um alle Daten zurückzusetzen und den Charakterbogen neu zu starten.

---

## Anforderungen zum lebst hosten
- Node.js und npm müssen installiert sein.
- Ein moderner Browser wie Chrome, Firefox oder Edge wird empfohlen.

---

## Homepage des Spiels
Weitere Informationen zu **"Das Feuer des Mondes"** findest du auf der offiziellen Homepage:  
**[www.dasfeuerdesmondes.de](http://www.dasfeuerdesmondes.de)**

---

## Lizenz
Dieses Projekt wurde für das Spielbuch **"Das Feuer des Mondes"** erstellt. Alle Rechte am Buch und den Inhalten liegen bei den Autoren **Christian und Florian Sussner**. Die App ist ein Fan-Projekt und dient der Unterstützung beim Spielen des Buches unterwegs.

Viel Spaß beim Spielen von **"Das Feuer des Mondes"** und mit der App! 🐉🌕
