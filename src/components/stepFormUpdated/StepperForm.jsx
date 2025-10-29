import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Phone, Copy, X, Loader, CreditCard } from 'lucide-react';
// import WelcomeStep from './WelcomeStep';
import DigiLockerStep from './DigiLockerStep';
import PersonalDetailsStep from './PersonalDetailsStep';
import AddressInfoStep from './AddressInfoStep';
import UanLoginStep from './UanLoginStep';
import ResumeUploadStep from './ResumeUploadStep';
import DocumentUploadStep from './DocumentUploadStep';
import ReviewSubmitStep from './ReviewSubmitStep';
import axios from 'axios';
import { toast } from 'sonner';
import WelcomeStep from './WelcomeStep';

const StepperForm = () => {
    const [currentStep, setCurrentStep] = useState(1);

    // Initialize form data from localStorage or default values
    const [formData, setFormData] = useState(() => {
        // Always start with fresh data - localStorage will be cleared on reload
        return {
            // Welcome step
            agreedToTerms: false,
            sessionId: '',

            // Personal Details
            fullName: '',
            dob: '',
            mobile: '',
            fathersName: '',
            email: '',

            // Additional Personal Info (from resume parsing)
            name: '',
            phone: '',
            address: '',
            linkedin: '',
            github: '',
            skills: [],

            //PAN INFO
            panNumber: '',
            panName: '',
            panGender: '',
            panDob: '',
            panVerifiedOn: '',

            //DL INFO
            dlImage: '',
            dlNumber: '',
            dlName: '',
            dlSWD: '',
            dlDob: '',
            dlIssuedDate: '',
            dlExpiryDate: '',
            dlIssuedAt: '',
            dlPresentAddress: {},
            dlPermanentAddress: {},

            // Address Information
            permanentAddress: {
                address: '',
                pincode: ''
            },
            currentAddress: {
                address: '',
                pincode: ''
            },
            sameAsPermanent: false,
            permanentAddressProofFile: null,
            currentAddressProofFile: null,

            referenceDocuments: [],

            // UAN Login
            uanNumber: '',
            password: '',
            isUanVerified: false,
            showOtpInput: false,
            isOtpVerified: false,

            // Document Uploads
            resume: null,
            salarySlips: [],
            certificates: [],
            addressProof: null,

            // Education Details
            educationDetails: [],

            // Experience Details
            experienceDetails: [],

            // DigiLocker
            digiLockerConnected: false,
            digiLockerTransId: '',
            digiLockerIssuedFiles: [],

            // Custom Details
            customDetailsConnected: false,
            aadhaarVerified: false,
            panVerified: false,
            dlVerified: false,

            // Progress tracking
            completedSteps: [],
        };
    });

    const newUrl = 'https://96890ebaf04d.ngrok-free.app';

    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [slideDirection, setSlideDirection] = useState('right');

    // Modal states for UAN fetch
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMobile, setModalMobile] = useState('');
    const [isFetchingUans, setIsFetchingUans] = useState(false);

    const totalSteps = 6;

    // Save form data to localStorage whenever it changes (but only if not a fresh reload)
    useEffect(() => {
        // Check if this is a fresh page load
        const isReload = sessionStorage.getItem('isReload');
        if (!isReload) {
            localStorage.setItem('trueProfileFormData', JSON.stringify(formData));
        }
    }, [formData]);

    // Clear localStorage on page load and restore data if not a reload
    useEffect(() => {
        // Check if this is a page reload
        const isReload = performance.navigation && performance.navigation.type === 1;

        if (isReload) {
            // Clear all data on reload
            localStorage.removeItem('trueProfileFormData');
            sessionStorage.setItem('isReload', 'true');
        } else {
            // Try to restore data if not a reload
            sessionStorage.removeItem('isReload');
            const savedData = localStorage.getItem('trueProfileFormData');
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    setFormData(parsedData);
                    // Restore current step if it was saved
                    if (parsedData.currentStep) {
                        setCurrentStep(parsedData.currentStep);
                    }
                } catch (error) {
                    console.error('Error parsing saved form data:', error);
                    localStorage.removeItem('trueProfileFormData');
                }
            }
        }
    }, []);

    // Call createSession when currentStep is 1

    // Show warning before page unload if form has data
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (currentStep > 1 || Object.keys(formData).some(key =>
                key !== 'completedSteps' &&
                (typeof formData[key] === 'string' ? formData[key].trim() :
                    Array.isArray(formData[key]) ? formData[key].length > 0 :
                        typeof formData[key] === 'object' && formData[key] !== null ?
                            Object.values(formData[key]).some(val => typeof val === 'string' ? val.trim() : val) :
                            formData[key])
            )) {
                const message = 'Warning: Your form data will be reset if you reload or leave this page. All entered information will be lost. Are you sure you want to continue?';
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };

        const handlePageShow = (e) => {
            if (e.persisted) {
                // Page was loaded from cache, clear form data
                localStorage.removeItem('trueProfileFormData');
                window.location.reload();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, [currentStep, formData]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === 'sameAsPermanent') {
            setFormData(prevData => ({
                ...prevData,
                sameAsPermanent: checked,
                currentAddress: checked ? { ...prevData.permanentAddress } : prevData.currentAddress
            }));
            return;
        }

        if (type === 'file') {
            if (name === 'salarySlips' || name === 'certificates') {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: Array.from(files)
                }));
            } else {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: files[0] || null
                }));
            }
            return;
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevData => ({
                ...prevData,
                [parent]: {
                    ...prevData[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    }, []);

    const verifyUan = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                setFormData(prevData => ({
                    ...prevData,
                    isUanVerified: true,
                    showOtpInput: true
                }));
                resolve();
            }, 3000);
        });
    };

    const createSession = async () => {
        setIsUploading(true);
        try {
            const response = await axios.post(`${newUrl}/api/session/start`, {
                requestId: "1e6fb6d9-94ff-4218-b090-1ced2065888c"
            })
            console.log(response.data)
            setFormData(prev => ({
                ...prev,
                sessionId: response.data.sessionId
            }))
            localStorage.setItem('sessionId', response.data.sessionId);
        } catch (error) {
            console.log(error)
            toast.error("Failed to create session. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }
    const sessionId = formData.sessionId || localStorage.getItem('sessionId');

    const uploadAddressProof = async () => {
        setIsUploading(true);
        try {
            const uploadedDocuments = [];

            // Upload permanent address proof if available
            if (formData.permanentAddressProofFile) {
                const permanentForm = new FormData();
                permanentForm.append('file', formData.permanentAddressProofFile);
                permanentForm.append('documentType', 'address_proof');
                const permanentUploadRes = await axios.post(`${newUrl}/api/session/${sessionId}/upload`, permanentForm);
                console.log('Permanent address proof upload:', permanentUploadRes.data);
                if (permanentUploadRes.data.success) {
                    uploadedDocuments.push(permanentUploadRes.data?.document);
                }
            }

            // Upload current address proof if available
            if (formData.currentAddressProofFile) {
                const currentForm = new FormData();
                currentForm.append('file', formData.currentAddressProofFile);
                currentForm.append('documentType', 'address_proof');
                const currentUploadRes = await axios.post(`${newUrl}/api/session/${sessionId}/upload`, currentForm);
                console.log('Current address proof upload:', currentUploadRes.data);
                if (currentUploadRes.data.success) {
                    uploadedDocuments.push(currentUploadRes.data?.document);
                }
            }

            // Update formData with uploaded documents
            if (uploadedDocuments.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    referenceDocuments: [...prev.referenceDocuments, ...uploadedDocuments]
                }));
                toast.success(`${uploadedDocuments.length} address proof(s) uploaded successfully.`);
            }

            // Always call address verification API
            const addressVerificationRes = await axios.post(`${newUrl}/api/session/${sessionId}/address-verification/start`, {
                "personalInfo": {
                    "fullName": formData.fullName,
                    "phone": formData.mobile,
                    "email": formData.email,
                    "dateOfBirth": formData.dob,
                    "pan": formData.panNumber
                },
                "addresses": {
                    "permanent": {
                        "detailed_address": formData.permanentAddress.address,
                        "pincode": formData.permanentAddress.pincode
                    },
                    "current": {
                        "detailed_address": formData.currentAddress.address,
                        "pincode": formData.currentAddress.pincode
                    }
                },
                "referenceDocuments": formData.referenceDocuments
            });

            if (addressVerificationRes.data.success) {
                console.log(addressVerificationRes.data);
                toast.success("Address verification started successfully.");
            } else {
                throw new Error("Address verification failed");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to upload address proof(s).");
        } finally {
            setIsUploading(false);
        }
    }

    const connectDigiLocker = async () => {
        try {
            if (!formData.sessionId) {
                toast.error("Session ID is missing. Please try again.");
                return;
            }
            const response = await axios.post(
                `${newUrl}/api/session/${formData.sessionId}/digilocker/init`,
                {
                    redirectUri: 'http://llmtech.in/test',
                    consent: 'Y',
                }
            );

            const data = response?.data;
            console.log(data)

            if (response.data.success) {
                setFormData(prev => ({
                    ...prev,
                    digiLockerTransId: data?.transactionId,
                }));

                window.location.href = data?.authUrl;
            }
        } catch (error) {
            console.error("Digilocker API error:", error);
            toast.error("Something went wrong while connecting to Digilocker.");
        }
    };


    const digiLockerCallback = async (txnId) => {
        try {
            const sessionId = formData.sessionId || localStorage.getItem('sessionId');
            console.log(sessionId)
            const response = await axios.post(`${newUrl}/api/session/${sessionId}/digilocker/callback`, {
                transactionId: txnId
            })
            console.log(response.data)
            const data = response.data?.extractedPersonalInfo;
            setFormData(prev => ({
                ...prev,
                fullName: data?.name || prev.fullName,
                dob: data?.dob || prev.dob,
                mobile: data?.mobile || prev.mobile,
                fathersName: data?.fathersName || prev.fathersName,
                permanentAddress: {
                    address: data?.addresses?.permanent?.address || prev.permanentAddress.address,
                    pincode: data?.addresses?.permanent?.pincode || prev.permanentAddress.pincode,
                },
                currentAddress: {
                    address: data?.addresses?.current?.address || prev.currentAddress.address,
                    pincode: data?.addresses?.current?.pincode || prev.currentAddress.pincode,
                },
                panNumber: data?.documents?.pan?.number || prev.panNumber,
                dlNumber: data?.documents?.dl?.number || prev.dlNumber,
            }));
        }

        catch (error) {
            console.log(error)
        }
    }






    const validateStep = (step) => {
        let stepErrors = {};
        let isValid = true;

        switch (step) {
            case 1:
                // Welcome screen - no validation needed
                break;

            case 2:
                if (!formData.digiLockerConnected) {
                    stepErrors.digiLocker = 'Please connect to DigiLocker to continue';
                }
                break;

            case 3:
                if (!formData.fullName.trim()) stepErrors.fullName = 'name is required';
                // if (!formData.lastName.trim()) stepErrors.lastName = 'Last name is required';
                if (!formData.mobile.trim()) stepErrors.mobile = 'Mobile number is required';
                else if (!/^\d{10}$/.test(formData.mobile)) stepErrors.mobile = 'Enter valid 10-digit number';
                if (!formData.dob) stepErrors.dob = 'Date of birth is required';
                if (!formData.email.trim()) stepErrors.email = 'Email is required';
                if (!formData.fathersName.trim()) stepErrors.fathersName = 'Father\'s name is required';
                break;

            case 4: {
                if (!formData.permanentAddress.address.trim()) stepErrors['permanentAddress.address'] = 'Address is required';

                if (!formData.sameAsPermanent) {
                    if (!formData.currentAddress.address.trim()) stepErrors['currentAddress.address'] = 'Address is required';
                }

                // Check if address proof is required
                const originalPermanent = formData.permanentAddress?.originalAddress || '';
                const originalCurrent = formData.currentAddress?.originalAddress || '';
                const currentPermanent = formData.permanentAddress?.address || '';
                const currentCurrent = formData.currentAddress?.address || '';

                const permanentModified = originalPermanent && currentPermanent !== originalPermanent;
                const currentModified = !formData.sameAsPermanent && originalCurrent && currentCurrent !== originalCurrent;

                // Require proof based on modifications
                if (permanentModified && !formData.sameAsPermanent && !formData.permanentAddressProofUploaded) {
                    stepErrors.permanentAddressProof = 'Permanent address proof is required since you modified the permanent address';
                }
                if (currentModified && !formData.currentAddressProofUploaded) {
                    stepErrors.currentAddressProof = 'Current address proof is required since you modified the current address';
                }
                if (permanentModified && formData.sameAsPermanent && !formData.permanentAddressProofUploaded) {
                    stepErrors.addressProof = 'Address proof is required since you modified the permanent address';
                }
                break;
            }

            case 5:
                if (!formData.uanNumber.trim()) stepErrors.uanNumber = 'UAN number is required';
                else if (!/^\d{12}$/.test(formData.uanNumber)) stepErrors.uanNumber = 'Enter valid 12-digit UAN';
                if (!formData.password.trim()) stepErrors.password = 'Password is required';
                if (!formData.isUanVerified) stepErrors.verification = 'Please verify your UAN credentials';
                if (formData.showOtpInput && !formData.isOtpVerified) stepErrors.otp = 'Please verify the OTP to continue';
                break;

            case 6:
                if (!formData.resume) stepErrors.resume = 'Resume upload is required';
                if (formData.educationDetails.length === 0) stepErrors.educationDetails = 'At least one education detail is required';
                break;

            // case 7:
            //     if (!formData.resume) stepErrors.resume = 'Resume is required';
            //     if (formData.salarySlips.length === 0) stepErrors.salarySlips = 'At least one salary slip is required';
            //     if (!formData.addressProof) stepErrors.addressProof = 'Address proof is required';
            //     break;

            // case 8:
            //     // Review step - no validation needed
            //     break;

            default:
                break;
        }

        if (Object.keys(stepErrors).length > 0) {
            isValid = false;
        }

        setErrors(stepErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setSlideDirection('right');
            // Mark current step as completed
            setFormData(prev => ({
                ...prev,
                currentStep: currentStep + 1,
                completedSteps: [...new Set([...prev.completedSteps, currentStep])]
            }));
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    useEffect(() => {
        const url = new URL(window.location.href);
        const txnId = url.searchParams.get("transaction_id");
        console.log(txnId)

        if (txnId) {
            setFormData(prev => ({
                ...prev,
                digiLockerTransId: txnId,
                digiLockerConnected: true
            }));
            setCurrentStep(2);

            // Clean URL
            // const cleanUrl = url.origin + url.pathname;
            // window.history.replaceState({}, document.title, cleanUrl);

            // ✅ Pass txnId directly to avoid async timing issue
            // fetchDigiLockerIssuedFiles(txnId);
            digiLockerCallback(txnId);
        }
    }, []);



    const handlePrevious = () => {
        setSlideDirection('left');
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const goToStep = (step) => {
        setSlideDirection(step > currentStep ? 'right' : 'left');
        setCurrentStep(step);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const reviewData = {
                employment: formData.experienceDetails,
                education: formData.educationDetails,
            };

            // For now, just log the formData - API call will be added later
            console.log('Form submitted:', formData);
            const submitRes = await axios.post(`${newUrl}/api/session/${sessionId}/review`, reviewData);
            console.log(submitRes.data)
        } catch (error) {
            console.log(error)
            toast.error('Failed to submit the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Modal functions for UAN fetch
    const openUanModal = useCallback(() => {
        setModalMobile(formData.mobile || '');
        setIsModalOpen(true);
    }, [formData.mobile]);

    const closeUanModal = useCallback(() => {
        setIsModalOpen(false);
        setIsFetchingUans(false);
    }, []);

    const fetchUans = useCallback(async () => {
        if (!modalMobile.trim() || modalMobile.length !== 10) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsFetchingUans(true);
        try {
            const fetchUanByMobileRes = await axios.post(`${newUrl}/api/session/${sessionId}/uan/fetch-by-mobile`, {
                mobileNumber: modalMobile,
                consent: "Y"
            });

            console.log(fetchUanByMobileRes.data);

            if (fetchUanByMobileRes.data.success) {
                const uanList = fetchUanByMobileRes.data.uanList || [];

                if (uanList.length === 0) {
                    toast.error('No UAN found for this mobile number');
                } else {
                    // Auto-fill the first UAN (0th index) and close modal
                    const selectedUan = fetchUanByMobileRes.data.uan || uanList[0];
                    setFormData(prev => ({ ...prev, uanNumber: selectedUan }));
                    closeUanModal();
                    toast.success(`UAN ${selectedUan} has been filled automatically`);
                }
            } else {
                toast.error('Failed to fetch UAN numbers');
            }

            setIsFetchingUans(false);
        } catch (error) {
            console.error('Error fetching UANs:', error);
            toast.error('Failed to fetch UAN numbers');
            setIsFetchingUans(false);
        }
    }, [modalMobile, sessionId, newUrl, setFormData, closeUanModal]);

    const renderStepContent = () => {
        const components = {
            1: WelcomeStep,
            2: DigiLockerStep,
            3: PersonalDetailsStep,
            4: AddressInfoStep,
            5: UanLoginStep,
            6: ResumeUploadStep,
            // 7: DocumentUploadStep,
            // 8: ReviewSubmitStep
        };

        const Component = components[currentStep];

        return (
            <div className={`transition-all duration-500 ease-in-out transform ${slideDirection === 'right'
                ? 'translate-x-0 opacity-100'
                : 'translate-x-0 opacity-100'
                }`}>
                <Component
                    formData={formData}
                    createSession={createSession}
                    handleChange={handleChange}
                    errors={errors}
                    connectDigiLocker={connectDigiLocker}
                    goToStep={goToStep}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                    verifyUan={verifyUan}
                    setFormData={setFormData}
                    openUanModal={openUanModal}
                />
            </div>
        );
    };

    return (
        <div className="h-screen w-[65vw] bg-red-600 mx-auto bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex  justify-between p-5">
            <div className="w-full flex flex-col mx-auto">
                {/* Modern Progress Bar */}
                <div className="mb-5 lg:mb-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="flex space-x-3">
                            {Array.from({ length: totalSteps }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`relative h-3 rounded-full transition-all duration-500 ease-in-out ${currentStep > index + 1
                                        ? 'w-10 bg-green-500 shadow-lg'
                                        : currentStep === index + 1
                                            ? 'w-16 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg'
                                            : 'w-10 bg-gray-300'
                                        }`}
                                >
                                    {currentStep > index + 1 && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mb-0">
                        <p className="text-sm font-medium text-gray-600">
                            Step {currentStep} of {totalSteps}
                        </p>
                        <div className="flex items-center justify-center mt-2">
                            <div className="text-xs text-gray-500">
                                {Math.round((currentStep / totalSteps) * 100)}% Complete
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className=" flex-1 shadow-2xl overflow-hidden h-[450px] overflow-y-auto  flex flex-col border border-gray-100">
                    <div className="p-6 md:p-4 lg:p-6">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons - Fixed at bottom */}
                </div>

                <div className="border-t border-gray-100 p-6 md:p-3 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                            className={`flex items-center px-4 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 ${currentStep === 1
                                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                                : 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:scale-105 shadow-md hover:shadow-lg'
                                }`}
                        >
                            <ChevronLeft className="w-5 h-5 mr-2" />
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">Back</span>
                        </button>

                        {currentStep < 6 ? (
                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={async () => {
                                    if (currentStep === 1) {
                                        await createSession();
                                    }
                                    if (currentStep === 4) {
                                        await uploadAddressProof();
                                    }
                                    handleNext();
                                }}
                                className={`flex items-center px-6 md:px-8 py-3 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold ${isUploading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : currentStep === 1
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                                    }`}
                            >
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        <span className="hidden sm:inline">Processing...</span>
                                        <span className="sm:hidden">Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">
                                            {currentStep === 1 ? 'Start Validating' : 'Continue'}
                                        </span>
                                        <span className="sm:hidden">Next</span>
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        ) : currentStep === 6 ? (
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className={`flex items-center px-6 md:px-8 py-3 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        <span className="hidden sm:inline">Submitting...</span>
                                        <span className="sm:hidden">Submit</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">Submit</span>
                                        <span className="sm:hidden">Submit</span>
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Review and submit your application
                            </div>
                        )}
                    </div>

                    {/* Progress indicator at bottom */}

                </div>
            </div>

            {/* UAN Fetch Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">Find Your UAN</h3>
                            <button
                                onClick={closeUanModal}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Mobile Number Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={modalMobile}
                                        onChange={(e) => setModalMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="Enter your registered mobile number"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        maxLength={10}
                                    />
                                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter the mobile number registered with EPFO
                                </p>
                            </div>

                            {/* Fetch Button */}
                            <button
                                onClick={fetchUans}
                                disabled={!modalMobile.trim() || modalMobile.length !== 10 || isFetchingUans}
                                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-300 mb-6 ${!modalMobile.trim() || modalMobile.length !== 10 || isFetchingUans
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                                    }`}
                            >
                                {isFetchingUans ? (
                                    <>
                                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                                        Fetching UANs...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Fetch UAN Numbers
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepperForm;








