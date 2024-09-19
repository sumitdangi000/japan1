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
