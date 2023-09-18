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

//starting counter at 4 so bot triggers off of first message when started
let msgcounter = 4

function removeEmojis(string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    return string.replace(regex, '');
}

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
    let spongeStr = String.fromCharCode(...codeArr);
    return removeEmojis(spongeStr);

}
function isURL(str) {
    const urlRegex = /^(?!(https?:\/\/|<@)).+/i
    return !urlRegex.test(str)
}
//add user ID into this array to make the bot trigger off of their messages
let userIdArr = [
    '96819678797660160' //Dixie
]

client.on(Events.MessageCreate, async (msg) => {
    let msgTxt = spongify(msg.content)//Changes case of message

    let middle = Math.floor(msgTxt.length / 2);
    let before = msgTxt.lastIndexOf(' ', middle);
    let after = msgTxt.indexOf(' ', middle + 1);

    if (middle - before < after - middle) {
        middle = before;
    } else {
        middle = after;
    }

    let s1 = msgTxt.substring(0, middle);
    let s2 = msgTxt.substring(middle + 1);
    //Lines 74-82 finds the middle point of the message, s1 is the first half, s2 is the second half

    if (userIdArr.includes(msg.author.id) && msgcounter < 5) {
        msgcounter += 1
        console.log(msgcounter)
    }
    if (msgcounter >= 5 && msg.content.length >= 20 && !isURL(msg.content)) {
        msgcounter = -1
        try {
            const json = await fetch('https://api.imgflip.com/caption_image?template_id=102156234&username=gfs0020&password=ww$pn79pzCZD5G6&boxes[0][text]=' + s1 + '&boxes[1][text]=' + s2).then((response) => response.json())
            console.log(json.data.url)
            msg.channel.send(json.data.url)
        } catch (error) {
            console.error(error)
        }
        //.then((response) => response.json())
        // .then((json) => {
        //     msg.channel.send(json.data.url);
        //     console.log(json.data.url);
        // })
        //.catch((error) => console.error(error));
    }
})







// Log in to Discord with your client's token
client.login(process.env.TOKEN);