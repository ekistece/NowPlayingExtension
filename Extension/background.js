// global vars
var hostName = "com.ekistece.nowplaying";
var port = null;
var playing = false;
var tabPlaying

// vars for Youtube
var yt_url = "youtube.com/watch?v=";
var ytTitle

// vars for Soundcloud
var sc_url = "soundcloud.com";
var sc_string = "Free Listening on SoundCloud"
var scTitle


// functions for interacting with desktop script
function sendNativeMessage(msg) {
  port.postMessage(msg);
}

function onDisconnected() {
  port = null;
}

function connect() {
  port = chrome.runtime.connectNative(hostName);
  port.onDisconnect.addListener(onDisconnected);
}

// Event handlers
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
        if (port == null)
        {
                connect()
        }
        else if (tab.audible == true)
        {
                //Youtube here

                if (tab.title != ytTitle && tab.url.includes(yt_url))
                {
                        ytTitle = tab.title.substring(0, tab.title.length - 10);
                        sendNativeMessage(ytTitle)
			tabPlaying = tabId;
			console.log(ytTitle);
                }
                //Soundcloud
                else if (tab.title != scTitle && !tab.title.includes(sc_string) && tab.url.includes(sc_url))
                {
                        scTitle = tab.title;
			sendNativeMessage(scTitle)
			tabPlaying = tabId;
                        console.log(scTitle);
                }
		playing = true;

        }
	else if (tab.audible == false && playing == true && tabPlaying == tabId)
	{
		scTitle = null;
		ytTitle = null;
		sendNativeMessage("Not Playing!");
		console.log("Stopped!");
		playing = false;
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo)
{
	if (tabPlaying == tabId && playing == true)
        {
		scTitle = null;
		ytTitle = null;
		if (port != null)
		{
                	sendNativeMessage("Not Playing!");
                }
		console.log("Stopped!");
                playing = false;
        }
});
