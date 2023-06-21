import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Spinner } from "react-bootstrap";
// import { Chart as GoogleChart } from 'react-google-charts'
// import useGoogleCharts from './useGoogleCharts';

const url = 'https://bookins-proxy.herokuapp.com/https://emoncms.org/feed/data.json'
// const url = 'https://cors-anywhere.herokuapp.com/https://emoncms.org/feed/data.json'
// const url = 'https://emoncms.org/feed/data.json'
// const url = 'https://emoncms.org/feed/data.json?
// id=482171&
// start=1687235095&
// end=1687238695&
// interval=60&
// average=0
// &timeformat=unix&skipmissing=0&limitinterval=0&delta=0'


const Chart = ({ google }) => {
    // const [data, setData] = useState();
    const [chart, setChart] = useState(null);

    const getData = async (startTime, endTime) => {
        const dataTables = await Promise.all([482171, 482172, 482173].map(async id => {
            let response = await axios.get(url, {
                params: {
                    apikey: 'b8dbcbcc505ff6e983133f4c3e4296ce',
                    id,
                    start: startTime,
                    end: endTime,
                    interval: 60
                }
            });
    
            const array = response.data;
            array.unshift(['time', `${id}`])
            return google.visualization.arrayToDataTable(array)
        }));

        // let data = new google.visualization.DataTable();

        let data = google.visualization.data.join(dataTables[0], dataTables[1], 'full', [[0, 0]], [1], [1]);
        return google.visualization.data.join(data, dataTables[2], 'full', [[0, 0]], [1, 2], [1]);
        // _data = [
        //     ['time', 'roof'],
        //     [0, 4],
        //     [1, 3],
        //     [2, 4]
        // ]


        // const roof = google.visualization.arrayToDataTable(_data);

        // response = await axios.get(url, {
        //     params: {
        //         apikey: 'b8dbcbcc505ff6e983133f4c3e4296ce',
        //         id: 482172, // tank
        //         start: lastMidnight.getTime(),
        //         end: lastMidnight.getTime() + 24 * 60 * 60 * 1000,
        //         interval: 60
        //     }
        // });

        // _data = response.data;
        // _data.unshift(['time', 'tank'])

        // _data = [
        //     ['time', 'tank'],
        //     [0, 0],
        //     [1, 1],
        //     [2, 1]
        // ]

        // const tank = window.google.visualization.arrayToDataTable(_data);
        // console.log(tank)

        // return google.visualization.data.join(roof, tank, 'full', [[0, 0]], [1], [1])
    }
    


    useEffect(() => {
        if (google && !chart) {
            const now = new Date();
            const lastMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
            const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime();
    
            getData(lastMidnight, nextMidnight).then(data => {
                const options = {
                    // Material design options
                    chart: {
                      title: "Students' Final Grades",
                      subtitle: "based on hours studied",
                    },
                    hAxis: { title: 'time', minValue: lastMidnight, maxValue: nextMidnight},
                    vAxis: { 
                        title: 'temperature (\u2103)',
                        minValue: 0,
                        maxValue: 80
                    },
                    interpolateNulls: false,
                    lineWidth: 1,
                    width: 1000,
                    height: 600
                  };

                // Instantiate and draw our chart, passing in some options.
                const newChart = new google.visualization.LineChart(document.getElementById('pizzaChart'));
                newChart.draw(data, options);
                setChart(newChart);            
            })
            // Create the data table.
            // const data = new google.visualization.DataTable();
            // data.addColumn('string', 'Topping');
            // data.addColumn('number', 'Slices');
            // data.addRows([
            //     ['Mushrooms', 3],
            //     ['Onions', 1],
            //     ['Olives', 1],
            //     ['Zucchini', 1],
            //     ['Pepperoni', 2]
            // ]);

            // // Set chart options
            // var options = {'title':'How Much Pizza I Ate Last Night',
            //             'width':400,
            //             'height':300};

            // // Instantiate and draw our chart, passing in some options.
            // const newChart = new google.visualization.PieChart(document.getElementById('pizzaChart'));
            // newChart.draw(data, options);

            // setChart(newChart);
        }
    }, [google, chart, getData]);

    // useEffect(() => {
    //     async function loadData () {
    //         setData(_data)

    //         console.log(data)
    //         // getEntries(start: Date, id: number): Promise<Entry[]> {
    //         //       apikey: 'b8dbcbcc505ff6e983133f4c3e4296ce',
    //         //       id,
    //         //       start: start.getTime(),
    //         //       end: start.getTime() + 24 * 60 * 60 * 1000,
    //         //       interval: 60
    //         //     }}).toPromise()
    //         //                .then(response => response.json().map(item => {
    //         //                  return {
    //         //                    timestamp: item[0],
    //         //                    value: item[1]
    //         //                    // status: {
    //         //                    //   roof: item[1],
    //         //                    //   tank: 100,
    //         //                    //   inlet: 100,
    //         //                    //   solar: 0,
    //         //                    //   backup:0
    //         //                    // }
    //         //                  }
    //         //                }))
    //         //                .then(json => json as Entry[])
    //         //                .then((entries: Entry[]) => {
    //         //                  return entries.map(entry => {
    //         //                    entry.timestamp = new Date(entry.timestamp);
    //         //                    return entry;
    //         //                  });
    //         //                })
    //         //                .catch(this.handleError);
    //     }
    //     loadData();
    // }, []);

      
      
 
    // return <GoogleChart
    //   chartType="Line"
    //   width="80%"
    //   height="400px"
    //   data={data}
    //   options={options}
    // />
    return (
        <>
          {!chart && <Spinner />}
          <div id="pizzaChart" className={!google ? 'd-none' : ''} />
        </>
      )
}

export default Chart


