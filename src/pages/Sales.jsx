import { useState } from "react";
import { motion } from "framer-motion";

import {
  LuReceipt,
  LuTrendingUp,
  LuShoppingCart,
  LuClock,
  LuSearch,
  LuPlus,
} from "react-icons/lu";

import Layout from "../components/Layout";
import NewSaleModal from "../components/NewSaleModal";



export default function Sales(){


const [saleModalOpen,setSaleModalOpen]=useState(false);



const [sales,setSales]=useState([

{
id:"INV-001",
customer:"Ali Khan",
product:"Fresh Milk",
quantity:5,
amount:750,
date:"07 Jul 2026",
status:"Paid"
},


{
id:"INV-002",
customer:"Ahmed Raza",
product:"Yogurt",
quantity:2,
amount:480,
date:"07 Jul 2026",
status:"Pending"
}

]);



const [search,setSearch]=useState("");





const filteredSales = sales.filter((sale)=>

sale.customer
.toLowerCase()
.includes(search.toLowerCase())

||

sale.product
.toLowerCase()
.includes(search.toLowerCase())

);






// NEW SALE ADD

const addSale=(sale)=>{


setSales([

...sales,

{

id:sale.invoiceId,

customer:sale.customer,

product:sale.product,

quantity:sale.quantity,

amount:sale.amount,

date:sale.date,

status:sale.status

}

]);


setSaleModalOpen(false);


};







return(

<Layout title="Sales">


<div className="space-y-6">





{/* HEADER */}

<div className="
flex
justify-between
items-center
">


<div>

<h1 className="
text-3xl
font-bold
text-ink-900
">

Sales Management

</h1>


<p className="text-sm text-ink-500">

Manage sales, invoices and payments

</p>


</div>





<button

onClick={()=>setSaleModalOpen(true)}

className="
flex
items-center
gap-2
bg-primary-600
text-white
px-5
py-3
rounded-xl
"

>

<LuPlus/>

New Sale

</button>


</div>








{/* CARDS */}

<div className="
grid
grid-cols-1
md:grid-cols-4
gap-5
">


<Card
title="Today's Sales"
value="Rs 25000"
icon={LuReceipt}
/>


<Card
title="Orders"
value={sales.length}
icon={LuShoppingCart}
/>


<Card
title="Revenue"
value="Rs 180000"
icon={LuTrendingUp}
/>


<Card
title="Pending"
value="Rs 12000"
icon={LuClock}
/>


</div>









{/* SEARCH */}

<div className="
bg-white
border
rounded-2xl
p-5
">


<div className="
flex
items-center
gap-3
border
rounded-xl
px-4
py-3
">


<LuSearch className="text-gray-400"/>


<input

placeholder="Search customer or product..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="
outline-none
w-full
"

/>


</div>


</div>









{/* TABLE */}

<div className="
bg-white
border
rounded-2xl
overflow-hidden
">


<h2 className="
p-5
text-xl
font-semibold
border-b
">

Sales History

</h2>





<table className="w-full">


<thead className="bg-slate-50">

<tr>

<th className="p-4 text-left">
Invoice
</th>


<th className="p-4 text-left">
Customer
</th>


<th className="p-4 text-left">
Product
</th>


<th className="p-4 text-left">
Quantity
</th>


<th className="p-4 text-left">
Amount
</th>


<th className="p-4 text-left">
Status
</th>


</tr>

</thead>






<tbody>


{

filteredSales.map((sale,index)=>(


<motion.tr

key={index}

initial={{
opacity:0
}}

animate={{
opacity:1
}}

className="
border-t
hover:bg-slate-50
"

>


<td className="p-4">
{sale.id}
</td>


<td className="p-4">
{sale.customer}
</td>


<td className="p-4">
{sale.product}
</td>


<td className="p-4">
{sale.quantity}
</td>


<td className="p-4 font-semibold">

Rs {sale.amount}

</td>


<td className="p-4">


<span className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
text-xs
">

{sale.status}

</span>


</td>


</motion.tr>


))

}


</tbody>


</table>


</div>







<NewSaleModal

open={saleModalOpen}

onClose={()=>setSaleModalOpen(false)}

onSave={addSale}

/>





</div>


</Layout>


)

}








function Card({title,value,icon:Icon}){


return(

<motion.div

whileHover={{
y:-5
}}

className="
bg-white
border
rounded-2xl
p-5
shadow-card
"

>


<div className="
flex
justify-between
">


<div>

<p className="text-gray-500 text-sm">

{title}

</p>


<h2 className="
text-2xl
font-bold
mt-2
">

{value}

</h2>


</div>




<div className="
bg-primary-50
text-primary-600
p-3
rounded-xl
">

<Icon size={25}/>

</div>



</div>


</motion.div>

)

}