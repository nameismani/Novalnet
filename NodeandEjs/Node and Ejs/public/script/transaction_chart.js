
const top_image = document.getElementById('top_image')



$(document).ready(()=>{
    fetch('http://localhost:8000/get_user_details', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },

    }).then((res) => res.json())
        .then((data) => {

            
            $('#top_name').html(`${data.data.name}`)
            top_image.src = `uploads/${data.data.Image}`
           
        })
    fetch('json/data.json',{
        method:"GET",
        headers:{
            "Content-Type" : "application/json"
        }
    })
    .then(data =>data.json())
    .then((data) => {


      const values = data.transaction[0]

        var options = {
            series: [{
            name: 'Transaction',
            data: values.all.month
          }],
            chart: {
            height: 350,
            type: 'bar',
          },
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val 
            },
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ["#304758"]
            }
          },
          
          xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            position: 'top',
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                }
              }
            },
            tooltip: {
              enabled: true,
            }
          },
          yaxis: {
            title: { text: 'Count of Transaction' },
            axisBorder: {
              show: true
            },
            axisTicks: {
              show: true,
            },
            labels: {
              
              formatter: function (val) {
                return val 
              }
            }
          
          },
          title: {
            text: 'Monthly Transaction Count in Germany, 2023',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
              color: '#444'
            }
          },
      
          };
  
          var chart = new ApexCharts(document.querySelector("#transaction_chart"), options);
          chart.render();

          var options_2 = {
            series: [{
            name: 'Success',
            data: values.success.month
          }, {
            name: 'Failure',
            data: values.failure.month
          }, {
            name: 'Pending',
            data: values.onhold.month
          }],
            chart: {
            type: 'bar',
            height: 350
          },
          colors:['rgb(0, 227, 220)', 'rgba(255,0,0,0.8)', 'rgb(254, 176, 25)'],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: '55%',
              endingShape: 'rounded'
            },
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
          },
          xaxis: {
            categories: ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',"Nov","Dec"],
          },
          yaxis: {
            title: {
              text: 'Percentage '
            }
          },
          fill: {
            opacity: 1
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return   val + "%"
              }
            }
          }
          };
  
          var chart2 = new ApexCharts(document.querySelector("#transaction_detail_chart"), options_2);
          chart2.render();
console.log(values)
          var options_3 = {
            series: [values.success.credit.year,values.failure.credit.year,values.onhold.credit.year],
            chart: {
            width: 380,
            type: 'pie',
          },
          colors:['rgb(0, 227, 220)', 'rgba(255,0,0,0.8)', 'rgb(254, 176, 25)'],
          labels: ['Success', 'Failure', 'Pending'],
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
          };
  
          var chart3 = new ApexCharts(document.querySelector("#credit_card_chart"), options_3);
          chart3.render();

         
      
        var options4 = {
            series: [values.success.debit.year,values.failure.debit.year,values.onhold.debit.year],
            chart: {
            height: 350,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '22px',
                },
                value: {
                  fontSize: '16px',
                },
                total: {
                  show: true,
                  label: 'Total',
                  formatter: function (w) {
                    // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                    return 100 + '%';
                  }
                }
              }
            }
          },
          colors:['rgb(0, 227, 150)', 'rgba(255,0,0,0.8)', 'rgb(254, 176, 25)'],
          labels: ['Success', 'Failure', 'Pending'],
          };
  
          var chart4 = new ApexCharts(document.querySelector("#dedit_card_chart"), options4);
          chart4.render();

          var options5 = {
            series: [values.success.invoice.year,values.failure.invoice.year,values.onhold.invoice.year],
            chart: {
            width: 380,
            type: 'pie',
          },
          labels: ["Success","Failure","Pending"],
          theme: {
            monochrome: {
              enabled: true
            }
          },
          plotOptions: {
            pie: {
              dataLabels: {
                offset: -3
              }
            }
          },
          title: {
            text: ""
          },
          dataLabels: {
            formatter(val, opts) {
              const name = opts.w.globals.labels[opts.seriesIndex]
              return [name, val.toFixed(1) + '%']
            }
          },
          legend: {
            show: false
          },
         
          };
  
          var chart5 = new ApexCharts(document.querySelector("#invoice_payment"), options5);
          chart5.render();
        

    })

   
})


// document.addEventListener("DOMContentLoaded", function () {
//     console.log('value',trans_value)
//     window.ApexCharts && (new ApexCharts(document.getElementById('chart-mentions'), {
//         chart: {
//             type: "bar",
//             fontFamily: 'inherit',
//             height: 240,
//             parentHeightOffset: 0,
//             toolbar: {
//                 show: false,
//             },
//             animations: {
//                 enabled: false
//             },
//             stacked: true,
//         },
//         plotOptions: {
//             bar: {
//                 columnWidth: '50%',
//             }
//         },
//         dataLabels: {
//             enabled: false,
//         },
//         fill: {
//             opacity: 1,
//         },
//         series: [{
//             name: "success",
//             data:[]
//         },{
//             name: "failure",
//             data: []
//         },{
//             name: "onhold",
//             data: []
//         }],
//         tooltip: {
//             theme: 'dark'
//         },
//         grid: {
//             padding: {
//                 top: -20,
//                 right: 0,
//                 left: -4,
//                 bottom: -4
//             },
//             strokeDashArray: 4,
//             xaxis: {
//                 lines: {
//                     show: true
//                 }
//             },
//         },
//         xaxis: {
//             labels: {
//                 padding: 0,
//             },
//             tooltip: {
//                 enabled: false
//             },
//             axisBorder: {
//                 show: false,
//             },
//             type: 'datetime',
//         },
//         yaxis: {
//             labels: {
//                 padding: 4
//             },
//         },
//         labels: [
//             '2020-06-21', '2020-06-22', '2020-06-23', '2020-06-24', '2020-06-25', '2020-06-26', '2020-06-27', '2020-06-28', '2020-06-29', '2020-06-30', '2020-07-01', '2020-07-02', '2020-07-03', '2020-07-04', '2020-07-05', '2020-07-06', '2020-07-07', '2020-07-08', '2020-07-09', '2020-07-10', '2020-07-11', '2020-07-12', '2020-07-13', '2020-07-14', '2020-07-15', '2020-07-16', '2020-07-17', '2020-07-18', '2020-07-19', '2020-07-20', '2020-07-21', '2020-07-22', '2020-07-23', '2020-07-24', '2020-07-25', '2020-07-26', '2020-07-27'
//         ],
//         colors: [tabler.getColor("primary"), tabler.getColor("primary", 0.8), tabler.getColor("green", 0.8)],
//         legend: {
//             show: false,
//         },
//     })).render();
// });
// @formatter:on