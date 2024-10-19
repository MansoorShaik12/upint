import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

const SharingRuleDetails = ({ rule, onClose }) => {
    if (!rule) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white shadow-lg overflow-auto" style={{ width: "97%", height: "94%" }}>
                <div className="border-b p-2">
                    <div className="mx-8 my-3 flex justify-between items-center">
                        <p className="text-xl">
                            <span className="text-orange-500 font-semibold">Sharing Rule</span> / {rule.ruleName}
                        </p>
                        <button className="shadow-lg rounded-full" onClick={onClose}>
                            <MdOutlineCancel className="text-2xl" />
                        </button>
                    </div>
                </div>
                <div className="mx-10 pt-5 pb-2">
                    <div className="text-xl space-x-10">
                        <span className="text-orange-500 font-semibold pb-3 border-b-2 border-orange-500">Details</span>
                    </div>
                </div>
                <div className="mx-16 mt-7 grid grid-cols-4">
                    <div className="col-span-3">
                        <div className="flex mb-5">
                            <div className="w-1/3">
                                <div className="font-medium">Rule Name</div>
                            </div>
                            <div className="w-1/3">
                                <p>
                                    <span className="font-normal text-gray-500">{rule.ruleName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex mb-5">
                            <div className="w-1/3">
                                <div className="font-medium">Object Name</div>
                            </div>
                            <div className="w-1/3">
                                <p>
                                    <span className="font-normal text-gray-500">{rule.objectName}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex mb-5">
                            <div className="w-1/3">
                                <div className="font-medium">Rule Type</div>
                            </div>
                            <div className="w-1/3">
                                <p>
                                    <span className="font-normal text-gray-500">{rule.ruleType}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex mb-5">
                            <div className="w-1/3">
                                <div className="font-medium">Records Owned By</div>
                            </div>
                            <div className="w-1/3">
                                <p>
                                    <span className="font-normal text-gray-500">{rule.recordsOwnedBy}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex mb-5">
                            <div className="w-1/3">
                                <div className="font-medium">Shared With</div>
                            </div>
                            <div className="w-1/3">
                                <p>
                                    <span className="font-normal text-gray-500">{rule.sharedWith}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex mb-5">
                            <div className="w-1/3">
                                <div className="font-medium">Access</div>
                            </div>
                            <div className="w-1/3">
                                <p>
                                    <span className="font-normal text-gray-500">{rule.access}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharingRuleDetails;