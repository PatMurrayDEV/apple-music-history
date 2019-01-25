import moment from 'moment';
// import {timestamp} from 'moment-timezone';
import alasql from 'alasql';

alasql.options.errorlog = true; 

function varExists(el) { 
    if (el !== null && typeof el !== "undefined" ) { 
      return true; 
    } else { 
      return false; 
    } 
}

class Computation {

    static monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



    static convetrData(input) {
        var data = {
            labels: [],
            datasets: [{
                    label: "Played Hours",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "#FB7E2A",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                },
                // {
                //     label: "Skipped Hours",
                //     fillColor: "rgba(220,220,220,0.2)",
                //     strokeColor: "#BCD2C5",
                //     pointColor: "rgba(220,220,220,1)",
                //     pointStrokeColor: "#fff",
                //     pointHighlightFill: "#fff",
                //     pointHighlightStroke: "rgba(220,220,220,1)",
                //     data: []
                // }
            ]
        }

        for (let index = 0; index < input.length; index++) {
            const element = input[index];

            data.labels.push(`${Computation.monthNames[element.month]} ${element.year}`);
            data.datasets[0].data.push(element.duration / 1000 / 60 / 60);
            // data.datasets[1].data.push(element.missedTime / 1000 / 60 / 60);

        }

        console.log(data);

        return data;

    }

    static convertTime(timeinmilli) {
        var seconds = parseInt(timeinmilli = timeinmilli / 1000) % 60;
        var minutes = parseInt(timeinmilli = timeinmilli / 60) % 60;
        var hours = parseInt(timeinmilli = timeinmilli / 60) % 24;
        var days = parseInt(timeinmilli = timeinmilli / 24);

        var string = "";

        if (days > 0) {
            string = string + days + "d";
        }

        if (hours > 0) {
            string = string + " " + hours + "h";
        }

        if (minutes > 0) {
            string = string + " " + minutes + "m";
        }

        if (seconds > 0) {
            string = string + " " + seconds + "s";
        }

        return string;

    }



    static convertObjectToArray(array) {
        var result = [];
        for (var key in array) {
            if (array.hasOwnProperty(key)) {
                /* useful code here */
                result.push({
                    key: key,
                    value: array[key]
                });
            }
        }
        return result
    }

    static isSamePlay(play, previousPlay) {
        if (previousPlay != null &&
            Computation.isPlay(previousPlay) && 
            Computation.isPlay(play) &&
            previousPlay["Song Name"] === play["Song Name"] &&
            previousPlay["Artist Name"] === play["Artist Name"] &&
            previousPlay["End Position In Milliseconds"] === play["Start Position In Milliseconds"] &&
            previousPlay["End Reason Type"] === "PLAYBACK_MANUALLY_PAUSED") {
            return true;
        } else {
            return false;
        }
    }

    static isSamePlayNext(play, nextPlay) {
        if (nextPlay != null &&
            Computation.isPlay(nextPlay) && 
            Computation.isPlay(play) &&
            nextPlay["Song Name"] === play["Song Name"] &&
            nextPlay["Artist Name"] === play["Artist Name"] &&
            play["End Position In Milliseconds"] === nextPlay["Start Position In Milliseconds"] &&
            play["End Reason Type"] === "PLAYBACK_MANUALLY_PAUSED") {
            return true;
        } else {
            return false;
        }
    }

    static isPlay(play) {
        if (varExists(play["Song Name"]) && play["Song Name"].length > 0 && Number(play["Media Duration In Milliseconds"]) > 0 && play["Item Type"] !== "ORIGINAL_CONTENT_SHOWS" && play["Media Type"] !== "VIDEO" && play["End Reason Type"] !== "FAILED_TO_LOAD") {
            return true;
        } else {
            return false;
        }
    }

    

    static calculateTop(data, excludedSongs, callback) {

        let today = new Date().getFullYear();
        if (new Date().getMonth() < 5) {
            today = today - 1
        }
        var thisYear = {
            totalPlays: 0,
            totalTime: 0,
            year: today,
            artists: {}
        }
        var totals = {
            totalLyrics: 0
        };
        var heatmapData = [
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        ];
        var reasons = {
            "SCRUB_END": 0,
            "MANUALLY_SELECTED_PLAYBACK_OF_A_DIFF_ITEM": 0,
            "PLAYBACK_MANUALLY_PAUSED": 0,
            "FAILED_TO_LOAD": 0,
            "TRACK_SKIPPED_FORWARDS": 0,
            "SCRUB_BEGIN": 0,
            "NATURAL_END_OF_TRACK": 0,
            "TRACK_SKIPPED_BACKWARDS": 0,
            "NOT_APPLICABLE": 0,
            "PLAYBACK_STOPPED_DUE_TO_SESSION_TIMEOUT": 0,
            "TRACK_BANNED": 0,
            "QUICK_PLAY": 0,
            "": 0
        }



        var playsForDB = [];
        var idCounter = 1;

        var previousPlay;

        for (let index = 0; index < data.length; index++) {
            const play = data[index];


            if (varExists(play["Song Name"]) && varExists(play["Artist Name"]) && varExists(play["Play Duration Milliseconds"]) && varExists(play["Media Duration In Milliseconds"]) && varExists(play["Event End Timestamp"]) && varExists(play["UTC Offset In Seconds"])) {
                reasons[play["End Reason Type"]] = reasons[play["End Reason Type"]] + 1;

                if (Computation.isPlay(play)) {
                    const uniqueID = "'" + play["Song Name"] + "' by " + play["Artist Name"];
                    
    
    
                    if (Number(play["Play Duration Milliseconds"]) > 8000 && (play["Event Type"] === "PLAY_END" || play["Event Type"] === "")) {
    
                        var date = new Date(play["Event End Timestamp"]);

                        if (!Computation.isSamePlay(play, previousPlay)) {
                            var offsetForDB = Number(play["UTC Offset In Seconds"]) / 60;
                            var dateforDB = moment(date).utcOffset(offsetForDB);
                            playsForDB.push({
                                id: idCounter,
                                songID: uniqueID,
                                name: play["Song Name"],
                                artist: play["Artist Name"],
                                timeStamp: dateforDB.toDate(),
                                duration: Number(play["Play Duration Milliseconds"]),
                                excluded: excludedSongs.includes(uniqueID),
                                year: dateforDB.toDate().getFullYear(),
                                date: dateforDB.format('YYYY-MM-DD')
                            });
                            idCounter = idCounter + 1;
                        } else {
                            playsForDB[playsForDB.length - 1].duration = playsForDB[playsForDB.length - 1].duration + Number(play["Play Duration Milliseconds"]);
                        }
    
                    
    
                        if (!excludedSongs.includes(uniqueID)) {
    
                            // heatmap
                            var offset = Number(play["UTC Offset In Seconds"]) / 60;
                            var day = moment(date).utcOffset(offset);
                            var dayint = day.isoWeekday();
                            var hoursint = day.hours();
                            if (varExists(dayint) && dayint < 8 && dayint > 0 && varExists(hoursint) && varExists(heatmapData[dayint - 1][hoursint])  && varExists(Number(heatmapData[dayint - 1][hoursint])) && !isNaN(Number(heatmapData[dayint - 1][hoursint])) && !isNaN(Number(play["Play Duration Milliseconds"]))) {
                                heatmapData[dayint - 1][hoursint] = Number(heatmapData[dayint - 1][hoursint]) + Number(play["Play Duration Milliseconds"]);
                            }
                            
    
                            if (today === date.getFullYear()) {
                                if (thisYear.artists[play["Artist Name"]] == null) {
                                    thisYear.artists[play["Artist Name"]] = {
                                        plays: 0,
                                        time: 0,
                                        missedTime: 0
                                    };
                                }
        
                                if (!Computation.isSamePlay(play, previousPlay)) {
                                    thisYear.totalPlays = thisYear.totalPlays + 1;
                                    thisYear.artists[play["Artist Name"]].plays = thisYear.artists[play["Artist Name"]].plays + 1;
                                }
        
        
                                thisYear.totalTime = Number(thisYear.totalTime) + Number(play["Play Duration Milliseconds"]);
                                thisYear.artists[play["Artist Name"]].time = Number(thisYear.artists[play["Artist Name"]].time) + Number(play["Play Duration Milliseconds"]);        
                            }
    
                        } 
    
                    }
                }
            }

            

            if (play["Event Type"] === "LYRIC_DISPLAY") {
                totals.totalLyrics = totals.totalLyrics + 1;
            }

            previousPlay = play;
        }



        var thisYearArtsistsResult = Computation.convertObjectToArray(thisYear.artists);
        thisYearArtsistsResult = thisYearArtsistsResult.sort(function (a, b) {
            return b.value.time - a.value.time;
        });

        var thisYearResult = {
            totalPlays: thisYear.totalPlays,
            totalTime: thisYear.totalTime,
            year: today,
            artists: thisYearArtsistsResult,
            songs: alasql(`SELECT name, artist, COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE year = ${today} AND excluded = false GROUP BY name, artist ORDER BY SUM(duration) DESC`,[playsForDB])
        }


        var reasonsResults = Computation.convertObjectToArray(reasons);
        reasonsResults = reasonsResults.sort(function (a, b) {
            return b.value - a.value;
        });



        var tot = alasql(`SELECT COUNT(id) as plays, SUM(duration) as duration FROM ? WHERE excluded = false`,[playsForDB]);
        var results = {
            totals: {
                totalPlays: tot[0].plays,
                totalTime: tot[0].duration,
                totalLyrics: totals.totalLyrics,
                totalArtists: alasql(`SELECT COUNT(artist) as artists FROM ? WHERE excluded = false GROUP BY artist`,[playsForDB])[0].artists
            },
            songs: alasql(`SELECT name, artist, songID as key, COUNT(id) as plays, SUM(duration) as duration, MAX(excluded) as excluded FROM ?  GROUP BY name, artist, songID ORDER BY SUM(duration) DESC`,[playsForDB]),
            reasons: reasonsResults,
            excludedSongs: excludedSongs,
            hoursArray: heatmapData,
            thisYear: thisYearResult,
            plays: playsForDB
        }

        console.log(results);

        callback(results);

        // return 
    }
}

export default Computation;
