# Packet

## Koncept
`Packet` je singleplayer digitální výuková hra pro 15leté žáky 1. ročníku střední umělecké školy. Hráč přenáší kreativní obsah přes internetovou síť složenou z klientů, routerů, serverů a tras. Hra učí, že internet není přímé spojení, ale síť alternativních cest, po kterých se data posílají po menších částech.

Hráč neovládá jednotlivé pakety ručně. Staví síť, upravuje spojení, reaguje na problémy a sleduje, jak se pakety automaticky směrují podle aktuální situace v síti. Úspěch nezajišťuje jedna nejkratší cesta, ale chytré rozložení tras, záložní spojení a schopnost reagovat na ztráty.

## Výukové cíle
- pochopit rozdíl mezi klientem, routerem a serverem
- pochopit, že soubor se přenáší po částech jako pakety
- vidět, že různé pakety mohou jet různými cestami
- pochopit, že pakety mohou dorazit se zpožděním nebo v jiném pořadí
- zažít, že výpadek jedné cesty nemusí znamenat konec přenosu
- pochopit princip opětovného odeslání jen chybějící části
- pochopit, že redundance zvyšuje spolehlivost sítě

## Obsah přenosu
Ve hře existují pouze tři typy souborů:
- `hudební smyčka`
- `krátká animace`
- `fotografie`

Typ souboru mění hlavně vizuální odměnu po úspěšném doručení. Samotná pravidla přenosu zůstávají stejná.

## Podoba paketu
Každý paket zobrazuje pouze tři informace:
- `zdroj`
- `cíl`
- `pořadí/množství`, například `1/3`, `2/3`, `3/3`

Příklad zápisu na paketu:
`Ateliér -> Galerie | 2/3`

## Herní smyčka
1. Hráč dostane zadání mise: co se má přenést a mezi kterými body.
2. Hráč postaví nebo upraví síť z klientů, routerů, serverů a tras.
3. Hráč spustí přenos.
4. Hra rozdělí soubor na pakety a odešle je do sítě.
5. Během přenosu vznikají síťové události.
6. Hráč reaguje přesměrováním, budováním záložních cest nebo opětovným odesláním chybějících paketů.
7. Po doručení všech částí se obsah složí v cíli a přehraje se krátká vizuální odměna.

## Akce hráče
- `Položit spojení`
  - vytvoří novou trasu mezi dvěma uzly
- `Přidat router`
  - vloží do sítě nový přestupní bod
- `Přesměrovat trasu`
  - změní tok paketů na jinou dostupnou větev
- `Otevřít záložní cestu`
  - aktivuje alternativní trasu pro případ zahlcení nebo výpadku
- `Znovu odeslat chybějící paket`
  - odešle pouze ten paket, který se ztratil nebo nedorazil
- `Spustit přenos`
  - pošle soubor do sítě a ukáže chování celé mapy

## Chování sítě
### Uzly
- `klient`
  - místo, odkud se odesílá soubor
- `router`
  - uzel, který předává pakety dál
- `server`
  - cílové místo, kam mají pakety dorazit

### Trasy
- každá trasa spojuje dva uzly
- trasa může být běžná, přetížená nebo nefunkční
- delší cesta může být výhodnější než kratší, pokud je kratší větev zahlcená

### Automatické směrování
- pakety se po spuštění přenosu pohybují automaticky
- routery preferují dostupnou trasu
- pokud je větev zablokovaná nebo přetížená, hráč musí síť upravit, jinak se přenos zpomalí nebo zastaví

## Síťové události
Ve hře se používají jen tyto čtyři události:

### `ucpaná trasa`
- spojení zůstává funkční, ale je pomalé
- pakety touto větví projdou později
- krátká cesta může být horší než delší alternativní větev

### `výpadek uzlu`
- router nebo část sítě přestane fungovat
- pakety musejí být přesměrovány jinudy
- pokud neexistuje záložní větev, přenos se zastaví

### `ztracený paket`
- konkrétní paket po cestě zmizí
- v cíli tak zůstane mezera, například dorazí `1/3` a `3/3`, ale `2/3` chybí
- hráč musí odeslat jen chybějící část

### `zpoždění`
- paket zůstane na trase déle než ostatní
- pakety mohou dorazit ve špatném pořadí
- soubor se složí až po doručení všech částí

## Stav mise
### Podmínky vítězství
- všechny pakety dorazí do cíle
- u cíle jsou všechny části kompletní
- chybějící pakety byly případně doposlány
- soubor se úspěšně složí

### Stav selhání
- přenos zůstane bez dostupné cesty
- hráč nevyřeší výpadek v časovém limitu mise
- chybějící paket není znovu odeslán a mise zůstane nekompletní

## Uživatelské rozhraní
Na obrazovce musí být stále vidět:
- klienti, routery a servery
- aktivní spoje mezi uzly
- přetížené nebo poškozené trasy
- právě se pohybující pakety
- seznam vytvořených paketů
- seznam doručených paketů
- seznam chybějících paketů
- tlačítko nebo výzva pro opětovné odeslání chybějící části

### Vizuální zásady
- klient, router a server musí mít odlišnou siluetu i barvu
- paket má být malý, pohyblivý, výrazný objekt s čitelným štítkem
- poškozené a přetížené cesty musí být na první pohled odlišené
- rozhraní má působit stylizovaně a výtvarně, ne jako realistický síťový software

## Vizuální odměny po dokončení přenosu
### `fotografie`
- obraz se doostří po částech podle doručených paketů

### `krátká animace`
- po doručení všech částí se odemknou a přehrají všechny snímky

### `hudební smyčka`
- po doručení všech částí se spustí kompletní zvuková smyčka

## Level design
Každý level zavádí jeden nový princip. Obtížnost roste počtem uzlů, počtem tras, kombinací událostí a množstvím současně přenášených dat.

### Level 1: Přímé spojení nestačí
#### Cíl
Postavit základní síť z klienta přes router k serveru a odeslat první soubor.

#### Výukový princip
Soubor se neposílá jako jeden celek, ale jako několik paketů.

#### Průběh
- hráč propojí `klient -> router -> server`
- odešle jednoduchou `fotografii`
- fotografie se rozdělí na 2 až 3 pakety
- bez výpadků a bez časového tlaku

#### Co si má hráč odnést
- rozdíl mezi klientem, routerem a serverem
- základní představu o paketu

### Level 2: Jedna cesta je risk
#### Cíl
Přenést soubor ve chvíli, kdy existují dvě různé cesty a jedna je ucpaná.

#### Výukový princip
Nejkratší cesta nemusí být nejlepší.

#### Průběh
- mapa nabídne dvě možné větve
- kratší trasa dostane událost `ucpaná trasa`
- hráč musí použít delší, ale rychlejší alternativu
- přenáší se `hudební smyčka`

#### Co si má hráč odnést
- význam přesměrování
- důležitost volby cesty podle situace

### Level 3: Kabel překousnutý zvířetem
#### Cíl
Dokončit přenos po náhlém přerušení části sítě.

#### Výukový princip
Internet je odolný díky alternativním cestám.

#### Průběh
- během aktivního přenosu nastane `výpadek uzlu`
- hlavní větev přestane fungovat
- hráč musí rychle položit nové spojení nebo otevřít záložní cestu
- přenáší se `fotografie`

#### Co si má hráč odnést
- že porucha jedné části sítě nemusí zničit celý přenos
- proč se vyplatí budovat redundanci

### Level 4: Ztracený paket
#### Cíl
Doplnit jen tu část souboru, která se po cestě ztratila.

#### Výukový princip
Neposílá se vše od začátku, ale pouze chybějící část.

#### Průběh
- soubor se rozdělí na 3 pakety
- jeden z nich dostane událost `ztracený paket`
- do cíle dorazí jen dvě části
- hráč musí znovu odeslat chybějící paket
- přenáší se `krátká animace`

#### Co si má hráč odnést
- že úplný přenos znamená mít všechny části
- princip doposlání chybějícího paketu

### Level 5: Všechno dorazí, ale ne ve správný čas
#### Cíl
Dokončit přenos, ve kterém části souboru dorazí ve špatném pořadí.

#### Výukový princip
Pakety mohou dorazit později a jinak seřazené.

#### Průběh
- více tras má různé časy průchodu
- jeden paket dostane událost `zpoždění`
- do cíle dorazí například `2/3`, `1/3`, `3/3`
- soubor se složí až po doručení všech částí
- přenáší se `hudební smyčka`

#### Co si má hráč odnést
- že pořadí doručení nemusí odpovídat pořadí odeslání
- že úplnost je důležitější než okamžité pořadí v síti

### Level 6: Přetížená síť
#### Cíl
Navrhnout síť, která zvládne více přenosů najednou.

#### Výukový princip
Více cest zvyšuje stabilitu celé sítě.

#### Průběh
- v mapě je více klientů a více serverů
- běží několik přenosů současně
- častěji vzniká `ucpaná trasa`
- hráč musí rozmístit více routerů a přidat záložní větve

#### Co si má hráč odnést
- že spolehlivost roste s počtem alternativ
- že přetížení je problém celé sítě, ne jednoho paketu

### Level 7: Galerie online
#### Cíl
Dokončit komplexní misi, ve které je třeba doručit více kreativních souborů přes jednu síť.

#### Výukový princip
Všechny dříve naučené principy fungují dohromady.

#### Průběh
- hráč musí přenést `fotografii`, `krátkou animaci` a `hudební smyčku`
- v mapě vznikají kombinace událostí `ucpaná trasa`, `výpadek uzlu`, `ztracený paket` a `zpoždění`
- k úspěchu je potřeba přesměrování, záložní cesty a doposlání chybějících částí

#### Co si má hráč odnést
- že internet funguje spolehlivě právě proto, že počítá s chybami
- že síť není jedna přímá trubka, ale adaptivní struktura

## Pravidla obtížnosti
- vyšší levely přidávají více uzlů
- vyšší levely přidávají více tras
- vyšší levely rozšiřují počet současně přenášených paketů
- vyšší levely kombinují více událostí v jedné misi
- nepřidávají se specializované routery ani mechaniky kompatibility protokolů

## Ověření návrhu
- Level 1 musí naučit dělení souboru na pakety bez zbytečného tlaku
- Level 2 musí ukázat, že delší cesta může být lepší než kratší
- Level 3 musí být řešitelný pouze přes záložní nebo nově otevřenou trasu
- Level 4 musí vyžadovat opětovné odeslání pouze chybějícího paketu
- Level 5 musí ukázat nesprávné pořadí doručení, ale správné dokončení po doplnění všech částí
- Level 6 musí odměnit síť s více alternativními větvemi
- Level 7 musí ověřit, že hráč chápe redundanci, přesměrování a doposílání
