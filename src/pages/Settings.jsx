import { useState } from "react";
import { motion } from "framer-motion";
import {
  LuStore,
  LuUser,
  LuBell,
  LuShieldCheck,
  LuX,
} from "react-icons/lu";

import Layout from "../components/Layout";


export default function Settings(){

  const [saved,setSaved] = useState(false);
  const [passwordOpen,setPasswordOpen] = useState(false);


  const handleSave = ()=>{

    setSaved(true);

    setTimeout(()=>{
      setSaved(false);
    },2000);

  }



  return(

    <Layout title="Settings">

      <div className="space-y-6">


        <div>

          <h1 className="text-3xl font-bold text-ink-900">
            Settings
          </h1>

          <p className="text-sm text-ink-500 mt-1">
            Manage your dairy shop configuration and preferences
          </p>

        </div>




        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


          <Card 
            title="Shop Information"
            icon={LuStore}
          >

            <Input 
              label="Shop Name"
              value="Fresh Dairy Shop"
            />

            <Input
              label="Shop Address"
              value="Main Market"
            />

            <Input
              label="Contact Number"
              value="0300-0000000"
            />

          </Card>





          <Card
            title="Admin Profile"
            icon={LuUser}
          >

            <Input
              label="Username"
              value="Admin User"
            />


            <Input
              label="Email"
              value="admin@dairyshop.com"
            />


            <Input
              label="Role"
              value="Shop Administrator"
            />

          </Card>







          <Card
            title="Notifications"
            icon={LuBell}
          >

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4"
              />

              <span>
                Enable sales notifications
              </span>

            </label>



            <label className="flex items-center gap-3 mt-4">

              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4"
              />

              <span>
                Low stock alerts
              </span>

            </label>


          </Card>







          <Card
            title="Security"
            icon={LuShieldCheck}
          >

            <p className="text-sm text-gray-500 mb-4">
              Manage account password and security
            </p>


            <button

              onClick={()=>setPasswordOpen(true)}

              className="
              bg-primary-600
              hover:bg-primary-700
              text-white
              px-5
              py-2.5
              rounded-xl
              transition
              "

            >

              Change Password

            </button>


          </Card>



        </div>






        <button

          onClick={handleSave}

          className="
          bg-primary-600
          hover:bg-primary-700
          text-white
          px-6
          py-3
          rounded-xl
          font-medium
          "

        >

          Save Settings

        </button>







        {/* SUCCESS TOAST */}

        {
          saved && (

            <motion.div

              initial={{
                opacity:0,
                x:50
              }}

              animate={{
                opacity:1,
                x:0
              }}

              className="
              fixed
              bottom-6
              right-6
              z-[200]
              bg-emerald-600
              text-white
              px-6
              py-3
              rounded-xl
              shadow-xl
              flex
              items-center
              gap-2
              font-medium
              "

            >

              ✓ Changes saved successfully

            </motion.div>

          )
        }








        {/* PASSWORD MODAL */}

        {
          passwordOpen && (

            <div

              className="
              fixed
              inset-0
              bg-black/40
              backdrop-blur-sm
              flex
              items-center
              justify-center
              z-[300]
              "

            >


              <div

                className="
                bg-white
                w-full
                max-w-md
                rounded-2xl
                p-6
                "

              >


                <div className="flex justify-between items-center mb-5">


                  <h2 className="text-xl font-bold">
                    Change Password
                  </h2>


                  <button

                    onClick={()=>setPasswordOpen(false)}

                    className="
                    text-gray-500
                    hover:text-black
                    "

                  >

                    <LuX size={22}/>

                  </button>


                </div>





                <Input
                  label="Old Password"
                />

                <Input
                  label="New Password"
                />

                <Input
                  label="Confirm Password"
                />





                <button

                  className="
                  mt-5
                  w-full
                  bg-primary-600
                  hover:bg-primary-700
                  text-white
                  py-3
                  rounded-xl
                  "

                >

                  Update Password

                </button>



              </div>


            </div>

          )
        }



      </div>


    </Layout>

  )

}








function Card({title,icon:Icon,children}){


  return(

    <motion.div

      whileHover={{
        y:-3
      }}

      className="
      bg-white
      border
      rounded-2xl
      p-6
      shadow-card
      "

    >


      <div className="flex items-center gap-3 mb-5">


        <div

          className="
          bg-primary-50
          text-primary-600
          p-3
          rounded-xl
          "

        >

          <Icon size={22}/>

        </div>



        <h2 className="text-xl font-semibold">

          {title}

        </h2>


      </div>



      {children}


    </motion.div>

  )


}








function Input({label,value=""}){


  return(

    <div className="mb-4">


      <label className="text-sm text-gray-500 block mb-1">

        {label}

      </label>



      <input

        defaultValue={value}

        type={
          label.toLowerCase().includes("password")
          ?
          "password"
          :
          "text"
        }

        className="
        w-full
        border
        rounded-xl
        px-4
        py-3
        outline-none
        focus:ring-2
        focus:ring-primary-200
        "

      />


    </div>

  )


}