import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";


export default function CustomerModal({
open,
onClose,
onSave
}){


const [form,setForm]=useState({

name:"",
phone:""

});



const submitHandler=(e)=>{

e.preventDefault();


if(!form.name || !form.phone)
return;


onSave({

id:Date.now(),

name:form.name,

phone:form.phone,

orders:0,

total:"Rs 0",

status:"Active"

});


setForm({

name:"",
phone:""

});


onClose();


};





return(

<AnimatePresence>


{

open &&


<motion.div

className="
fixed
inset-0
bg-black/40
z-50
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

className="
bg-white
rounded-2xl
p-6
w-full
max-w-md
"

initial={{
scale:.9
}}

animate={{
scale:1
}}

>


<div className="
flex
justify-between
mb-5
">


<h2 className="text-xl font-bold">
Add Customer
</h2>


<button onClick={onClose}>
<LuX/>
</button>


</div>





<form
onSubmit={submitHandler}
className="space-y-4"
>



<input

placeholder="Customer Name"

value={form.name}

onChange={(e)=>
setForm({
...form,
name:e.target.value
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





<input

placeholder="Phone Number"

value={form.phone}

onChange={(e)=>
setForm({
...form,
phone:e.target.value
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





<button

className="
w-full
bg-primary-600
text-white
py-3
rounded-xl
"

>

Save Customer

</button>



</form>



</motion.div>


</motion.div>


}


</AnimatePresence>


)

}