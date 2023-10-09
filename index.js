const { Client, IntentsBitField, Partials, Collection, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
const prefix = config.prefix;
const roleconfig = config.role;
const snekfetch = require('snekfetch');
const moment = require('moment');
const day = new Date();
const mysql = require("mysql");

const exilied_config = {
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'yolo_license',
};

const exilied_database = mysql.createConnection({
    host: exilied_config.host,
    user: exilied_config.user,
    password: exilied_config.password,
    database: exilied_config.database,
    timezone: 'Italy'
});

exilied_database.on('error', function(err) {
   console.error('Error de conexión a la base de datos:', err);
});

exilied_database.connect(function(err) {
    if (err) {
        console.error('Error de Conexión: ' + err.stack);
        return;
    }

    setInterval(function () {
        exilied_database.query('SELECT 1');
    }, 5000);
});

const client = new Client({
   intents: [
      IntentsBitField.Flags.AutoModerationConfiguration,
      IntentsBitField.Flags.AutoModerationExecution,
      IntentsBitField.Flags.DirectMessageReactions,
      IntentsBitField.Flags.DirectMessageTyping,
      IntentsBitField.Flags.DirectMessages,
      IntentsBitField.Flags.GuildEmojisAndStickers,
      IntentsBitField.Flags.GuildIntegrations,
      IntentsBitField.Flags.GuildInvites,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessageReactions,
      IntentsBitField.Flags.GuildMessageTyping,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.GuildModeration,
      IntentsBitField.Flags.GuildPresences,
      IntentsBitField.Flags.GuildScheduledEvents,
      IntentsBitField.Flags.GuildVoiceStates,
      IntentsBitField.Flags.GuildWebhooks,
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.MessageContent
   ],
   partials: [
      Partials.Channel,
      Partials.GuildMember,
      Partials.GuildScheduledEvent,
      Partials.Message,
      Partials.Reaction,
      Partials.ThreadMember,
      Partials.User
   ],
});

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

client.commands = new Collection();
client.events = new Collection();

client.on('ready', (c) => {
   console.log(`💻 ${c.user.tag} Is online`)
});

client.on('messageCreate', async(message) => {
   if (!message.content.startsWith(prefix) || message.author.bot) return;
   const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

   if (cmd === 'createkey') {
      if (message.member.roles.cache.has(roleconfig)) {
         const target = message.author.id;
         automaticoread = message.author;

         function creaid() {
            const base = 'PowerAC-';
            const length = 20;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = base;
        
            for (let i = 0; i < length - base.length; i++) {
               const randomIndex = Math.floor(Math.random() * chars.length);
               result += chars.charAt(randomIndex);
            }
            return result;
         }

         let generatedString = creaid();

         let tempo1 = parseInt((new Date().getTime() / 1000).toFixed(0));
         let tempo = args[0];
         tempoetag = true;

         if (tempo == undefined) return message.reply("**Necesitas insertar un tiempo. Usa: https://toolset.mrw.it/dev/timestamp.html**");

         if (tempoetag) {
            message.reply("**La clave generada es**: " + generatedString + "\n **Fecha de generación**: " + message.createdAt.toLocaleDateString());
            message.author.send("**Tu clave es**: " + generatedString + "\n**La duración de la clave es**: **" + args[0] + "**" + " **Días**");

            function creaipdinamico() {
                let resultip = '';
                let length = 20;
                let chars = '0123456789';
                for (let i = length; i > 0; --i) resultip += chars[Math.floor(Math.random() * chars.length)];
                let key = generatedString;
                exilied_database.query(`INSERT INTO licenses (license, created_by, total_time, created, used, ip, userid) VALUES ('${key}', '${target}', '${tempo}', '${tempo1}', '${resultip}', '${message.author.id}')`);
            }

            creaipdinamico(exilied_config);
         }
      } else {
         message.channel.send("Acceso denegado");
      }
   }

   if (cmd === 'setip') {
      if (args[0] == undefined) return message.reply("You Need To Insert A License Key")
      if (args[1] == undefined) return message.reply("You Need To Insert An IP")
      
      exilied_database.query(`UPDATE licenses SET ip = '${args[1]}' WHERE license = '${args[0]}'`)
      message.reply(`**The License**: ${args[0]} \n**Has Been Set On IP**: ${args[1]}`)
   }

   if (cmd === 'deletekey') {
      if (message.member.roles.cache.has(roleconfig)) {
         let chiave = args.join(' ')
            if(args[0] == undefined) return message.reply("You Need An Insert A License Key")
            exilied_database.query(`DELETE FROM licenses WHERE license = '${args[0]}'`)
            message.reply("**The License Key**: "+ chiave +" **Has Been Deleted**") 
      } else {
         message.reply('Acceso denegado')
      }
   }

   if (cmd === 'checkKey') {
      if (message.member.roles.cache.has(roleconfig)) {
          const discordID = args[0];
  
          if (!discordID) return message.reply("You Need To Insert Discord ID");
  
          const queryCheck = `SELECT * FROM licenses WHERE userid = '${discordID}'`;
  
          const autoreasd = querytxt => {
              return new Promise((resolve, reject) => {
                  exilied_database.query(querytxt, (err, results, fields) => {
                      if (err) {
                          console.error(err);
                          reject(err);
                      } else {
                          resolve([results, fields]);
                      }
                  });
              });
          };
  
          autoreasd(queryCheck)
              .then(([results, fields]) => {
                  if (results.length === 0) {
                      message.reply('This User ID ' + discordID + ' Doesn\'t Have A License Key In Database');
                  } else {
                      const messageCheck = results.map(result => {
                          return `**The License Key**: ${result.license}\n**Discord ID**: ${result.userid}\n**IP**: ${result.ip}\n**Duration Key**: ${result.total_time} **Days**\n**This License Is Setted At Discord ID**: '${discordID}'`;
                      });
  
                      message.delete();
                      message.reply(messageCheck);
                  }
              })
              .catch(err => {
                  console.error('Error en la consulta SQL:', err);
                  message.reply('An error occurred while checking the key.');
              });
      } else {
          message.reply("Access Denied");
      }
  }  

});

client.login(config.token).then(() => {
loadEvents(client);
loadCommands(client);
});