import React, { useState, useEffect } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { fetchMasterData } from '../../../../utils/fetchMasterData';
import fetchOrganizationData from '../../../../utils/fetchOrganizationData';
import axios from 'axios';
import Cookies from 'js-cookie';
// Define dropdown data
const ruleTypes = ["Based on Record Owner", "Based on Criteria"];

const accessLevels = ["Read-Only", "Read/Write"];
const categories = ["Role", "User"];

const AddSharingRules = ({ onClose }) => {
    const organizationId = Cookies.get('organizationId');
    // State for dropdown visibility and selected value
    const [showDropdownRuleType, setShowDropdownRuleType] = useState(false);
    const [selectedRuleType, setSelectedRuleType] = useState("");
    const [showDropdownObjectName, setShowDropdownObjectName] = useState(false);
    const [selectedObjectName, setSelectedObjectName] = useState("");
    const [showDropdownAccess, setShowDropdownAccess] = useState(false);
    const [selectedAccess, setSelectedAccess] = useState("");
    const [objectNames, setObjectNames] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [ownedByUsersList, setOwnedByUsersList] = useState([]);
    const [ownedByRolesList, setOwnedByRolesList] = useState([]);

    // Separate state for "Records Owned By" dropdowns
    const [showDropdownCategoryOwnedBy, setShowDropdownCategoryOwnedBy] = useState(false);
    const [selectedCategoryOwnedBy, setSelectedCategoryOwnedBy] = useState("");
    const [showDropdownOptionsOwnedBy, setShowDropdownOptionsOwnedBy] = useState(false);
    const [selectedOptionOwnedBy, setSelectedOptionOwnedBy] = useState("");

    // Separate state for "Share With" dropdowns
    const [showDropdownCategoryShareWith, setShowDropdownCategoryShareWith] = useState(false);
    const [selectedCategoryShareWith, setSelectedCategoryShareWith] = useState("");
    const [showDropdownOptionsShareWith, setShowDropdownOptionsShareWith] = useState(false);
    const [selectedOptionShareWith, setSelectedOptionShareWith] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const [selectedRuleName, setSelectedRuleName] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");
    const [sharingRules, setSharingRules] = useState([]);
    const [selectedOptionOwnedById, setSelectedOptionOwnedById] = useState("");
    const [selectedOptionShareWithId, setSelectedOptionShareWithId] = useState("");
    // Function to toggle dropdown visibility
    const toggleDropdownRuleType = () => {
        setShowDropdownRuleType(!showDropdownRuleType);
    };

    const toggleDropdownObjectName = () => {
        setShowDropdownObjectName(!showDropdownObjectName);
    };

    const toggleDropdownAccess = () => {
        setShowDropdownAccess(!showDropdownAccess);
    };

    const toggleDropdownCategoryOwnedBy = () => {
        setShowDropdownCategoryOwnedBy(!showDropdownCategoryOwnedBy);
    };

    const toggleDropdownOptionsOwnedBy = () => {
        setShowDropdownOptionsOwnedBy(!showDropdownOptionsOwnedBy);
    };

    const toggleDropdownCategoryShareWith = () => {
        setShowDropdownCategoryShareWith(!showDropdownCategoryShareWith);
    };

    const toggleDropdownOptionsShareWith = () => {
        setShowDropdownOptionsShareWith(!showDropdownOptionsShareWith);
    };

    // Function to handle selection
    const handleRuleTypeSelect = (type) => {
        setSelectedRuleType(type);
        setShowDropdownRuleType(false);
    };

    const handleObjectNameSelect = (name) => {
        setSelectedObjectName(name);
        setShowDropdownObjectName(false);
    };

    const handleAccessSelect = (access) => {
        setSelectedAccess(access);
        setShowDropdownAccess(false);
    };

    const handleCategorySelectOwnedBy = (category) => {
        setSelectedCategoryOwnedBy(category);
        setSelectedOptionOwnedBy("");
        setSelectedOptionOwnedById("");
        setShowDropdownCategoryOwnedBy(false);

        // Clear "Share With" fields when "Records Owned By" category changes
        setSelectedCategoryShareWith("");
        setSelectedOptionShareWith("");
        setSelectedOptionShareWithId("");
    };

    const handleOptionSelectOwnedBy = (option) => {
        setSelectedOptionOwnedBy(option.name);
        setSelectedOptionOwnedById(option.id);
        setShowDropdownOptionsOwnedBy(false);
        setSelectedOptionShareWith("");
        setSelectedOptionShareWithId("");
    };

    const handleCategorySelectShareWith = (category) => {
        setSelectedCategoryShareWith(category);
        setSelectedOptionShareWith("");
        setSelectedOptionShareWithId("");
        setShowDropdownCategoryShareWith(false);
    };

    const handleOptionSelectShareWith = (option) => {
        const key = `${selectedObjectName}-${selectedCategoryOwnedBy}`;
        setSelections(prev => ({
            ...prev,
            [key]: [...(prev[key] || []), option.id]
        }));
        setSelectedOptionShareWith(option.name);
        setSelectedOptionShareWithId(option.id);
        setShowDropdownOptionsShareWith(false);
    };

    const isShareWithEnabled = selectedRuleType === "Based on Record Owner" && selectedOptionOwnedBy !== "";
    // Determine options based on selected category
    const optionsShareWith = selectedCategoryShareWith === "Role" ? rolesList : usersList;
    const optionsOwnedBy = selectedCategoryOwnedBy === "Role" ? ownedByRolesList : ownedByUsersList;



    useEffect(() => {
        const fetchObjectsData = async () => {
            try {
                const data = await fetchMasterData('sharing-rules-objects');
                setObjectNames(data.map(obj => obj.objects).flat());
                console.log(data);
            } catch (error) {
                console.error('Error fetching objects data:', error);
            }
        };
        fetchObjectsData();
    }, []);

  

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/organization/${organizationId}`);
                const usersData = response.data.map(user => ({ name: user.Name, id: user._id }));
                setUsersList(usersData);
                setOwnedByUsersList(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // const fetchRoles = async () => {
        //     try {
        //         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rolesdata/${organizationId}`);
        //         const rolesData = response.data.map(role => ({ name: role.roleName, id: role._id }));
        //         setRolesList(rolesData);
        //         setOwnedByRolesList(rolesData);
        //     } catch (error) {
        //         console.error('Error fetching roles:', error);
        //     }
        // };

        const fetchRoles = async () => {
            try {
                const rolesData = await fetchOrganizationData('rolesdata');
                const formattedRolesData = rolesData.map(role => ({ name: role.roleName, id: role._id }));
                setRolesList(formattedRolesData);
                setOwnedByRolesList(formattedRolesData);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

        if (selectedCategoryShareWith === "User") {
            fetchUsers();
        } else if (selectedCategoryShareWith === "Role") {
            fetchRoles();
        }

        if (selectedCategoryOwnedBy === "User") {
            fetchUsers();
        } else if (selectedCategoryOwnedBy === "Role") {
            fetchRoles();
        }
    }, [selectedCategoryShareWith, selectedCategoryOwnedBy, organizationId]);
    // useEffect(() => {
    //     const fetchSharingRules = async () => {
    //         try {
    //             const data = await fetchOrganizationData('sharing-rules'); // Ensure this matches the backend
    //             setSharingRules(data);
    //         } catch (error) {
    //             console.error('Error fetching sharing rules:', error);
    //         }
    //     };

    //     fetchSharingRules();
    // }, []);

    useEffect(() => {
        const fetchSharingRules = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/from/sharing-rules?orgId=${organizationId}`);
                setSharingRules(response.data);
            } catch (error) {
                console.error('Error fetching sharing rules:', error);
            }
        };
        fetchSharingRules();
    }, [organizationId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            label: selectedLabel,
            name: selectedRuleName,
            objectName: selectedObjectName,
            ruleType: selectedRuleType,
            recordsOwnedBy: selectedCategoryOwnedBy,
            recordsOwnedById: selectedOptionOwnedById,
            shareWith: selectedCategoryShareWith,
            shareWithId: selectedOptionShareWithId,
            access: selectedAccess,
            description: selectedDescription,
            orgId: organizationId
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/sharing-rules`, data);
            console.log('Sharing rule saved:', response.data);
        } catch (error) {
            console.error('Error saving sharing rule:', error);
        }
        onClose();
    };
    const [selections, setSelections] = useState({});

    const getFilteredShareWithOptions = () => {
        return optionsShareWith.filter(option => {
            return !sharingRules.some(rule =>
                rule.objectName === selectedObjectName &&
                rule.recordsOwnedBy === selectedCategoryOwnedBy &&
                rule.recordsOwnedById === selectedOptionOwnedById &&
                rule.shareWithId === option.id
            );
        });
    };

    useEffect(() => {
        const key = `${selectedObjectName}-${selectedCategoryOwnedBy}`;
        if (!selections[key]) {
            setSelections(prev => ({
                ...prev,
                [key]: []
            }));
        }
    }, [selectedObjectName, selectedCategoryOwnedBy]);



    return (
        <div>
            {/* Header  */}
            <div className="fixed top-0 w-full bg-white border-b">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-bold">Sharing Rules</h2>
                    <button onClick={onClose} className="focus:outline-none">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Form section */}
            <div className="fixed top-16 bottom-16 overflow-auto p-5 w-full text-sm right-0">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Label  */}
                    <div className="flex items-center mb-5">
                        <label className="block text-sm font-medium text-gray-700 w-1/3 mr-4">
                            Label <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-grow">
                            <input
                                type="text"
                                className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                value={selectedLabel}
                                onChange={(e) => setSelectedLabel(e.target.value)}
                            />                        </div>
                    </div>

                    {/* Rule Name  */}
                    <div className="flex items-center mb-5">
                        <label className="block text-sm font-medium text-gray-700 w-1/3 mr-4">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-grow">
                            <input
                                type="text"
                                className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                value={selectedRuleName}
                                onChange={(e) => setSelectedRuleName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Object Name */}
                    <div className="flex items-center mb-5">
                        <label className="block text-sm font-medium text-gray-700 w-1/3 mr-4">
                            Object Name <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                value={selectedObjectName}
                                onClick={toggleDropdownObjectName}
                                readOnly
                            />
                            <MdArrowDropDown
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={toggleDropdownObjectName}
                            />
                            {showDropdownObjectName && (
                                <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg h-40 overflow-y-auto">
                                    {objectNames.map((obj, index) => (
                                        <div
                                            key={index}
                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleObjectNameSelect(obj)}
                                        >
                                            {obj}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rule Type  */}
                    <div className="flex items-center mb-5">
                        <label className="block text-sm font-medium text-gray-700 w-1/3 mr-4">
                            Rule Type <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                value={selectedRuleType}
                                onClick={toggleDropdownRuleType}
                                readOnly
                            />
                            <MdArrowDropDown
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={toggleDropdownRuleType}
                            />
                            {showDropdownRuleType && (
                                <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg">
                                    {ruleTypes.map((type) => (
                                        <div
                                            key={type}
                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleRuleTypeSelect(type)}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Records Owned By  */}
                    <div className={`flex items-center mb-5 ${selectedRuleType !== "Based on Record Owner" ? "opacity-50 pointer-events-none" : ""}`}>
                        <label className="block text-sm font-medium text-gray-700 w-1/3 mr-4">
                            Records Owned By <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-grow flex gap-4">
                            <div className="relative w-1/2">
                                <input
                                    type="text"
                                    className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                    value={selectedCategoryOwnedBy}
                                    onClick={toggleDropdownCategoryOwnedBy}
                                    readOnly
                                />
                                <MdArrowDropDown
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={toggleDropdownCategoryOwnedBy}
                                />
                                {showDropdownCategoryOwnedBy && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg">
                                        {categories.map((category) => (
                                            <div
                                                key={category}
                                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleCategorySelectOwnedBy(category)}
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="relative w-1/2">
                                <input
                                    type="text"
                                    className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                    value={selectedOptionOwnedBy}
                                    onClick={toggleDropdownOptionsOwnedBy}
                                    readOnly
                                />
                                <MdArrowDropDown
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={toggleDropdownOptionsOwnedBy}
                                />
                                {showDropdownOptionsOwnedBy && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg">
                                        {optionsOwnedBy.map((option) => (
                                            <div
                                                key={option.id}
                                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleOptionSelectOwnedBy(option)}
                                            >
                                                {option.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Share With  */}
                    <div className={`flex items-center mb-5 ${!isShareWithEnabled ? "opacity-50 pointer-events-none" : ""}`}>
                        <label className="block text-sm font-medium text-gray-700 w-1/3 mr-4">
                            Share With <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-grow flex gap-4">
                            <div className="relative w-1/2">
                                <input
                                    type="text"
                                    className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                    value={selectedCategoryShareWith}
                                    onClick={toggleDropdownCategoryShareWith}
                                    readOnly
                                />
                                <MdArrowDropDown
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={toggleDropdownCategoryShareWith}
                                />
                                {showDropdownCategoryShareWith && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg">
                                        {categories.map((category) => (
                                            <div
                                                key={category}
                                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleCategorySelectShareWith(category)}
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="relative w-1/2">
                                <input
                                    type="text"
                                    className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                    value={selectedOptionShareWith}
                                    onClick={toggleDropdownOptionsShareWith}
                                    readOnly
                                />
                                <MdArrowDropDown
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                    onClick={toggleDropdownOptionsShareWith}
                                />
                                {showDropdownOptionsShareWith && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg">
                                        {getFilteredShareWithOptions().map((option) => (
                                            <div
                                                key={option.id}
                                                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                                onClick={() => handleOptionSelectShareWith(option)}
                                            >
                                                {option.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Access  */}
                    <div className="flex items-center mb-8">
                        <label className="block text-sm font-medium text-gray-700 w-1/3 mr-4">
                            Access <span className="text-red-500">*</span>
                        </label>
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                className="w-full border-b border-gray-300 focus:border-black focus:outline-none"
                                value={selectedAccess}
                                onClick={toggleDropdownAccess}
                                readOnly
                            />
                            <MdArrowDropDown
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={toggleDropdownAccess}
                            />
                            {showDropdownAccess && (
                                <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg">
                                    {accessLevels.map((access) => (
                                        <div
                                            key={access}
                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleAccessSelect(access)}
                                        >
                                            {access}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description  */}
                    <div className="flex gap-5 mb-5">
                        <label className="block text-sm font-medium text-gray-700 w-1/3">
                            Description
                        </label>
                        <div className="flex-grow">
                            <textarea
                                rows={5}
                                className="border p-2 border-gray-300 focus:border-black focus:outline-none mb-5 w-full rounded-md"
                                value={selectedDescription}
                                onChange={(e) => setSelectedDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    {/* Footer  */}
                    <div className="footer-buttons flex justify-end">
                        <button
                            type="submit"
                            className="footer-button"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>



        </div>
    )
}

export default AddSharingRules;