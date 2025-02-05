const fs = require('fs');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync('../index.html', 'utf-8');
const $ = cheerio.load(htmlContent);

let errors = [];



// 2. Check for a table with the correct structure and content
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
            if (ths.length === 3){
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
                            cells.eq(0).text().trim().toLowerCase() !== expectedValues[index][0].toLowerCase() ||
                            cells.eq(1).text().trim().toLowerCase() !== expectedValues[index][1].toLowerCase() ||
                            cells.eq(2).text().trim().toLowerCase() !== expectedValues[index][2].toLowerCase()) {
                                
                            matches = false;
                            return false; // break out of each loop
                        }
                    });
                    if (matches) {
                        hasCorrectTable = true;
                        return false; // break out of each loop
                    }
                }else{
                    errors.push("Table has ${rows.length} rows, but it should have 4 rows");
                }
            } else{
                errors.push('The <table> should have 3 th elements. Double-check the table headers.');
            }
        }
    });
    if (!hasCorrectTable) {
        errors.push('Wrong answer to the The <table> question. Some of the answers inside the cells are incorrect. Double-check your responses.');
    }
}


if (errors.length > 0) {
    console.error('Error: Your submission did not meet the lab requirements. Errors: ');
    errors.forEach(error => console.error('- ' + error));
    process.exit(1);
} else {
    console.log('Success: Your submission meets the lab requirements');
}
