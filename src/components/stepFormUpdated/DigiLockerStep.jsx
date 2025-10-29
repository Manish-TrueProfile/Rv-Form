import React, { useState } from 'react';
import { Shield, ExternalLink, Loader, CheckCircle, Lock, Zap, FileText, CreditCard, Car, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const DigiLockerStep = ({ formData, setFormData, connectDigiLocker, handleChange, errors }) => {
    const [activeTab, setActiveTab] = useState('digilocker');

    // Custom Details States
    const [aadhaarNumber1, setAadhaarNumber1] = useState('856620948196');
    const [aadhaarNumber2, setAadhaarNumber2] = useState('856620948196');

    // Verification States
    const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
    const [aadharTransId, setaadharTransId] = useState('')
    const [showAadhaarOtp, setShowAadhaarOtp] = useState(false);
    const [aadhaarOtp, setAadhaarOtp] = useState(['', '', '', '', '', '']);
    const [aadhaarOtpVerifying, setAadhaarOtpVerifying] = useState(false);

    const [panNumber, setPanNumber] = useState('');
    const [panVerifying, setPanVerifying] = useState(false);

    const [dlNumber, setDlNumber] = useState("");
    const [dlDob, setDlDob] = useState("");
    const [dlVerifying, setDlVerifying] = useState(false);
    const [dlError, setDlError] = useState("");


    const [isConnecting, setIsConnecting] = useState(false);

    const handleDigiLockerConnect = async () => {
        setIsConnecting(true);
        await connectDigiLocker();
        setIsConnecting(false);
    };

    // Aadhaar Verification
    const handleAadhaarSubmit = async () => {
        if (aadhaarNumber1 === aadhaarNumber2 && aadhaarNumber1.length === 12) {
            setAadhaarVerifying(true);

            try {
                const res = await axios.post(
                    'https://api.gridlines.io/aadhaar-api/boson/generate-otp',
                    {
                        aadhaar_number: aadhaarNumber1,
                        consent: "Y"
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-Auth-Type': 'API-Key',
                            'X-API-Key': 'el2JMbXJW6ZrH5KeSogJHQT7XViuSjqH'
                        }
                    }
                );

                console.log(res.data)
                if (res.data.status === 200) {
                    setAadhaarVerifying(false);
                    setShowAadhaarOtp(true);
                    setaadharTransId(res?.data?.transaction_id)
                } else {
                    toast.error(res.data.data.message)
                }
            } catch (error) {
                console.error(error)
                toast.error(error?.response?.data?.error?.message || error.message)

            } finally {
                setAadhaarVerifying(false)
            }
        }
    };


    const handleAadhaarOtpChange = (index, value) => {
        if (!/^\d*$/.test(value) || value.length > 1) return;

        const newOtp = [...aadhaarOtp];
        newOtp[index] = value;
        setAadhaarOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`aadhaar-otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleAadhaarOtpVerify = async () => {
        if (aadhaarOtp.join('').length === 6) {
            console.log(aadhaarOtp.join(''))
            console.log(aadharTransId)
            try {
                setAadhaarOtpVerifying(true);
                const res = await axios.post('https://api.gridlines.io/aadhaar-api/boson/submit-otp',
                    {
                        "otp": aadhaarOtp.join(''),
                        "include_xml": true,
                        "share_code": "1001"
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-API-Key': 'el2JMbXJW6ZrH5KeSogJHQT7XViuSjqH',
                            'X-Auth-Type': 'API-Key',
                            'X-Transaction-ID': aadharTransId
                        }
                    }
                )
                console.log(res.data.data)
                if (res.data.status === 200) {
                    setAadhaarOtpVerifying(false);

                    const fullName = res.data.data.aadhaar_data.name.trim(); // e.g. "Manish Jha"
                    // const nameParts = fullName.split(" ");

                    // const firstName = nameParts[0];
                    // const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

                    let fatherName = "";
                    if (res.data?.data?.aadhaar_data?.care_of && res.data?.data?.aadhaar_data?.care_of.includes(":")) {
                        fatherName = res.data?.data?.aadhaar_data?.care_of.split(":")[1].trim(); // Removes "S/O:" and trims the rest
                    }
                    setFormData(prevData => ({
                        ...prevData,
                        customDetailsConnected: true,
                        aadhaarVerified: true,

                        fullName: fullName || '',
                        // lastName: lastName || '',
                        dob: res.data?.data?.aadhaar_data?.date_of_birth || '',
                        mobile: res.data?.data?.aadhaar_data?.mobile?.length === 10 ? res.data?.data?.aadhaar_data?.mobile : '',
                        fathersName: fatherName || '',

                        // Address Information
                        permanentAddress: {
                            street: res.data?.data?.aadhaar_data?.street || '',
                            city: res.data?.data?.aadhaar_data?.district || '',
                            state: res.data?.data?.aadhaar_data?.state || '',
                            pincode: res.data?.data?.aadhaar_data?.pincode || '',
                        },
                    }));
                }

            } catch (error) {
                console.error(error)
                toast.error(error?.response?.data?.error?.message)
            } finally {
                setAadhaarOtpVerifying(false)
            }
        };
    }

    // PAN Verification
    const handlePanVerify = async () => {
        if (panNumber.length === 10) {

            try {
                setPanVerifying(true);
                const res = await axios.post('https://api.gridlines.io/pan-api/fetch-essentials',
                    {
                        "pan_number": panNumber,
                        "consent": "Y"
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'X-API-Key': 'el2JMbXJW6ZrH5KeSogJHQT7XViuSjqH',
                            'X-Auth-Type': 'API-Key',
                        }
                    }
                )

                console.log(res.data)
                if (res.data.status === 200) {
                    setPanVerifying(false);
                    handleChange({
                        target: {
                            name: 'panVerified',
                            value: true
                        }
                    });
                }
            } catch (error) {
                console.log(error)
            } finally {
                setPanVerifying(false);
            }
        }
    };

    // DL Verification
    const handleDlVerify = async () => {
        if (dlNumber.length < 10) {
            setDlError("Please enter a valid driving license number.");
            return;
        }

        if (!dlDob) {
            setDlError("Please enter your date of birth.");
            return;
        }

        console.log(dlNumber, dlDob)

        setDlError("");

        try {
            setDlVerifying(true);
            const res = await axios.post('https://api.gridlines.io/dl-api/fetch',
                {
                    "driving_license_number": dlNumber,
                    "date_of_birth": dlDob,
                    "consent": "Y"
                },
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'X-API-Key': 'el2JMbXJW6ZrH5KeSogJHQT7XViuSjqH',
                        'X-Auth-Type': 'API-Key',
                    }
                }
            )



            console.log(res.data)

            if (res.data.data.message === 'Driving license does not exist') {
                setDlError('Driving license does not exist')
                return
            }

            if (res.data.status === 200) {
                setDlVerifying(false);
                handleChange({
                    target: {
                        name: 'dlVerified',
                        value: true
                    }
                });
            }

        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.error?.message)

        } finally {
            setDlVerifying(false)
        }

    };


    const isCustomDetailsComplete = formData.aadhaarVerified && formData.panVerified && formData.dlVerified;

    return (
        <div className="w-full mx-auto h-full">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Identity Verification
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Choose your preferred verification method
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('digilocker')}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'digilocker'
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        <Shield className="w-5 h-5 inline mr-2" />
                        DigiLocker
                    </button>
                    <button
                        onClick={() => setActiveTab('custom')}
                        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'custom'
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        <FileText className="w-5 h-5 inline mr-2" />
                        Custom Details
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'digilocker' ? (
                /* DigiLocker Tab */
                <div className="text-center">
                    {/* DigiLocker Connection Card */}
                    <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-3xl p-8 mb-8 hover:border-blue-200 transition-all duration-300 shadow-xl hover:shadow-2xl">

                        {formData.digiLockerConnected ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                                <div className="flex items-center justify-center text-green-600 mb-4">
                                    <CheckCircle className="w-10 h-10 mr-3" />
                                    <span className="text-xl font-bold">Successfully Connected!</span>
                                </div>
                                <p className="text-green-700 text-base">
                                    Your documents have been verified and details are ready to use
                                </p>

                                {/* Connected Features */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white rounded-xl p-4 border border-green-200">
                                        <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-green-800">Aadhaar Verified</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-green-200">
                                        <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-green-800">PAN Verified</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-green-200">
                                        <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm font-medium text-green-800">Address Verified</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Quick & Secure Access</h3>
                                <p className="text-gray-600 mb-8 text-base leading-relaxed">
                                    We use DigiLocker to auto-fill your data. It's fast, secure, and consent-based.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleDigiLockerConnect}
                                    disabled={isConnecting}
                                    className={` mx-auto flex items-center justify-center px-5 py-3 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isConnecting
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl'
                                        }`}
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader className="w-5 h-5 mr-3 animate-spin" />
                                            Connecting to DigiLocker...
                                        </>
                                    ) : (
                                        <>
                                            <ExternalLink className="w-5 h-5 mr-3" />
                                            Connect DigiLocker
                                        </>
                                    )}
                                </button>

                                {errors.digiLocker && (
                                    <p className="mt-4 text-red-600 text-center font-medium">
                                        {errors.digiLocker}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-base">Lightning Fast</h4>
                            <p className="text-gray-600 text-sm">Auto-fill forms in seconds</p>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-base">100% Secure</h4>
                            <p className="text-gray-600 text-sm">Government verified data</p>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 text-base">Pre-verified</h4>
                            <p className="text-gray-600 text-sm">No manual verification needed</p>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start text-left">
                            <Lock className="w-6 h-6 text-gray-500 mr-4 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Your Privacy Matters</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    We securely use DigiLocker to auto-fill your details. Your data is never stored without
                                    your consent and is protected with bank-level security. You maintain full control over
                                    what information is shared.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Custom Details Tab */
                <div className="w-full space-y-8">
                    {/* Step 1: Aadhaar Verification */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-blue-900">Step 1: Aadhaar Verification</h3>
                                <p className="text-blue-700 text-sm">Verify your Aadhaar number with OTP</p>
                            </div>
                            {formData.aadhaarVerified && (
                                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    ✓ Aadhaar Verified
                                </span>
                            )}
                        </div>

                        {!showAadhaarOtp && !formData.aadhaarVerified ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-blue-800 mb-2">
                                            Aadhaar Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter 12-digit Aadhaar number"
                                            value={aadhaarNumber1}
                                            onChange={(e) => setAadhaarNumber1(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                            maxLength={12}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-blue-800 mb-2">
                                            Confirm Aadhaar Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Re-enter Aadhaar number"
                                            value={aadhaarNumber2}
                                            onChange={(e) => setAadhaarNumber2(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                            maxLength={12}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleAadhaarSubmit}
                                    disabled={aadhaarNumber1 !== aadhaarNumber2 || aadhaarNumber1.length !== 12 || aadhaarVerifying}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${aadhaarNumber1 !== aadhaarNumber2 || aadhaarNumber1.length !== 12 || aadhaarVerifying
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                                        }`}
                                >
                                    {aadhaarVerifying ? (
                                        <>
                                            <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                                            Sending OTP...
                                        </>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            </div>
                        ) : showAadhaarOtp && !formData.aadhaarVerified ? (
                            <div className="text-center">
                                <p className="text-blue-700 mb-4 text-sm">Enter the 6-digit OTP sent to your registered mobile</p>
                                <div className="flex justify-center space-x-3 mb-4">
                                    {aadhaarOtp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`aadhaar-otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="\d*"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleAadhaarOtpChange(index, e.target.value)}
                                            className="w-12 h-12 text-center text-lg font-bold border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={handleAadhaarOtpVerify}
                                    disabled={aadhaarOtp.join('').length !== 6 || aadhaarOtpVerifying}
                                    className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${aadhaarOtp.join('').length !== 6 || aadhaarOtpVerifying
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                                        }`}
                                >
                                    {aadhaarOtpVerifying ? (
                                        <>
                                            <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {/* Step 2: PAN Verification - Only show after Aadhaar is verified */}
                    {formData.aadhaarVerified && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-green-900">Step 2: PAN Verification</h3>
                                    <p className="text-green-700 text-sm">Verify your PAN card details</p>
                                </div>
                                {formData.panVerified && (
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                        ✓ PAN Verified
                                    </span>
                                )}
                            </div>

                            {!formData.panVerified ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-green-800 mb-2">
                                            PAN Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter 10-character PAN number"
                                            value={panNumber}
                                            onChange={(e) => setPanNumber(e.target.value.toUpperCase().slice(0, 10))}
                                            className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                                            maxLength={10}
                                        />
                                    </div>

                                    <button
                                        onClick={handlePanVerify}
                                        disabled={panNumber.length !== 10 || panVerifying}
                                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${panNumber.length !== 10 || panVerifying
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                                            }`}
                                    >
                                        {panVerifying ? (
                                            <>
                                                <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                                                Verifying PAN...
                                            </>
                                        ) : (
                                            'Verify PAN'
                                        )}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* Step 3: Driving License Verification - Only show after PAN is verified */}
                    {formData.aadhaarVerified && formData.panVerified && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                                    <Car className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-purple-900">Step 3: Driving License Verification</h3>
                                    <p className="text-purple-700 text-sm">Verify your driving license details</p>
                                </div>
                                {formData.dlVerified && (
                                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                        ✓ License Verified
                                    </span>
                                )}
                            </div>

                            {!formData.dlVerified ? (
                                <div className="space-y-4">
                                    {/* DL Number Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-purple-800 mb-2">
                                            Driving License Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter driving license number"
                                            value={dlNumber}
                                            onChange={(e) => {
                                                setDlNumber(e.target.value.toUpperCase());
                                                setDlError(""); // reset error
                                            }}
                                            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                                        />
                                    </div>

                                    {/* DOB Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-purple-800 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={dlDob}
                                            onChange={(e) => {
                                                setDlDob(e.target.value);
                                                setDlError("");
                                            }}
                                            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {dlError && (
                                        <div className="text-red-600 text-sm font-medium">
                                            {dlError}
                                        </div>
                                    )}

                                    {/* Verify Button */}
                                    <button
                                        onClick={handleDlVerify}
                                        disabled={!dlNumber || dlNumber.length < 10 || !dlDob || dlVerifying}
                                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${!dlNumber || dlNumber.length < 10 || !dlDob || dlVerifying
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-purple-600 text-white hover:bg-purple-700 transform hover:scale-105'
                                            }`}
                                    >
                                        {dlVerifying ? (
                                            <>
                                                <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                                                Verifying License...
                                            </>
                                        ) : (
                                            'Verify License'
                                        )}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    )}


                    {/* Completion Status */}
                    {isCustomDetailsComplete && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-800 mb-2">All Verifications Complete!</h3>
                            <p className="text-green-600 text-base">You can now proceed to the next step</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DigiLockerStep;