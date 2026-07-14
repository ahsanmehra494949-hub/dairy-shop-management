import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuStore,
  LuUser,
  LuBell,
  LuShieldCheck,
  LuTags,
  LuX,
  LuPlus,
} from "react-icons/lu";

import Layout from "../components/Layout";
import { useShop } from "../context/ShopContext";


export default function Settings(){

  const { categories, addCategory, deleteCategory } = useShop();

  const [saved,setSaved] = useState(false);
  const [passwordOpen,setPasswordOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");


  const handleSave = ()=>{

    setSaved(true);

    setTimeout(()=>{
      setSaved(false);
    },2000);

  }

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setNewCategory("");
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
            title="Product Categories"
            icon={LuTags}
          >

            <p className="text-sm text-gray-500 mb-4">
              Add categories here — they'll show up when adding a product in Inventory.
            </p>

            <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Ice Cream"
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={!newCategory.trim()}
                className="shrink-0 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Add category"
              >
                <LuPlus size={18} />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {categories.length === 0 && (
                <p className="text-xs text-ink-500">No categories yet — add your first one above.</p>
              )}
              {categories.map((c) => (
                <span
                  key={c}
                  className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium"
                >
                  {c}
                  <button
                    onClick={() => deleteCategory(c)}
                    className="p-0.5 rounded-full hover:bg-primary-100 transition-colors"
                    aria-label={`Remove ${c}`}
                  >
                    <LuX size={13} />
                  </button>
                </span>
              ))}
            </div>

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

        <AnimatePresence>
        {
          saved && (

            <motion.div

              initial={{
                opacity:0,
                y:-20
              }}

              animate={{
                opacity:1,
                y:0
              }}

              exit={{
                opacity:0,
                y:-20
              }}

              className="
              fixed
              top-20
              sm:top-6
              inset-x-4
              sm:inset-x-auto
              sm:right-6
              z-[200]
              bg-emerald-600
              text-white
              px-6
              py-3
              rounded-xl
              shadow-xl
              flex
              items-center
              justify-center
              sm:justify-start
              gap-2
              font-medium
              "

            >

              ✓ Changes saved successfully

            </motion.div>

          )
        }
        </AnimatePresence>




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
              px-4
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
