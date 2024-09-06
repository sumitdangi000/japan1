// Function to toggle table visibility
function showDetails(tableId) {
    var table = document.getElementById(tableId);
    if (table.style.display === "none") {
        table.style.display = "block";
    } else {
        table.style.display = "none";
    }
}

// Function to download table data as an Excel file
function downloadExcel(tableId, filename) {
    var table = document.getElementById(tableId);
    var wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    XLSX.writeFile(wb, filename);
}

// Include the XLSX library for exporting Excel files
var script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
document.head.appendChild(script);

document.addEventListener('DOMContentLoaded', function() {
    const chartModal = document.getElementById('chartModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalChartTitle = document.getElementById('modalChartTitle');
    const modalChart = document.getElementById('modalChart').getContext('2d');
    let activeChart; // To store the current chart instance


    // Ensure the modal and overlay are hidden on page load
    chartModal.style.display = 'none';
    modalOverlay.style.display = 'none';

    // Button to take Screenshot of the page and save with today's date
    document.getElementById('printBtn').addEventListener('click', function () {
        html2canvas(document.body).then(function(canvas) {
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const today = new Date();
                const formattedDate = today.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const a = document.createElement('a');
                a.href = url;
                a.download = `Japan Dashboard - ${formattedDate}.png`;
                a.click();
                URL.revokeObjectURL(url);
            }, 'image/png');
        });
    });







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
                legend: { display: true }, // or false depending on your preference
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            let label = tooltipItem.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += Math.round(tooltipItem.raw * 100) / 100;

                            // Additional information for hover
                            let additionalInfo = '';
                            if (tooltipItem.dataset.label === 'Revenue') {
                                additionalInfo = `\nProjected: ${tooltipItem.raw * 1.1}`;
                            } else if (tooltipItem.dataset.label === 'Total HC') {
                                additionalInfo = `\nGrowth Rate: ${(tooltipItem.raw / 17500 * 100).toFixed(2)}%`;
                            }
                            // You can add more conditions based on the dataset.label or other data

                            return label + additionalInfo;
                        },
                        afterLabel: function (tooltipItem) {
                            // Any additional details that should be shown after the label
                            return 'Lekin aur kya dikhana hai wo toh bata bhai';
                        }
                    },
                    backgroundColor: '#f1f1f1', // Customize tooltip background color
                    titleColor: '#000',          // Customize title color
                    bodyColor: '#000',           // Customize body text color
                    borderColor: '#0072ce',      // Tooltip border color
                    borderWidth: 1,              // Tooltip border width
                }
            }
        }
    });
};




    createChart('revenueTrendChart', 'line', {
        labels: ['Q1 Act', 'Q2 BE', 'Q2 BE', 'Q2 ', 'Q2 '],
        datasets: [{
            label: 'Revenue',
            data: [286.1, 284.5, -152.4, 132.1],
            backgroundColor: ['#1a73e8', '#1a73e8', '#e8711a', '#1a73e8', '#1a73e8']
        }]
    }, {
        responsive: true,
        plugins: {
            legend: { display: false }
        }
    });

    createChart('utilizationChart', 'bar', {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            { label: 'Total HC', data: [17703, 17601, 17494, 17548, 17577, 17583], backgroundColor: '#1a73e8' },
            { label: 'Leave', data: [310, 310, 310, 310, 310, 310], backgroundColor: '#e8711a' },
            { label: 'Pre-Production', data: [820, 820, 820, 820, 820, 820], backgroundColor: '#34a853' },
            { label: 'Prod', data: [8225, 8225, 8225, 8225, 8225, 8225], backgroundColor: '#fbbc05' }
        ]
    }, {
        responsive: true,
        plugins: { legend: { display: true } }
    });

    createChart('peakProdChart', 'line', {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [{
            label: 'Peak Prod HC',
            data: [14928, 14928, 14928, 14928, 14928, 14928],
            borderColor: '#1a73e8',
            fill: false
        }]
    }, {
        responsive: true,
        plugins: { legend: { display: true } }
    });

    createChart('preProductionChart', 'pie', {
            labels: ['BGV', 'Client onboarding', 'Evaluating', 'Not Updated'],
            datasets: [{
                data: [50, 76, 321, 436],
                backgroundColor: ['#1a73e8', '#34a853', '#fbbc05', '#e8711a']
            }]
        }, {
            responsive: true,
            plugins: { legend: { display: true } }
        });
     createChart('demandDataChart', 'doughnut', {
            labels: ['Open', 'Abandon', 'Closed', 'Expired', 'Fulfilled'],
            datasets: [{
                data: [524, 1819, 2649, 126, 1077],
                backgroundColor: ['#1a73e8', '#fbbc05', '#34a853', '#e8711a', '#964B00']
            }]
        }, {
            responsive: true,
            plugins: { legend: { display: true } }
        });

    createChart('roleMixChart', 'bar', {
        labels: ['JL6', 'JL5', 'JL4', 'JL3A', 'JL3B'],
        datasets: [
            { label: 'Role Mix', data: [18, 40, 24, 12.3, 5.8], backgroundColor: '#1a73e8' },
            { label: 'Ideal Mix', data: [8, 23, 23, 23, 23], backgroundColor: '#e8711a' }
        ]
    }, {
        responsive: true,
        plugins: { legend: { display: true } }
    });
      createChart('visaUtilizationChart', 'bar', {
            labels: ['May', 'Jun', 'Jul', 'Curr Week'],
            datasets: [
                { label: 'Valid Visa', data: [71.7, 72.5, 72.3, 69.5], backgroundColor: '#1a73e8' },
                { label: 'Valid Petition', data: [17.7, 17.7, 17.7, 17.7], backgroundColor: '#e8711a' }
            ]
        }, {
            responsive: true,
            plugins: { legend: { display: true } }
        });


    createChart('pendingBillingChart', 'doughnut', {
            labels: ['T&M', 'FP'],
            datasets: [{
                data: [22562, 71008],
                backgroundColor: ['#1a73e8', '#e8711a']
            }]
        }, {
            responsive: true,
            plugins: { legend: { display: true } }
        });
        createChart('onsiteBenchChart', 'bar', {
                labels: ['<= 7 days', '8-30 days', '31-60 days', '> 60 days'],
                datasets: [{
                    label: 'Onsite Bench',
                    data: [106, 24, 30, 29],
                    backgroundColor: ['#e8711a', '#fbbc05', '#34a853', '#1a73e8']
                }]
            }, {
                responsive: true,
                plugins: { legend: { display: true } }
            });
        createChart('visaUtilizationChart1', 'bar', {
                    labels: ['May', 'Jun', 'Jul', 'Curr Week'],
                    datasets: [
                        { label: 'Valid Visa', data: [71.7, 72.5, 72.3, 69.5], backgroundColor: '#1a73e8' },
                        { label: 'Valid Petition', data: [17.7, 17.7, 17.7, 17.7], backgroundColor: '#e8711a' }
                    ]
                }, {
                    responsive: true,
                    plugins: { legend: { display: true } }
                });
        createChart('onsiteBenchChart1', 'bar', {
                        labels: ['<= 7 days', '8-30 days', '31-60 days', '> 60 days'],
                        datasets: [{
                            label: 'Onsite Bench',
                            data: [106, 24, 30, 29],
                            backgroundColor: ['#e8711a', '#fbbc05', '#34a853', '#1a73e8']
                        }]
                    }, {
                        responsive: true,
                        plugins: { legend: { display: true } }
                    });
    // Handle chart modal functionality(bar)
    document.querySelectorAll('.chart-container1 canvas').forEach(function(chartCanvas) {
        chartCanvas.addEventListener('click', function() {
            const chartId = chartCanvas.getAttribute('id');
            const originalChart = Chart.getChart(chartId); // Get the original chart instance
            const chartHeading = chartCanvas.closest('.dashboard-section').querySelector('h3').textContent;

            // Set the modal title to the chart name
            modalChartTitle.textContent = chartHeading;

            // Destroy any existing chart in the modal
            if (activeChart) {
                activeChart.destroy();
            }

            // Create a new chart in the modal with the same configuration as the original chart
            activeChart = new Chart(modalChart, {
                type: originalChart.config.type,
                data: originalChart.config.data,
                options: originalChart.config.options
            });

            modalOverlay.style.display = 'block'; // Show the overlay
            chartModal.style.display = 'flex'; // Show the modal
        });
    });

    // Handle chart modal functionality(pie)
        document.querySelectorAll('.chart-pie canvas').forEach(function(chartCanvas) {
            chartCanvas.addEventListener('click', function() {
                const chartId = chartCanvas.getAttribute('id');
                const originalChart = Chart.getChart(chartId); // Get the original chart instance
                const chartHeading = chartCanvas.closest('.dashboard-section').querySelector('h3').textContent;

                // Set the modal title to the chart name
                modalChartTitle.textContent = chartHeading;

                // Destroy any existing chart in the modal
                if (activeChart) {
                    activeChart.destroy();
                }

                // Create a new chart in the modal with the same configuration as the original chart
                activeChart = new Chart(modalChart, {
                    type: originalChart.config.type,
                    data: originalChart.config.data,
                    options: originalChart.config.options
                });

                modalOverlay.style.display = 'block'; // Show the overlay
                chartModal.style.display = 'flex'; // Show the modal
            });
        });


    // Close the modal when the user clicks on (X)
    document.querySelector('.close').addEventListener('click', function() {
        chartModal.style.display = 'none';
        modalOverlay.style.display = 'none'; // Hide the overlay
    });




});

