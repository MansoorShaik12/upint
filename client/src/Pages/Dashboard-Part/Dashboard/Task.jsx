import { useState, useEffect, useCallback } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaList } from "react-icons/fa6";
import { TbLayoutGridRemove } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import Tooltip from "@mui/material/Tooltip";
import { FaFilter } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { CgInfo } from "react-icons/cg";
import TaskForm from '../Dashboard/Task_form.jsx';
import axios from 'axios';


const OffcanvasMenu = ({ isOpen, onFilterChange }) => {
    const [isStatusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [isPriorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
    const [isStatusMainChecked, setStatusMainChecked] = useState(false);
    const [isPriorityMainChecked, setPriorityMainChecked] = useState(false);
    const [selectedStatusOptions, setSelectedStatusOptions] = useState([]);
    const [selectedPriorityOptions, setSelectedPriorityOptions] = useState([]);

    const isAnyOptionSelected = selectedStatusOptions.length > 0 || selectedPriorityOptions.length > 0;

    const handleUnselectAll = () => {
        setSelectedStatusOptions([]);
        setSelectedPriorityOptions([]);
        setStatusMainChecked(false);
        setPriorityMainChecked(false);
        onFilterChange({ status: [], priority: [] });
    };

    useEffect(() => {
        if (!isStatusMainChecked) setSelectedStatusOptions([]);
        if (!isPriorityMainChecked) setSelectedPriorityOptions([]);
    }, [isStatusMainChecked, isPriorityMainChecked]);

    const handleStatusMainToggle = () => {
        setStatusMainChecked(!isStatusMainChecked);
        const newSelectedStatus = isStatusMainChecked ? [] : [...statusOptions];
        setSelectedStatusOptions(newSelectedStatus);
        onFilterChange({ status: newSelectedStatus, priority: selectedPriorityOptions });
    };

    const handlePriorityMainToggle = () => {
        setPriorityMainChecked(!isPriorityMainChecked);
        const newSelectedPriority = isPriorityMainChecked ? [] : [...priorityOptions];
        setSelectedPriorityOptions(newSelectedPriority);
        onFilterChange({ status: selectedStatusOptions, priority: newSelectedPriority });
    };

    const handleStatusOptionToggle = (option) => {
        const selectedIndex = selectedStatusOptions.indexOf(option);
        const updatedOptions = selectedIndex === -1
            ? [...selectedStatusOptions, option]
            : selectedStatusOptions.filter((_, index) => index !== selectedIndex);

        setSelectedStatusOptions(updatedOptions);
        onFilterChange({ status: updatedOptions, priority: selectedPriorityOptions });
    };

    const handlePriorityOptionToggle = (option) => {
        const selectedIndex = selectedPriorityOptions.indexOf(option);
        const updatedOptions = selectedIndex === -1
            ? [...selectedPriorityOptions, option]
            : selectedPriorityOptions.filter((_, index) => index !== selectedIndex);

        setSelectedPriorityOptions(updatedOptions);
        onFilterChange({ status: selectedStatusOptions, priority: updatedOptions });
    };

    const statusOptions = [
        "New",
        "In Progress",
        "Completed",
        "No Response",
    ];

    const priorityOptions = [
        "High",
        "Normal",

    ];

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
                        <h2 className="text-lg font-bold">Filter</h2>
                    </div>
                    <div>
                        {isAnyOptionSelected && (
                            <div>
                                <button onClick={handleUnselectAll} className="font-bold text-md">
                                    Unselect All
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Filter */}
                <div className="flex justify-between">
                    <div className="cursor-pointer">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5"
                                checked={isStatusMainChecked}
                                onChange={handleStatusMainToggle}
                            />
                            <span className="ml-3 font-bold">Status</span>
                        </label>
                    </div>
                    <div
                        className="cursor-pointer mr-3 text-2xl"
                        onClick={() => setStatusDropdownOpen(!isStatusDropdownOpen)}
                    >
                        {isStatusDropdownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
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

                {/* Priority Filter */}
                <div className="flex justify-between mt-2">
                    <div className="cursor-pointer">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5"
                                checked={isPriorityMainChecked}
                                onChange={handlePriorityMainToggle}
                            />
                            <span className="ml-3 font-bold">Priority</span>
                        </label>
                    </div>
                    <div
                        className="cursor-pointer mr-3 text-2xl"
                        onClick={() => setPriorityDropdownOpen(!isPriorityDropdownOpen)}
                    >
                        {isPriorityDropdownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                    </div>
                </div>
                {isPriorityDropdownOpen && (
                    <div className="bg-white py-2 mt-1">
                        {priorityOptions.map((option, index) => (
                            <label key={index} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5"
                                    checked={selectedPriorityOptions.includes(option)}
                                    onChange={() => handlePriorityOptionToggle(option)}
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



const Task = ({ sharingPermissions }) => {
    // Define missing state variables
    const [viewMode, setViewMode] = useState("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [taskData, setTaskData] = useState([]);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [actionViewMore, setActionViewMore] = useState(null);
    const [tableVisible, setTableVisible] = useState(true);
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);


    // Define missing functions
    const handleListViewClick = () => setViewMode("list");
    const handleKanbanViewClick = () => setViewMode("kanban");
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };
    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };
    const nextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };
    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    const toggleAction = (id) => setActionViewMore(actionViewMore === id ? null : id);

    const handleFilterChange = useCallback((filters) => {
        setSelectedFilters(filters);
    }, []);

    const [selectedFilters, setSelectedFilters] = useState({
        status: [],
        priority: [],
    });


    const FilteredData = () => {
        if (!Array.isArray(taskData)) return [];
        return taskData.filter((task) => {
            const fieldsToSearch = [
                task.title,  // Assuming tasks have a title field
                task.description,  // Assuming tasks have a description field
                task.assigned,  // Assuming tasks have an assigned field
            ].filter(field => field !== null && field !== undefined);

            const matchesStatus = selectedFilters.status.length === 0 || selectedFilters.status.includes(task.status);
            const matchesPriority = selectedFilters.priority.length === 0 || selectedFilters.priority.includes(task.priority);

            const matchesSearchQuery = fieldsToSearch.some(
                (field) =>
                    field.toString().toLowerCase().includes(searchQuery.toLowerCase())
            );

            return matchesSearchQuery && matchesStatus && matchesPriority;
        });
    };
    const rowsPerPage = 10;
    const totalPages = Math.ceil(FilteredData().length / rowsPerPage);


    const startIndex = currentPage * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, FilteredData().length);

    const currentFilteredRows = FilteredData()
        .slice(startIndex, endIndex)
        .reverse();

    const noResults = currentFilteredRows.length === 0 && searchQuery !== "";

    const handleAddTaskClick = () => {
        setIsTaskFormOpen(true);
    };

    const handleTaskFormClose = () => {
        setIsTaskFormOpen(false);
    };




    // Function to handle opening the TaskForm
    const handleOpenTaskForm = () => {
        setIsTaskFormOpen(true);
    };

    // Function to handle closing the TaskForm
    const handleCloseTaskForm = () => {
        setIsTaskFormOpen(false);
    };

   

    // Fetch tasks from the backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tasks`);
                setTaskData(response.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    

    const handleTaskAdded = (newTask) => {
        setTaskData((prevTasks) => [...prevTasks, newTask]);
        setIsTaskFormOpen(false);
    };

    







    return (
        <>
            <div className={`fixed top-24 left-0 right-0 ${isTaskFormOpen ? 'bg-gray-200 bg-opacity-50' : ''}`}>
                <div className="flex justify-between p-4">
                    <div>
                        <span className="text-lg font-semibold">Tasks</span>
                    </div>

                    <div onClick={handleOpenTaskForm} className="mr-6">
                        <span className="p-2 text-md font-semibold border shadow rounded-3xl">
                            Add Task
                        </span>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className={`fixed top-36 left-0 right-0 ${isTaskFormOpen ? 'bg-gray-200 bg-opacity-50' : ''}`}>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <Tooltip title="List" enterDelay={300} leaveDelay={100} arrow>
                            <span onClick={handleListViewClick}>
                                <FaList className={`text-2xl mr-4 ${viewMode === "list" ? "text-blue-500" : ""}`} />
                            </span>
                        </Tooltip>
                        <Tooltip title="Kanban" enterDelay={300} leaveDelay={100} arrow>
                            <span onClick={handleKanbanViewClick}>
                                <TbLayoutGridRemove className={`text-2xl ${viewMode === "kanban" ? "text-blue-500" : ""}`} />
                            </span>
                        </Tooltip>
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <div className="searchintabs mr-5 relative">
                                <div className="absolute inset-y-0 left-0 flex items-center">
                                    <button type="submit" className="p-2">
                                        <IoMdSearch />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by Task ID ,Title, Assigned To."
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
                                <span className={`border-2 p-2 mr-2 text-2xl ${currentPage === 0 ? " cursor-not-allowed" : ""}`} onClick={prevPage}>
                                    <IoIosArrowBack />
                                </span>
                            </Tooltip>
                            <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                                <span className={`border-2 p-2 text-2xl ${currentPage === totalPages - 1 ? " cursor-not-allowed" : ""}`} onClick={nextPage}>
                                    <IoIosArrowForward />
                                </span>
                            </Tooltip>
                        </div>
                        <div className="ml-4 text-2xl border-2 rounded-md p-2">
                            <Tooltip title="Filter" enterDelay={300} leaveDelay={100} arrow>
                                <span onClick={taskData.length === 0 ? null : toggleMenu} style={{ opacity: taskData.length === 0 ? 0.2 : 1 }}>
                                    <FaFilter className={`${isMenuOpen ? "text-blue-500" : ""}`} />
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
                                <div className="flex-grow" style={{ marginRight: isMenuOpen ? "290px" : "0" }}>
                                    <div className="relative">
                                        <div className="overflow-y-auto min-h-80 max-h-96">
                                            <table className="text-left w-full border-collapse border-gray-300 mb-14">
                                                <thead className="bg-gray-300 sticky top-0 z-10 text-xs">
                                                    <tr>
                                                        <th scope="col" className="py-3 px-6">Task ID</th>
                                                        <th scope="col" className="py-3 px-6">Title</th>
                                                        <th scope="col" className="py-3 px-6">Assigned To</th>
                                                        <th scope="col" className="py-3 px-6">Priority</th>
                                                        <th scope="col" className="py-3 px-6">Status</th>
                                                        <th scope="col" className="py-3 px-6">Due Date</th>
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
                                                    ) : taskData.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="7" className="py-10 text-center">
                                                                <div className="flex flex-col items-center justify-center p-5">
                                                                    <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                                                    <p className="text-center text-lg font-normal">You don't have tasks yet. Create a new task.</p>
                                                                    {/* <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add Task</p> */}
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
                                                        currentFilteredRows.map((task) => (
                                                            <tr key={task._id} className="bg-white border-b cursor-pointer text-xs">
                                                                <td className="py-2 px-6 text-blue-400">
                                                                    <div
                                                                        className="flex items-center gap-3"
                                                                    // onClick={() => handleTaskClick(task)}
                                                                    >
                                                                        {task.imageUrl ? (
                                                                            <img src={task.imageUrl} alt="Task" className="w-7 h-7 rounded" />
                                                                        ) : (
                                                                            <div className="w-7 h-7 rounded bg-gray-300 flex items-center justify-center">
                                                                                <span>No Image</span>
                                                                            </div>
                                                                        )}
                                                                        {task.title}
                                                                    </div>
                                                                </td>
                                                                <td className="py-2 px-6">{task.assigned}</td>
                                                                <td className="py-2 px-6">{task.priority}</td>
                                                                <td className="py-2 px-6">{task.status}</td>
                                                                <td className="py-2 px-6">{task.dueDate}</td>
                                                                <td className="py-2 px-6">{task.description}</td>
                                                                <td className="py-2 px-6 relative">
                                                                    <button onClick={() => toggleAction(task._id)}>
                                                                        <MdMoreHoriz className="text-3xl" />
                                                                    </button>
                                                                    {actionViewMore === task._id && (
                                                                        <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                                                            <div className="space-y-1">
                                                                                <p
                                                                                    className="hover:bg-gray-200 p-1 rounded pl-3"
                                                                                // onClick={() => handleTaskClick(task)}
                                                                                >
                                                                                    View
                                                                                </p>
                                                                                <p className="hover:bg-gray-200 p-1 rounded pl-3" >Edit</p>

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


                            // Kanban view

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
                                            ) : taskData.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <div className="flex flex-col items-center justify-center p-5">
                                                        <p className="text-9xl rotate-180 text-blue-500"><CgInfo /></p>
                                                        <p className="text-center text-lg font-normal">You don't have tasks yet. Create a new task.</p>
                                                        {/* <p onClick={toggleSidebar} className="mt-3 cursor-pointer text-white bg-blue-400 px-4 py-1 rounded-md">Add Task</p> */}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 gap-4 p-4">
                                                    {currentFilteredRows.length === 0 ? (
                                                        <div className="col-span-3 py-10 text-center">
                                                            <p className="text-lg font-normal">No data found.</p>
                                                        </div>
                                                    ) : (
                                                        currentFilteredRows.map((task) => (
                                                            <div key={task._id} className="bg-white border border-orange-500 p-2 rounded">
                                                                <div className="relative">
                                                                    <div className="float-right">
                                                                        <button onClick={() => toggleAction(task._id)}>
                                                                            <MdMoreHoriz className="text-3xl mt-1" />
                                                                        </button>
                                                                        {actionViewMore === task._id && (
                                                                            <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                                                                <div className="space-y-1">
                                                                                    <p className="hover:bg-gray-200 p-1 rounded pl-3" >View</p>
                                                                                    <p className="hover:bg-gray-200 p-1 rounded pl-3">Edit</p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex">
                                                                    <div className="text-blue-400 text-lg cursor-pointer break-words" >
                                                                        {task.title}
                                                                    </div>
                                                                    <div className="text-xs grid grid-cols-2 gap-1 items-start">
                                                                        <div className="text-gray-400">Assigned To</div>
                                                                        <div>{task.assigned}</div>
                                                                        <div className="text-gray-400">Priority</div>
                                                                        <div>{task.priority}</div>
                                                                        <div className="text-gray-400">Status</div>
                                                                        <div>{task.status}</div>
                                                                        <div className="text-gray-400">Due Date</div>
                                                                        <div>{task.dueDate}</div>
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

            {/* Task Form as a sidebar */}
            {isTaskFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-15 z-50">
                    <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-500 transform">
                        <TaskForm
                            isOpen={isTaskFormOpen}
                            onClose={handleTaskFormClose}
                            onTaskAdded={handleTaskAdded}
                            sharingPermissions={sharingPermissions}
                        />
                    </div>
                </div>
            )}

        </>
    );
};

export default Task;