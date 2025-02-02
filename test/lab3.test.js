const fs = require('fs');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync('../index.html', 'utf-8');
const $ = cheerio.load(htmlContent);

let errors = [];



// 2. Check for a table with the correct structure and content
const table = $('table');
const colorTable = $('table');
if (colorTable.length === 0) {
    errors.push('No <table> element found');
} else {
    let hasCorrectTable = false;
    colorTable.each(function () {
        const thead = $(this).find('thead');
        const tbody = $(this).find('tbody');
        if (thead.length > 0 && tbody.length > 0) {
            const ths = thead.find('th');
            if (ths.length === 3 &&
                ths.eq(1).text().trim() === 'Color' &&
                ths.eq(2).text().trim() === 'Color when mouse over') {
                const rows = tbody.find('tr');
                if (rows.length === 4) {
                    const expectedValues = [
                        ['span.myclass1', 'Pink', 'Blue'],
                        ['span.myclass2', 'Pink', 'Pink'],
                        ['span.myclass3', 'Orange', 'Orange'],
                        ['span.myclass4', 'Red', 'Red']
                    ];
                    let matches = true;
                    rows.each(function (index) {
                        const cells = $(this).find('td');
                        if (cells.length !== 3 ||
                            cells.eq(0).text().trim() !== expectedValues[index][0] ||
                            cells.eq(1).text().trim() !== expectedValues[index][1] ||
                            cells.eq(2).text().trim() !== expectedValues[index][2]) {
                            matches = false;
                            return false; // break out of each loop
                        }
                    });
                    if (matches) {
                        hasCorrectTable = true;
                        return false; // break out of each loop
                    }
                }
            }
        }
    });
    if (!hasCorrectTable) {
        errors.push('No <table> element found with the specified color values');
    }
}


if (errors.length > 0) {
    console.error('Error: Your submission did not meet the lab requirements. Errors: ');
    errors.forEach(error => console.error('- ' + error));
    process.exit(1);
} else {
    console.log('Success: Your submission meets the lab requirements');
}