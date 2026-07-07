// data/storeData.js


export let inventory = [

{
id:1,
product:"Fresh Milk",
category:"Milk",
quantity:120,
unit:"Liter",
price:150
},

{
id:2,
product:"Yogurt",
category:"Dairy",
quantity:15,
unit:"KG",
price:240
},

{
id:3,
product:"Butter",
category:"Dairy",
quantity:40,
unit:"Packet",
price:230
},

{
id:4,
product:"Paneer",
category:"Cheese",
quantity:5,
unit:"KG",
price:320
},

{
id:5,
product:"Fresh Cream",
category:"Butter & Cream",
quantity:6,
unit:"Liter",
price:200
}

];




// STOCK KAM KARNA

export function reduceStock(productName, qty){


inventory = inventory.map((item)=>{


if(item.product === productName){

return {
...item,
quantity:item.quantity - Number(qty)
}

}


return item;


});


}




export function getStockStatus(quantity){


if(quantity <= 0){

return "Out of Stock";

}


if(quantity <= 10){

return "Low Stock";

}


return "Available";


}