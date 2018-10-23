<div>
        <p>Most played song is {this.state.songs[0].key} ({this.state.songs[0].value.plays} times) for a total of {numeral(this.state.songs[0].value.time / 1000).format('00:00:00')}, skipping {numeral(this.state.songs[0].value.missedTime / 1000).format('00:00:00')}!</p>
        <LineChart data={Computation.convetrData(this.state.months)} width="600" height="300" options={{ bezierCurve: true, bezierCurveTension: 0.8, pointDot: false }} />
        <ReactTable
          data={this.state.songs}
          columns={[
            {
              Header: "Song",
              columns: [
                {
                  Header: "Name",
                  id: "name",
                  accessor: d => d.value.name
                },
                {
                  Header: "Artist",
                  id: "artist",
                  accessor: d => d.value.artist
                }
              ]
            },
            {
              Header: "Info",
              columns: [
                {
                  Header: "Plays",
                  id: "plays",
                  accessor: d => d.value.plays

                },
                {
                  Header: "Listened Time",
                  id: "time",
                  accessor: d => d.value.time,
                  Cell: row => (
                    <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                  )
                },
                {
                  Header: "Skipped Time",
                  id: "missedTime",
                  accessor: d => d.value.missedTime,
                  Cell: row => (
                    <div>{numeral(row.value / 1000).format('00:00:00')}</div>
                  )
                }
              ]
            }
          ]
          }
          defaultPageSize={100}
          style={{
            height: "400px" // This will force the table body to overflow and scroll, since there is not enough room
          }}
        />
        {/* <ul>
          {daysLi}
        </ul> */}
      </div>;