var lastPlayedByUser = {};
 const radioArr = [
    'https://5a6872aace0ce.streamlock.net/vov1/vov1.stream_aac/playlist.m3u8',
    'https://5a6872aace0ce.streamlock.net/vov2/vov2.stream_aac/playlist.m3u8',
    'https://5a6872aace0ce.streamlock.net/vov3/vov3.stream_aac/playlist.m3u8',
    'https://5a6872aace0ce.streamlock.net/vovgt+hn/vovgt+hn.stream_aac/playlist.m3u8',
    'https://5a6872aace0ce.streamlock.net/vovgt+hcm/vovgt+hcm.stream_aac/chunklist_w341167682.m3u8',
];
var radioIndex = 2;
var streamURL = radioArr[radioIndex];



exports.handler = function(event, context) {
    var player = new SidRothPlayer(event, context);
    player.handle();
};
 
var SidRothPlayer = function (event, context) {
    this.event = event;
    this.context = context;
};
 
SidRothPlayer.prototype.handle = function () {
    var requestType = this.event.request.type;
    var userId = this.event.context ? this.event.context.System.user.userId : this.event.session.user.userId;
 
   if (requestType === "LaunchRequest") {
		radioIndex = 2;
		streamURL = radioArr[radioIndex];
		this.play(streamURL, 0);
 
    } else  if (requestType === "IntentRequest") {
        var intent = this.event.request.intent;
        if (intent.name === "RadioIntent") {
			var myNumber = this.event.request.intent.slots.myNumber.value;

			switch (myNumber) {
			case "channel 1" : {
				radioIndex = 0;
				break;
			}
			case "1": {
				radioIndex = 0;
				break;
			}
			case "radio 1": {
				radioIndex = 0;
				break;
			}
			case "2": {
				radioIndex = 1;
				break;
			}
			case "radio 2": {
				radioIndex = 1;
				break;
			}
			case "channel 2": {
				var radioIndex = 1;
				break;
			}
			case "3": {
				radioIndex = 2;
				break;
			}
			case "radio 3": {
				radioIndex = 2;
				break;
			}
			case "channel 3": {
				radioIndex = 2;
				break;
			}
			case "channel 4": {
				radioIndex = 3;
				break;
			}
			case "radio 4": {
				radioIndex = 3;
				break;
			}
			case "4": {
				radioIndex = 3;
				break;
			}
			case "channel 5": {
				radioIndex = 4;
				break;
			}
			case "radio 5": {
				radioIndex = 4;
				break;
			}
			case "5": {
				radioIndex = 4;
				break;
			}
			default : {
				radioIndex = 2;
			}
		}
			streamURL = radioArr[radioIndex];
			this.play(streamURL, 0);
		
            
        } else if (intent.name === "AMAZON.NextIntent") {
			switch (streamURL) {
			case radioArr[0] : {
				radioIndex = 1;
				break;
			}
			case radioArr[1]: {
				radioIndex = 2;
				break;
			}
			case radioArr[2]: {
				radioIndex = 3;
				break;
			}
			case radioArr[3]: {
				radioIndex = 4;
				break;
			}
			case radioArr[4]: {
				radioIndex = 0;
				break;
			}
			default : {
				radioIndex = 2;
			}
		}
            streamURL = radioArr[radioIndex];
            this.play(streamURL, 0);
             
        
		} else if (intent.name === "AMAZON.PreviousIntent") {
			switch (streamURL) {
			case radioArr[0] : {
				radioIndex = 4;
				break;
			}
			case radioArr[1]: {
				radioIndex = 0;
				break;
			}
			case radioArr[2]: {
				radioIndex = 1;
				break;
			}
			case radioArr[3]: {
				radioIndex = 2;
				break;
			}
			case radioArr[4]: {
				radioIndex = 3;
				break;
			}
			default : {
				radioIndex = 2;
			}
		}
            streamURL = radioArr[radioIndex];
            this.play(streamURL, 0);
 
 
        } else if (intent.name === "AMAZON.ShuffleOnIntent" || intent.name === "AMAZON.ShuffleOffIntent" ) {
			this.errorspeak("Sorry, I can’t shuffle a radio.");
 
        } else if (intent.name === "AMAZON.LoopOnIntent" || intent.name === "AMAZON.LoopOffIntent" || intent.name === "AMAZON.RepeatIntent" )  {
			this.errorspeak("Sorry, I can’t loop a radio.");
 
        } else if (intent.name === "AMAZON.StartOverIntent") {
            this.play(streamURL, 0);
		} 
		  
		  
			  
		  
		  else if (intent.name === "AMAZON.PauseIntent") {
            this.stop();
 
        } else if (intent.name === "AMAZON.ResumeIntent") {
            var lastPlayed = this.loadLastPlayed(userId);
            var offsetInMilliseconds = 0;
            if (lastPlayed !== null) {
                offsetInMilliseconds = lastPlayed.request.offsetInMilliseconds;
            }
             this.play(streamURL, offsetInMilliseconds);
        }
    } else if (requestType === "AudioPlayer.PlaybackStopped") {
        this.saveLastPlayed(userId, this.event);
        this.context.succeed(true);
    }
};
 


// Tap hop cac function 
SidRothPlayer.prototype.errorspeak = function (message) {
     var response = {
        version: "1.0",
        response: {
            shouldEndSession: true,
            outputSpeech: {
                type: "SSML",
                ssml: "<speak> " + message +" </speak>"
            },
            
        }
    };
   this.context.succeed(response); 
};

 SidRothPlayer.prototype.play = function (audioURL, offsetInMilliseconds) {
    var response = {
        version: "1.0",
        response: {
            shouldEndSession: true,
            directives: [
                {
                    type: "AudioPlayer.Play",
                    playBehavior: "REPLACE_ALL", 
                    audioItem: {
                        stream: {
                            url: audioURL,
                            token: "0", 
                            expectedPreviousToken: null, 
                            offsetInMilliseconds: offsetInMilliseconds
                        }
                    }
                }
            ]
        }
    };
    this.context.succeed(response);
};
 
SidRothPlayer.prototype.stop = function () {
    var response = {
        version: "1.0",
        response: {
            shouldEndSession: true,
            directives: [
                {
                    type: "AudioPlayer.Stop"
                }
            ]
        }
    };
    this.context.succeed(response);
};
 
SidRothPlayer.prototype.saveLastPlayed = function (userId, lastPlayed) {
    lastPlayedByUser[userId] = lastPlayed;
};
 
SidRothPlayer.prototype.loadLastPlayed = function (userId) {
    var lastPlayed = null;
    if (userId in lastPlayedByUser) {
        lastPlayed = lastPlayedByUser[userId];
    }
    return lastPlayed;
};
