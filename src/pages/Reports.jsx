import { motion } from "framer-motion";
import {
  LuFileChartColumn,
  LuTrendingUp,
  LuReceipt,
  LuDollarSign,
} from "react-icons/lu";
import Layout from "../components/Layout";


const reports = [
  {
    id:1,
    name:"Monthly Sales Report",
    value:"Rs 250,000",
    date:"July 2026",
  },
  {
    id:2,
    name:"Profit Report",
    value:"Rs 85,000",
    date:"July 2026",
  },
  {
    id:3,
    name:"Product Sales",
    value:"320 Items Sold",
    date:"July 2026",
  },
];



export default function Reports(){


return(

<Layout title="Reports">


<div className="space-y-6">



<div>

<h1 className="text-3xl font-bold text-ink-900">
Reports & Analytics
</h1>

<p className="text-sm text-ink-500 mt-1">
View sales, profit and inventory reports
</p>

</div>





<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-5
">


<Card
title="Total Sales"
value="Rs 500,000"
icon={LuReceipt}
/>


<Card
title="Total Profit"
value="Rs 180,000"
icon={LuTrendingUp}
/>


<Card
title="Invoices"
value="245"
icon={LuFileChartColumn}
/>


<Card
title="Revenue"
value="Rs 650,000"
icon={LuDollarSign}
/>


</div>






<div className="
bg-white
rounded-2xl
border
shadow-card
overflow-hidden
">


<div className="p-5 border-b">

<h2 className="text-xl font-semibold">
Generated Reports
</h2>

</div>




<table className="w-full">


<thead className="bg-slate-50">

<tr>

<th className="p-4 text-left">
Report Name
</th>

<th className="p-4 text-left">
Amount
</th>

<th className="p-4 text-left">
Date
</th>

</tr>

</thead>



<tbody>


{
reports.map((report,index)=>(

<motion.tr

key={report.id}

initial={{
opacity:0,
y:10
}}

animate={{
opacity:1,
y:0
}}

transition={{
delay:index*0.1
}}

className="
border-t
hover:bg-slate-50
"

>


<td className="p-4 font-medium">
{report.name}
</td>


<td className="p-4">
{report.value}
</td>


<td className="p-4">
{report.date}
</td>


</motion.tr>


))

}


</tbody>


</table>


</div>



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


<div className="
flex
justify-between
items-center
">


<div>

<p className="text-sm text-gray-500">
{title}
</p>


<h2 className="
text-2xl
font-bold
mt-2
text-ink-900
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