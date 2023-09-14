// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Message } = require('discord.js');
require('dotenv').config()
// Create a new client instance
const client = new Client({
    intents:
        [
            //GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            //GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.Guilds]
});


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


let msgcounter = 0

function spongify(msg) {
    let codeArr = []
    for (let i = 0; i < msg.length; i++) {
        const charCode = msg.charCodeAt(i)
        if (charCode >= 65 && charCode <= 90) {
            codeArr.push(charCode);
        }
        else if (charCode >= 97 && charCode <= 122) {
            codeArr.push(charCode);
        }
        else {
            codeArr.push(charCode)
        }
    }
    for (let i = 0; i < codeArr.length; i++) {
        const arrInd = codeArr[i]
        if (i % 2 == 1) {
            if (arrInd >= 65 && arrInd <= 90) {
                codeArr.splice(i, 1, arrInd + 32);
            }
            else if (arrInd >= 97 && arrInd <= 122) {
                codeArr.splice(i, 1, arrInd - 32);
            }
        }

    }
    return String.fromCharCode(...codeArr)
}
function isURL(str) {
    const urlRegex = /^(?!(https?:\/\/)).+/i
    return !urlRegex.test(str)
}

client.on(Events.MessageCreate, (msg) => {
    let msgTxt = spongify(msg.content)
    let regex = /^https/
    let s = msgTxt;

    let middle = Math.floor(s.length / 2);
    let before = s.lastIndexOf(' ', middle);
    let after = s.indexOf(' ', middle + 1);

    if (middle - before < after - middle) {
        middle = before;
    } else {
        middle = after;
    }

    let s1 = s.substring(0, middle);
    let s2 = s.substring(middle + 1);


    function apiCall() {
        fetch('https://api.imgflip.com/caption_image?template_id=102156234&username=gfs0020&password=ww$pn79pzCZD5G6&boxes[0][text]=' + s1 + '&boxes[1][text]=' + s2)

            .then((response) => response.json())
            .then((json) => msg.channel.send(json.data.url))
            .catch((error) => console.error(error));
    }

    if (msg.author.id === '178029769189883908' && msgcounter < 7) {
        msgcounter += 1
        console.log(msgcounter)
    }
    if (msgcounter >= 7 && msg.content.length >= 20 && !isURL(msg.content)) {
        msgcounter = -1
        apiCall()
    }
})







// Log in to Discord with your client's token
client.login(process.env.TOKEN);