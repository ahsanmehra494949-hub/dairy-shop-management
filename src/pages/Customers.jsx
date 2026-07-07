import { useState } from "react";
import { motion } from "framer-motion";

import {
  LuUsers,
  LuUserPlus,
  LuShoppingCart,
  LuTrendingUp,
  LuSearch,
} from "react-icons/lu";

import Layout from "../components/Layout";
import CustomerModal from "../components/CustomerModal";



export default function Customers(){



const [modalOpen,setModalOpen]=useState(false);



const [customers,setCustomers]=useState([

{
id:1,
name:"Ali Khan",
phone:"0300-1234567",
orders:12,
total:"Rs 25,000",
status:"Active"
},


{
id:2,
name:"Ahmed Raza",
phone:"0312-9876543",
orders:8,
total:"Rs 14,500",
status:"Active"
},


{
id:3,
name:"Sara Ahmed",
phone:"0321-5556789",
orders:5,
total:"Rs 8,900",
status:"Inactive"
}

]);




const [search,setSearch]=useState("");






const filteredCustomers = customers.filter((customer)=>

customer.name
.toLowerCase()
.includes(search.toLowerCase())

||

customer.phone.includes(search)

);






// ADD CUSTOMER

const addCustomer=(customer)=>{


setCustomers([

...customers,

customer

]);


};







// ACTIVE INACTIVE CHANGE

const changeStatus=(id)=>{


setCustomers(

customers.map(customer=>


customer.id===id

?

{

...customer,

status:
customer.status==="Active"
?
"Inactive"
:
"Active"

}

:

customer


)

);


};








return(


<Layout title="Customers">


<div className="space-y-6">





{/* HEADER */}

<div className="
flex
justify-between
items-center
">


<div>

<h1 className="text-3xl font-bold text-ink-900">

Customer Management

</h1>


<p className="text-sm text-ink-500">

Manage customers and purchase history

</p>


</div>





<button

onClick={()=>setModalOpen(true)}

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


<LuUserPlus/>

Add Customer


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
title="Total Customers"
value={customers.length}
icon={LuUsers}
/>


<Card
title="Total Orders"
value="580"
icon={LuShoppingCart}
/>


<Card
title="Revenue"
value="Rs 450,000"
icon={LuTrendingUp}
/>


<Card
title="Active Customers"
value={
customers.filter(
x=>x.status==="Active"
).length
}
icon={LuUsers}
/>



</div>








{/* SEARCH */}


<div className="
bg-white
p-5
rounded-2xl
border
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


<LuSearch/>


<input

placeholder="Search customer..."

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
rounded-2xl
border
overflow-hidden
">


<h2 className="
p-5
text-xl
font-semibold
border-b
">

Customer List

</h2>





<table className="w-full">


<thead className="bg-slate-50">

<tr>

<th className="p-4 text-left">
Name
</th>


<th className="p-4 text-left">
Phone
</th>


<th className="p-4 text-left">
Orders
</th>


<th className="p-4 text-left">
Total Spend
</th>


<th className="p-4 text-left">
Status
</th>


<th className="p-4 text-left">
Action
</th>


</tr>


</thead>






<tbody>


{

filteredCustomers.map(customer=>(


<tr

key={customer.id}

className="
border-t
"


>


<td className="p-4 font-medium">

{customer.name}

</td>


<td className="p-4">

{customer.phone}

</td>


<td className="p-4">

{customer.orders}

</td>


<td className="p-4">

{customer.total}

</td>



<td className="p-4">


<span className={`
px-3
py-1
rounded-full
text-xs

${
customer.status==="Active"

?

"bg-green-100 text-green-700"

:

"bg-gray-100 text-gray-700"

}

`}>

{customer.status}

</span>


</td>




<td className="p-4">


<button

onClick={()=>changeStatus(customer.id)}

className="
bg-primary-600
text-white
px-3
py-2
rounded-lg
text-sm
"

>

Change

</button>


</td>


</tr>


))

}



</tbody>


</table>


</div>







<CustomerModal

open={modalOpen}

onClose={()=>setModalOpen(false)}

onSave={addCustomer}

/>





</div>


</Layout>


)

}







function Card({title,value,icon:Icon}){


return(

<motion.div

whileHover={{y:-5}}

className="
bg-white
p-5
rounded-2xl
border
shadow-card
"

>


<div className="flex justify-between">


<div>

<p className="text-sm text-gray-500">

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

<Icon/>

</div>


</div>


</motion.div>

)

}