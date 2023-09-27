const crypto = require('crypto')
const fs = require('fs')
const puppeteer = require('puppeteer')

// Replace with the desired number of pages to be scraped (0-100)
const maxPageNumber = 50

// Function to generate the URL for each page dynamically
function generateURL(pageNumber) {
  const urlElements = {
    domain: 'www.topuniversities.com',
    path: ['university-rankings', 'world-university-rankings', '2024'],
    queryParams: {
      page: pageNumber, // Set the page number dynamically
    },
  }

  // Construct the URL using the 'urlElements' object
  const { domain, path, queryParams } = urlElements
  const pathString = path.join('/')
  const queryParamsString = new URLSearchParams(queryParams)

  const generatedURL = `https://${domain}/${pathString}?${queryParamsString}`
  //generated url will look like    https://www.topuniversities.com/university-rankings/world-university-rankings/2024?page=1

  return generatedURL
}

// Function to generate unique IDs for each college
function generateUniqueId(collegename) {
  // Using college name to generate id as it most likely won't change
  const id = crypto
    .createHash('sha256')
    .update(collegename)
    .digest('hex')
    .substr(0, 16)
  return id
}

// Main function to scrape the data and save it to a JSON file
;(async () => {
  console.log('Scraping Data ... please wait ... :) ')
  const allData = []
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  // Expose the generateUniqueId function to the page context so that it can be used inside page.evaluate
  await page.exposeFunction('generateUniqueId', generateUniqueId)

  for (let pgno = 0; pgno <= maxPageNumber; pgno++) {
    const url = generateURL(pgno)

    await page.goto(url)
    await page.waitForSelector('.uni-link')

    const pageData = await page.evaluate(async () => {
      const colleges = []
      const rows = document.querySelectorAll('.api-ranking-css.normal-row')

      // Use Promise.all to await all asynchronous operations inside the loop
      await Promise.all(
        Array.from(rows).map(async (row, index) => {
          const college = {}
          let collegename = row.querySelector('.uni-link').textContent.trim()

          college.id = await generateUniqueId(collegename)
          college.name = collegename
          college.score = row
            .querySelector('.overall-score-span')
            .textContent.trim()
          college.address = row.querySelector('.location').textContent.trim()
          college.collegePage = row.querySelector('.uni-link').href

          colleges.push(college)
        })
      )

      return colleges
    })

    allData.push(...pageData)
  }

  await browser.close()

  // Save the colleges with unique IDs to a new JSON file
  const fileName = 'university_data.json' // Update with your desired file name
  const jsonData = JSON.stringify(allData, null, 2)

  fs.writeFile(fileName, jsonData, (err) => {
    if (err) {
      console.error('Error writing to the file:', err)
    } else {
      console.log(
        'Colleges data has been saved to',
        fileName,
        'successfully! :)'
      )
    }
  })
})()
