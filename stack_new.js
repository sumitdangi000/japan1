//HTML
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>




//New Chart Initialization
// Chart initialization
        const createChart = (id, type, data, options) => {
            const ctx = document.getElementById(id).getContext('2d');
            return new Chart(ctx, {
                type,
                data,
                options: {
                    ...options,
                    responsive: true,
                    plugins: {
                        legend: { display: true }, // Show or hide legend
                        tooltip: {
                            enabled: true // Tooltips are optional now since we're showing percentage on the bar itself
                        },
                        datalabels: {
                            display: function (context) {
                                // Only show label for the highest dataset
                                const datasetIndex = context.datasetIndex;
                                const dataIndex = context.dataIndex;

                                // Get all dataset values for the current stack (bar)
                                const stackValues = context.chart.data.datasets.map(dataset => dataset.data[dataIndex]);

                                // Find the highest value in the stack
                                const highestValue = Math.max(...stackValues);

                                // Only display data label if the value is the highest in the stack
                                return context.dataset.data[dataIndex] === highestValue;
                            },
                            formatter: function (value, context) {
                                const total = context.chart.data.datasets
                                    .reduce((sum, dataset) => sum + dataset.data[context.dataIndex], 0);

                                const percentage = (value / total * 100).toFixed(2);
                                return percentage + '%'; // Return percentage as label
                            },
                            color: '#fff', // Label color
                            font: {
                                weight: 'bold'
                            },
                            rotation: -90 // Rotate label vertically
                        }
                    },
                    scales: {
                        x: {
                            stacked: true // Stacked x-axis
                        },
                        y: {
                            stacked: true, // Stacked y-axis
                            beginAtZero: true
                        }
                    }
                },
                plugins: [ChartDataLabels] // Register the datalabels plugin
            });
        };






// New chart - Stacked Bar Chart-------------------------------
createChart('peakProdStackedChart', 'bar', {
            labels: ['May', 'June', 'July', 'Aug', 'Sept'],
            datasets: [
                {
                    label: 'Revenue',
                    data: [286.1, 284.5, 300, 250, 320],
                    backgroundColor: '#1a73e8'
                },
                {
                    label: 'Total HC',
                    data: [200, 150, 50, 100, 120],
                    backgroundColor: '#e8711a'
                },
                {
                    label: 'Profit',
                    data: [100, 120, 130, 140, 150],
                    backgroundColor: '#1ae88b'
                },
                {
                    label: 'Expenses',
                    data: [80, 90, 70, 60, 50],
                    backgroundColor: '#e81a1a'
                }
            ]
        }, {
            scales: {
                x: {
                    stacked: true // Stacked x-axis
                },
                y: {
                    stacked: true, // Stacked y-axis
                    beginAtZero: true
                }
            }
        });