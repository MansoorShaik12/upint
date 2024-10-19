
// (a
import { useState, useRef, useEffect, useCallback } from "react";
// import "../../../../index.css";
// import "../styles/tabs.scss";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { TbLayoutGridRemove } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import RolesProfileDetails from "./RolesProfileDetails.jsx";
import { FaFilter } from "react-icons/fa";
import Sidebar from "./Roles_form.jsx";
import { MdMoreHoriz } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import axios from "axios";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
// import Editroles from "./Editroles";
import { CgInfo } from "react-icons/cg";
import Cookies from 'js-cookie';
const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
  const [isStatusMainChecked, setStatusMainChecked] = useState(false);
  const [isTechMainChecked, setTechMainChecked] = useState(false);
  const [isExperienceMainChecked, setIsExperienceMainChecked] = useState(false);
  const [selectedStatusOptions, setSelectedStatusOptions] = useState([]);
  const [selectedTechOptions, setSelectedTechOptions] = useState([]);
  const [selectedExperienceOptions, setSelectedExperienceOptions] = useState([]);


  const isAnyOptionSelected = selectedStatusOptions.length > 0 || selectedTechOptions.length > 0 || selectedExperienceOptions.length > 0;


  const handleUnselectAll = () => {
    setSelectedStatusOptions([]);
    setSelectedTechOptions([]);
    setSelectedExperienceOptions([]);
    setStatusMainChecked(false);
    setTechMainChecked(false);
    setIsExperienceMainChecked(false);
    setMinExperience('');
    setMaxExperience('');
    onFilterChange({ status: [], tech: [], experience: [] });
  };
  useEffect(() => {
    if (!isStatusMainChecked) setSelectedStatusOptions([]);
    if (!isTechMainChecked) setSelectedTechOptions([]);
    if (!isExperienceMainChecked) setSelectedExperienceOptions([]);
  }, [isStatusMainChecked, isTechMainChecked, isExperienceMainChecked]);


  const handleStatusMainToggle = () => {
    setStatusMainChecked(!isStatusMainChecked);
    const newSelectedStatus = isStatusMainChecked ? [] : [...statusOptions];
    setSelectedStatusOptions(newSelectedStatus);
    onFilterChange({ status: newSelectedStatus, tech: selectedTechOptions, experience: selectedExperienceOptions });
  };

  const handleTechMainToggle = () => {
    setTechMainChecked(!isTechMainChecked);
    const newSelectedTech = isTechMainChecked ? [] : [...techOptions];
    setSelectedTechOptions(newSelectedTech);
    onFilterChange({ status: selectedStatusOptions, tech: newSelectedTech, experience: selectedExperienceOptions });
  };

  const handleExperienceMainToggle = () => {
    setIsExperienceMainChecked(!isExperienceMainChecked);
    const newSelectedExperience = isExperienceMainChecked ? [] : [...experienceOptions];
    setSelectedExperienceOptions(newSelectedExperience);
    onFilterChange({ status: selectedStatusOptions, tech: selectedTechOptions, experience: newSelectedExperience });
  };

  const handleStatusOptionToggle = (option) => {
    const selectedIndex = selectedStatusOptions.indexOf(option);
    const updatedOptions = selectedIndex === -1
      ? [...selectedStatusOptions, option]
      : selectedStatusOptions.filter((_, index) => index !== selectedIndex);

    setSelectedStatusOptions(updatedOptions);
    onFilterChange({ status: updatedOptions, tech: selectedTechOptions, experience: selectedExperienceOptions });
  };

  const handleTechOptionToggle = (option) => {
    const selectedIndex = selectedTechOptions.indexOf(option);
    const updatedOptions = selectedIndex === -1
      ? [...selectedTechOptions, option]
      : selectedTechOptions.filter((_, index) => index !== selectedIndex);

    setSelectedTechOptions(updatedOptions);
    onFilterChange({ status: selectedStatusOptions, tech: updatedOptions, experience: selectedExperienceOptions });
  };

  const handleExperienceOptionToggle = (option) => {
    const selectedIndex = selectedExperienceOptions.indexOf(option);
    const updatedOptions = selectedIndex === -1
      ? [...selectedExperienceOptions, option]
      : selectedExperienceOptions.filter((_, index) => index !== selectedIndex);

    setSelectedExperienceOptions(updatedOptions);
    onFilterChange({ status: selectedStatusOptions, tech: selectedTechOptions, experience: updatedOptions });
  };


  const statusOptions = [
    "Bachelor of Arts (BA)",
    "Bachelor of Science (BSc)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Engineering (BE/BTech)",
    "Bachelor of Technology (B.Tech)",
    "Bachelor of Business Administration (BBA)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Architecture (BArch)",
    "Master of Arts (MA)",
    "Master of Science (MSc)",
    "Master of Commerce (MCom)",
    "Master of Engineering (ME/MTech)",
    "Master of Technology (M.Tech)",
    "Master of Business Administration (MBA)",
    "Master of Computer Applications (MCA)",
    "Diploma in Engineering",
    "Diploma in Computer Applications (DCA)",
    "Diploma in Business Administration",
  ];

  const experienceOptions = [
    "0-1 years",
    "1-2 years",
    "2-3 years",
    "3-4 years",
    "4-5 years",
    "5-6 years",
    "6-7 years",
    "7-8 years",
    "8-9 years",
    "9-10 years",
    "10+ years",
  ];

  const techOptions = [
    "Python",
    "Java",
    "SQL",
    "JavaScript",
    "Artificial Intelligence (AI)",
    "Machine Learning (ML)",
    "Internet of Things (IoT)",
    "Blockchain",
    "Augmented Reality (AR)",
    "Virtual Reality (VR)",
    "Cybersecurity",
    "Cloud Computing",
    "Big Data Analytics",
    "Quantum Computing",
    "Natural Language Processing (NLP)",
    "Data Science",
    "DevOps (Development and Operations)",
    "Software-defined Networking (SDN)",
    "Predictive Analytics",
    "Robotic Process Automation (RPA)",
    "Edge Computing",
    "5G Technology",
    "Autonomous Vehicles",
    "Biometric Authentication Technology",
  ];


  const [isExperienceDropdownOpen, setExperienceDropdownOpen] = useState(false);


  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');

  const handleExperienceChange = (e, type) => {
    const value = Math.max(0, Math.min(15, e.target.value));
    if (type === 'min') {
      setMinExperience(value);
    } else {
      setMaxExperience(value);
    }
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: { min: type === 'min' ? value : minExperience, max: type === 'max' ? value : maxExperience },
    });
  };
  useEffect(() => {
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: { min: minExperience, max: maxExperience },
    });
  }, [selectedStatusOptions, selectedTechOptions, minExperience, maxExperience, onFilterChange]);


  return (
    <div
      className="absolute w-72 text-sm bg-white border right-0 z-30 overflow-y-scroll"
      style={{
        visibility: isOpen ? "visible" : "hidden",
        transform: isOpen ? "" : "translateX(50%)",
        height: isOpen ? "calc(100vh - 30%)" : "auto",
      }}
    >
      <div className="p-2 mb-32">
        <div className="flex justify-between p-2 mb-4 shadow items-center">
          <div>
            <h2 className="text-lg font-bold ">Filter</h2>
          </div>
          {/* Unselect All Option */}
          <div>
            {(isAnyOptionSelected || minExperience || maxExperience) && (
              <div>
                <button onClick={handleUnselectAll} className="font-bold text-md">
                  Unselect All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Higher Qualification */}
        <div className="flex justify-between">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={isStatusMainChecked}
                onChange={handleStatusMainToggle}
              />
              <span className="ml-3 font-bold">Higher Qualification</span>
            </label>
          </div>
          <div
            className="cursor-pointer mr-3 text-2xl"
            onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            {isStatusDropdownOpen ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </div>
        </div>
        {isStatusDropdownOpen && (
          <div className="bg-white py-2 mt-1">
            {statusOptions.map((option, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={selectedStatusOptions.includes(option)}
                  onChange={() => handleStatusOptionToggle(option)}
                />
                <span className="ml-2 w-56">{option}</span>
              </label>
            ))}
          </div>
        )}



        <div className="flex justify-between mt-2 ml-5">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <span className="ml-3 font-bold">Experience</span>
            </label>
          </div>
        </div>

        <div className="bg-white py-2 mt-1">
          <div className="flex items-center ml-10">
            <input
              type="number"
              placeholder="Min"
              value={minExperience}
              min="0"
              max="15"
              onChange={(e) => handleExperienceChange(e, 'min')}
              className="border-b form-input w-20 mr-2"
            />
            <span className="mx-2">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxExperience}
              min="1"
              max="15"
              onChange={(e) => handleExperienceChange(e, 'max')}
              className="border-b form-input w-20"
            />
          </div>
        </div>


        {/* Skill/Technology */}
        <div className="flex mt-2 justify-between">
          <div className="cursor-pointer">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5"
                checked={isTechMainChecked}
                onChange={handleTechMainToggle}
              />
              <span className="ml-3 font-bold">Skill/Technology</span>
            </label>
          </div>
          <div
            className="cursor-pointer mr-3 text-2xl"
            onClick={() => setTechDropdownOpen(!isTechDropdownOpen)}
          >
            {isTechDropdownOpen ? (
              <MdKeyboardArrowUp />
            ) : (
              <MdKeyboardArrowDown />
            )}
          </div>
        </div>

        {isTechDropdownOpen && (
          <div className="bg-white py-2 mt-1">
            {techOptions.map((option, index) => (
              <label key={index} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5"
                  checked={selectedTechOptions.includes(option)}
                  onChange={() => handleTechOptionToggle(option)}
                />
                <span className="ml-2 w-56">{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Roles = () => {
  const organizationId = Cookies.get('organizationId');

  useEffect(() => {
    document.title = "Roles Tab";
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const [error, setError] = useState(null);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleOutsideClick = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar();
    }
  }, []);

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebarOpen, handleOutsideClick]);
  const [selectedRoles, setSelectedRoles] = useState(false);

  const handleRolesClick = (roles) => {
    setSelectedRoles(roles);
    setActionViewMore(false);
  };
  
  const handleCloseRoles = () => {
    setSelectedRoles(false);
  };

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");

  


  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}`);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === 'role') {
        setRoles(data);
        setNotification("A new role has been successfully created!");

        setTimeout(() => {
          setNotification("");
        }, 3000);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/rolesdata?organizationId=${organizationId}`);

        setRoles(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRoles();



    return () => {
      ws.close();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState("");


  const [selectedFilters, setSelectedFilters] = useState({
    status: [],
    tech: [],
    experience: [],
  });

  const handleFilterChange = useCallback((filters) => {
    setSelectedFilters(filters);
  }, []);

  const FilteredData = () => {
    if (!Array.isArray(roles)) return [];
    return roles.filter((user) => {
      const fieldsToSearch = [
        user.roleName,
        user.reportsToRole,
        user.description,
      ].filter(field => field !== null && field !== undefined);

      const matchesStatus = selectedFilters.status.length === 0 || selectedFilters.status.includes(user.HigherQualification);
      const matchesTech = selectedFilters.tech.length === 0 || user.skills.some(skill => selectedFilters.tech.includes(skill.skill));
      const matchesExperience = (selectedFilters.experience.min === '' || user.CurrentExperience >= selectedFilters.experience.min) &&
        (selectedFilters.experience.max === '' || user.CurrentExperience <= selectedFilters.experience.max);

      const matchesSearchQuery = fieldsToSearch.some(
        (field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      return matchesSearchQuery && matchesStatus && matchesTech && matchesExperience;
    });
  };


  useEffect(() => {
    setCurrentPage(0);
  }, [selectedFilters]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(0);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;





  const [activeArrow, setActiveArrow] = useState(null);



  const nextPage = () => {
    console.log("Next button clicked");
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => {
        console.log("Current page before increment:", prevPage);
        return prevPage + 1;
      });
    }
  };

  const prevPage = () => {
    console.log("Previous button clicked");
    if (currentPage > 0) {
      setCurrentPage((prevPage) => {
        console.log("Current page before decrement:", prevPage);
        return prevPage - 1;
      });
    }
  };


  const totalPages = Math.ceil(FilteredData().length / rowsPerPage);
  console.log("Total pages:", totalPages);

  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, FilteredData().length);

  const currentFilteredRows = FilteredData()
    .slice(startIndex, endIndex)
    .reverse();



  const noResults = currentFilteredRows.length === 0 && searchQuery !== "";

  const [tableVisible] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const handleListViewClick = () => {
    setViewMode("list");
  };

  const handleKanbanViewClick = () => {
    setViewMode("kanban");
  };

  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const [actionViewMore, setActionViewMore] = useState({});

  const toggleAction = (id) => {
    setActionViewMore((prev) => (prev === id ? null : id));
  };

  const [selectedroles, setSelectedroles] = useState(null);
  const handleEditClick = (roles) => {
    setSelectedroles(roles);
  };

  const handleclose = () => {
    setSelectedroles(null);
    setActionViewMore(false);
  };
  const [popupLastName, setPopupLastName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupClick = (lastName) => {
    setPopupLastName(lastName);
    setShowPopup(true);
  };
  const onClosepopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <div className="fixed top-24 left-0 right-0">
        <div className="flex justify-between p-4">
          <div>
            <span className="text-lg font-semibold">Roles</span>
          </div>

          <div>
            {notification && (
              <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
                {notification}
              </div>
            )}
          </div>

          <div onClick={toggleSidebar} className="mr-6">
            <span className="p-2 text-md bg-[#217989] text-white font-semibold border shadow rounded-3xl">
              Add Role
            </span>
          </div>
        </div>
      </div>

      <div className="fixed top-36 left-0 right-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Tooltip title="List" enterDelay={300} leaveDelay={100} arrow>
              <span onClick={handleListViewClick}>
                <FaList
                  className={`text-2xl mr-4 ${viewMode === "list" ? "text-custom-blue" : ""}`}
                />
              </span>
            </Tooltip>
            <Tooltip title="Kanban" enterDelay={300} leaveDelay={100} arrow>
              <span onClick={handleKanbanViewClick}>
                <TbLayoutGridRemove
                  className={`text-2xl ${viewMode === "kanban" ? "text-custom-blue" : ""}`}
                />
              </span>
            </Tooltip>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <div className="searchintabs mr-5 relative">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button type="submit" className="p-2">
                    <IoMdSearch className="text-custom-blue" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Search by Role Name, Label, Description."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="pl-10 pr-12"
                />
              </div>
            </div>


            <div>
              <span className="p-2 text-xl mr-2">
                {currentPage + 1}/{totalPages}
              </span>
            </div>
            <div className="flex">
              <Tooltip title="Previous" enterDelay={300} leaveDelay={100} arrow>
                <span
                  className={`border-2 p-2 mr-2 text-2xl ${currentPage === 0 ? " cursor-not-allowed" : ""} ${activeArrow === "prev" ? "text-blue-500" : ""}`}
                  onClick={prevPage}
                >
                  <IoIosArrowBack />
                </span>
              </Tooltip>

              <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                <span
                  className={`border-2 p-2 text-2xl ${currentPage === totalPages - 1 ? " cursor-not-allowed" : ""} ${activeArrow === "next" ? "text-blue-500" : ""}`}
                  onClick={nextPage}
                >
                  <IoIosArrowForward />
                </span>
              </Tooltip>
            </div>



            <div className="ml-4 text-2xl border-2 rounded-md p-2">
              <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                <span
                  onClick={roles.length === 0 ? null : toggleMenu}
                  style={{
                    opacity: roles.length === 0 ? 0.2 : 1,
                    pointerEvents: roles.length === 0 ? "none" : "auto",
                  }}
                >
                  <FaFilter className={`${isMenuOpen ? "text-custom-blue" : ""}`} />
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed left-0 right-0 mx-auto top-56 z-10">
        {tableVisible && (
          <div>
            {viewMode === "list" ? (
              <div className="flex">
                <div
                  className="flex-grow"
                  style={{ marginRight: isMenuOpen ? "290px" : "0" }}
                >
                  <div className="relative">
                    <div className="overflow-y-auto min-h-80 max-h-96">
                      <table className="text-left w-full border-collapse border-gray-300 mb-14">
                      <thead className="bg-custom-blue bg-opacity-5 text-custom-blue sticky top-0 z-10 text-xs">
                      <tr>
                            <th scope="col" className="py-3 px-6">Role Name</th>
                            <th scope="col" className="py-3 px-6">Reports To Role</th>
                            <th scope="col" className="py-3 px-6">Description</th>
                            <th scope="col" className="py-3 px-6">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="7" className="py-28 text-center">
                                <div className="wrapper12">
                                  <div className="circle12"></div>
                                  <div className="circle12"></div>
                                  <div className="circle12"></div>
                                  <div className="shadow12"></div>
                                  <div className="shadow12"></div>
                                  <div className="shadow12"></div>
                                </div>
                              </td>
                            </tr>
                          ) : roles.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-10 text-center">
                                <div className="flex flex-col items-center justify-center p-5">
                                  <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                  <p className="text-center text-lg font-normal">You don't have Connected Apps yet. Create new Connected Apps.</p>
                                  <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add Apps</p>
                                </div>
                              </td>
                            </tr>
                          ) : currentFilteredRows.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="py-10 text-center">
                                <p className="text-lg font-normal">No data found.</p>
                              </td>
                            </tr>
                          ) : (
                            currentFilteredRows.map((roles) => (
                              <tr key={roles._id} className="bg-white border-b cursor-pointer text-xs">
                                <td className="py-2 px-6 text-custom-blue">
                                  <div
                                    className="flex items-center gap-3"
                                    onClick={() => handleRolesClick(roles)}
                                  >

                                    {roles.roleName}
                                  </div>
                                </td>
                                <td className="py-2 px-6">{roles.reportsToRoleId ? roles.reportsToRoleId.roleName : 'N/A'}</td>
                                <td className="py-2 px-6">{roles.description}</td>

                                <td className="py-2 px-6 relative">
                                  <button onClick={() => toggleAction(roles._id)}>
                                    <MdMoreHoriz className="text-3xl" />
                                  </button>
                                  {actionViewMore === roles._id && (
                                    <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                      <div className="space-y-1">
                                        <p
                                          className="hover:bg-gray-200 p-1 rounded pl-3"
                                          onClick={() => handleRolesClick(roles)}
                                        >
                                          View

                                        </p>
                                        <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleEditClick(roles)}>Edit</p>
                                        <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handlePopupClick(roles.LastName)}>
                                          Schedule
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <OffcanvasMenu isOpen={isMenuOpen} closeOffcanvas={toggleMenu} onFilterChange={handleFilterChange} />
              </div>
            ) : (
              // kanban view
              <div className="mx-3">
                <div className="flex">
                  <div
                    className="flex-grow"
                    style={{ marginRight: isMenuOpen ? "290px" : "0" }}
                  >
                    <div className="overflow-y-auto min-h-80 max-h-96">
                      {loading ? (
                        <div className="py-10 text-center">
                          <div className="wrapper12">
                            <div className="circle12"></div>
                            <div className="circle12"></div>
                            <div className="circle12"></div>
                            <div className="shadow12"></div>
                            <div className="shadow12"></div>
                            <div className="shadow12"></div>
                          </div>
                        </div>
                      ) : roles.length === 0 ? (
                        <div className="py-10 text-center">
                          <div className="flex flex-col items-center justify-center p-5">
                            <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                            <p className="text-center text-lg font-normal">You don't have Connected Apps yet. Create new Connected Apps.</p>
                            <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add Apps</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4 p-4">
                          {currentFilteredRows.length === 0 ? (
                            <div className="col-span-3 py-10 text-center">
                              <p className="text-lg font-normal">No data found.</p>
                            </div>
                          ) : (
                            currentFilteredRows.map((roles) => (
                              <div key={roles._id} className="bg-white border border-[#217989] p-2 rounded">
                                <div className="relative">
                                  <div className="float-right">
                                    <button onClick={() => toggleAction(roles._id)}>
                                      <IoMdMore className="text-3xl mt-1" />
                                    </button>
                                    {actionViewMore === roles._id && (
                                      <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                        <div className="space-y-1">
                                          <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleRolesClick(roles)}>View</p>
                                          <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handleEditClick(roles)}>Edit</p>
                                          <p className="hover:bg-gray-200 p-1 rounded pl-3" onClick={() => handlePopupClick(roles.LastName)}>Schedule</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex">
                                  <div className="flex flex-col">
                                    <div className="text-custom-blue text-lg cursor-pointer break-words" onClick={() => handleRolesClick(roles)}>
                                      {roles.roleName}
                                    </div>
                                    <div className="text-xs grid grid-cols-2 gap-1 items-start">
                                      <div className="text-gray-400">Reports To Role</div>
                                      <div>{roles.reportsToRoleId ? roles.reportsToRoleId.roleName : 'N/A'}</div>
                                      <div className="text-gray-400">Description</div>
                                      <div>{roles.description}</div>


                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <OffcanvasMenu isOpen={isMenuOpen} closeOffcanvas={toggleMenu} onFilterChange={handleFilterChange} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {sidebarOpen && (
        <>
          <div
            className={"fixed inset-0 bg-black bg-opacity-15 z-50"}
          >
            <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
              <Sidebar
                onClose={closeSidebar}
                onOutsideClick={handleOutsideClick}
                ref={sidebarRef}
              />
            </div>
          </div>
        </>)}


      {selectedRoles && (
        <RolesProfileDetails roles={selectedRoles} onCloseroles={handleCloseRoles} />
      )}
      {/* {selectedroles && (
        <Editroles onClose={handleclose} roles1={selectedroles} />
      )} */}
    </>
  );
};

export default Roles;

// a)