// Data for the stacked bar chart
const labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const datasets = [
    { label: 'Category A', data: [1200, 1400, 1300, 1500, 1600, 1700], backgroundColor: '#8481DD' },
    { label: 'Category B', data: [800, 900, 850, 950, 1000, 1050], backgroundColor: '#7CC674' },
    { label: 'Category C', data: [600, 700, 650, 750, 800, 850], backgroundColor: '#1a73e8' }
];

// Function to calculate percentage of each stack
function calculatePercentageData(datasets) {
    const percentageDatasets = datasets.map(dataset => {
        const dataWithPercent = dataset.data.map((value, index) => {
            const stackTotal = datasets.reduce((acc, curr) => acc + curr.data[index], 0); // Sum all values in the stack
            return (value / stackTotal) * 100; // Convert to percentage
        });
        return { ...dataset, data: dataWithPercent }; // Return updated dataset
    });
    return percentageDatasets;
}

// Create the chart
const ctx = document.getElementById('peakProdStackedChart').getContext('2d');
const peakProdStackedChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: calculatePercentageData(datasets)
    },
    options: {
        responsive: true,
        plugins: {
            datalabels: {
                display: (context) => {
                    // Display only if it's the lowest stack (first dataset)
                    return context.datasetIndex === datasets.length -3; // Lowest stack is the last dataset
                },
                formatter: (value, ctx) => {
                    return value.toFixed(2) + '%'; // Show percentage inside the bar for the lowest stack
                },
                color: '#fff', // Set label color
                anchor: 'center', // Place the label in the center of the bar
                align: 'center',  // Align the label in the middle
                font: {
                    weight: 'bold',
                    size: 12
                },
                rotation: -90, // Rotate the label vertically
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        const label = tooltipItem.dataset.label || '';
                        const value = tooltipItem.raw;
                        return label + ': ' + value.toFixed(2) + '%'; // Show percentage in tooltips
                    }
                }
            }
        },
        scales: {
            x: {
                            stacked: true,
                            ticks: {
                                font: {
                                    size: 14, // Customize the font size of the labels below the chart
                                    weight: 'bold'
                                },
                                color: '#333' // Customize the color of the labels
                            }
                        },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value + '%'; // Add '%' to the y-axis ticks
                    }
                }
            }
        }
    },
    plugins: [ChartDataLabels] // Enable the data labels plugin
});







// 2nd Chart
createChart('testChart', 'bar', {
        labels: ["Apr", "May", "June", "July", "Aug", "Sept"],
            datasets: [
                {
                    label: "Peak Head Count",
                    backgroundColor:"#8481DD",
                    data: [14303,14491,14636,14695,14849,15038]
                },
                {
                    label: "ME Prod HC",
                    backgroundColor:"#7CC674",
                    data: [10303,11491,10636,10695,11849,11038]
                }
            ]
    }, {
        responsive: true,
        plugins: { legend: { display: true } }
    });