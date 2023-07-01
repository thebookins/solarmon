import React, { useEffect, useState, useCallback } from 'react'
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

const addDay = date => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    return newDate;
};

const subtractDay = date => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    return newDate;
};

const Chart = ({ google }) => {
    // const [data, setData] = useState();
    const [chart, setChart] = useState(null);

    const now = new Date();
    const [startDate, setStartDate] = useState(new Date(now.setHours(0, 0, 0, 0)));
    const [endDate, setEndDate] = useState(new Date(now.setHours(24, 0, 0, 0)));

    // new Date().setHours(0, 0, 0, 0)

    const oneDayForward = useCallback(() => {
        setStartDate(addDay)
        setEndDate(addDay);
    }, [setStartDate, setEndDate]);

    const oneDayBack = useCallback(() => {
        setStartDate(subtractDay);
        setEndDate(subtractDay);
    }, [setStartDate, setEndDate]);

    useEffect(() => {
        const getData = async () => {
            const dataTables = await Promise.all([482171, 482172, 482173].map(async id => {
                let response = await axios.get(url, {
                    params: {
                        apikey: 'b8dbcbcc505ff6e983133f4c3e4296ce',
                        id,
                        start: startDate.getTime(),
                        end: endDate.getTime(),
                        interval: 60
                    }
                });
        
                const array = response.data.map(sample => [new Date(sample[0]), sample[1]]);
                array.unshift(['time', `${id}`])
                return google.visualization.arrayToDataTable(array)
            }));
                
            let data = google.visualization.data.join(dataTables[0], dataTables[1], 'full', [[0, 0]], [1], [1]);
            return google.visualization.data.join(data, dataTables[2], 'full', [[0, 0]], [1, 2], [1]);
        }
    
        if (google) {
            getData().then(data => {
                const options = {
                    // Material design options
                    // chart: {
                    //   title: "Students' Final Grades",
                    //   subtitle: "based on hours studied",
                    // },
                    title: startDate.toDateString(),
                    hAxis: { title: 'time', minValue: startDate, maxValue: endDate},
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
    }, [google, startDate, endDate]);

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
          <button onClick={oneDayBack}>-</button>
          <button onClick={oneDayForward}>+</button>
          <div id="pizzaChart" className={!google ? 'd-none' : ''} />
        </>
      )
}

export default Chart


