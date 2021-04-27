const fs = require('fs');
const Discord = require("discord.js")
const config = require("./config.json");

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

  fs.readdir(`./commands/`, (error, files) => {
    if (error) {return console.log("Error while trying to get the commmands.");};
    files.forEach(file => {
        const command = require(`./commands/${file}`);
        const commandName = file.split(".")[0];

        client.commands.set(commandName, command);

        if (command.aliases) {
            command.aliases.forEach(alias => {
                client.aliases.set(alias, command);
            });
        };
    });
});

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

	try {
		command.execute(client, message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.once('ready', () => {
	console.log('SmoothSharp initialized.');
  setTimeout(() => {  console.log("Client completely initialized."); }, 500);
});
client.login(config.token);
