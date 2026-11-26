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

---

## Comenzile Git folosite în proiect

### 1. Configurarea Git (o singură dată)
```bash
git config --global user.name "Fagura"
git config --global user.email "adresa@exemplu.com"
git config --list
```

### 2. Crearea repository-ului local
```bash
mkdir prob-site
cd prob-site
git init
```

### 3. Legarea cu repository-ul de pe GitHub
```bash
git remote add origin https://github.com/Fagura/prob-site.git
git remote -v
```

### 4. Crearea unei ramuri (branch) de lucru
```bash
git branch
git checkout -b dezvoltare
git switch dezvoltare
```

### 5. Adăugarea fișierelor și verificarea stării
```bash
git status
git add index.html css/style.css js/app.js
git add images/
git add README.md .nojekyll
git add .
```

### 6. Salvarea modificărilor (commit)
```bash
git commit -m "Generator de albume cu fotografii: site static cu galerie"
git log --oneline
git diff
```

### 7. Trimiterea pe GitHub (push)
```bash
git push -u origin dezvoltare
```

### 8. Unirea ramurii în `main`
```bash
git checkout main
git pull origin main
git merge dezvoltare
git push origin main
```

### 9. Alte comenzi utile
```bash
git clone https://github.com/Fagura/prob-site.git
git fetch origin
git pull
git branch -d dezvoltare
git commit --amend -m "Mesaj nou"
git restore fisier.html
git log --graph --oneline --all
```

### 10. Publicarea pe GitHub Pages
1. Repository → **Settings → Pages**
2. *Source*: **Deploy from a branch**
3. Ramura `main`, folderul `/ (root)` → **Save**
4. Site-ul apare la `https://fagura.github.io/prob-site/`
