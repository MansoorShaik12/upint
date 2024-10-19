import React, { useState, useEffect } from "react";
import axios from "axios";

const Roles_form = ({ onClose }) => {
    const [errors, setErrors] = useState("");

    const [formData, setFormData] = useState({
        roleName: "",
        reportsToRole: "",
        description: "",
        label: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = "";

        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: errorMessage });
    };

    const [description, setDescription] = useState("");

    const handleChangeDescription = (event) => {
        const value = event.target.value;
        if (value.length <= 1000) {
            setDescription(value);
            event.target.style.height = "auto";
            event.target.style.height = event.target.scrollHeight + "px";
            setFormData({ ...formData, description: value });

            setErrors({ ...errors, description: "" });
        }
    };

    const [selectedRole, setSelectedRole] = useState("");
    const [showDropdownRole, setShowDropdownRole] = useState(false);

    const toggleDropdownRole = () => {
        setShowDropdownRole(!showDropdownRole);
    };

    const roles = ["Manager", "Admin", "CEO","HR Lead"];

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setShowDropdownRole(false);
        setFormData((prevFormData) => ({
            ...prevFormData,
            reportsToRole: role,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            reportsToRole: "",
        }));
    };
    const organizationId = localStorage.getItem("organizationId");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/rolesdata`, { ...formData, organizationId });
            console.log("Role saved successfully:", response.data);
            onClose();
        } catch (error) {
            console.error("Error saving role:", error);
        }
    };

    return (
        <div>
            <div className="fixed top-0 w-full bg-white border-b">
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-lg font-bold">Roles Form</h2>
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
            <div className="fixed top-16 bottom-16 overflow-auto p-4 w-full text-sm">
                <form onSubmit={handleSubmit}>
                <div className="flex gap-5 mb-5">
                        <div>
                            <label
                                htmlFor="roleName"
                                className="block mb-2 text-sm font-medium text-gray-900 w-36"
                            >
                                Label <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="flex-grow">
                            <input
                                value={formData.label}
                                onChange={handleChange}
                                name="label"
                                type="text"
                                id="label"
                                className={`border-b focus:outline-none mb-5 w-full ${errors.label
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-black"
                                    }`}
                            />
                            {errors.label && (
                                <p className="text-red-500 text-sm -mt-4">
                                    {errors.label}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Role Name */}
                    <div className="flex gap-5 mb-5">
                        <div>
                            <label
                                htmlFor="roleName"
                                className="block mb-2 text-sm font-medium text-gray-900 w-36"
                            >
                                Role Name <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="flex-grow">
                            <input
                                value={formData.roleName}
                                onChange={handleChange}
                                name="roleName"
                                type="text"
                                id="roleName"
                                className={`border-b focus:outline-none mb-5 w-full ${errors.roleName
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-black"
                                    }`}
                            />
                            {errors.roleName && (
                                <p className="text-red-500 text-sm -mt-4">
                                    {errors.roleName}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Reports To Role */}
                    <div className="flex gap-5 mb-5 text-sm">
                        <div>
                            <label
                                htmlFor="reportsToRole"
                                className="block mb-2  font-medium text-gray-900 w-36"
                            >
                                Reports To Role <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="relative flex-grow">
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`border-b focus:outline-none mb-5 w-full ${errors.reportsToRole
                                        ? "border-red-500"
                                        : "border-gray-300 focus:border-black"
                                        }`}
                                    value={selectedRole}
                                    onClick={toggleDropdownRole}
                                    readOnly
                                />
                                {errors.reportsToRole && (
                                    <p className="text-red-500 text-sm -mt-4">
                                        {errors.reportsToRole}
                                    </p>
                                )}
                            </div>
                            {showDropdownRole && (
                                <div className="absolute z-50 -mt-3 mb-5 w-full rounded-md bg-white shadow-lg h-40 overflow-y-auto">
                                    {roles.map((role) => (
                                        <div
                                            key={role}
                                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleRoleSelect(role)}
                                        >
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Job Description */}
                    <div className="flex gap-5 mb-5">
                        <div>
                            <label
                                htmlFor="description"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-black w-36"
                            >
                                Description <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="flex-grow">
                            <textarea
                                rows={8}
                                onChange={handleChangeDescription}
                                value={formData.description}
                                name="description"
                                id="description"
                                className={`border p-2 focus:outline-none mb-5 w-full  rounded-md  ${errors.description
                                    ? "border-red-500"
                                    : "border-gray-300 focus:border-black"
                                    }`}
                            ></textarea>
                            {errors.description && (
                                <p className="text-red-500 text-sm -mt-4">
                                    {errors.description}
                                </p>
                            )}
                            {formData.description.length > 0 && (
                                <p className="text-gray-600 text-sm float-right -mt-4">
                                    {formData.description.length}/1000
                                </p>
                            )}
                        </div>
                    </div>
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

export default Roles_form;