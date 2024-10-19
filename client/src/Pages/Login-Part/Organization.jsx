import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import image1 from "../Dashboard-Part/Images/image1.png";
import { MdArrowDropDown } from "react-icons/md";
import Cookies from 'js-cookie';
import { fetchMasterData } from '../../utils/fetchMasterData';
export const Organization = () => {
  const [selectedFirstName, setSelectedFirstName] = useState("");
  const [selectedLastName, setSelectedLastName] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPassword, setSelectedPassword] = useState("");
  const [selectedConfirmPassword, setSelectedConfirmPassword] = useState("");
  const [showDropdownEmployees, setShowDropdownEmployees] = useState(false);
  const [showDropdownCountry, setShowDropdownCountry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const countryOptions = ["India", "UK"];
  const employeesOptions = ["Employees", "11-20"];
  const [objectsData, setObjectsData] = useState([]);
  const [tabsData, setTabsData] = useState([]);
  // const userId = localStorage.getItem('userId');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchObjectsData = async () => {
      try {
        const data = await fetchMasterData('api/objects');
        setObjectsData(data.objects);
      } catch (error) {
        console.error('Error fetching objects data:', error);
      }
    };

    const fetchTabsData = async () => {
      try {
        const data = await fetchMasterData('api/tabs');
        setTabsData(data.tabs);
      } catch (error) {
        console.error('Error fetching tabs data:', error);
      }
    };

    fetchObjectsData();
    fetchTabsData();
  }, []);

  const toggleDropdownEmployees = () => {
    setShowDropdownEmployees(!showDropdownEmployees);
  };

  const handleEmployeesSelect = (option) => {
    setSelectedEmployees(option);
    setShowDropdownEmployees(false);
  };

  const toggleDropdownCountry = () => {
    setShowDropdownCountry(!showDropdownCountry);
  };

  const handleCountrySelect = (option) => {
    setSelectedCountry(option);
    setShowDropdownCountry(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedPassword !== selectedConfirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      // Create organization
      const formData = {
        firstName: selectedFirstName,
        lastName: selectedLastName,
        Email: selectedEmail,
        Phone: selectedPhone,
        username: selectedUsername,
        jobTitle: selectedJobTitle,
        company: selectedCompany,
        employees: selectedEmployees,
        country: selectedCountry,
        password: selectedPassword
      };

      console.log('API URL:', process.env.REACT_APP_API_URL);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/organization`, formData);
      console.log('Organization saved:', response.data);
      // localStorage.setItem('userId', response.data.user._id);
      // localStorage.setItem('organizationId', response.data.organization._id);


      Cookies.set('userId', response.data.user._id, { expires: 7 }); // Expires in 7 days
      Cookies.set('organizationId', response.data.organization._id, { expires: 7 });

      const organizationId = response.data.organization._id;
      const userId = response.data.user._id; // Ensure user ID is correctly retrieved

      // Construct accessBody from objectsData and tabsData
      const accessBody = objectsData.map(tab => ({
        ObjName: tab,
        Access: 'Public',
        GrantAccess: false
      }));

      // Save default sharing settings
      await axios.post(`${process.env.REACT_APP_API_URL}/api/sharing-settings`, {
        Name: 'sharingSettingDefaultName',
        organizationId: organizationId,
        accessBody: accessBody
      });

      // Create default profiles
      const profileNames = ["Admin", "CEO", "HR Manager", "HR Lead", "HR Recruiter"];
      let adminProfileId = "";
      for (let i = 0; i < profileNames.length; i++) {
        const profileTabs = tabsData.map(tab => ({
          name: tab,
          status: profileNames[i] === "Admin" ? 'Visible' : 'Hidden'
        }));
        const profileObjects = objectsData.map(object => ({
          name: object,
          permissions: {
            View: true,
            Create: true,
            Edit: true,
            Delete: profileNames[i] === "Admin"
          }
        }));

        const profileResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/profiles`, {
          label: profileNames[i],
          Name: profileNames[i],
          Description: `Default profile description for ${profileNames[i]}`,
          Tabs: profileTabs,
          Objects: profileObjects,
          organizationId: organizationId
        });

        if (profileNames[i] === "Admin") {
          adminProfileId = profileResponse.data._id;
        }
      }

      // Create default roles
      const roles = [
        { label: "Admin", name: "Admin" },
        { label: "CEO", name: "CEO" },
        { label: "HR Manager", name: "HR_Manager" },
        { label: "HR Lead", name: "HR_Lead" },
        { label: "Recruiter", name: "Recruiter" },
      ];

      let adminRoleId = "";
      let ceoRoleId = "";
      let hrManagerRoleId = "";
      let hrLeadRoleId = "";

      for (let i = 0; i < roles.length; i++) {
        let reportsToRoleId = null;

        if (roles[i].name === "CEO") {
          reportsToRoleId = adminRoleId;
        } else if (roles[i].name === "HR_Manager") {
          reportsToRoleId = ceoRoleId;
        } else if (roles[i].name === "HR_Lead") {
          reportsToRoleId = hrManagerRoleId;
        } else if (roles[i].name === "Recruiter") {
          reportsToRoleId = hrLeadRoleId;
        }

        const roleData = {
          label: roles[i].label,
          roleName: roles[i].name,
          description: `Default role description for ${roles[i].name}`,
          organizationId: organizationId,
        };

        if (reportsToRoleId) {
          roleData.reportsToRoleId = reportsToRoleId;
        }

        const roleResponse = await axios.post(`${process.env.REACT_APP_API_URL}/rolesdata`, roleData);

        if (roles[i].name === "Admin") {
          adminRoleId = roleResponse.data._id;
        } else if (roles[i].name === "CEO") {
          ceoRoleId = roleResponse.data._id;
        } else if (roles[i].name === "HR_Manager") {
          hrManagerRoleId = roleResponse.data._id;
        } else if (roles[i].name === "HR_Lead") {
          hrLeadRoleId = roleResponse.data._id;
        }
      }

      // Update user with Admin profile and role IDs
      await axios.put(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        RoleId: adminRoleId,
        ProfileId: adminProfileId
      });

      navigate('/price');
    } catch (error) {
      console.error('Error saving organization:', error); // Log the entire error object
      setErrorMessage(`An error occurred while saving the organization: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };


  return (
    <>
      <div className="border-b p-4">
        <p className="font-bold text-xl">LOGO</p>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center p-4">
        <div className="md:w-1/2 flex justify-center">
          <img src={image1} alt="Interview" className="h-auto" />
        </div>
        <div className="md:w-1/2 p-4">
          <h2 className="text-3xl font-medium mb-4 text-center">Sign Up</h2>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="gap-5 flex">
              <div className="relative w-[233px]">
                <input
                  type="text"
                  id="first_name"
                  className="block rounded px-8 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                  placeholder=" "
                  value={selectedFirstName}
                  onChange={(e) => setSelectedFirstName(e.target.value)}
                />
                <label
                  htmlFor="first_name"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                >
                  First Name
                </label>
              </div>
              <div className="relative w-[233px]">
                <input
                  type="text"
                  id="last_name"
                  className="block rounded px-8 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                  placeholder=" "
                  value={selectedLastName}
                  onChange={(e) => setSelectedLastName(e.target.value)}
                />
                <label
                  htmlFor="last_name"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                >
                  Last Name
                </label>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                id="job_title"
                className="block rounded px-2.5 pb-1.5 pt-4 w-96 text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                placeholder=" "
                value={selectedJobTitle}
                onChange={(e) => setSelectedJobTitle(e.target.value)}
                style={{ width: "82%" }}
              />
              <label
                htmlFor="job_title"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Job Title
              </label>
            </div>
            <div className="relative">
              <input
                type="email"
                id="Email"
                className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                placeholder=" "
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                style={{ width: "82%" }}
              />
              <label
                htmlFor="Email"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Email
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="Phone"
                className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                placeholder=" "
                value={selectedPhone}
                onChange={(e) => setSelectedPhone(e.target.value)}
                style={{ width: "82%" }}
              />
              <label
                htmlFor="Phone"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Phone
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="company"
                className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                placeholder=" "
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                style={{ width: "82%" }}
              />
              <label
                htmlFor="company"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Company
              </label>
            </div>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  id="employees"
                  className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                  placeholder=" "
                  value={selectedEmployees}
                  onClick={toggleDropdownEmployees}
                  readOnly
                  style={{ width: "82%" }}
                />
                <label
                  htmlFor="employees"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                >
                  Employees
                </label>
                <div
                  className="absolute right-0 top-0"
                  onClick={toggleDropdownEmployees}
                >
                  <MdArrowDropDown className="text-lg text-gray-500 mt-3 mr-28 cursor-pointer" />
                </div>
              </div>
              {showDropdownEmployees && (
                <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                  {employeesOptions.map((option) => (
                    <div
                      key={option}
                      className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleEmployeesSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  id="country"
                  className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                  placeholder=" "
                  value={selectedCountry}
                  onClick={toggleDropdownCountry}
                  readOnly
                  style={{ width: "82%" }}
                />
                <label
                  htmlFor="country"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
                >
                  Country/Region
                </label>
                <div
                  className="absolute right-0 top-0"
                  onClick={toggleDropdownCountry}
                >
                  <MdArrowDropDown className="text-lg text-gray-500 mt-3 mr-28 cursor-pointer" />
                </div>
              </div>
              {showDropdownCountry && (
                <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg">
                  {countryOptions.map((option) => (
                    <div
                      key={option}
                      className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleCountrySelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                id="username"
                className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                placeholder=" "
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
                style={{ width: "82%" }}
              />
              <label
                htmlFor="username"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Username
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                id="create_password"
                className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                placeholder=" "
                value={selectedPassword}
                onChange={(e) => setSelectedPassword(e.target.value)}
                style={{ width: "82%" }}
              />
              <label
                htmlFor="create_password"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Create Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                id="confirm_password"
                className="block rounded px-2.5 pb-1.5 pt-4 w-full text-sm text-gray-900 bg-white border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-gray-300 peer"
                placeholder=" "
                value={selectedConfirmPassword}
                onChange={(e) => setSelectedConfirmPassword(e.target.value)}
                style={{ width: "82%" }}
              />
              <label
                htmlFor="confirm_password"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] start-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Confirm Password
              </label>
            </div>
            <div className="flex justify-center">
              <div className="text-sm mb-4">
                If already registered | <span className="cursor-pointer text-blue-500 underline" onClick={() => navigate('/admin')}>Login</span>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-20 py-2 bg-blue-500 text-white rounded-3xl"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
