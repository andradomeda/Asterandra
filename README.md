Asterandra - Joc dezvoltat in JavaScript

Descriere: 
Proiect implementat pentru a exersa utilizarea JavaScript, facut dupa modelul jocului Asteroids Atari 7800.
Asterandra este un joc realizat exclusiv cu JavaScript, fără utilizarea unor biblioteci sau framework-uri externe. Codul este împărțit în trei fișiere principale:
asterandra.js - Conține logica principală a jocului.
asterandra.html - Pagina HTML care încorporează fișierul JS și CSS.
asterandra.css - Fișierul de stilizare pentru aspectul jocului.

Caracteristici:
Utilizează canvas API pentru randarea elementelor grafice.
Implementare interacțiune cu tastatura pentru controlul jucătorului.

Pentru a rula: 
Dupa descarcarea tuturor fisierelor, apasarea pe fisierul asterandra.html deschide pagina jocului intr-un browser.

Tehnologii utilizate:
JavaScript: pentru logica jocului și interacțiunea cu utilizatorul.
HTML5 Canvas: pentru desenarea elementelor de joc.
CSS3: pentru stilizarea interfeței.


Asteroizi: reprezentat ca un cerc cu valoare aleatorie între 1 și 4, indicând numărul de rachete necesare pentru distrugere
Se deplasează pe o traiectorie liniară, cu o viteză generată aleatoriu.

Navă spațială: 
Săgeți → deplasare sus/jos/stânga/dreapta.
Z → rotire spre stânga.
C → rotire spre dreapta.
X → lansare rachetă în direcția orientării navei.
Se poate deplasa în orice direcție, indiferent de orientarea curentă.

Rachete:
Se detectează coliziunea cu asteroidul, la impact numărul de rachete necesar pentru distrugere se reduce.
Pot fi lansate maxim 3 rachete simultan.

Coliziuni:
Între asteroizi → determină modificarea traiectoriei acestora.
Între navă și asteroizi → reduce numărul de vieți și repornește jocul. Când numărul de vieți ajunge la 0, jocul se încheie.
Regenerare vieți 

Distrugerea unui asteroid oferă puncte jucătorului iar la atingerea unui număr predefinit de puncte, numărul de vieți se actualizează.
