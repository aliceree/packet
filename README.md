The information used in this game comes from Khan Academy, specifically from this lesson: 'https://www.youtube.com/watch?v=aD_yi5VjF78'.

# Video transcript

Sedm, šest, pět, čtyři, tři, dva, jedna.

(úvodní znělka)

Ahoj, jmenuji se Lynn Root.
Jsem softwarová inženýrka ve firmě Spotify.
Přiznám se, že i já beru spolehlivost internetu jako samozřejmost.
Objem dat kolujících přes internet je ohromující.
Ale jak je možné, že každý kus informace je k vám doručen spolehlivě?

Řekněme, že si chcete pustit písničku ze Spotify.
Zdá se, že váš počítač se připojí přímo k serverům Spotify,
a Spotify vám pošle písničku přímou cestou.
Ve skutečnosti takhle internet nefunguje.
Kdyby byl internet tvořen pomocí přímých připojení,
bylo by nemožné udržet všechno v chodu,
obzvlášť když se připojí milióny uživatelů,
a navíc nemáme záruku, že každý drát a počítač běží nepřetržitě.
Místo toho informace cestují přes internet v mnohem otevřenějším duchu.

(Vint Cerf)
Před mnoha, mnoha lety, na počátku sedmdesátých let,
můj partner, Bob Kahn, se mnou začal pracovat
na návrhu toho, čemu dnes říkáme internet.
Bob a já jsme měli možnost a zodpovědnost
navrhnout protokoly a architekturu internetu.
S Bobem jsme se podíleli na růstu a evoluci internetu
po celou dobu až k dnešnímu dni.

Způsob, jakým se informace dostávají
z jednoho počítače do druhého, je velmi zajímavý.
Nemusí sledovat pevně danou cestu.
Jejich cesta se může změnit během komunikace počítač–počítač.
Informace se na internetu dostává z jednoho počítače na druhý
v takzvaném „informačním paketu“.

Pakety na internetu cestují z místa na místo
podobně jako byste se vy mohli dostat z místa na místo autem.
V závislosti na dopravních zácpách nebo stavu vozovky
si můžete vybrat nebo být přinuceni zvolit jinou cestu,
abyste se dostali na stejné místo
při každé vaší cestě.

Stejně jako můžete v autě převážet spoustu věcí,
tak spousta druhů digitálních informací může být přenesena v IP paketech,
ale vše má své hranice.
Co kdybyste například potřebovali přesunout raketoplán
z výrobní linky na místo startu?
Raketoplán se nevejde do jednoho auta, takže se musí rozebrat na součástky
a převézt pomocí několika náklaďáků.
Každý z nich může jet jinou cestou a dorazit do cíle v jiný čas,
ale jakmile jsou všechny díly na místě,
můžete je znovu sestavit v raketoplán připravený k odletu.

Na internetu to funguje podobně.
Velmi velký obrázek,
který chcete poslat příteli nebo nahrát na stránky,
se skládá z desítek miliard jedniček a nul,
což je příliš mnoho dat na jeden paket.
Ale protože mluvíme o datech v počítači,
počítač odesílající obrázek může data rychle rozebrat
na stovky až tisíce menších částí,
nazývaných „pakety“.

Na rozdíl od aut a náklaďáků pakety nemají řidiče
a nevybírají si cestu.
Každý paket má internetovou adresu, odkud vyrazil a kam míří.
Speciální počítače na internetu,
zvané „routery“, slouží jako kontroloři dopravy,
udržující plynulý chod sítě.
Pokud je jedna cesta ucpaná,
jednotlivé pakety mohou skrz internet cestovat jinými cestami
a mohou dorazit v trochu jiném čase,
ale dokonce i v jiném pořadí.

[Lynn]
Pojďme si promluvit o tom, jak to funguje.
V rámci internetového protokolu si každý router udržuje přehled
o několika cestách pro posílání paketů
a vybere tu „nejdostupnější“ cestu
pro každý kousek informace podle cílové IP adresy pro paket.
„Nejdostupnější“ v tomto případě nemá nic společného s cenou,
ale s časem a jinými faktory,
například vyhláškami a vztahy mezi společnostmi.
Ta nejvíc přímá cesta nemusí nutně být ta nejlepší.

Možnost volit mezi cestami dělá síť tolerantní vůči chybám,
což znamená, že síť může posílat pakety,
i když se něco velmi pokazí.
Tohle je jeden ze základních principů internetu – spolehlivost.

Co když si vyžádáte nějaká data,
ale ne všechna jsou doručena?
Řekněme, že si chcete pustit písničku.
Jak si můžete být na 100 % jistí, že všechna data budou doručena,
aby písnička hrála bez problémů?

Představuji vám vašeho nového nejlepšího přítele:
TCP – Transmission Control Protocol.
TCP se stará o odesílání a přijímání dat ve formě paketů.
Můžete si to představit jako zásilku se zárukou.
Když si na vašem zařízení vyžádáte písničku,
Spotify ji pošle rozdělenou do mnoha malých paketů.
Když vaše pakety dorazí, TCP udělá inventuru
a zpátky pošle potvrzení o přijatých paketech.
Pokud všechny pakety dorazily, TCP zásilku „podepíše“ a je hotovo.

(znělka)

Pokud TCP zjistí, že nějaké pakety chybí, nepodepíše.
V opačném případě by vaše písnička nezněla tak dobře
anebo by její části mohly chybět.
Každý chybějící nebo neúplný paket Spotify odešle znovu.
Jakmile TCP ověří zásilku všech paketů pro vaši písničku,
písnička se přehraje.

(znělka)

Skvělá vlastnost TCP a routerů je jejich škálovatelnost.
Mohou pracovat s osmi nebo s osmi miliardami zařízení.
Díky principům tolerance chyb a redundance
čím více routerů přidáme, tím bude internet spolehlivější.
Další skvělá věc je, že můžeme rozsah internetu zvětšit
bez jakéhokoliv přerušení.

(Vint)
Internet je tvořen stovkami tisíc sítí
a miliardami fyzicky propojených počítačů a zařízení.
Tyto rozdílné systémy, které tvoří internet,
se vzájemně propojují, komunikují a spolupracují
díky dohodnutým standardům pro posílání dat přes internet.
Výpočetní přístroje či routery na internetu
napomáhají všem paketům najít cestu k cíli,
kde jsou, pokud je to nutné, poskládány do správného pořadí.

Toto probíhá miliardkrát za den,
ať už posíláte emaily, navštěvujete webové stránky,
máte videohovor, používáte mobilní aplikaci,
či když senzory nebo zařízení na internetu spolu komunikují.

# game notes

## Hlavní myšlenka
Internet nefunguje jako jedno přímé spojení mezi dvěma body.
Informace se dělí na malé části, putují sítí různými cestami a v cíli se znovu skládají dohromady.

---

## 1. Internet není přímé spojení
Když si pustíme hudbu nebo otevřeme web, data nejdou jedním přímým kabelem od uživatele k serveru.
Putují přes síť mnoha propojených zařízení.

### Pro hru
- síť má mít více uzlů a více možných cest
- hráč nemá jen jednu přímou trasu k cíli

---

## 2. Data se dělí na pakety
Velké soubory se neposílají najednou, ale rozdělené na malé části – pakety.

### Pro hru
- jeden soubor nebo zpráva se rozdělí na více dílků
- hráč musí doručit všechny části

---

## 3. Každý paket má adresu
Každý paket obsahuje informaci, odkud přišel a kam má dojít.

### Pro hru
- každý dílek může mít označení startu a cíle
- bez adresy by paket nešel správně směrovat

---

## 4. Routery řídí provoz
Routery jsou zařízení, která rozhodují, kudy paket půjde dál.

### Pro hru
- router může být uzel, který přeposílá balíčky
- hráč nebo systém vybírá další trasu podle situace v síti

---

## 5. Pakety mohou cestovat různými cestami
Jednotlivé části jedné zprávy nemusí jet společně.
Každý paket může dorazit jinou trasou.

### Pro hru
- různé pakety se mohou pohybovat po různých větvích mapy
- síť má nabídnout alternativní trasy

---

## 6. Pakety mohou dorazit v jiném čase a pořadí
Protože jedou různými cestami, nepřijdou vždy najednou ani správně seřazené.

### Pro hru
- některé pakety přijdou dříve, jiné později
- hráč musí výsledná data znovu sestavit ve správném pořadí

---

## 7. Nejkratší cesta nemusí být nejlepší
Router nevolí nutně nejpřímější cestu, ale tu nejdostupnější podle situace.

### Pro hru
- krátká cesta může být přetížená nebo uzavřená
- delší cesta může být ve výsledku lepší

---

## 8. Internet je odolný vůči chybám
Když se jedna cesta porouchá nebo ucpe, pakety mohou jet jinudy.

### Pro hru
- některé cesty mohou během hry vypadnout
- hráč musí rychle přesměrovat pakety na jinou trasu

---

## 9. Spolehlivost vzniká díky alternativám
Internet není spolehlivý proto, že se nic nekazí.
Je spolehlivý proto, že má náhradní možnosti.

### Pro hru
- síť s více cestami je stabilnější než síť s jedinou trasou
- hráč může budovat nebo odemykat záložní cesty

---

## 10. TCP kontroluje, zda dorazilo všechno
TCP je protokol, který kontroluje úplnost doručení.

### Pro hru
- po doručení probíhá kontrola všech částí
- nestačí doručit jen část zprávy

---

## 11. Potvrzení přijetí
Příjemce posílá potvrzení, které pakety dorazily.

### Pro hru
- po doručení hráč získá potvrzení jen za skutečně doručené části
- bez potvrzení se přenos nepovažuje za hotový

---

## 12. Ztracené pakety se posílají znovu
Když nějaký paket chybí nebo je neúplný, odešle se znovu.

### Pro hru
- při ztrátě balíčku se neposílá všechno od začátku
- doposílá se jen chybějící část

---

## 13. V cíli se data znovu skládají
Po doručení všech paketů je potřeba je seřadit a složit do původní podoby.

### Pro hru
- závěrečná fáze může být skládání zprávy, obrázku nebo písničky z dílků
- hráč musí mít všechny části i správné pořadí

---

## 14. Internet je škálovatelný
Stejné principy fungují pro malý i obrovský počet zařízení.

### Pro hru
- vyšší úrovně mohou mít více uzlů, více paketů a složitější síť
- hra může postupně růst bez změny základních pravidel

---

## 15. Redundance zvyšuje spolehlivost
Více routerů a více cest znamená větší šanci, že komunikace uspěje.

### Pro hru
- hráč může získávat bonus za síť s více alternativami
- jediná cesta je risk, více cest je bezpečnější řešení

---

## 16. Internet funguje díky standardům
Různé sítě a zařízení spolu komunikují proto, že používají společná pravidla.

### Pro hru
- různé prvky sítě mohou spolupracovat jen tehdy, když jsou kompatibilní
- může se objevit mechanika správného „nastavení protokolu“

---

# Klíčové principy, které se vyplatí ve hře ukázat
- dělení dat na pakety
- směrování paketů přes routery
- více možných cest
- zpoždění a jiné pořadí doručení
- výpadek cesty a přesměrování
- potvrzení doručení
- opětovné odeslání ztracených paketů
- skládání dat v cíli
- spolehlivost díky redundanci

---

# Jednoduché herní jádro
Hráč posílá zprávu nebo soubor přes síť.
Soubor se rozdělí na pakety.
Pakety procházejí přes routery různými cestami.
Některé cesty mohou být zablokované nebo pomalé.
Některé pakety se ztratí.
Hráč musí zajistit jejich opětovné odeslání.
Po doručení všech částí se data složí ve správném pořadí.

---

# Možný vzdělávací cíl hry
Žáci si na vlastní zkušenosti uvědomí, že internet:
- není jedna přímá cesta
- funguje díky rozdělení dat na pakety
- využívá směrování a alternativní trasy
- počítá s chybami a umí je řešit
- je spolehlivý díky kontrole, potvrzení a opakovanému odeslání
