import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMinus } from "react-icons/fa";
import TimezoneSelect from "react-timezone-select";

const Availability = () => {
    const [selectedTimezone, setSelectedTimezone] = useState({});
    const [availability, setAvailability] = useState({
        TimeZone: "",
        PreferredDuration: "",
    });
    const [times, setTimes] = useState({});
    const [editMode, setEditMode] = useState(false);
    const userId = localStorage.getItem("userId");
    const [selectedOption, setSelectedOption] = useState(null);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/contacts/${userId}/details`);
                if (response.data) {
                    const availabilityData = response.data.availability || [];
                    const timesByDay = availabilityData.reduce((acc, availability) => {
                        acc[availability.day] = availability.timeSlots || []; // Ensure timeSlots exists
                        return acc;
                    }, {});

                    setTimes(timesByDay);
                    setSelectedTimezone({ value: response.data.TimeZone, label: response.data.TimeZone });
                    setSelectedOption(response.data.PreferredDuration);
                    setAvailability({
                        ...response.data,
                        _id: availabilityData[0]?._id, // Ensure _id is included for existing time slots
                    });
                }
            } catch (error) {
                console.error("Error fetching availability data:", error);
            }
        };
        fetchData();
    }, [userId]);



    const handleOptionClick = (option) => {
        if (editMode) {
            setSelectedOption(option);
        }
    };

    const handleSave = async () => {
        setEditMode(false);

        try {
            // Prepare the updated availability object
            const updatedAvailability = {
                TimeZone: selectedTimezone.value,
                PreferredDuration: selectedOption,
                availability: Object.keys(times).map((day) => ({
                    day,
                    timeSlots: times[day].map(slot => ({
                        _id: slot._id, // Include the _id to ensure the backend knows which slot to update
                        startTime: new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                        endTime: new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                    })).filter(slot => slot._id), // Only include slots that have an existing _id (i.e., we're not adding new slots)
                })),
            };

            console.log('Updated availability data:', updatedAvailability);

            // Send the update request
            await axios.put(`${process.env.REACT_APP_API_URL}/contacts/${userId}/availability`, updatedAvailability);

            // Show success toast message
            toast.success("Settings saved successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } catch (error) {
            console.error("Error updating availability data:", error);
        }
    };



    console.log('Backend response:', times);


    const handleTimezoneChange = (timezone) => {
        if (editMode) {
            setSelectedTimezone(timezone);
        }
    };

    const handleTimeChange = (day, index, field, value) => {
        setTimes((prevTimes) => {
            const newTimes = [...(prevTimes[day] || [])];
            newTimes[index] = {
                ...newTimes[index],
                [field]: value,
            };
            return {
                ...prevTimes,
                [day]: newTimes,
            };
        });
    };

    return (
        <div className="ml-64">
            <ToastContainer />
            <div
                className="text-md float-end mr-20 mt-1 bg-blue-300 px-3 py-1 rounded cursor-pointer"
                onClick={() => {
                    if (editMode) handleSave();
                    else setEditMode(true);
                }}
            >
                {editMode ? 'Save' : 'Edit'}
            </div>
            <div className="mx-10 mt-7 mb-5">
                {/* left side */}
                <div className="col-span-2">
                    <div className="text-sm flex">
                        <div>
                            <div className="text-2xl text-gray-500 mb-5">
                                Account Details
                            </div>
                            <div className="text-xl">
                                <h2>
                                    Availability &nbsp;{" "}
                                    <span className="text-red-500 -ml-3">*</span>
                                </h2>
                            </div>
                            <div>
                                {daysOfWeek.map((day) => (
                                    <div key={day}>
                                        <div className="flex justify-center space-y-8">
                                            <span className="w-24 mr-10 mt-7">{day}</span>
                                            <div>
                                                {(times[day] && times[day].length > 0 ? times[day] : [{ startTime: null, endTime: null }]).map((timeSlot, index) => (
                                                    <div key={index} className={`flex items-center -mt-2 justify-center ${index > 0 ? 'mt-5' : ''}`}>
                                                        {/* start time */}
                                                        <div className="w-28 mr-5">
                                                            <div className="border-2 border-black">
                                                                <div className="flex justify-center">
                                                                    <div className="text-center">
                                                                        {/* <DatePicker
                                                                            selected={timeSlot.startTime ? new Date(timeSlot.startTime) : null}
                                                                            onChange={(date) => handleTimeChange(day, index, 'startTime', date)}
                                                                            showTimeSelect
                                                                            showTimeSelectOnly
                                                                            timeIntervals={15}
                                                                            dateFormat="h:mm aa"
                                                                            placeholderText="Start Time"
                                                                            className="p-2 w-full"
                                                                            disabled={!editMode}
                                                                        /> */}
                                                                        <DatePicker
                                                                            selected={timeSlot.startTime && !isNaN(new Date(timeSlot.startTime)) ? new Date(timeSlot.startTime) : null}
                                                                            onChange={(date) => handleTimeChange(day, index, 'startTime', date)}
                                                                            showTimeSelect
                                                                            showTimeSelectOnly
                                                                            timeIntervals={15}
                                                                            dateFormat="h:mm aa"
                                                                            placeholderText="Start Time"
                                                                            className="p-2 w-full"
                                                                            disabled={!editMode}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* minus */}
                                                        <div className='mr-5'>
                                                            <span>
                                                                <FaMinus className='text-2xl' />
                                                            </span>
                                                        </div>
                                                        {/* end time */}
                                                        <div className="w-28 mr-5">
                                                            <div className="border-2 border-black">
                                                                <div className="flex justify-center">
                                                                    <div className="text-center">
                                                                        {/* <DatePicker
                                                                            selected={timeSlot.endTime ? new Date(timeSlot.endTime) : null}
                                                                            onChange={(date) => handleTimeChange(day, index, 'endTime', date)}
                                                                            showTimeSelect
                                                                            showTimeSelectOnly
                                                                            timeIntervals={15}
                                                                            dateFormat="h:mm aa"
                                                                            placeholderText="End Time"
                                                                            className="p-2 w-full"
                                                                            disabled={!editMode}
                                                                        /> */}
                                                                        <DatePicker
                                                                            selected={timeSlot.endTime && !isNaN(new Date(timeSlot.endTime)) ? new Date(timeSlot.endTime) : null}
                                                                            onChange={(date) => handleTimeChange(day, index, 'endTime', date)}
                                                                            showTimeSelect
                                                                            showTimeSelectOnly
                                                                            timeIntervals={15}
                                                                            dateFormat="h:mm aa"
                                                                            placeholderText="End Time"
                                                                            className="p-2 w-full"
                                                                            disabled={!editMode}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* right side */}
                <div className="mt-8">
                    {/* Time Zone */}
                    <div className="flex mb-5 items-center overflow-visible">
                        <div>
                            <label
                                htmlFor="TimeZone"
                                className="block text-sm font-medium leading-6 text-gray-900 w-20"
                            >
                                Time Zone <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div className="flex-grow w-full overflow-visible mt-1">
                            <div className="w-full overflow-visible">
                                {editMode ? (
                                    <TimezoneSelect
                                        value={selectedTimezone}
                                        onChange={handleTimezoneChange}
                                        className="TimezonePicker ml-5"
                                    />
                                ) : (
                                    <div className="ml-5 p-2 border border-gray-300 rounded">
                                        {selectedTimezone.label || "Select Timezone"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* preferred interview */}
                    <div>
                        <div className="bg-gray-50 border border-gray-500 text-gray-900 text-sm p-4 rounded-lg">
                            <p className="font-medium">
                                Preferred Interview Duration <span className="text-red-500">*</span>
                            </p>
                            <ul className="flex mt-3 text-xs font-medium">
                                <li
                                    className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "30"
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-300"
                                        }`}
                                    onClick={() => handleOptionClick("30")}
                                >
                                    30 mints
                                </li>
                                <li
                                    className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "60"
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-300"
                                        }`}
                                    onClick={() => handleOptionClick("60")}
                                >
                                    1 Hour
                                </li>
                                <li
                                    className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "90"
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-300"
                                        }`}
                                    onClick={() => handleOptionClick("90")}
                                >
                                    1:30 mints
                                </li>
                                <li
                                    className={`option hover:bg-gray-500 cursor-pointer inline-block py-1 px-4 border rounded-lg mr-10 ${selectedOption === "120"
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-300"
                                        }`}
                                    onClick={() => handleOptionClick("120")}
                                >
                                    2 Hour
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Availability;