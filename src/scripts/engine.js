const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
// *******************
// Left side
// *******************
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
// *******************
// Right side
// *******************
    fieldCards:{
        // Player card in challenge
        player: document.getElementById("player-field-card"),
        // Computer card in challenge
        computer: document.getElementById("computer-field-card"),
    },
    actions:{
        button: document.getElementById("next-duel")
    },

    playerSides: {
        // Player cards container
        player1: "player-cards",
        player1BOX: document.getElementById("player-cards"),
        // Computer cards container
        computer: "computer-cards",
        computerBOX: document.getElementById("computer-cards"),
    }

};
    

const pathImages = "./src/assets/icons/";

// Cards informations
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    },
]

// Generate aleatory number of a card
async function getRandomCard(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}


async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === state.playerSides.player1){
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard)
        });

        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
            state.cardSprites.avatar.src = `${pathImages}blank.png`;
        });
    }

    return cardImage;
}

async function removeAllCardsImages(){
    let {player1BOX, computerBOX} = state.playerSides;
    let imageElements = player1BOX.querySelectorAll("img");
    imageElements.forEach(img => img.remove());

    imageElements = computerBOX.querySelectorAll("img");
    imageElements.forEach(img => img.remove());
}

async function hiddenCardsDetails(){
    // state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function showHiddenCardFieldImages(value){
    if(value === true){
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    else if(value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function setCardsField(cardId){
    await removeAllCardsImages();
    let computerCardId = await getRandomCard();

    await showHiddenCardFieldImages(true);

    hiddenCardsDetails();

    await drawCardsInField(cardId, computerCardId);
    
    let duelResults = await checkDuelResults(cardId, computerCardId)
    
    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img
}

async function drawButton(text){
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    }else if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults);

    // state.cardSprites.avatar.src = `${pathImages}blank.png`;

    return duelResults.toUpperCase();
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;

}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCard();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel() {
    state.actions.button.style.display = "none";

    showHiddenCardFieldImages(false);

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try{
        audio.play();
    }
    catch{};
}

async function init() {
    await showHiddenCardFieldImages(false);

    state.cardSprites.avatar.src = `${pathImages}blank.png`;

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.getElementById("bgm");
    try{
        await bgm.play();
    }
    catch{};
}

init();