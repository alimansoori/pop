
function save2csv(fileName: string, data: any[]) {
    const fs = require("fs")
    const csvWriter = require('csv-write-stream');
    var writer = csvWriter({sendHeaders: false}); //Instantiate var
    // const csvFilename = "C:\some\path\myfile.csv";

// If CSV file does not exist, create it and add the headers
    if (!fs.existsSync(fileName)) {
        writer = csvWriter({sendHeaders: false});
        writer.pipe(fs.createWriteStream(fileName));
        writer.write({
            header1: 'url',
            // header2: 'amzUrl',
            header3: 'image',
            header4: 'price',
            header5: 'title',
            header6: 'availability'
        });
        writer.end();
    }

// Append some data to CSV the file
    writer = csvWriter({sendHeaders: false});
    writer.pipe(fs.createWriteStream(fileName, {flags: 'a'}));
    data.map(product => {
        writer.write(product);
    })
    writer.end();
}

export default save2csv