// script start after extension install
chrome.runtime.onInstalled.addListener(async () => {
    // alert("extension installed");
    console.log("extension installed");
});
chrome.commands.onCommand.addListener((command) => {
    // tab is active tab
    chrome.tabs.update({}, async (tab) => {
        if (command == "tabs-to-buffer") {
            console.log("extension command: tabs-to-buffer");
            // let url = chrome.runtime.getURL("html/question.html");
            // // open this url in new tab
            // let tab = await chrome.tabs.create({url});
        }
        // } else if (command == "clear-local-storage") {
        //     chrome.storage.local.clear(() => {
        //         console.log('Everything was removed');
        //         chrome.notifications.create(
        //             "notification1",
        //             {
        //                 type: "basic",
        //                 iconUrl: "/icons/alert.png",
        //                 title: "Local storage",
        //                 message: "Everything was removed",
        //                 buttons: [{title: "Thanks"}],
        //                 priority: 0,
        //             },
        //             (e) => {
        //                 console.log("Last error:", chrome.runtime.lastError);
        //             }
        //         );
        //     });
        // }
    });
})
;
//notifications
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("onAlarm", alarm);
    chrome.notifications.create(
        "notification1",
        {
            type: "basic",
            iconUrl: "/icons/alert.png",
            title: "Напоминашка",
            message: "Ахтунг! Пришло время напомнить!",
            buttons: [{title: "Спасибо"}],
            priority: 0,
        },
        (e) => {
            console.log("Last error:", chrome.runtime.lastError);
        }
    );
});
chrome.notifications.onButtonClicked.addListener(
    async (notificationId, buttonIndex) => {
        console.log({notificationId, buttonIndex});
    }
);
chrome.notifications.onClicked.addListener(async (notificationId) => {
    chrome.storage.sync.get(["timer"], (result) => {
        if (result.timer) {
            chrome.alarms.create({delayInMinutes: result.timer});
        }
    });
    chrome.notifications.clear(notificationId);
});
