
const nbPaquets = 1;
let partieNonFinie = true
let buttonRester = document.getElementById('rester')
let buttonTirer = document.getElementById('tirer')
let paquetGlobal = []
let joueur, croupier

function verifBlackjackT1(compteur){
    if (compteur === 21){
        victoire()
    }
}
function victoire(){
    alert("VICTOIRE")
}
function generate(nbPaquets){
    paquetGlobal = generatePaquetsGlobal(nbPaquets)
    joueur = new Joueur('joueur')
    croupier = new Joueur('croupier')
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
}
function toggleButton(){
    buttonTirer.classList.toggle('afficher')
    buttonRester.classList.toggle('afficher')
}
function generatePaquetsGlobal(nbPaquets) {
    let couleurs = [ 'coeur' , 'pique', 'trefle', 'carreau']
    let chiffres = ["A",2,3,4,5,6,7,8,9,10,"V","D","R"]
    let cartes = []
    for (let i = 0; i < nbPaquets; i++) {
        for (let j = 0 ; j < couleurs.length ; j++) {
            for ( let k = 0 ; k < chiffres.length; k++) {
                if (chiffres[k] === "V" || chiffres[k] === "D" || chiffres[k] === "R"){
                    let card = new Card(chiffres[k], 10, couleurs[j])
                    cartes.push(card)
                }
                else if (typeof (chiffres[k]) === "number") {
                    let card = new Card(chiffres[k],chiffres[k], couleurs[j])
                    cartes.push(card)
                }
                else{
                    let card = new Card(chiffres[k],11, couleurs[j])
                    cartes.push(card)
                }
                
            }
        }
    }
    return shuffleArray(cartes)
}
function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve,milliseconds))
}
async function initPartie(){
    await joueur.tirerCarte()
    await croupier.tirerCarte()
    await joueur.tirerCarte()
    await croupier.tirerCarte(true)
}
function defaite(){
    alert("DEFAITE")
    //page = document.querySelector('html')
    //page.style.display = 'none'
}
function verifCompteur(typeJoueur,compteur){
    return wait(1000).then(async()=>{
        if (typeJoueur === "joueur"){
            if (compteur > 21){
                defaite()
            }
        }
        else{
            if (compteur<=16){
                await croupier.tirerCarte()
                verifCompteur(typeJoueur,croupier.compteur)
            }
            else{
                if (croupier.compteur>joueur.compteur && croupier.compteur<=21){
                    defaite()
                }
                else{
                    victoire()
                }
            }
        }
    })
}
class Card {
    constructor(name,valeur, couleur) {
        this.name = name
        this.valeur = valeur
        this.couleur = couleur
        this.cache = false 
    }
    getLien(){
        if (this.cache) {
            return 'carte_cachee.png'
        }
        else{
            return `carte_${this.name}${this.couleur}.png`
        }
        //return this.cache ? 'carte_cachee.png' : `carte_${this.name}${this.couleur}.png`
    }
}
class Joueur {
    constructor(name){
        this.cartes = []
        this.compteur = 0
        this.gagnant = false
        this.name = name
    }
    tirerCarte(carteCachee=false){
        return wait(1000).then(()=>{
            let derniereCarte = paquetGlobal.shift() 
            derniereCarte.cache = carteCachee
            this.cartes.push(derniereCarte)
            this.compteur += this.cartes[this.cartes.length-1].valeur
            if (carteCachee === false){
                let divCompteur = document.getElementById(`${this.name}Compteur`)
                divCompteur.innerText = this.compteur
            }
            let divImages = document.querySelector(`.cartes_${this.name}`)
            divImages.insertAdjacentHTML('beforeend',`<img src="cartes/${derniereCarte.getLien()}"></img>`)
            //divImages.insertAdjacentHTML('beforeend',`<img src="${derniereCarte.getLien()}"></img>`)
            

        })
    }
    

}


document.addEventListener("DOMContentLoaded", function(event){
    setTimeout(async function(){
        generate(nbPaquets) // on initialise les joueurs/cartes
        await initPartie()
        verifBlackjackT1(joueur.compteur)
        toggleButton()

        buttonTirer.addEventListener('click',async function(){
            await joueur.tirerCarte()
            verifCompteur(joueur.name,joueur.compteur)
        })

        buttonRester.addEventListener('click',async function(){
            toggleButton()
            verifCompteur(croupier.name,croupier.compteur)
        })

    },2000)
})
    









