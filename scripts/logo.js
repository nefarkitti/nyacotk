//av

// now time to hurt your brain and mine, because ive never used the Array class before
// btw to make it worse for you theres a single gif lol
// the gif one is 4
// sOLVED
const array = [...Array(26).keys()].map(x => ([4].includes(x + 1)) ? `${x + 1}.gif` : `${x + 1}.png`)

function minMaxRandom(min, max) {
 return Math.floor(Math.random() * (max - min) ) + min;
};

const img = document.getElementById("toplogo")
img.src = `/logos/${array[minMaxRandom(0, array.length)]}`
