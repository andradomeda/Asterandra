var canvas = document.getElementById("jocAsteroizi");
var context = canvas.getContext("2d");

let asteroizi = [];

function creareAsteroid() {
    const marime = Math.floor(Math.random() * 4) + 1; // Dim 1 și 4
    const dimensiuneRaza = [20, 30, 40, 50]; // Dim posibile
    const culori = ["red", "orange", "yellow", "green"]; // Culori posibile
    let asteroid;
    do {
        asteroid = {
            marime: marime,
            dimensiuneRaza: dimensiuneRaza[marime - 1],
            culoare: culori[marime - 1],
            pozitie: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            viteza: {
                x: (Math.random() - 0.75) * 1.07,
                y: (Math.random() - 0.98) * 1.09
            },
            marimeInitiala: marime,
            impuscat: false
        };
        //sa nu apara direc peste nava
    } while (calculeazaDistanta(asteroid.pozitie, nava.pozitie) < asteroid.dimensiuneRaza + 70);

    return asteroid;
}

function calculeazaDistanta(pozitie1, pozitie2) {
    const dx = pozitie1.x - pozitie2.x;
    const dy = pozitie1.y - pozitie2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
function initVectAsteroizi() {
    const numAsteroizi = Math.floor(Math.random() * 7) + 1; // nr 
    for (let i = 0; i < numAsteroizi; i++) {
        asteroizi.push(creareAsteroid());
    }
}

function deseneazaAsteroid(context, asteroid) {
    context.beginPath();
    context.arc(asteroid.pozitie.x, asteroid.pozitie.y, asteroid.dimensiuneRaza, 0, Math.PI * 2);
    context.fillStyle = asteroid.culoare;
    context.fill();
    context.closePath();


    context.fillStyle = "black";
    context.font = "bold 16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(asteroid.marime, asteroid.pozitie.x, asteroid.pozitie.y);//marimea este scrisa in centru
}


function miscaAsteroid(asteroid) {
    asteroid.pozitie.x += asteroid.viteza.x;
    asteroid.pozitie.y += asteroid.viteza.y;

    // Dacă asteroidul iese din canvas, reapare pe partea opusă
    if (asteroid.pozitie.x > canvas.width) asteroid.pozitie.x = 0;
    if (asteroid.pozitie.x < 0) asteroid.pozitie.x = canvas.width;
    if (asteroid.pozitie.y > canvas.height) asteroid.pozitie.y = 0;
    if (asteroid.pozitie.y < 0) asteroid.pozitie.y = canvas.height;
}

let nava = creareNava();

function creareNava() {
    return {
        pozitie: {
            x: canvas.width / 2,
            y: canvas.height / 2
        },
        viteza: {
            x: 0,
            y: 0
        },
        unghi: 3 * Math.PI / 2, // Unghiul de orientare al navei în radiani
        rotire: 0, // Direcția de rotire (-1 stânga, 1 dreapta)
        vieti: 5,
        punctajAcumulat: 0
    };
}

function deseneazaNava(context, nava) {
    const unghi = nava.unghi;

    // Punctele triunghiului determinate dupa formula: 
    // x(pct) = x(centruCerc)+R* cos(unghiFataDeOX);
    // y(pct) = y(centruCerc)+R* sin(unghiFatadeOX);
    const distCentruVarf = 30;
    const distCentruBaza = 15;
    const varf = {
        x: nava.pozitie.x + distCentruVarf * Math.cos(unghi),
        y: nava.pozitie.y + distCentruVarf * Math.sin(unghi)
    };
    const pctStanga = {
        x: nava.pozitie.x + distCentruBaza * Math.cos(unghi - Math.PI * 2 / 3),//scad 120 de grade din unghi 
        y: nava.pozitie.y + distCentruBaza * Math.sin(unghi - Math.PI * 2 / 3)
    };
    const pctDreapta = {
        x: nava.pozitie.x + distCentruBaza * Math.cos(unghi + Math.PI * 2 / 3),//adaug 120 de grade din unghi 
        y: nava.pozitie.y + distCentruBaza * Math.sin(unghi + Math.PI * 2 / 3)
    };

    // Desenăm triunghiul
    context.beginPath();
    context.moveTo(varf.x, varf.y);
    context.lineTo(pctStanga.x, pctStanga.y);
    context.lineTo(pctDreapta.x, pctDreapta.y);
    context.closePath();
    context.fillStyle = "green";
    context.fill();
}

function miscaNava(nava) {
    nava.pozitie.x += nava.viteza.x;
    nava.pozitie.y += nava.viteza.y;

    // daca rotire activ atunci te rotesti spre stanga sau spre dreapta
    if (nava.rotire !== 0) {
        nava.unghi += nava.rotire * 0.05;//se adauga 0.05 radiani la unghi per frame 
    }

    if (nava.pozitie.x > canvas.width) {
        nava.pozitie.x = 0;
    }
    if (nava.pozitie.x < 0) {
        nava.pozitie.x = canvas.width;
    }
    if (nava.pozitie.y > canvas.height) {
        nava.pozitie.y = 0;
    }
    if (nava.pozitie.y < 0) {
        nava.pozitie.y = canvas.height;
    }
}

function deseneazaVietisiPunctaj() {
    context.font = "20px Arial"; // Fontul textului
    context.fillStyle = "white"; // Culoarea textului
    context.fillText(`Nr. vieți: ${nava.vieti} Punctaj:${nava.punctajAcumulat} `, 110, 20); // Textul și poziția
}

function verificaColiziuneNavaAsteroizi(nava, asteroizi) {

    for (var i = 0; i < asteroizi.length; i++) {
        const distanta = calculeazaDistanta(nava.pozitie, asteroizi[i].pozitie)
        //am luat 30 care e distanta de la centru la varf drepr Raza
        const sumaRaze = 30 + asteroizi[i].dimensiuneRaza;
        if (distanta < sumaRaze) {
            nava.vieti--;
            if (nava.vieti === 0) {
                gameOver();
                return false;
            } else {
                reseteazaJoc();
            }

            break;
        }
    }
}
function reseteazaJoc() {
    asteroizi = []
    initVectAsteroizi();
    nava.pozitie.x = canvas.width / 2;
    nava.pozitie.y = canvas.height / 2;
}

function gameOver() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.font = "60px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}


let rachete = [];


function creareLaser() {
    return {
        pozitie: {
            x: nava.pozitie.x + 30 * Math.cos(nava.unghi),
            y: nava.pozitie.y + 30 * Math.sin(nava.unghi)
        },
        viteza: {
            x: 5 * Math.cos(nava.unghi), // Viteza laserului
            y: 5 * Math.sin(nava.unghi)
        },
        raza: 5,
        folosit: false
    };
}
function desenareLaser(context, laser) {
    context.beginPath();
    context.arc(
        laser.pozitie.x,
        laser.pozitie.y,
        laser.raza,
        0,
        Math.PI * 2
    );
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

function miscareLasere(rachete) {
    for (var i = 0; i < rachete.length; i++) {
        rachete[i].pozitie.x += rachete[i].viteza.x;
        rachete[i].pozitie.y += rachete[i].viteza.y;

        if (rachete[i].pozitie.x > canvas.width || rachete[i].pozitie.y > canvas.height || rachete[i].pozitie.x < 0 || rachete[i].pozitie.y < 0) {
            rachete.splice(i, 1);
            i--;
        }
    }

}

function verificaColiziune(rachete, asteroizi) {

    for (let i = 0; i < asteroizi.length; i++) {
        for (let j = 0; j < rachete.length; j++) {
            const distanta = calculeazaDistanta(asteroizi[i].pozitie, rachete[j].pozitie);
            const sumaRaze = asteroizi[i].dimensiuneRaza + rachete[j].raza;

            if (distanta < sumaRaze) {

                rachete[j].folosit = true;

                if (asteroizi[i].marime === 1) {
                    gestioneazaPunctaj(nava, asteroizi[i]);
                    asteroizi[i].impuscat = true;
                } else {
                    asteroizi[i].marime--;

                    switch (asteroizi[i].marime) {
                        case 1:
                            asteroizi[i].dimensiuneRaza = 20;
                            asteroizi[i].culoare = "red";
                            asteroizi[i].punctaj = 100;
                            break;
                        case 2:
                            asteroizi[i].dimensiuneRaza = 30;
                            asteroizi[i].culoare = "orange";
                            asteroizi[i].punctaj = 200;
                            break;
                        case 3:
                            asteroizi[i].dimensiuneRaza = 40;
                            asteroizi[i].culoare = "yellow";
                            asteroizi[i].punctaj = 300;
                            break;
                    }
                }
            }
        }
    }
    //elimina rachete si asteroizi dupa ce au fost marcati ca utilizati 
    for (let i = rachete.length - 1; i >= 0; i--) {
        if (rachete[i].folosit) {
            rachete.splice(i, 1);
        }
    }
    for (let i = asteroizi.length - 1; i >= 0; i--) {
        if (asteroizi[i].impuscat) {
            asteroizi.splice(i, 1);
        }
    }

}

function gestioneazaPunctaj(nava, asteroid) {

    nava.punctajAcumulat += asteroid.marimeInitiala * 100;
    if (nava.punctajAcumulat > 1000) { nava.vieti++; nava.punctajAcumulat -= 1000 }

}
document.addEventListener("keydown", function (event) {

    if (event.key === "ArrowUp") {
        nava.viteza.y = -2;
        nava.viteza.x = 0;
    } else if (event.key === "ArrowDown") {
        nava.viteza.y = 2;
        nava.viteza.x = 0;
    } else if (event.key === "ArrowLeft") {
        nava.viteza.x = -2;
        nava.viteza.y = 0;
    } else if (event.key === "ArrowRight") {
        nava.viteza.x = 2;
        nava.viteza.y = 0;
    }
    if (event.key === "z") {
        nava.rotire = -1;
    } else if (event.key === "c") {
        nava.rotire = 1;
    }
    if (event.key === "x") {
        if (rachete.length < 3) {
            rachete.push(creareLaser());
        }
    }
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        nava.viteza.y = 0;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        nava.viteza.x = 0;
    }
    if (event.key === "z" || event.key === "c") {
        nava.rotire = 0;
    }
});


function gameLoop() {

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    deseneazaVietisiPunctaj();

    for (let asteroid of asteroizi) {
        miscaAsteroid(asteroid);
        deseneazaAsteroid(context, asteroid);
    }
    miscareLasere(rachete);
    verificaColiziune(rachete, asteroizi);

    for (let i = 0; i < rachete.length; i++) {
        desenareLaser(context, rachete[i]);
    }

    miscaNava(nava);
    deseneazaNava(context, nava);

    if (verificaColiziuneNavaAsteroizi(nava, asteroizi) == false)
        return;

    requestAnimationFrame(gameLoop);
}



initVectAsteroizi();
gameLoop();
