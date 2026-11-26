# Generator de albume cu fotografii

Proiect individual – *Instrumente pentru dezvoltarea în echipă a proiectelor software* (Săpt. 9).

Site static (HTML + CSS + JavaScript, fără biblioteci externe) pentru crearea și vizualizarea albumelor foto.

## Funcționalități
- Listă de albume cu copertă generată automat din primele fotografii și căutare
- Creare / editare / ștergere album (titlu, descriere, stil de afișare)
- Încărcare fotografii prin *drag & drop* sau selectare (micșorate automat în browser)
- 3 stiluri de galerie: **Grilă**, **Mozaic**, **Polaroid**
- Lightbox cu navigare (săgeți ←/→, Esc) și **Slideshow** automat
- **Descarcă HTML** – generează albumul ca pagină HTML independentă
- Datele se păstrează în `localStorage` al browserului

## Structura
```
index.html      – structura paginii
css/style.css   – stilurile (inclusiv temă întunecată și mobil)
js/app.js       – logica aplicației
images/         – fotografiile demo
```

## Rulare locală
Deschide `index.html` în browser sau pornește un server:
```bash
python3 -m http.server 8000
```

## Publicare pe GitHub Pages
Repository → **Settings → Pages** → *Source: Deploy from a branch* → alege ramura și folderul `/ (root)` → **Save**.
Site-ul va fi disponibil la `https://<utilizator>.github.io/prob-site/`.
