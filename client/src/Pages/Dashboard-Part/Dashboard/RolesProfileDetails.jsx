import React, { useState,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";



const RolesProfileDetails =  ({roles, onCloseroles}) => {
    useEffect(() => {
      document.title = "Roles Profile Details";
    }, []);
    const navigate = useNavigate();
    const location = useLocation();
  
    const [activeTab, setActiveTab] = useState("roles");
    const handleNavigate = () => {
      navigate("/roles", { state: { roles } });
    };
  
    const formData = location.state?.formData;
    const selectedPosition = formData?.position;
  
    useEffect(() => {
      const fetchPositionDetails = async () => {
        try {
          const response = await fetch(`YOUR_API_ENDPOINT/${selectedPosition}`);
          console.log(response);
        } catch (error) {
          console.error("Error fetching position details:", error);
        }
      };
  
      if (selectedPosition) {
        fetchPositionDetails();
      }
    }, [selectedPosition]);
  
  
    const [showMainContent, setShowMainContent] = useState(true);

 
  return (
    <>
      {showMainContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white shadow-lg overflow-auto"
            style={{ width: "97%", height: "94%" }}
          >
            <div className="border-b p-2">
              <div className="mx-8 my-3 flex justify-between items-center">
              <p className="text-xl">
                  <span
                    className="text-orange-500 font-semibold cursor-pointer"
                    onClick={handleNavigate}
                  >
                 Role
                  </span>{" "}
                  /
                  {/* {Roles.roleName} */}
                </p>
                {/* Cancel icon */}
                <button
                  className="shadow-lg rounded-full"
                  onClick={onCloseroles}
                >
                  <MdOutlineCancel className="text-2xl" />
                </button>
              </div>
            </div>
            <>
              <div className="flex float-end mr-10 mt-1">
                <button className=" text-gray-500 mr-20"
                //   onClick={handleEditClick}
                >
                  Edit
                </button>
              </div>
              <div className="mx-16 mt-7 grid grid-cols-4">
                <div className="col-span-3">
                  <div className="flex mb-5">
                    {/*  Role Name */}
                    <div className="w-1/3">
                      <div className="font-medium">Role Name</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{roles.roleName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/* reports*/}
                    <div className="w-1/3">
                      <div className="font-medium">Reports to role</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{roles.reportsToRoleId ? roles.reportsToRoleId.roleName : 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-5">
                    {/* Description */}
                    <div className="w-1/3">
                      <div className="font-medium">Description</div>
                    </div>
                    <div className="w-1/3">
                      <p>
                        <span className="font-normal">{roles.description}</span>
                      </p>
                    </div>
                  </div>

              
                </div>
                <div className="col-span-1">
                  <div>
                    <div className="flex justify-end text-center mt-3">
                      <div>
                        <img className="w-32 h-32" src={roles.image} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
            </>
          </div>
        </div>
      )
      }

    </>
  )
}

export default RolesProfileDetails