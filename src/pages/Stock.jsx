import { useState } from "react";
import { motion } from "framer-motion";
import {
  LuTriangleAlert,
  LuBoxes,
  LuMilk,
  LuPlus,
  LuX,
} from "react-icons/lu";

import Layout from "../components/Layout";
import { inventory, getStockStatus } from "../data/storeData";


export default function Stock(){


const [stock,setStock] = useState(inventory);

const [addOpen,setAddOpen]=useState(false);

const [updateOpen,setUpdateOpen]=useState(false);

const [selected,setSelected]=useState(null);

const [updateQty,setUpdateQty]=useState("");


const [form,setForm]=useState({
product:"",
category:"",
quantity:"",
unit:"Liter"
});





// ADD PRODUCT

const addProduct=()=>{


if(!form.product || !form.quantity)
return;


setStock([
...stock,
{
id:Date.now(),
product:form.product,
category:form.category || "Dairy",
quantity:Number(form.quantity),
unit:form.unit,
price:0
}
]);


setForm({
product:"",
category:"",
quantity:"",
unit:"Liter"
});


setAddOpen(false);


};







// UPDATE STOCK

const updateStock=()=>{


setStock(

stock.map(item=>

item.id===selected.id

?

{
...item,
quantity:item.quantity + Number(updateQty)
}

:

item

)

);


setUpdateQty("");

setUpdateOpen(false);


};






return(

<Layout title="Stock">


<div className="space-y-6">


<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold text-ink-900">
Stock Management
</h1>


<p className="text-sm text-ink-500">
Manage dairy inventory and stock levels
</p>


</div>



<button

onClick={()=>setAddOpen(true)}

className="
flex items-center gap-2
bg-primary-600
text-white
px-5 py-3
rounded-xl
"

>

<LuPlus/>

Add New Stock

</button>


</div>







<div className="grid md:grid-cols-3 gap-5">


<Card
title="Total Products"
value={stock.length}
icon={LuBoxes}
/>


<Card
title="Available Stock"
value={
stock.filter(x=>x.quantity>10).length
}
icon={LuMilk}
/>


<Card
title="Low Stock"
value={
stock.filter(x=>x.quantity<=10).length
}
icon={LuTriangleAlert}
/>



</div>







<div className="
bg-white
rounded-2xl
border
shadow-card
overflow-hidden
">


<h2 className="p-5 text-xl font-semibold border-b">
Inventory List
</h2>



<table className="w-full">


<thead className="bg-slate-50">

<tr>

<th className="p-4 text-left">
Product
</th>

<th className="p-4 text-left">
Category
</th>

<th className="p-4 text-left">
Quantity
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
stock.map(item=>(


<tr key={item.id} className="border-t">


<td className="p-4">
{item.product}
</td>


<td className="p-4">
{item.category}
</td>


<td className="p-4">
{item.quantity} {item.unit}
</td>


<td className="p-4">

<Status quantity={item.quantity}/>

</td>



<td className="p-4">


<button

onClick={()=>{

setSelected(item);
setUpdateOpen(true);

}}

className="
bg-primary-600
text-white
px-4
py-2
rounded-lg
"

>

Update

</button>


</td>



</tr>


))

}


</tbody>



</table>


</div>









{
addOpen &&

<Modal
title="Add New Stock"
close={()=>setAddOpen(false)}
>


<Input
label="Product Name"
value={form.product}
onChange={
e=>setForm({...form,product:e.target.value})
}
/>


<Input
label="Category"
value={form.category}
onChange={
e=>setForm({...form,category:e.target.value})
}
/>


<Input
label="Quantity"
type="number"
value={form.quantity}
onChange={
e=>setForm({...form,quantity:e.target.value})
}
/>


<button
onClick={addProduct}
className="
w-full
bg-primary-600
text-white
py-3
rounded-xl
"
>

Save

</button>


</Modal>

}








{
updateOpen &&

<Modal
title="Update Stock"
close={()=>setUpdateOpen(false)}
>


<p>
Product:
<b>{selected.product}</b>
</p>


<p className="my-3">
Current:
<b>{selected.quantity} {selected.unit}</b>
</p>



<Input
label="Add Quantity"
type="number"
value={updateQty}
onChange={
e=>setUpdateQty(e.target.value)
}
/>



<button

onClick={updateStock}

className="
w-full
bg-primary-600
text-white
py-3
rounded-xl
"

>

Update Stock

</button>


</Modal>

}



</div>

</Layout>

)

}






function Status({quantity}){


const status=getStockStatus(quantity);



if(status==="Out of Stock")

return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
Out of Stock
</span>



if(status==="Low Stock")

return <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
Low Stock
</span>



return <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
Available
</span>


}






function Card({title,value,icon:Icon}){

return(

<motion.div
whileHover={{y:-5}}
className="bg-white p-5 rounded-2xl border shadow-card"
>


<div className="flex justify-between">

<div>

<p className="text-gray-500">
{title}
</p>

<h2 className="text-2xl font-bold">
{value}
</h2>

</div>


<div className="bg-primary-50 text-primary-600 p-3 rounded-xl">

<Icon/>

</div>


</div>


</motion.div>

)

}







function Modal({title,children,close}){


return(

<div className="
fixed inset-0
bg-black/40
flex
items-center
justify-center
z-50
">


<div className="
bg-white
p-6
rounded-2xl
w-96
">


<div className="flex justify-between mb-5">

<h2 className="font-bold">
{title}
</h2>

<button onClick={close}>
<LuX/>
</button>

</div>


{children}


</div>


</div>

)

}






function Input({label,value,onChange,type="text"}){


return(

<div className="mb-4">


<label className="text-sm text-gray-500">
{label}
</label>


<input

type={type}

value={value}

onChange={onChange}

className="
w-full
border
rounded-xl
px-4
py-3
"

/>


</div>

)

}