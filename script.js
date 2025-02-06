//Initialisation des agents et du nombreagents

numberOfAgent = 0;
const SCALE  = 33
const gameShow_div = document.querySelector(".game_show")
let agentOnePoint, agentTwoPoint;

let labelOne, labelTwo;

let rendezVousEnCours = true; // Variable pour gérer l'état du rendez-vous 

let checkingDistance = false;

function startVerifDistance() {
    if (checkingDistance) return; // Évite de lancer plusieurs boucles
    checkingDistance = true;

    function checkLoop() {
        verifierDistance();

        if (!rendezVousEnCours || agentOnePoint.calculerDistance(agentTwoPoint) < 1) {
            console.log("Arrêt de la vérification (distance atteinte)");
            checkingDistance = false;
            return;
        }

        requestAnimationFrame(checkLoop); // Continue tant que le rendez-vous est en cours
    }

    requestAnimationFrame(checkLoop);
}

function verifierDistance() {
    if (agentOnePoint && agentTwoPoint) {
        const distance = agentOnePoint.calculerDistance(agentTwoPoint);
        const distance2 = agentTwoPoint.calculerDistance(agentOnePoint);
        if ((distance <= 1 || distance2 <= 1) && rendezVousEnCours) {
            console.log("Distance inférieure à 1. Arrêt du rendez-vous.");
            rendezVousEnCours = false;
            let distanceModal = new bootstrap.Modal(document.getElementById('distanceModal'));
            distanceModal.show();
        }
    }
}

function convertirEnNotationBinaire(nombre) {
    if (!Number.isInteger(nombre) || nombre < 0) {
        throw new Error("Le nombre doit être un entier positif.");
    }
    return `${nombre.toString(2)}`;
}

function transformerBinaire(notationBinaire) {
    if (!/^[01]+$/.test(notationBinaire)) {
        throw new Error("L'entrée doit être une notation binaire valide (par exemple : '101').");
    }

    // Supprime le préfixe "0b" pour travailler uniquement avec les bits
    const bits = notationBinaire;

    // Transformation des bits
    let resultat = "";
    for (const bit of bits) {
        if (bit === "1") {
            resultat += "10";
        } else if (bit === "0") {
            resultat += "01";
        } else {
            throw new Error("La chaîne contient des caractères invalides.");
        }
    }

    // Ajouter 0 au début et 11 à la fin
    resultat = "0" + resultat + "11";

    // Retourner la notation finale avec le préfixe "0b"
    return `${resultat}`;
}

class Point {
    constructor(x, y, identifiant, htmlElement) {
        if (!/^[01]+$/.test(identifiant)) {
            throw new Error("L'identifiant doit être une notation binaire valide (par exemple : '0b101').");
        }

        this.x = x; // Coordonnée x
        this.y = y; // Coordonnée y
        this.identifiant = identifiant; // Identifiant binaire
        this.htmlElement = htmlElement; //Element Html rattaché
    }

    // Méthode pour déplacer à gauche
async allerAGauche(distance = 1, duration = 50) {
    if(!rendezVousEnCours){
        return;
    }
        const targetX = this.x - (distance);

        let targetHTML = parseInt(this.htmlElement.style.left.replace("px", "")) + (distance * SCALE);
        const totalDistance = targetX - this.x; // Distance totale à parcourir

        const totalDistanceHtml = (targetHTML + parseInt(this.htmlElement.style.left.replace("px", "")))
        const velocity = totalDistanceHtml / duration; // Vitesse constante (distance par milliseconde)
        let temp = parseInt(this.htmlElement.style.left.replace("px", ""));
        startVerifDistance();
        
        return new Promise((resolve) => {
            let elapsedTime = 0;
            verifierDistance();
            const interval = setInterval(() => {
                elapsedTime += 10;
    
                if (elapsedTime >= duration || !rendezVousEnCours || this.x === targetX) {
                    verifierDistance();
                    clearInterval(interval);
                    this.x = targetX;
                    this.htmlElement.style.left = targetHTML + "px";
                    resolve(); // Résoudre la promesse une fois terminé
                } else {
                    this.x += totalDistance / 20; // Ajout proportionnel à la vitesse
                    temp += velocity * 10;
                    this.htmlElement.style.left = temp + "px";
                    verifierDistance();
                }
            }, 20);
        });
    }

    async allerAGaucheM(distance = 1, duration = 50) {
        if (!rendezVousEnCours) return;
        const startTime = performance.now();
        const targetX = this.x - distance;
        let target = 1;
        let targetHTML = parseInt(this.htmlElement.style.left.replace("px", "")) - (distance * SCALE);
        const step = this.x > targetX ? -1 : 1;
    
        startVerifDistance();
    
        return new Promise((resolve) => {
            const move = () => {
                if (!rendezVousEnCours || this.x === targetX) {
                    resolve();
                    return;
                }
                this.x  += step;
    
                // Update the HTML element's position
                target = parseInt(this.htmlElement.style.left.replace("px", "")) + (step * SCALE );
                this.htmlElement.style.left = `${target}px`;
                requestAnimationFrame(move);
                verifierDistance();
               
            };
            move();
            verifierDistance();
        });
    }

    

// Méthode pour déplacer à droite
async allerADroite(distance = 1, duration = 1000) {
    if(!rendezVousEnCours){
        return;
    }
    const targetX = this.x + (distance);
    let targetHTML = parseInt(this.htmlElement.style.left.replace("px", "")) + (distance * SCALE);
    const totalDistance = targetX - this.x; // Distance totale à parcourir
    const totalDistanceHtml = (targetHTML + parseInt(this.htmlElement.style.left.replace("px", "")))
    const velocity = totalDistanceHtml / duration; // Vitesse constante (distance par milliseconde)
    let temp = parseInt(this.htmlElement.style.left.replace("px", ""));
    startVerifDistance();
    return new Promise((resolve) => {
        let elapsedTime = 0;
        verifierDistance();
        const interval = setInterval(() => {
            elapsedTime += 10;

            if (elapsedTime >= duration || !rendezVousEnCours || this.x === targetX) {
                verifierDistance();
                clearInterval(interval);
                this.x = targetX;
                this.htmlElement.style.left = targetHTML + "px";
                resolve(); // Résoudre la promesse une fois terminé
            } else {
                this.x += totalDistance / 20; // Ajout proportionnel à la vitesse
                temp += velocity * 10;
                this.htmlElement.style.left = temp + "px";
                verifierDistance();
            }
        }, 20);
    });
}
async allerADroiteM(distance = 1, duration = 500) {
    if (!rendezVousEnCours) return;
    const startTime = performance.now();
    const targetX = this.x + distance;
    //let target = 1;
    //let targetHTML = parseInt(this.htmlElement.style.left.replace("px", "")) + (distance * SCALE);
    const step = this.x < targetX ? 1 : -1;

    startVerifDistance();

    return new Promise((resolve) => {
        const move = () => {

        //const initial_X = this.x
        //const initialX = parseInt(this.htmlElement.style.left.replace("px", ""));
            if (!rendezVousEnCours || this.x === targetX ) {
                resolve();
                return;
            }

            // Update the internal coordinate
            this.x = this.x + step;

            // Update the HTML element's position
            let target = parseInt(this.htmlElement.style.left.replace("px", ""))  + (step * SCALE );
            this.htmlElement.style.left = `${target}px`;
            requestAnimationFrame(move);
            verifierDistance();
           
        };
        move();
        verifierDistance();
    });
}


// Méthode pour déplacer en haut
async allerEnHaut(distance = 1, duration = 500) {
    if(!rendezVousEnCours){
        return;
    }const startTime = performance.now();

    const targetY = this.y - (distance );
    let initial_Y = this.y
    let targetHTML = parseInt(this.htmlElement.style.top.replace("px", "")) - (distance * SCALE);
    const totalDistance = targetY - this.y; // Distance totale à parcourir
    const totalDistanceHtml = (targetHTML - parseInt(this.htmlElement.style.top.replace("px", "")))
    const velocity = totalDistanceHtml / duration; // Vitesse constante (distance par milliseconde)
    let temp = parseInt(this.htmlElement.style.top.replace("px", ""));
    startVerifDistance();
    return new Promise((resolve) => {
        let elapsedTime = 0;
        verifierDistance();
        const interval = setInterval(() => {
            elapsedTime += 10;

            if (elapsedTime >= duration || !rendezVousEnCours || this.y === targetY) {
                verifierDistance();
                clearInterval(interval);
                this.y = targetY;
                this.htmlElement.style.top = targetHTML + "px";
                resolve(); // Résoudre la promesse une fois terminé
            } else {
                
                this.y = this.y + totalDistance/20
                temp += velocity * 10; // Ajout proportionnel à la vitesse
                this.htmlElement.style.top = temp + "px";
                verifierDistance();
            }
        }, 20);
    });
}
async allerEnHautM(distance = 1, duration = 500) {
    if (!rendezVousEnCours) return;
    const startTime = performance.now();
    const targetY = this.y - distance;
    let target = 1;
    let targetHTML = parseInt(this.htmlElement.style.top.replace("px", "")) - (distance * SCALE);
    const step = this.y > targetY ? -1 : 1;

    startVerifDistance();

    return new Promise((resolve) => {
        const move = (currentTime) => {
            if (!rendezVousEnCours || this.y === targetY) {
                resolve();
                return;
            }

            // Update the internal coordinate
            this.y = this.y + step;

            // Update the HTML element's position
            target = parseInt(this.htmlElement.style.top.replace("px", "")) + (step * SCALE);
            this.htmlElement.style.top = `${target}px`;
            requestAnimationFrame(move);
            verifierDistance();
           
        };
        move();
        verifierDistance();
    });
}


// Méthode pour déplacer en bas
async allerEnBas(distance = 1, duration = 500) {
    if(!rendezVousEnCours){
        return;
    }
    const targetY = this.y + (distance);
    let targetHTML = parseInt(this.htmlElement.style.top.replace("px", "")) + (distance * SCALE);
    const totalDistance = targetY - this.y; // Distance totale à parcourir
    const totalDistanceHtml = (targetHTML - parseInt(this.htmlElement.style.top.replace("px", "")))
    const velocity = totalDistanceHtml / duration; // Vitesse constante (distance par milliseconde)
    let temp = parseInt(this.htmlElement.style.top.replace("px", ""));
    startVerifDistance();
    return new Promise((resolve) => {
        let elapsedTime = 0;
        verifierDistance();
        const interval = setInterval(() => {
            elapsedTime += 10;

            if (elapsedTime >= duration || !rendezVousEnCours || this.y === targetY) {
                verifierDistance();
                clearInterval(interval);
                this.y = targetY;
                this.htmlElement.style.top = targetHTML + "px";
                resolve(); // Résoudre la promesse une fois terminé
            } else {
                this.y = this.y + totalDistance/20
                temp += velocity * 10; // Ajout proportionnel à la vitesse
                this.htmlElement.style.top = temp + "px";
                verifierDistance();
            }
        }, 20);
    });
}

async allerEnBasM(distance = 1, duration = 500) {
    if (!rendezVousEnCours) {
        return;
    }

    const startTime = performance.now();
    const targetY = this.y + distance;
    let target = 1;
     
    let targetHTML = parseInt(this.htmlElement.style.top.replace("px", "")) + (distance * SCALE);
    const step = this.y < targetY ? 1 : -1; // Move in the correct direction

    startVerifDistance();

    return new Promise((resolve) => {
        const initial_Y = this.y
        const initialY = parseInt(this.htmlElement.style.top.replace("px", ""));
        const move = (currentTime) => {
            if (!rendezVousEnCours || this.y === targetY) {
                resolve();
                return;
            }

            // Update the internal coordinate
            this.y = this.y + step;

            // Update the HTML element's position
            target = parseInt(this.htmlElement.style.top.replace("px", "")) + (step * SCALE);
            this.htmlElement.style.top = `${target}px`;
            requestAnimationFrame(move);
            verifierDistance();
           
        };
        move();
        verifierDistance();
    });
}


// Méthode pour rester sur place
async reste(duration = 500) {
    if(!rendezVousEnCours){
        return;
    }
    startVerifDistance();
    verifierDistance();
    return new Promise((resolve) => {
        const elapsedTime = { time: 0 }; // Crée un objet pour suivre le temps écoulé
        const interval = setInterval(() => {
            elapsedTime.time += 10;
            verifierDistance();
            verifierDistance();
            verifierDistance();
            verifierDistance(); 
            verifierDistance();   
            if (elapsedTime.time >= duration || !rendezVousEnCours) {
                verifierDistance();
                clearInterval(interval);
                resolve(); // Résout la promesse une fois terminé
            }else {
                verifierDistance();
            }
        }, 20);
    });

}
async resteM(distance=1, duration = 500) {
    if (!rendezVousEnCours) return;
    let step = 1
    startVerifDistance();

    return new Promise((resolve) => {
        const startTime = performance.now();

        const wait = (currentTime) => {
            if (!rendezVousEnCours || step === distance) {
                resolve();
                return;
            }

            const elapsedTime = currentTime - startTime;

            verifierDistance(); // Check distance at each frame
            if (elapsedTime >= duration) {
                resolve(); // Finish after the duration
            } else {
                requestAnimationFrame(wait);
                verifierDistance(); 
            }
            step += 1;
            requestAnimationFrame(wait);
            verifierDistance()
        };

        wait();
        verifierDistance(); 
    });
}


    // Afficher les informations du point
    afficherInfo() {
        console.log(`Point [x=${this.x}, y=${this.y}, identifiant=${this.identifiant}]`);
    }
    // Méthode pour calculer la distance entre ce point et un autre point
    calculerDistance(autrePoint) {
        if (!(autrePoint instanceof Point)) {
            throw new Error("L'autre point doit être une instance de la classe Point.");
        }

        const dx = this.x - (autrePoint.x);
        const dy = this.y - (autrePoint.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
    calculerDistanceInit(autrePoint) {
        if (!(autrePoint instanceof Point)) {
            throw new Error("L'autre point doit être une instance de la classe Point.");
        }

        const dx = this.x - (autrePoint.x);
        const dy = this.y - (autrePoint.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
    afficherInfo() {
        console.log(`Point [x=${this.x}, y=${this.y}, identifiant=${this.identifiant}]`);
        console.log('\n')
    }
}



// Fonction spirale
async function spirale(point, distanceMax) {
    if(!rendezVousEnCours){
        return;
    }
    if (!(point instanceof Point)) {
        throw new Error("Le premier argument doit être une instance de la classe Point.");
    }
    if (!Number.isInteger(distanceMax) || distanceMax <= 0) {
        throw new Error("La distance maximale doit être un entier positif.");
    }

    for (let distance = 1; distance <= distanceMax;) {
        // Aller à droite
        await point.allerADroiteM(distance); // Attendre le mouvement

        // Aller en bas
        await point.allerEnBasM(distance); // Attendre le mouvement

        distance++; // Augmenter la distance après deux mouvements

        // Aller à gauche
        await point.allerAGaucheM(distance); // Attendre le mouvement

        // Aller en haut
        await point.allerEnHautM(distance); // Attendre le mouvement

        distance++; // Augmenter à nouveau après deux autres mouvements
    }
}

//fonction spiraleInver
async function spiraleInv(point, distanceMax) {
    if(!rendezVousEnCours){
        return;
    }
    if (!(point instanceof Point)) {
        throw new Error("Le premier argument doit être une instance de la classe Point.");
    }
    if (!Number.isInteger(distanceMax) || distanceMax <= 0) {
        throw new Error("La distance maximale doit être un entier positif.");
    }

    for (let distance = distanceMax; distance > 0;) {
        // Aller en bas
        await point.allerEnBasM(distance);

        // Aller à droite
        await point.allerADroiteM(distance);

        distance--; // Réduire la distance après deux mouvements

        // Aller en haut
        await point.allerEnHautM(distance);

        // Aller à gauche
        await point.allerAGaucheM(distance);

        distance--; // Réduire à nouveau après deux autres mouvements
    }
}

async function resteSurPlace(point, distanceMax) {
    if(!rendezVousEnCours){
        return;
    }
    if (!(point instanceof Point)) {
        throw new Error("Le premier argument doit être une instance de la classe Point.");
    }
    if (!Number.isInteger(distanceMax) || distanceMax <= 0) {
        throw new Error("La distance maximale doit être un entier positif.");
    }

    for (let distance = 1; distance <= distanceMax;) {
        // Simuler une pause pour le mouvement vers la droite
        await point.resteM();

        // Simuler une pause pour le mouvement vers le bas
        await point.resteM();

        distance++; // Augmenter la distance après deux mouvements

        // Simuler une pause pour le mouvement vers la gauche
        await point.resteM();

        // Simuler une pause pour le mouvement vers le haut
        await point.resteM();

        distance++; // Augmenter à nouveau après deux autres mouvements
    }
}

async function rendezVous(identifiant, point) {
    let phases = 1;
    while (rendezVousEnCours) {
        console.log(`Phase: ${phases}`)
        for (let i = 0; i < identifiant.length && rendezVousEnCours; i++) {
            if (identifiant.charAt(i) === '1') {
                await spirale(point, 2 ** phases);
                if (!rendezVousEnCours) break;
                await spiraleInv(point, 2 ** phases);
            } else if (identifiant.charAt(i) === '0') {
                await resteSurPlace(point, 2 ** phases); // Attente pendant la durée spécifiée
                if (!rendezVousEnCours) break;
                await resteSurPlace(point, 2 ** phases);
            }
            verifierDistance(); // Vérifie la distance après chaque action
        }
        phases++;
    }

}



async function letThemmett() {
    console.log(agentOnePoint.afficherInfo())
    console.log(agentTwoPoint.afficherInfo())
    const distance = agentOnePoint.calculerDistanceInit(agentTwoPoint);
    distanceInput = document.getElementById("distanceValue");
    distanceInput.textContent = `${parseInt(distance)}`;
    console.log(`distance initiale D est: ${agentOnePoint.calculerDistanceInit(agentTwoPoint)}`)

    const distanceChecker = setInterval(verifierDistance, 1);
    await Promise.all([
        rendezVous(agentOnePoint.identifiant, agentOnePoint), // Plus lent
        rendezVous(agentTwoPoint.identifiant, agentTwoPoint),  // Plus lent
        
    ]);

    clearInterval(distanceChecker);
}

function mosePosition(e) {
    console.log(e.pageX)
    console.log(e.pageY)
    if (numberOfAgent == 0) {
        console.log(numberOfAgent)
        
        agentOne.style.left = e.pageX + "px"
        agentOne.style.top = e.pageY + "px"
        agentOne.style.display = "block"
        agentOnePoint = new Point(e.pageX, e.pageY, "101", agentOne)
        numberOfAgent++
        return
    }
    if (numberOfAgent == 1) {
        console.log(numberOfAgent)
        agentTwo.style.left = e.pageX + "px"
        agentTwo.style.top = e.pageY + "px"
        agentTwo.style.display = "block"
        agentTwoPoint = new Point(e.pageX, e.pageY, "000", agentTwo)
        numberOfAgent++
        return
    }
    if (numberOfAgent >= 2) {
        return
    }

}

gameShow_div.addEventListener("click", mosePosition, false)

let currentPage = 1;

function goToPage(pageNumber) {
    document.querySelector(`#page${currentPage}`).classList.remove('active');
    document.querySelector(`#page${pageNumber}`).classList.add('active');
    currentPage = pageNumber;

    document.getElementById('prevButton').disabled = currentPage === 1;
    const nextButton = document.getElementById('nextButton');
    nextButton.innerText = currentPage === 2 ? 'Valider' : 'Suivant';
}

function validateAndGoToPage() {
    const errors = [];
    if (currentPage === 1) {
        // Validation pour le premier agent
        const label = document.getElementById('agent1Label').value.trim();
        labelOne = parseInt(label);
        const x = document.getElementById('agent1X').value.trim();
        const y = document.getElementById('agent1Y').value.trim();
        document.getElementById("agent1Value").textContent = label;
        document.getElementById("agent1Binary").textContent = "TransBin(x) : " +  transformerBinaire(convertirEnNotationBinaire(labelOne));
        if (!label) errors.push('agent1LabelError');
        if (!x || isNaN(x)) errors.push('agent1XError');
        if (!y || isNaN(y)) errors.push('agent1YError');

        if (errors.length === 0) {
            labelOne = parseInt(label);
            // Ajouter l'agent au conteneur
            afficherAgent(labelOne, parseInt(x), parseInt(y), 'agent1');

            goToPage(2);
        }
    } else if (currentPage === 2) {
        // Validation pour le deuxième agent
        const label = document.getElementById('agent2Label').value.trim();
        labelTwo = parseInt(label);
        const x = document.getElementById('agent2X').value.trim();
        const y = document.getElementById('agent2Y').value.trim();
        document.getElementById("agent2Value").textContent = label;
        document.getElementById("agent2Binary").textContent = "TransBin(x) : " + transformerBinaire(convertirEnNotationBinaire(labelTwo));
        if (!label) errors.push('agent2LabelError');
        if (!x || isNaN(x)) errors.push('agent2XError');
        if (!y || isNaN(y)) errors.push('agent2YError');

        if (errors.length === 0) {
            labelTwo = parseInt(label);
            // Ajouter l'agent au conteneur
            afficherAgent(labelTwo, parseInt(x), parseInt(y), 'agent2');

            
            // Fermer le modal en JavaScript natif
            const modal = document.getElementById('twoPageModal');
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            modal.style.display = 'none';

            // Supprimer le backdrop (si présent)
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
        }
    }

    // Gérer les erreurs
    ['agent1LabelError', 'agent1XError', 'agent1YError', 'agent2LabelError', 'agent2XError', 'agent2YError'].forEach((id) => {
        document.getElementById(id).classList.add('d-none');
    });
    errors.forEach((id) => {
        document.getElementById(id).classList.remove('d-none');
    });
}

function afficherAgent(label, x, y, agentClass) {
    const container = document.querySelector('.game_show');
    const containerStyle = window.getComputedStyle(container);
    if (containerStyle.position === "static") {
        container.style.position = "relative";
    }
    
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;


    // Créer un élément div pour représenter l'agent
    if (numberOfAgent == 0) {
        console.log(numberOfAgent)
        
        const agentOne = document.createElement("img")
        agentOne.src = "images/agentOne.png"
        agentOne.style.width = "50px"
        agentOne.style.height = "50px"
        agentOne.style.position = "absolute"
        /*let position = container.getBoundingClientRect()
        console.log(position.x)
        console.log(position.y)
        const relX = parseInt(position.x) + parseInt(x)
        const relY = parseInt(position.y) + parseInt(y)*/
        agentOne.style.left = `${x + centerX}px`;
        agentOne.style.top = `${y + centerY}px`;
        agentOne.style.backgroundColor = agentClass === 'agent1' ? 'blue' : 'green';
        agentOne.style.borderRadius = '50%';
        agentOne.style.display = 'flex';
        labelOne = transformerBinaire(convertirEnNotationBinaire(label));
        agentOnePoint = new Point(parseInt(x), parseInt(y), `${labelOne}`, agentOne)
        container.appendChild(agentOne);
        numberOfAgent++
        return
    }
    if (numberOfAgent == 1) {
        const agentTwo = document.createElement("img")
        agentTwo.src = "images/agentTwo.png"
        agentTwo.style.width = "50px"
        agentTwo.style.height = "50px"
        agentTwo.style.position = "absolute"
        agentTwo.style.left = `${x + centerX + SCALE}px`;
        agentTwo.style.top = `${y + centerY + SCALE}px`;
        agentTwo.style.backgroundColor = agentClass === 'agent1' ? 'blue' : 'green';
        agentTwo.style.borderRadius = '50%';
        agentTwo.style.display = 'flex';
        labelTwo = transformerBinaire(convertirEnNotationBinaire(label));
        agentTwoPoint = new Point(parseInt(x), parseInt(y), `${labelTwo}`, agentTwo)
        container.appendChild(agentTwo);
        numberOfAgent++
        return
    }
    if (numberOfAgent >= 2) {
        return
    }

    // Ajouter l'élément au conteneur
    
}


    function closeModal() {
      const modal = bootstrap.Modal.getInstance(document.getElementById('twoPageModal'));
      modal.hide();
    }

    // Afficher la modale au chargement de la page
    window.onload = function () {
      const modal = new bootstrap.Modal(document.getElementById('twoPageModal'));
      modal.show();
    };