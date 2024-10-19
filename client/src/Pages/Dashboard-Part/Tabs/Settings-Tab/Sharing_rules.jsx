
import React, { useState, useRef, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbLayoutGridRemove } from "react-icons/tb";
import { FaList } from "react-icons/fa6";
import { MdMoreHoriz } from "react-icons/md";
import Sidebar from "./AddSharing_rules.jsx";
import SharingRuleDetails from "./SharingRuleDetails.jsx";
import EditSharingRule from "./EditSharingRule.jsx";
import axios from "axios";
import Cookies from "js-cookie";
const SharingRules = () => {
    const [rules, setRules] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [viewMode, setViewMode] = useState("list");
    const rowsPerPage = 10;
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const [editingRule, setEditingRule] = useState(null);

    const organizationId = Cookies.get('organizationId');
    useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/from/sharing-rules`, {
                    params: { orgId: organizationId } // Pass orgId as a query parameter
                });
                setRules(response.data);
            } catch (error) {
                console.error('Error fetching sharing rules:', error);
            }
        };
        fetchRules();
    }, [organizationId]);

    const handleListViewClick = () => {
        setViewMode("list");
    };

    const handleKanbanViewClick = () => {
        setViewMode("kanban");
    };

    const [activeArrow, setActiveArrow] = useState(null);
    const [actionViewMore, setActionViewMore] = useState({});

    const toggleAction = (id) => {
        setActionViewMore((prev) => (prev === id ? null : id));
    };

    const totalPages = Math.ceil(rules.length / rowsPerPage);
    const currentFilteredRows = rules.slice(
        currentPage * rowsPerPage,
        (currentPage + 1) * rowsPerPage
    );

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleViewClick = (rule) => {
        setSelectedRule(rule);
        setActionViewMore(null);
    };

    const handleEditClick = (rule) => {
        setEditingRule(rule);
        setActionViewMore(null);
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    return (
        <>

            <div>
                <div className="fixed top-24 left-0 ml-64 right-0">
                    <div className="flex justify-between p-4">
                        <div>
                            <span className="text-lg font-semibold">Sharing Rules</span>
                        </div>

                        <div className="mr-6">
                            <span className="p-2 text-md font-semibold border shadow rounded-3xl"
                                onClick={toggleSidebar}                >
                                Add
                            </span>
                        </div>
                    </div>
                    <div className="fixed top-36 left-0 right-0 ml-64">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center">
                                <Tooltip title="List" enterDelay={300} leaveDelay={100} arrow>
                                    <span onClick={handleListViewClick}>
                                        <FaList
                                            className={`text-2xl mr-4 ${viewMode === "list" ? "text-blue-500" : ""
                                                }`}
                                        />
                                    </span>
                                </Tooltip>
                                <Tooltip title="Kanban" enterDelay={300} leaveDelay={100} arrow>
                                    <span onClick={handleKanbanViewClick}>
                                        <TbLayoutGridRemove
                                            className={`text-2xl ${viewMode === "kanban" ? "text-blue-500" : ""
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
                                                <IoMdSearch />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by Candidate, Email, Phone."
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
                                    <Tooltip
                                        title="Previous"
                                        enterDelay={300}
                                        leaveDelay={100}
                                        arrow
                                    >
                                        <span
                                            className={`border-2 p-2 mr-2 text-2xl ${currentPage === 0 ? " cursor-not-allowed" : ""
                                                } ${activeArrow === "prev" ? "text-blue-500" : ""}`}
                                            onClick={prevPage}
                                        >
                                            <IoIosArrowBack />
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Next" enterDelay={300} leaveDelay={100} arrow>
                                        <span
                                            className={`border-2 p-2 text-2xl ${currentPage === totalPages - 1
                                                ? " cursor-not-allowed"
                                                : ""
                                                } ${activeArrow === "next" ? "text-blue-500" : ""}`}
                                            onClick={nextPage}
                                        >
                                            <IoIosArrowForward />
                                        </span>
                                    </Tooltip>
                                </div>
                                <div className="ml-4 text-2xl border-2 rounded-md p-2">
                                    <Tooltip
                                        title="Filter"
                                        enterDelay={300}
                                        leaveDelay={100}
                                        arrow
                                    >
                                        <span
                                            onClick={rules.length === 0 ? null : toggleMenu}
                                            style={{
                                                opacity: rules.length === 0 ? 0.2 : 1,
                                                pointerEvents:
                                                    rules.length === 0 ? "none" : "auto",
                                            }}
                                        >
                                            <FaFilter
                                                className={`${isMenuOpen ? "text-blue-500" : ""}`}
                                            />
                                        </span>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="fixed left-0 right-0 ml-64 mx-auto top-56 z-10">
                        {viewMode === "list" ? (
                            <div className="overflow-y-auto min-h-80 max-h-96">
                                <table className="text-left w-full border-collapse border-gray-300 mb-14">
                                    <thead className="bg-gray-300 sticky top-0 z-10 text-xs">
                                        <tr>
                                            <th scope="col" className="py-3 px-6">
                                                Rule Name
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Object Name
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Rule Type
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Records Owned By
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Shared With
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Access
                                            </th>
                                            <th scope="col" className="py-3 px-6">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentFilteredRows.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="py-10 text-center">
                                                    <p className="text-lg font-normal">No data found.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            currentFilteredRows.map((rule) => (
                                                <tr
                                                    key={rule.ruleName}
                                                    className="bg-white border-b cursor-pointer text-xs"
                                                >
                                                    <td className="py-2 px-6">{rule.name}</td>
                                                    <td className="py-2 px-6">{rule.objectName}</td>
                                                    <td className="py-2 px-6">{rule.ruleType}</td>
                                                    <td className="py-2 px-6">{rule.recordsOwnedBy}</td>
                                                    <td className="py-2 px-6">{rule.shareWith}</td>
                                                    <td className="py-2 px-6">{rule.access}</td>
                                                    <td className="py-2 px-6 relative">
                                                        <button onClick={() => toggleAction(rule.ruleName)}>
                                                            <MdMoreHoriz className="text-3xl" />
                                                        </button>
                                                        {actionViewMore === rule.ruleName && (
                                                            <div className="absolute z-10 w-36 rounded-md shadow-lg bg-white ring-1 p-4 ring-black ring-opacity-5 right-2 popup">
                                                                <div className="space-y-1">
                                                                    <p
                                                                        className="hover:bg-gray-200 p-1 rounded pl-3"
                                                                        onClick={() => handleViewClick(rule)}
                                                                    >
                                                                        View
                                                                    </p>
                                                                    <p
                                                                        className="hover:bg-gray-200 p-1 rounded pl-3"
                                                                        onClick={() => handleEditClick(rule)}
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
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {currentFilteredRows.map((rule) => (
                                    <div key={rule.ruleName} className="bg-white border p-4 rounded">
                                        <h3 className="font-bold">{rule.name}</h3>
                                        <p>Object Name: {rule.objectName}</p>
                                        <p>Rule Type: {rule.ruleType}</p>
                                        <p>Records Owned By: {rule.recordsOwnedBy}</p>
                                        <p>Shared With: {rule.shareWith}</p>
                                        <p>Access: {rule.access}</p>
                                        <button className="text-blue-500" onClick={() => handleViewClick(rule)}>View</button>
                                        <button className="text-blue-500" onClick={() => handleEditClick(rule)}>Edit</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {sidebarOpen && (
                <>
                    <div className={"fixed inset-0 bg-black bg-opacity-15 z-50"}>
                        <div className="fixed inset-y-0 right-0 z-50 w-1/2 bg-white shadow-lg transition-transform duration-5000 transform">
                            <Sidebar
                                onClose={closeSidebar}
                            />
                        </div>
                    </div>
                </>
            )}
            
            {selectedRule && (
                <SharingRuleDetails rule={selectedRule} onClose={() => setSelectedRule(null)} />
            )}

            {editingRule && (
                <EditSharingRule rule={editingRule} onClose={() => setEditingRule(null)} />
            )}
        </>
    );
};

export default SharingRules;

