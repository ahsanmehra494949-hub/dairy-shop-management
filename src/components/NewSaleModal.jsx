import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";

import { inventory, reduceStock } from "../data/storeData";


export default function NewSaleModal({
open,
onClose,
onSave
}){


const [form,setForm]=useState({
customer:"",
product:"",
qty:1
});



useEffect(()=>{

if(open){

setForm({

customer:"",
product:inventory[0]?.product || "",
qty:1

});

}

},[open]);





const selectedProduct = inventory.find(
(item)=>item.product===form.product
);



const amount =
selectedProduct
?
selectedProduct.price * Number(form.qty)
:
0;






const handleSubmit=(e)=>{

e.preventDefault();


if(!form.customer || !form.qty)
return;



// STOCK KAM KARO
reduceStock(
form.product,
form.qty
);



onSave({

invoiceId:
`INV-${Math.floor(1000+Math.random()*9000)}`,

customer:form.customer,

product:form.product,

quantity:Number(form.qty),

amount:amount,

date:new Date().toLocaleDateString(),

status:"Paid"

});


onClose();


};





return(

<AnimatePresence>

{

open &&

<motion.div

className="
fixed inset-0
z-50
bg-black/40
flex
items-center
justify-center
px-4
"

initial={{opacity:0}}

animate={{opacity:1}}

exit={{opacity:0}}

onClick={onClose}

>


<motion.div

onClick={(e)=>e.stopPropagation()}

initial={{scale:.9}}

animate={{scale:1}}

className="
bg-white
rounded-2xl
p-6
w-full
max-w-md
"

>


<div className="
flex
justify-between
mb-5
">

<h2 className="text-xl font-bold">
New Sale
</h2>


<button onClick={onClose}>
<LuX/>
</button>


</div>





<form
onSubmit={handleSubmit}
className="space-y-4"
>



<div>

<label>
Customer Name
</label>

<input

required

value={form.customer}

onChange={(e)=>
setForm({
...form,
customer:e.target.value
})
}

className="
w-full
border
rounded-xl
px-4
py-3
"

/>


</div>





<div>

<label>
Product
</label>


<select

value={form.product}

onChange={(e)=>
setForm({
...form,
product:e.target.value
})
}

className="
w-full
border
rounded-xl
px-4
py-3
"

>


{
inventory.map(item=>(

<option
key={item.id}
value={item.product}
>

{item.product}

</option>

))

}


</select>


</div>





<div>

<label>
Quantity
</label>


<input

type="number"

min="1"

value={form.qty}

onChange={(e)=>
setForm({
...form,
qty:e.target.value
})
}

className="
w-full
border
rounded-xl
px-4
py-3
"

/>


</div>





<div className="
bg-primary-50
p-3
rounded-xl
flex
justify-between
">

<span>
Amount
</span>

<b>
Rs {amount}
</b>

</div>




<button

type="submit"

className="
w-full
bg-primary-600
text-white
py-3
rounded-xl
"

>

Record Sale

</button>



</form>



</motion.div>



</motion.div>


}


</AnimatePresence>


)

}