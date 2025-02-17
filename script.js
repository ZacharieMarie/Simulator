//Initialisation des agents et du nombreagents

numberOfAgent = 0;
const SCALE  = 20
const gameShow_div = document.querySelector(".game_show")
let agentOnePoint, agentTwoPoint;

let labelOne, labelTwo;

let rendezVousEnCours = true; // Variable pour gérer l'état du rendez-vous 

let checkingDistance = false;

let framsperSecond = 10;

function startVerifDistance() {
    if (checkingDistance) return; // Pour éviter de lancer plusieurs intervalles
    checkingDistance = true;
  
    const intervalId = setInterval(() => {
        // S'assurer que les deux agents existent
        if (!rendezVousEnCours || !agentOnePoint || !agentTwoPoint) {
            clearInterval(intervalId);
            checkingDistance = false;
            return;
        }
      
        verifierDistance();
      
        // Si la distance entre les agents est inférieure à 1, arrêter la vérification
        if (agentOnePoint.calculerDistance(agentTwoPoint) < 1) {
            console.log("Arrêt de la vérification (distance atteinte)");
            rendezVousEnCours = false;
            clearInterval(intervalId);
            checkingDistance = false;
        }
    }, 1000); // Vérification toutes les 1000 millisecondes (1 seconde)
}

function getElementCenter(element) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }


  function verifierDistance() {
    if (agentOnePoint && agentTwoPoint) {
      const distanceVisuelle = calculerDistanceVisuelle(agentOnePoint, agentTwoPoint);
      const distance = agentOnePoint.calculerDistance(agentTwoPoint)
      // Vous pouvez ajuster ce seuil en fonction de la taille de vos images
      if (distance <= 24 && distanceVisuelle <= 24 && rendezVousEnCours) {
        console.log("Les agents se croisent visuellement. Arrêt du rendez-vous.");
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
function calculerDistanceVisuelle(point1, point2) {
    const center1 = getElementCenter(point1.htmlElement);
    const center2 = getElementCenter(point2.htmlElement);
    const dx = center1.x - center2.x;
    const dy = center1.y - center2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  

class Point {
    constructor(x, y, identifiant, htmlElement) {
        if (!/^[01]+$/.test(identifiant)) {
            throw new Error("L'identifiant doit être une notation binaire valide (par exemple : '0b101').");
        }
        this.x = x;
        this.y = y;
        this.identifiant = identifiant;
        this.htmlElement = htmlElement;
    }
  
    // Déplacement vers la droite (M) avec interpolation temporelle
    async allerADroiteM(distance = 1, duration = 500) {
        if (!rendezVousEnCours) return;
        const startTime = performance.now();
        const startX = this.x;
        const targetX = startX + distance;
        const startLeft = parseInt(this.htmlElement.style.left.replace("px", ""));
      
        startVerifDistance();
      
        return new Promise((resolve) => {
            const move = () => {
                if (!rendezVousEnCours) { resolve(); return; }
                const elapsed = performance.now() - startTime;
                let progress = elapsed / duration;
                if (progress > 1) progress = 1;
                // Calcul de la nouvelle position (coordonnée interne)
                this.x = startX + (distance * SCALE) * progress;
                // Calcul de la nouvelle position en pixels
                const newLeft = startLeft + (distance * SCALE) * progress;
                this.htmlElement.style.left = `${newLeft}px`;
                verifierDistance();
                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    resolve();
                }
            };
            move();
        });
    }
  
    // Déplacement vers la gauche (M)
    async allerAGaucheM(distance = 1, duration = 500) {
        if (!rendezVousEnCours) return;
        const startTime = performance.now();
        const startX = this.x;
        const targetX = startX - distance;
        const startLeft = parseInt(this.htmlElement.style.left.replace("px", ""));
      
        startVerifDistance();
      
        return new Promise((resolve) => {
            const move = () => {
                if (!rendezVousEnCours) { resolve(); return; }
                const elapsed = performance.now() - startTime;
                let progress = elapsed / duration;
                if (progress > 1) progress = 1;
                this.x = startX - (distance * SCALE) * progress;
                const newLeft = startLeft - (distance * SCALE) * progress;
                this.htmlElement.style.left = `${newLeft}px`;
                verifierDistance();
                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    resolve();
                }
            };
            move();
        });
    }
  
    // Déplacement vers le haut (M)
    async allerEnHautM(distance = 1, duration = 500) {
        if (!rendezVousEnCours) return;
        const startTime = performance.now();
        const startY = this.y;
        const targetY = startY - distance;
        const startTop = parseInt(this.htmlElement.style.top.replace("px", ""));
      
        startVerifDistance();
      
        return new Promise((resolve) => {
            const move = () => {
                if (!rendezVousEnCours) { resolve(); return; }
                const elapsed = performance.now() - startTime;
                let progress = elapsed / duration;
                if (progress > 1) progress = 1;
                this.y = startY - (distance * SCALE) * progress;
                const newTop = startTop - (distance * SCALE) * progress;
                this.htmlElement.style.top = `${newTop}px`;
                verifierDistance();
                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    resolve();
                }
            };
            move();
        });
    }
  
    // Déplacement vers le bas (M)
    async allerEnBasM(distance = 1, duration = 500) {
        if (!rendezVousEnCours) return;
        const startTime = performance.now();
        const startY = this.y;
        const targetY = startY + distance;
        const startTop = parseInt(this.htmlElement.style.top.replace("px", ""));
      
        startVerifDistance();
      
        return new Promise((resolve) => {
            const move = () => {
                if (!rendezVousEnCours) { resolve(); return; }
                const elapsed = performance.now() - startTime;
                let progress = elapsed / duration;
                if (progress > 1) progress = 1;
                this.y = startY + (distance * SCALE) * progress;;
                const newTop = startTop + (distance * SCALE) * progress;
                this.htmlElement.style.top = `${newTop}px`;
                verifierDistance();
                if (progress < 1) {
                    requestAnimationFrame(move);
                } else {
                    resolve();
                }
            };
            move();
        });
    }
    /**
     * La méthode resteM crée une copie (clone) du point qui appelle cette fonction
     * et fait réaliser à ce clone un mouvement en spirale.
     * Le point original reste inchangé.
     * @param {number} distanceMax - La distance maximale (en nombre de "pas") pour la spirale.
     */
    async resteM(distanceMax = 5) {
        if (!rendezVousEnCours) return;
        // Clone l'élément HTML associé au point
        const cloneElement = this.htmlElement.cloneNode(true);
        // Positionne le clone exactement à la même position que l'original
        cloneElement.style.left = this.htmlElement.style.left;
        cloneElement.style.top = this.htmlElement.style.top;

        // Crée une nouvelle instance de Point pour le clone, avec les mêmes propriétés
        const clonePoint = new Point(this.x, this.y, this.identifiant, cloneElement);

        // Lance le mouvement en spirale sur le clone
        // La fonction "spirale" est supposée être définie ailleurs et prendre en paramètres un point et une distance maximale
        await spirale(clonePoint, distanceMax);

        // Optionnel : après le mouvement, on peut retirer le clone du DOM
        // cloneElement.remove();
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

        const dx = (this.x - autrePoint.x);
        const dy = (this.y - autrePoint.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
    calculerDistanceInit(autrePoint) {
        if (!(autrePoint instanceof Point)) {
            throw new Error("L'autre point doit être une instance de la classe Point.");
        }

        const dx = (this.x - autrePoint.x);
        const dy = (this.y - autrePoint.y);
        return Math.sqrt(dx * dx + dy * dy);
    }
    afficherInfo() {
        console.log(`Point [x=${this.x}, y=${this.y}, identifiant=${this.identifiant}]`);
        console.log('\n')
    }

    // Autres méthodes (reste, spirale, etc.) restent inchangées
    // ...
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
    if (!rendezVousEnCours) {
        return;
    }
    if (!(point instanceof Point)) {
        throw new Error("Le premier argument doit être une instance de la classe Point.");
    }
    if (!Number.isInteger(distanceMax) || distanceMax <= 0) {
        throw new Error("La distance maximale doit être un entier positif.");
    }

    await point.resteM(distanceMax);
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
        container.appendChild(agentOne);
        const rect = agentOne.getBoundingClientRect();
        x = x + centerX + (rect.width / 2)
        y = y + centerY +(rect.height / 2)
        agentOnePoint = new Point(parseInt(x), parseInt(y), `${labelOne}`, agentOne);
        console.log(agentOne.getBoundingClientRect())
        numberOfAgent++
        return
    }
    if (numberOfAgent == 1) {
        const agentTwo = document.createElement("img")
        agentTwo.src = "images/agentTwo.png"
        agentTwo.style.width = "50px"
        agentTwo.style.height = "50px"
        agentTwo.style.position = "absolute"
        agentTwo.style.left = `${x + centerX + 33}px`;
        agentTwo.style.top = `${y + centerY + 33}px`;
        agentTwo.style.backgroundColor = agentClass === 'agent1' ? 'blue' : 'green';
        agentTwo.style.borderRadius = '50%';
        agentTwo.style.display = 'flex';
        labelTwo = transformerBinaire(convertirEnNotationBinaire(label));
        container.appendChild(agentTwo);
        const rect = agentTwo.getBoundingClientRect();
        x = x + centerX + 33 +(rect.width / 2)
        y = y + centerY + 33 + (rect.height / 2)
        agentTwoPoint = new Point(parseInt(x), parseInt(y), `${labelTwo}`, agentTwo)
        console.log(agentTwo.getBoundingClientRect())
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