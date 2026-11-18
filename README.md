# Slabikář – vláček s písmenky

Hra na čtení pro předškoláky (4–7 let): hlásky, slabiky a slova jako ve slabikáři.
Otevři `index.html`, nebo stránku na GitHub Pages. Na tabletu ji přidej na plochu, pak jede přes celou obrazovku a i bez internetu.

## Proč se k tomu dítě vrací

- **Vláček jede po trati.** Každá stanice je jedno nové písmenko v pořadí slabikáře (A E I O U, M, L, P, S, T, J, V …). Trať vede šesti zeměmi: louka, les, farma, hory, moře, vesmír.
- **Jedna jízda = krátké kolo úkolů** (6–10, asi 3–5 minut). Za každou jízdu je dárek: samolepka do vagónku, nebo čepice pro kamaráda.
- **Ve stanici se vylíhne kamarád.** Dítě ťuká na vajíčko, vyleze nikdy předtím neviděný tvoreček a dítě mu **přečte a vybere jméno** ze slabik, které umí (LO-MI, PA-TI-ME …). Kamarádi pak jezdí ve vagóncích, vykukují v hrách a dají se šťouchat.
- **Zlaté vajíčko** se snese jednou denně a vylíhne se až zítra, takže je důvod přijít znovu.
- **Hvězdičky a medaile** za správné odpovědi napoprvé. Chyba nic nebere: po druhém pokusu sovička ukáže řešení.
- Živá krajina se střídáním dne a noci; sluníčko, mraky, stromy i vláček reagují na ťuknutí.

## Hry

Balónky (první a poslední hláska) · Kdo vykoukl? (chytání písmenek) · Vytleskej (slabiky) · Bubliny (slyšíš slabiku) · Slož slabiku · Slovní vláček (slovo ze slabik) · Přečti (slovo → obrázek) · Najdi slovo (obrázek → slovo) · Pexeso (velké a malé) · Maluj písmenko (vybarvi prstem) · Řekni to (čtení nahlas, kamarád zopakuje legračním hlasem) · představení nového písmenka.

Slova (332, s obrázky) se nabízejí jen z písmenek, která dítě zná. Co nejde, se objevuje častěji, nové písmenko jízdy má přednost.

## Pro rodiče (ozubené kolečko, odemyká se příkladem)

- Písmenka, která dítě zná (přesune vláček), délka jízdy, počet jízd na písmenko, denní limit jízd, velká/malá písmena.
- Statistika: co ještě nejde, poslední jízdy.
- **Vlastní hlas:** Nahrávací studio nahrává jedno po druhém (hlásky, slabiky, slova, věty sovičky), samo ořízne ticho a srovná hlasitost. Co chybí, dořekne předčítání prohlížeče.
- **Hlas na víc zařízení:** „Uložit hlas.json“ → nahraj soubor do kořene webu vedle `index.html` a každé zařízení si ho při spuštění stáhne samo.

## Technika

Čisté HTML/CSS/JS bez sestavování. Grafika je ručně psané SVG, zvukové efekty se syntetizují (Web Audio), písma Andika a Baloo 2 (OFL) jsou přibalená. Postup se ukládá v `localStorage` (klíč `slabikar-v1`, starší postup se převede), nahrávky v IndexedDB.

```
index.html            kostra obrazovek
css/app.css           vzhled
js/data.js            slova, pořadí písmen, věty sovičky
js/core.js            stav, co dítě zná, výběr úloh
js/audio.js           efekty, hlas, mikrofon, balíček hlasu
js/art.js             SVG: sova, vláček, kamarádi, vajíčka, krajiny
js/games.js           hry
js/ride.js            jízda, příjezd do stanice, vajíčko, dárek
js/views.js           domov, mapa, kamarádi, hry, rodiče, studio
sw.js                 offline
```

Po změně souborů zvyš `V` v `sw.js` (a `?v=` v `index.html`), ať se nová verze dostane i do zařízení, kde už hra běží offline.
