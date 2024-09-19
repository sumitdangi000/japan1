using System.Data;
using System.Data.SqlClient;
using System.Configuration;

public class HomeController : Controller
{
    // Replace with your actual connection string from Web.config
    private string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

    [HttpGet]
    public JsonResult GetChartData()
    {
        List<string> labels = new List<string>();
        List<int> values = new List<int>();

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand("GetChartData", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        labels.Add(reader["Label"].ToString());
                        values.Add(Convert.ToInt32(reader["Value"]));
                    }
                }
            }
        }

        var data = new
        {
            labels = labels.ToArray(),
            values = values.ToArray()
        };

        return Json(data, JsonRequestBehavior.AllowGet);
    }
}











// Function to fetch data from SQL
async function fetchDataFromSQL() {
    try {
        const response = await fetch('/Home/GetChartData');
        const data = await response.json();

        // Assuming the response has labels and dataset arrays for charts
        const chartLabels = data.labels;
        const chartData = data.values;

        // Update chart with new data
        updateChart('revenueTrendChart', chartLabels, chartData);

        // Update table with the same data
        updateTable('revenueDetailsTable', chartLabels, chartData);
    } catch (error) {
        console.error("Error fetching data from SQL:", error);
    }
}

// Function to update the chart
function updateChart(chartId, labels, data) {
    const chart = Chart.getChart(chartId);
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Function to update the table
function updateTable(tableId, labels, data) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = ''; // Clear existing table rows
    labels.forEach((label, index) => {
        const row = `<tr><td>${label}</td><td>${data[index]}</td></tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Add event listener to the button
fetchDataBtn.addEventListener('click', function() {
    // Code to execute when the button is clicked
    console.log('Button clicked!');
    fetchDataFromSQL(); // Call the function to fetch data from SQL
});




const express = require('nodejs');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
    host: 'localhost:3306',
    user: 'root',
    password: '12345678',
    database: 'japan'
});

app.get('/api/getChartData', (req, res) => {
    const query = 'SELECT * FROM data'; // Customize your query
    db.query(query, (err, results) => {
        if (err) throw err;

        const labels = results.map(row => row.EmpNo);
        const values = results.map(row => row.EmpName);

        res.json({ labels, values });
    });
});

app.listen(3306, () => {
    console.log('Server running on port 3306');
});
