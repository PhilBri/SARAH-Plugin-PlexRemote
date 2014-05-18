/*__________________________________________________ 
|                PlexRemote V 1.0                   |
| Plugin pour S.A.R.A.H.                            |
| ( By Phil Bri 05/2014 )                           |
|___________________________________________________|
*/

exports.action = function ( data , callback , config , SARAH ) {

	var config = config.modules.plexremote;
	var commande  = '/';

	if (!config.server) {

		var tts = 'Le serveur n\'est pas configuré';
		plexLog('config', tts);
		return;
	}

	if (!config.client) {

		var tts = 'Le client n\'est pas configuré';
		plexLog('config', tts);
	}

	switch (data.cat) {

		case 'sys' : 
			commande += data.cmd;
			break;
		case 'nav' :
			commande += 'system/players/' + config.client + '/navigation/' + data.cmd;
			break;
		case 'play' :
			commande += 'system/players/' + config.client + '/playback/' + data.cmd;
			break;
		default :
			plexLog (callback, 'Commande PLEX incorrecte', commande);
	}

	getPlex (commande, config, callback, function (res) {

		switch (data.cmd) {
			case 'clients' :
				getClients (data.cmd, res, callback);
				break;
		}
	});
}

var plexLog = function (callback, txt, log) {

	console.log ('\r\nPlexRemote : [' + log + '] => ' + txt + '\r\n');
	callback ({'tts' : txt});
}

var getPlex = function (cmd, config, callback, clbk) {

	var plexServer = config.server;
	var url = 'http://' + plexServer + ':32400' + cmd;
	var request = require('request');

	request ({ 'uri' : url }, function (err, response, body) {
		if (err || response.statusCode != 200){

			console.log ("Erreur !" + body);
			return;
		}
		clbk (body);
	});
	//plexLog(callback, 'OK', cmd);
}

var getClients = function (cmd, res, callback) {

	var xmldoc = require ('./lib/xmldoc');
	var plexXML = new xmldoc.XmlDocument (res);
	var plexClient = plexXML.childrenNamed ('Server');
	var txt = 'J\'ai trouvé ';

	if (plexClient[0] === undefined) {

		txt += 'aucun client';
		plexLog (cmd, txt);
	} else {

		var nbClients = plexClient.length;
		txt += nbClients + ' client';
		for (var i = 0; i < nbClients; i++) {

			txt += ' : client '+ (i+1) + ' = ' + plexClient[i].attr.name + ' : ';
		}
		plexLog (callback, txt, cmd);
	}
}

