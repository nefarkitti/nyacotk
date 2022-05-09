//av

const array = [...Array(31).keys()].map(x => ([4].includes(x + 1)) ? `${x + 1}.gif` : `${x + 1}.png`)

function minMaxRandom(min, max) {
 return Math.floor(Math.random() * (max - min) ) + min;
};

const img = document.getElementById("toplogo")
img.src = `/logos/${array[minMaxRandom(0, array.length)]}`