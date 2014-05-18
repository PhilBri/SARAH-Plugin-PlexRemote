/*__________________________________________________ 
| PlexRemote V 0.9									|
| Plugin pour S.A.R.A.H. 							|
| ( By Phil Bri 05/2014 )							|
|___________________________________________________|
*/


exports.action = function ( data , callback , config , SARAH ) {

	var xlmDoc = require('./lib/xmldoc');
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
			commande += 'clients';
			break;
		case 'nav' :
			commande += 'system/players/' + config.client + '/navigation/' + data.cmd;
			break;
		case 'play' :
			commande += 'system/players/' + config.client + '/playback/' + data.cmd;
			break;
	}

	getPlex(commande, config, callback, function(res){
		//Do stuff
	});
}

var plexLog = function (callback, txt, log) {

	console.log('\r\nPlexRemote : [' + log + '] => ' + txt + '\r\n');
	callback ({'tts' : txt});
}

var getPlex = function (cmd, config, callback, clbk) {

	var plexServer = config.server;
	var url = 'http://' + plexServer + ':32400' + cmd;
	var request = require('request');

	request ({ 'uri' : url }, function (err, response, body) {
		if (err || response.statusCode != 200){
			console.log("Erreur !" + body);
			return;
		}
		clbk(body);
	});
	plexLog(callback, 'OK', cmd);
}
