const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { Parser } = require('json2csv');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Function to scrape internships based on user-provided topic
async function scrapeInternshala(topic) {
    try {
        // Construct the URL dynamically based on the topic
        const searchUrl = `https://internshala.com/internships/${encodeURIComponent(topic)}-internship`;

        // Send a GET request to the search results page
        const response = await axios.get(searchUrl);

        // Load the HTML content into Cheerio
        const $ = cheerio.load(response.data);

        // Extract job titles and company names from the first 10 internships
        const internships = [];
        $('.internship_meta').slice(2, 12).each((index, element) => {
            const jobTitle = $(element).find('.company > .job-internship-name').text().trim();
            const companyName = $(element).find('.company > .company_name > .company_and_premium > .company-name').text().trim();
            const location = $(element).find('.individual_internship_details > .detail-row-1 > .locations').children('span:first').children('a').text().trim();
            const duration = $(element).find('.individual_internship_details > .detail-row-1 > .row-1-item').children('span:eq(1)').text().trim();
            const stipend = $(element).find('.individual_internship_details > .detail-row-1 > .row-1-item').children('span:eq(2)').text().trim();
            const link = `https://internshala.com${$(element).parent('div').attr('data-href')}`;
            internships.push({ jobTitle, companyName, location, duration, stipend, link });
        });

        return internships;
    } catch (error) {
        console.error('Error during scraping:', error);
        return [];
    }
}
function convertJsonToCsv(jsonData) {
    try {
      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(jsonData);
  
      // Write the CSV data to a file
      fs.writeFileSync('output.csv', csvData, 'utf8');
      console.log('JSON data successfully converted to CSV and saved to output.csv');
    } catch (error) {
      console.error('Error converting JSON to CSV:', error);
    }
  }

// API endpoint to get internships based on topic
app.get('/scrape/:topic', async (req, res) => {
    const topic = req.params.topic;
    const internships = await scrapeInternshala(topic);
    convertJsonToCsv(internships);
    res.json(internships);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
