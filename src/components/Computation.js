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
        var yearSongs = {};
        var days = {};
        var months = {}
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

            reasons[play["End Reason Type"]] = reasons[play["End Reason Type"]] + 1;

            if (play["Song Name"].length > 0) {
                const uniqueID = "'" + play["Song Name"] + "' by " + play["Artist Name"];

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


                    var date = new Date(play["Event End Timestamp"]);
                    var dayID = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();

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
        var resultMonths = Computation.convertObjectToArray(months);


        return {
            songs: result,
            days: resultDays,
            months: resultMonths,
            reasons: reasons,
            years: yearresult
        }
    }
}

export default Computation;