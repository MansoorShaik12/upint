import { useState, useRef, useEffect, useCallback } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { MdMoreHoriz } from "react-icons/md";
import UserProfileDetails from "./UserProfileDetails";
// import { useNavigate } from "react-router-dom";
import Sidebar from "./UserForm";
import Sidebar1 from "./EditUser";
import { CgInfo } from "react-icons/cg";
import axios from "axios";
import { TbLayoutGridRemove } from "react-icons/tb";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoMdMore } from "react-icons/io";
import EditUser from "./EditUser";
import Cookies from "js-cookie";
import { FaList } from "react-icons/fa6";
import maleImage from "../../Dashboard-Part/Images/man.png";
import femaleImage from "../../Dashboard-Part/Images/woman.png";
import genderlessImage from "../../Dashboard-Part/Images/transgender.png";
// {f} //

const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
  const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isTechDropdownOpen, setTechDropdownOpen] = useState(false);
  const [isStatusMainChecked, setStatusMainChecked] = useState(false);
  const [isTechMainChecked, setTechMainChecked] = useState(false);
  const [isExperienceMainChecked, setIsExperienceMainChecked] = useState(false);
  const [selectedStatusOptions, setSelectedStatusOptions] = useState([]);
  const [selectedTechOptions, setSelectedTechOptions] = useState([]);
  const [selectedExperienceOptions, setSelectedExperienceOptions] = useState(
    []
  );

  const isAnyOptionSelected =
    selectedStatusOptions.length > 0 ||
    selectedTechOptions.length > 0 ||
    selectedExperienceOptions.length > 0;

  const handleUnselectAll = () => {
    setSelectedStatusOptions([]);
    setSelectedTechOptions([]);
    setSelectedExperienceOptions([]);
    setStatusMainChecked(false);
    setTechMainChecked(false);
    setIsExperienceMainChecked(false);
    setMinExperience("");
    setMaxExperience("");
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
    onFilterChange({
      status: newSelectedStatus,
      tech: selectedTechOptions,
      experience: selectedExperienceOptions,
    });
  };

  const handleTechMainToggle = () => {
    setTechMainChecked(!isTechMainChecked);
    const newSelectedTech = isTechMainChecked ? [] : [...techOptions];
    setSelectedTechOptions(newSelectedTech);
    onFilterChange({
      status: selectedStatusOptions,
      tech: newSelectedTech,
      experience: selectedExperienceOptions,
    });
  };

  // const handleExperienceMainToggle = () => {
  //   setIsExperienceMainChecked(!isExperienceMainChecked);
  //   const newSelectedExperience = isExperienceMainChecked
  //     ? []
  //     : [...experienceOptions];
  //   setSelectedExperienceOptions(newSelectedExperience);
  //   onFilterChange({
  //     status: selectedStatusOptions,
  //     tech: selectedTechOptions,
  //     experience: newSelectedExperience,
  //   });
  // };

  const handleStatusOptionToggle = (option) => {
    const selectedIndex = selectedStatusOptions.indexOf(option);
    const updatedOptions =
      selectedIndex === -1
        ? [...selectedStatusOptions, option]
        : selectedStatusOptions.filter((_, index) => index !== selectedIndex);

    setSelectedStatusOptions(updatedOptions);
    onFilterChange({
      status: updatedOptions,
      tech: selectedTechOptions,
      experience: selectedExperienceOptions,
    });
  };

  const handleTechOptionToggle = (option) => {
    const selectedIndex = selectedTechOptions.indexOf(option);
    const updatedOptions =
      selectedIndex === -1
        ? [...selectedTechOptions, option]
        : selectedTechOptions.filter((_, index) => index !== selectedIndex);

    setSelectedTechOptions(updatedOptions);
    onFilterChange({
      status: selectedStatusOptions,
      tech: updatedOptions,
      experience: selectedExperienceOptions,
    });
  };

  // const handleExperienceOptionToggle = (option) => {
  //   const selectedIndex = selectedExperienceOptions.indexOf(option);
  //   const updatedOptions =
  //     selectedIndex === -1
  //       ? [...selectedExperienceOptions, option]
  //       : selectedExperienceOptions.filter(
  //           (_, index) => index !== selectedIndex
  //         );

  //   setSelectedExperienceOptions(updatedOptions);
  //   onFilterChange({
  //     status: selectedStatusOptions,
  //     tech: selectedTechOptions,
  //     experience: updatedOptions,
  //   });
  // };

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

  // const experienceOptions = [
  //   "0-1 years",
  //   "1-2 years",
  //   "2-3 years",
  //   "3-4 years",
  //   "4-5 years",
  //   "5-6 years",
  //   "6-7 years",
  //   "7-8 years",
  //   "8-9 years",
  //   "9-10 years",
  //   "10+ years",
  // ];

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

  // const [isExperienceDropdownOpen, setExperienceDropdownOpen] = useState(false);

  const [minExperience, setMinExperience] = useState("");
  const [maxExperience, setMaxExperience] = useState("");

  const handleExperienceChange = (e, type) => {
    const value = Math.max(0, Math.min(15, e.target.value));
    if (type === "min") {
      setMinExperience(value);
    } else {
      setMaxExperience(value);
    }
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: {
        min: type === "min" ? value : minExperience,
        max: type === "max" ? value : maxExperience,
      },
    });
  };
  useEffect(() => {
    onFilterChange({
      status: selectedStatusOptions,
      tech: selectedTechOptions,
      experience: { min: minExperience, max: maxExperience },
    });
  }, [
    selectedStatusOptions,
    selectedTechOptions,
    minExperience,
    maxExperience,
    onFilterChange,
  ]);

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
                <button
                  onClick={handleUnselectAll}
                  className="font-bold text-md"
                >
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
              onChange={(e) => handleExperienceChange(e, "min")}
              className="border-b form-input w-20 mr-2"
            />
            <span className="mx-2">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxExperience}
              min="1"
              max="15"
              onChange={(e) => handleExperienceChange(e, "max")}
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

const Users = () => {
  const organizationId = Cookies.get("organizationId");
  console.log(organizationId);
  const [notification] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchlocationsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/organization/${organizationId}`
        );
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };
    fetchlocationsData();
    setLoading(false);
  }, [organizationId]);
  // const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (users) => {
    
      setSelectedUser(users);
    
    setActionViewMore(false);
  };
  const handleCloseUsers = () => {
    setSelectedUser(null);
  };
  const [userToEdit, setUserToEdit] = useState(null);
  const handleEditClick = (users) => {
    setUserToEdit(users);
    setSidebarOpen1(true);
    setActionViewMore(null);
  };

  const handleclose = () => {
    setSelectedUser(false);
    setActionViewMore(false);
    setSidebarOpen(false);
    setSidebarOpen1(false);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    console.log("Search query:", event.target.value);
  };

  // const [selectedFilters, setSelectedFilters] = useState({
  //   status: [],
  //   tech: [],
  //   experience: [],
  // });

  const toggleAction = (id) => {
    setActionViewMore((prev) => (prev === id ? null : id));
  };

  const handleFilterChange = useCallback((filters) => {
    // setSelectedFilters(filters);
  }, []);
  const FilteredData = () => {
    if (!Array.isArray(userData)) return [];
    return userData.filter((users) => {
      const fieldsToSearch = [
        users.Firstname,
        users.UserId,
        users.Phone,
        users.Email,
        users.LinkedinUrl,
      ];

      return fieldsToSearch.some(
        (field) =>
          field !== undefined &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(FilteredData().length / rowsPerPage);
  const [activeArrow, setActiveArrow] = useState(null);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setActiveArrow("next");
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveArrow("prev");
    }
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, userData.length);
  const currentFilteredRows = FilteredData()
    .slice(startIndex, endIndex)
    .reverse();

  const [isMenuOpen, setMenuOpen] = useState(false);
  // const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // const openPopup = (users) => {
  //   setSelectedUser(users);
  //   setPopupOpen(true);
  // };

  // const closePopup = () => {
  //   setPopupOpen(false);
  //   setSelectedUser(null);
  // };

  useEffect(() => {
    document.title = "Users Tab";
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarOpen1, setSidebarOpen1] = useState(false);

  const sidebarRef = useRef(null);

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

  // const toggleSidebar1 = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  const closeSidebar1 = () => {
    setSidebarOpen1(false);
  };
  const handleOutsideClickk = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      closeSidebar1();
    }
  }, []);
  const [actionViewMore, setActionViewMore] = useState(null);

  const handleMoreClick = (usersId) => {
    setActionViewMore(usersId === actionViewMore ? null : usersId);
  };

  const [tableVisible] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const handleListViewClick = () => {
    setViewMode("list");
  };

  const handleKanbanViewClick = () => {
    setViewMode("kanban");
  };

  // const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleCandidateClick = (users) => {
    // setSelectedCandidate(users);

    setActionViewMore(false);
  };
  // const handleCloseProfile = () => {
  //   setSelectedCandidate(null);
  // };

  return (
    <>
      <div className="fixed top-24 left-0 right-0">
        <div className="flex justify-between p-4">
          <div>
            <span className="text-lg font-semibold">Users</span>
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
              Add User
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
                  className={`text-2xl mr-4 ${
                    viewMode === "list" ? "text-custom-blue" : ""
                  }`}
                />
              </span>
            </Tooltip>
            <Tooltip title="Kanban" enterDelay={300} leaveDelay={100} arrow>
              <span onClick={handleKanbanViewClick}>
                <TbLayoutGridRemove
                  className={`text-2xl ${
                    viewMode === "kanban" ? "text-custom-blue" : ""
                  }`}
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
                  placeholder="Search by Firstname, Email, Phone."
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
                  className={`border-2 p-2 mr-2 text-2xl ${
                    currentPage === 0 ? " cursor-not-allowed" : ""
                  } ${activeArrow === "prev" ? "text-blue-500" : ""}`}
                  onClick={prevPage}
                >
                  <IoIosArrowBack />
                </span>
              </Tooltip>

              <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                <span
                  className={`border-2 p-2 text-2xl ${
                    currentPage === totalPages - 1 ? " cursor-not-allowed" : ""
                  } ${activeArrow === "next" ? "text-blue-500" : ""}`}
                  onClick={nextPage}
                >
                  <IoIosArrowForward />
                </span>
              </Tooltip>
            </div>

            <div className="ml-4 text-2xl border-2 rounded-md p-2">
              <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                <span
                  onClick={userData.length === 0 ? null : toggleMenu}
                  style={{
                    opacity: userData.length === 0 ? 0.2 : 1,
                    pointerEvents: userData.length === 0 ? "none" : "auto",
                  }}
                >
                  <FaFilter
                    className={`${isMenuOpen ? "text-custom-blue" : ""}`}
                  />
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
                            <th scope="col" className="py-3 px-6">
                              Name
                            </th>
                            <th scope="col" className="py-3 px-6">
                              User ID
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Email
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Phone
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Linkedin URL
                            </th>
                            <th scope="col" className="py-3 px-6">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <tr>
                              <td colSpan="6" className="py-28 text-center">
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
                          ) : userData.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-10 text-center">
                                <div className="flex flex-col items-center justify-center p-5">
                                  <p className="text-9xl rotate-180 text-blue-500">
                                    <CgInfo />
                                  </p>
                                  <p className="text-center text-lg font-normal">
                                    You don't have Users yet. Create new users.
                                  </p>
                                  <p
                                    onClick={toggleSidebar}
                                    className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md"
                                  >
                                    Add Users
                                  </p>
                                </div>
                              </td>
                            </tr>
                          ) : currentFilteredRows.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-10 text-center">
                                <p className="text-lg font-normal">
                                  No data found.
                                </p>
                              </td>
                            </tr>
                          ) : (
                            currentFilteredRows.map((users, index) => (
                              <tr key={index} className="border-b text-xs">
                                <td className="py-3 px-6 text-custom-blue">
                                  <div
                                    className="flex items-center gap-3"
                                    onClick={() =>handleUserClick(users)}
                                  >
                                    {users.imageUrl ? (
                                      <img
                                        src={users.imageUrl}
                                        alt="Candidate"
                                        className="w-7 h-7 rounded"
                                      />
                                    ) : users.Gender === "Male" ? (
                                      <img
                                        src={maleImage}
                                        alt="Male Avatar"
                                        className="w-7 h-7 rounded"
                                      />
                                    ) : users.Gender === "Female" ? (
                                      <img
                                        src={femaleImage}
                                        alt="Female Avatar"
                                        className="w-7 h-7 rounded"
                                      />
                                    ) : (
                                      <img
                                        src={genderlessImage}
                                        alt="Other Avatar"
                                        className="w-7 h-7 rounded"
                                      />
                                    )}
                                    {users.Firstname}
                                  </div>
                                </td>
                                <td className="py-3 px-6">{users.UserId}</td>
                                <td className="py-3 px-6">{users.Email}</td>
                                <td className="py-3 px-6">{users.Phone}</td>
                                <td className="py-3 px-6">
                                  <a
                                    href={users.LinkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {users.LinkedinUrl}
                                  </a>
                                </td>
                                <td className="py-3 px-6 relative">
                                  <button
                                    onClick={() =>
                                      handleMoreClick(users.UserId)
                                    }
                                  >
                                    <MdMoreHoriz className="text-3xl" />
                                  </button>
                                  {actionViewMore === users.UserId && (
                                    <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2">
                                      <div className="space-y-1">
                                     
                                        <p
                                          className="hover:bg-gray-200 p-1 rounded pl-3"
                                          onClick={() => handleUserClick(users)}
                                        >
                                          View
                                        </p>
                                   
                                        <p
                                          className="hover:bg-gray-200 p-1 rounded pl-3"
                                          onClick={() => handleEditClick(users)}
                                        >
                                          Edit
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
                <OffcanvasMenu
                  isOpen={isMenuOpen}
                  closeOffcanvas={toggleMenu}
                  onFilterChange={handleFilterChange}
                />
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
                      ) : userData.length === 0 ? (
                        <div className="py-10 text-center">
                          <div className="flex flex-col items-center justify-center p-5">
                            <p className="text-9xl rotate-180 text-blue-500">
                              <CgInfo />
                            </p>
                            <p className="text-center text-lg font-normal">
                              You don't have candidates yet. Create new
                              candidate.
                            </p>
                            <p
                              onClick={toggleSidebar}
                              className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md"
                            >
                              Add Candidate
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4 p-4">
                          {currentFilteredRows.length === 0 ? (
                            <div className="col-span-3 py-10 text-center">
                              <p className="text-lg font-normal">
                                No data found.
                              </p>
                            </div>
                          ) : (
                            currentFilteredRows.map((users, index) => (
                              <div
                                key={users._id}
                                className="bg-white border border-orange-500 p-2 rounded"
                              >
                                <div className="relative">
                                  <div className="float-right">
                                    <button
                                      onClick={() => toggleAction(users._id)}
                                    >
                                      <IoMdMore className="text-3xl mt-1" />
                                    </button>
                                    {actionViewMore === users._id && (
                                      <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                        <div className="space-y-1">
                                          <p
                                            className="hover:bg-gray-200 p-1 rounded pl-3"
                                            onClick={() =>
                                              handleUserClick(users)
                                            }
                                          >
                                            View
                                          </p>
                                          <p
                                            className="hover:bg-gray-200 p-1 rounded pl-3"
                                            onClick={() =>
                                              handleEditClick(users)
                                            }
                                          >
                                            Edit
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex">
                                  <div className="w-16 h-14 mt-3 ml-1 mr-3 overflow-hidden cursor-pointer rounded">
                                    {users.imageUrl ? (
                                      <img
                                        src={users.imageUrl}
                                        alt="Candidate"
                                        className="w-full h-full rounded"
                                      />
                                    ) : users.Gender === "Male" ? (
                                      <img
                                        src={maleImage}
                                        alt="Male Avatar"
                                        className="w-full h-full rounded"
                                      />
                                    ) : users.Gender === "Female" ? (
                                      <img
                                        src={femaleImage}
                                        alt="Female Avatar"
                                        className="w-full h-full rounded"
                                      />
                                    ) : (
                                      <img
                                        src={genderlessImage}
                                        alt="Other Avatar"
                                        className="w-full h-full rounded"
                                      />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <div
                                      className="text-blue-400 text-lg cursor-pointer break-words"
                                      onClick={() =>
                                        handleCandidateClick(users)
                                      }
                                    >
                                      {users.Firstname}
                                    </div>
                                    <div className="text-xs grid grid-cols-2 gap-1 items-start">
                                      <div className="text-gray-400">
                                        {" "}
                                        User ID
                                      </div>
                                      <div>{users.UserId}</div>
                                      <div className="text-gray-400">Email</div>
                                      <div>{users.Email}</div>
                                      <div className="text-gray-400">Phone</div>
                                      <div>{users.Phone}</div>
                                      <div className="text-gray-400">
                                        {" "}
                                        Linkedin URL
                                      </div>
                                      <div>{users.LinkedinUrl}</div>
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
                  <OffcanvasMenu
                    isOpen={isMenuOpen}
                    closeOffcanvas={toggleMenu}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onOutsideClick={handleOutsideClick}
        ref={sidebarRef}
      />

      <Sidebar1
        isOpen={sidebarOpen1}
        onClose={closeSidebar1}
        onOutsideClick={handleOutsideClickk}
        ref={sidebarRef}
        user={userToEdit}
      />
      {selectedUser && <UserProfileDetails Users={selectedUser} onCloseUsers={handleCloseUsers} />}

      {selectedUser && <EditUser onClose={handleclose} users={selectedUser} />}
    </>
  );
};

export default Users; // {f} //
