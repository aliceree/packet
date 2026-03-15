# Internet Speed

Tento projekt simuluje "rychlost internetu" jako vizuální hru, kde se po klikání zvyšuje hodnota přenosu i rychlost rotace objektu po kružnici.

## Maximální dosažená rychlost

Nejvyšší dosažitelná rychlost je aktuálně **150 Mb/s**. Té lze dosáhnout při kombinaci:

- technologie **5G**
- signál **3 čárky**

Tato hranice vychází přímo z modelu ve [`script.js`](/Users/borovickova/Library/Mobile%20Documents/com~apple~CloudDocs/Projects/Apps/Packet/internet%20speed/script.js), kde je rychlost mapovaná podle typu připojení a síly signálu.

## Zamyšlení nad vizuálem

Vizuál stojí na kontrastu mezi tmavým futuristickým pozadím a výrazným světlým akcentem. Střed obrazovky patří orbitu, takže uživatel okamžitě chápe, kam se má soustředit.

Tlačítka jsou řešená jako kompaktní kapsle se skleněným efektem, jemným blurrem a zaoblením. Působí jako ovládací panel spíš než klasické formulářové prvky, což sedí ke stylizované simulaci. Dobře funguje i to, že tlačítko signálu je ikonické a tlačítko technologie textové, protože každé komunikuje jiný typ informace.

Text je záměrně úsporný a technický. Krátké labely jako `SPEED` a `TECH` podporují dashboardový charakter rozhraní. Vedle toho instrukce vpravo funguje jako lehký onboarding, i když jazykově se zatím míchá čeština a angličtina, takže by stálo za zvážení sjednocení.

## Vyladění rychlosti točení s čísly

Rotace není navázaná lineárně jen na kliknutí, ale na průběžně počítanou hodnotu `currentCps` a z ní odvozenou rychlost. Díky tomu pohyb nepůsobí trhaně a lépe odpovídá číslu, které se zobrazuje u `Mb/s`.

Důležité ladicí body:

- `absoluteMaxSpeed: 150` určuje referenční strop celé simulace
- `minRotationSpeed: 0.28` zajišťuje, že pohyb začne čitelně už při nižších rychlostech
- `maxRotationSpeed: 12.5` omezuje horní hranici rotace, aby animace nebyla nečitelná
- `speedCurveExponent: 0.32` zjemňuje převod mezi rychlostí v číslech a vizuálním otáčením
- `accelerationSmoothing: 0.2` a `decelerationSmoothing: 0.12` drží plynulé rozjíždění i zpomalování

Prakticky to znamená, že i malé změny v nižších rychlostech jsou vidět, ale při vysokých hodnotách se rotace neutrhne do nepoužitelného extrému. To je dobrý kompromis mezi čitelností čísel a pocitem zrychlení.
