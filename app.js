'use strict';

let xlsx = require('xlsx');
let csv = require('csvtojson');
let fs = require('fs');
let file = process.argv[2];

let orderArray = [];

function Order(data){
    this.orderDate = data["Order Date"];
    this.orderNumber = data["Order Number"];
    this.firstName = data["First Name (Shipping)"];
    this.lastName = data["Last Name (Shipping)"];
    this.name = data.Name;
    this.productVariation = data["Product Variation"];
    this.quantity = data.Quantity;
    this.shippingMethod = data["Shipping Method Title"];
    this.billingAddress1 = data["Address 1&2 (Billing)"]
    this.shippingAddress1 = data["Address 1&2 (Shipping)"];
}


let csvToJson = (file) => {
    csv().fromFile(file)
    .then((obj) => {
            let jsonData = {};
            obj.forEach((order, idx) => {
                let newOrder = new Order(order);
                jsonData[idx]= newOrder;
                orderArray.push(newOrder);
            });
            console.log(orderArray) 
            fs.writeFile('./parsed.json', JSON.stringify(jsonData, null, 2), (err) => {
            if(err) throw err;
            console.log('data has been saved to parsed.json');
        });
  });    
}


let xlsxToCsv = (file) => {
    let buf = fs.readFileSync(file);
    let workbook = xlsx.read(buf, {type: 'buffer'});
    let parsedFile = './parsed.csv'
    xlsx.writeFile(workbook, parsedFile, {type: 'csv'});

    return csvToJson(parsedFile);
}




xlsxToCsv(file);