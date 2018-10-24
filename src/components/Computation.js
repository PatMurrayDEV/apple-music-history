class Computation {

    static monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    

    static convetrData(input) {
        var data = {
            labels: [],
            datasets: [
                {
                    label: "Played Hours",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "#FB7E2A",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                },
                {
                    label: "Skipped Hours",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "#BCD2C5",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                }
            ]
        }

        for (let index = 0; index < input.length; index++) {
            const element = input[index];

            data.labels.push(element.key);
            data.datasets[0].data.push(element.value.time / 1000 / 60 / 60);
            data.datasets[1].data.push(element.value.missedTime / 1000 / 60 / 60);

        }

        console.log(data);

        return data;

    }

    static convertTime(timeinmilli) {
        var seconds     = parseInt(timeinmilli=timeinmilli/1000)%60;
        var minutes     = parseInt(timeinmilli=timeinmilli/60)%60;
        var hours       = parseInt(timeinmilli=timeinmilli/60)%24;
        var days        =  parseInt(timeinmilli=timeinmilli/24);

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

    static calculateTop(data) {

        var songs = {};
        var artists ={};
        var yearSongs = {};
        var days = {};
        var months = {};
        var totals = {
            totalPlays: 0,
            totalTime: 0
        };
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

        for (let index = 0; index < data.length; index++) {
            const play = data[index];


            if (play["Song Name"].length > 0 && Number(play["Media Duration In Milliseconds"]) > 0 && play["Item Type"] !== "ORIGINAL_CONTENT_SHOWS") {
                const uniqueID = "'" + play["Song Name"] + "' by " + play["Artist Name"];
                reasons[play["End Reason Type"]] = reasons[play["End Reason Type"]] + 1;


                if (Number(play["Play Duration Milliseconds"]) > 8000 && (play["Event Type"] === "PLAY_END" || play["Event Type"] === "")) {

                    if (songs[uniqueID] == null) {
                        songs[uniqueID] = {
                            plays: 0,
                            time: 0,
                            name: play["Song Name"],
                            artist: play["Artist Name"],
                            missedTime: 0
                        };
                    }

                    songs[uniqueID].plays = songs[uniqueID].plays + 1;
                    songs[uniqueID].time = Number(songs[uniqueID].time) + Number(play["Play Duration Milliseconds"]);
                    var missedMilliseconds = Number(play["Media Duration In Milliseconds"]) - Number(play["Play Duration Milliseconds"])
                    songs[uniqueID].missedTime = Number(songs[uniqueID].missedTime) + missedMilliseconds;

                    totals.totalPlays = totals.totalPlays + 1;
                    totals.totalTime = Number(totals.totalTime) + Number(play["Play Duration Milliseconds"]);

                    if (artists[play["Artist Name"]] == null) {
                        artists[play["Artist Name"]] = {
                            plays: 0,
                            time: 0,
                            missedTime: 0
                        };
                    }
                    artists[play["Artist Name"]].plays = artists[play["Artist Name"]].plays + 1;
                    artists[play["Artist Name"]].time = Number(artists[play["Artist Name"]].time) + Number(play["Play Duration Milliseconds"]);
                    artists[play["Artist Name"]].missedTime = Number(artists[play["Artist Name"]].missedTime) + missedMilliseconds;


                    var date = new Date(play["Event End Timestamp"]);
                    var dayID = date.getDate() + " " + Computation.monthNames[date.getMonth()] + ", " + date.getFullYear();

                    if (days[dayID] == null) {
                        days[dayID] = {
                            plays: 0,
                            time: 0
                        };
                    }

                    days[dayID].plays = days[dayID].plays + 1;
                    days[dayID].time = Number(days[dayID].time) + Number(play["Play Duration Milliseconds"]);


                    var monthID = date.getFullYear() + "-" + Computation.monthNames[date.getMonth()]

                    if (months[monthID] == null) {
                        months[monthID] = {
                            plays: 0,
                            time: 0,
                            missedTime: 0
                        };
                    }

                    months[monthID].plays = months[monthID].plays + 1;
                    months[monthID].time = Number(months[monthID].time) + Number(play["Play Duration Milliseconds"]);
                    months[monthID].missedTime = Number(months[monthID].missedTime) + missedMilliseconds;

                    var yearID = date.getFullYear()

                    if (yearSongs[yearID] == null) {
                        yearSongs[yearID] = {
                        };
                    }

                    if (yearSongs[yearID][uniqueID] == null) {
                        yearSongs[yearID][uniqueID] = {
                            plays: 0,
                            time: 0,
                            name: play["Song Name"],
                            artist: play["Artist Name"],
                            missedTime: 0
                        };
                    }

                    yearSongs[yearID][uniqueID].plays = yearSongs[yearID][uniqueID].plays + 1;
                    yearSongs[yearID][uniqueID].time = Number(yearSongs[yearID][uniqueID].time) + Number(play["Play Duration Milliseconds"]);
                    yearSongs[yearID][uniqueID].missedTime = Number(yearSongs[yearID][uniqueID].missedTime) + missedMilliseconds;

                }
            }

            // if (play["Item Type"] === "ORIGINAL_CONTENT_SHOWS") {

            // }


        }


        var result = Computation.convertObjectToArray(songs);
        result = result.sort(function (a, b) {
            return b.value.plays - a.value.plays;
        });

        var yearresult = Computation.convertObjectToArray(yearSongs);

        for (let index = 0; index < yearresult.length; index++) {
            yearresult[index].value = Computation.convertObjectToArray(yearresult[index].value);
            yearresult[index].value = yearresult[index].value.sort(function (a, b) {
                return b.value.plays - a.value.plays;
            });
        }

        var resultDays = Computation.convertObjectToArray(days);
        resultDays = resultDays.sort(function (a, b) {
            return b.value.time - a.value.time;
        });

        var resultMonths = Computation.convertObjectToArray(months);
        var artistsResults = Computation.convertObjectToArray(artists);
        artistsResults = artistsResults.sort(function (a, b) {
            return b.value.plays - a.value.plays;
        });

        var reasonsResults = Computation.convertObjectToArray(reasons);
        reasonsResults = reasonsResults.sort(function (a, b) {
            return b.value - a.value;
        });

        return {
            songs: result,
            days: resultDays,
            months: resultMonths,
            reasons: reasonsResults,
            years: yearresult,
            artists: artistsResults,
            totals: totals
        }
    }
}

export default Computation;