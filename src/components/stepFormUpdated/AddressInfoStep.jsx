import React, { useState, useEffect } from 'react';
import { Home, MapPin, CheckCircle, Upload, X, FileText } from 'lucide-react';
import FormField from '../ui/FormField';

const AddressInfoStep = ({ formData, handleChange, errors }) => {
    const [originalPermanentAddress, setOriginalPermanentAddress] = useState('');
    const [originalCurrentAddress, setOriginalCurrentAddress] = useState('');
    const [permanentAddressModified, setPermanentAddressModified] = useState(false);
    const [currentAddressModified, setCurrentAddressModified] = useState(false);
    const [permanentAddressProofUploaded, setPermanentAddressProofUploaded] = useState(false);
    const [currentAddressProofUploaded, setCurrentAddressProofUploaded] = useState(false);

    // Track original addresses when component mounts or when DigiLocker data is loaded
    useEffect(() => {
        if (formData.digiLockerConnected && formData.permanentAddress.address && !originalPermanentAddress) {
            setOriginalPermanentAddress(formData.permanentAddress.address);
            // Also store in formData for validation in parent component
            handleChange({
                target: {
                    name: 'permanentAddress.originalAddress',
                    value: formData.permanentAddress.address
                }
            });
        }
    }, [formData.digiLockerConnected, formData.permanentAddress.address, originalPermanentAddress, handleChange]);

    // Track original current address when it's first set (if different from permanent)
    useEffect(() => {
        if (formData.currentAddress.address && !formData.sameAsPermanent && !originalCurrentAddress) {
            setOriginalCurrentAddress(formData.currentAddress.address);
            handleChange({
                target: {
                    name: 'currentAddress.originalAddress',
                    value: formData.currentAddress.address
                }
            });
        }
    }, [formData.currentAddress.address, formData.sameAsPermanent, originalCurrentAddress, handleChange]);

    // Check if addresses have been modified
    useEffect(() => {
        // Check permanent address modification
        const permModified = originalPermanentAddress && formData.permanentAddress.address !== originalPermanentAddress;
        setPermanentAddressModified(permModified);

        // Check current address modification (only if not same as permanent)
        const currModified = !formData.sameAsPermanent && originalCurrentAddress && formData.currentAddress.address !== originalCurrentAddress;
        setCurrentAddressModified(currModified);

        // Reset proof uploads if no modifications
        if (!permModified && !currModified) {
            setPermanentAddressProofUploaded(false);
            setCurrentAddressProofUploaded(false);
            handleChange({
                target: {
                    name: 'permanentAddressProofFile',
                    value: null
                }
            });
            handleChange({
                target: {
                    name: 'currentAddressProofFile',
                    value: null
                }
            });
        }
    }, [
        formData.permanentAddress.address,
        formData.currentAddress.address,
        formData.sameAsPermanent,
        originalPermanentAddress,
        originalCurrentAddress,
        handleChange
    ]);

    const handleAddressChange = (e) => {
        handleChange(e);
    };

    const handlePermanentAddressFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleChange({
                target: {
                    name: 'permanentAddressProofFile',
                    value: file
                }
            });
            setPermanentAddressProofUploaded(true);
            // Update formData with proof upload status
            handleChange({
                target: {
                    name: 'permanentAddressProofUploaded',
                    value: true
                }
            });
            handleChange({
                target: {
                    name: 'permanentAddressProof',
                    value: file
                }
            });
        }
    };

    const handleCurrentAddressFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleChange({
                target: {
                    name: 'currentAddressProofFile',
                    value: file
                }
            });
            setCurrentAddressProofUploaded(true);
            // Update formData with proof upload status
            handleChange({
                target: {
                    name: 'currentAddressProofUploaded',
                    value: true
                }
            });
            handleChange({
                target: {
                    name: 'currentAddressProof',
                    value: file
                }
            });
        }
    };

    const removePermanentAddressFile = () => {
        handleChange({
            target: {
                name: 'permanentAddressProofFile',
                value: null
            }
        });
        setPermanentAddressProofUploaded(false);
        // Update formData when proof is removed
        handleChange({
            target: {
                name: 'permanentAddressProofUploaded',
                value: false
            }
        });
        handleChange({
            target: {
                name: 'permanentAddressProof',
                value: null
            }
        });
    };

    const removeCurrentAddressFile = () => {
        handleChange({
            target: {
                name: 'currentAddressProofFile',
                value: null
            }
        });
        setCurrentAddressProofUploaded(false);
        // Update formData when proof is removed
        handleChange({
            target: {
                name: 'currentAddressProofUploaded',
                value: false
            }
        });
        handleChange({
            target: {
                name: 'currentAddressProof',
                value: null
            }
        });
    };
    return (
        <div className="max-w-3xl mx-auto h-full overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Address Information</h2>
                <p className="text-gray-600 text-lg">
                    Please provide your permanent and current address details
                </p>
            </div>

            {/* Permanent Address */}
            <div className="mb-6 lg:mb-10">
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                        <Home className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Permanent Address</h3>
                        {formData.digiLockerConnected && (
                            <p className="text-sm text-green-600 flex items-center mt-1">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Auto-fetched from DigiLocker
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                    <FormField
                        label="Address"
                        name="permanentAddress.address"
                        type="textarea"
                        placeholder="Enter full address"
                        value={formData.permanentAddress.address}
                        onChange={handleAddressChange}
                        error={errors['permanentAddress.address']}
                        rows={4}
                        required
                    />

                    {/* Address Proof Upload - Only show if permanent address was modified AND not using "same as permanent" */}
                    {permanentAddressModified && !formData.sameAsPermanent && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                    <Upload className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-amber-900 mb-2">Permanent Address Proof Required</h4>
                                    <p className="text-amber-800 text-sm mb-4">
                                        Since you've modified your permanent address, please upload proof of your permanent address.
                                    </p>

                                    {!permanentAddressProofUploaded ? (
                                        <div className="space-y-3">
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
                                                <Upload className="w-6 h-6 text-amber-600 mb-2" />
                                                <span className="text-sm text-amber-700 font-medium">Click to upload permanent address proof</span>
                                                <span className="text-xs text-amber-600">PDF, JPG, PNG up to 5MB</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={handlePermanentAddressFileUpload}
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-800">{formData.permanentAddressProofFile.name}</p>
                                                        <p className="text-xs text-green-600">Proof uploaded successfully</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={removePermanentAddressFile}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Current Address */}
            <div>
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-4">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">Current Address</h3>
                        <p className="text-sm text-gray-600">Where you currently reside</p>
                    </div>
                </div>

                {/* Same as Permanent Checkbox */}
                <div className="mb-4 lg:mb-6">
                    <label className="flex items-center cursor-pointer p-4 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors">
                        <input
                            type="checkbox"
                            name="sameAsPermanent"
                            checked={formData.sameAsPermanent}
                            onChange={handleChange}
                            className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="ml-3 text-gray-800 font-medium">Same as Permanent Address</span>
                    </label>
                </div>

                <div className={`bg-gray-50 rounded-xl p-4 lg:p-6 space-y-4 lg:space-y-6 transition-all duration-300 ${formData.sameAsPermanent
                    ? 'opacity-50 pointer-events-none'
                    : 'opacity-100'
                    }`}>
                    <FormField
                        label="Address"
                        name="currentAddress.address"
                        type="textarea"
                        placeholder="Enter full address"
                        value={formData.sameAsPermanent
                            ? formData.permanentAddress.address
                            : formData.currentAddress.address}
                        onChange={handleAddressChange}
                        error={errors['currentAddress.address']}
                        rows={4}
                        required={!formData.sameAsPermanent}
                        disabled={formData.sameAsPermanent}
                    />

                    {/* Address Proof Upload - Only show if current address was modified and not same as permanent */}
                    {currentAddressModified && !formData.sameAsPermanent && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start">
                                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                    <Upload className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-amber-900 mb-2">Current Address Proof Required</h4>
                                    <p className="text-amber-800 text-sm mb-4">
                                        Since you've modified your current address, please upload proof of your current address.
                                    </p>

                                    {!currentAddressProofUploaded ? (
                                        <div className="space-y-3">
                                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-amber-300 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors">
                                                <Upload className="w-6 h-6 text-amber-600 mb-2" />
                                                <span className="text-sm text-amber-700 font-medium">Click to upload current address proof</span>
                                                <span className="text-xs text-amber-600">PDF, JPG, PNG up to 5MB</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={handleCurrentAddressFileUpload}
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="bg-white border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-800">{formData.currentAddressProofFile.name}</p>
                                                        <p className="text-xs text-green-600">Proof uploaded successfully</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={removeCurrentAddressFile}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 lg:mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-900 mb-2">Address Verification</h4>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            Address information will be verified against your uploaded documents in later steps.
                            Please ensure accuracy to avoid delays in processing.
                        </p>
                    </div>
                </div>
            </div>

            {/* Address Proof Validation Message */}
            {(permanentAddressModified && formData.sameAsPermanent) && !permanentAddressProofUploaded && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <X className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-red-900 mb-1">Address Proof Required</h4>
                            <p className="text-red-800 text-sm mb-4">
                                You have modified your permanent address and set current address as same. Please upload address proof to continue.
                            </p>

                            <div className="space-y-3">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-red-300 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
                                    <Upload className="w-6 h-6 text-red-600 mb-2" />
                                    <span className="text-sm text-red-700 font-medium">Click to upload address proof</span>
                                    <span className="text-xs text-red-600">PDF, JPG, PNG up to 5MB</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handlePermanentAddressFileUpload}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Message when proof is uploaded */}
            {((permanentAddressModified && formData.sameAsPermanent && permanentAddressProofUploaded) ||
                (permanentAddressModified && !formData.sameAsPermanent && permanentAddressProofUploaded) ||
                (currentAddressModified && currentAddressProofUploaded)) && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-green-900 mb-1">Address Proof(s) Uploaded</h4>
                                <p className="text-green-800 text-sm mb-3">
                                    Your modified address(es) have been verified with proof. You can now continue.
                                </p>
                                <div className="space-y-2">
                                    {permanentAddressProofUploaded && (
                                        <div className="bg-white border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-800">{formData.permanentAddressProofFile.name}</p>
                                                        <p className="text-xs text-green-600">Permanent address proof</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={removePermanentAddressFile}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {currentAddressProofUploaded && (
                                        <div className="bg-white border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                                                    <div>
                                                        <p className="text-sm font-medium text-green-800">{formData.currentAddressProofFile.name}</p>
                                                        <p className="text-xs text-green-600">Current address proof</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={removeCurrentAddressFile}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default AddressInfoStep;