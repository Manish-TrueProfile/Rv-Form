import React, { useState } from 'react';
import { Key, Shield, CreditCard, Lock, Loader, CheckCircle, Eye, EyeOff, Award, Star } from 'lucide-react';
import FormField from '../ui/FormField';
import axios from 'axios';
import { toast } from 'sonner';

const UanLoginStep = ({ formData, handleChange, errors, setFormData, openUanModal }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [isOtpVerifying, setIsOtpVerifying] = useState(false);
    const [txnId, setTxnId] = useState('')


    const newUrl = 'https://96890ebaf04d.ngrok-free.app';
    const sessionId = formData.sessionId || localStorage.getItem('sessionId');


    console.log(formData)
    // const uanAuthInitiate = async () => {
    //     try {
    //         const res = await axios.post(
    //             `${newUrl}/api/session/${sessionId}/employment-verification/initiate`,
    //             {}, // assuming no body is required
    //             {
    //                 headers: {
    //                     'x-api-key': 'b62c74de5a375e16941464a6eb950a4bb354696eddd4c9'
    //                 }
    //             }
    //         );
    //         console.log(res.data.data.session_id);
    //         setSessionId(res.data.data.session_id)
    //     } catch (err) {
    //         console.error(err.response?.data || err.message);
    //     }
    // };


    const handleVerify = async () => {
        if (!formData.uanNumber.trim() || !formData.password.trim()) {
            return;
        }
        try {
            setIsVerifying(true);
            const res = await axios.post(`${newUrl}/api/session/${sessionId}/employment-verification/initiate`,
                {
                    uan: formData.uanNumber,
                    password: formData.password
                })

            console.log(res.data)
            if (res.data.success) {
                setFormData(prevData => ({
                    ...prevData,
                    isUanVerified: true,
                    showOtpInput: true
                }));
                setTxnId(res.data.transactionId)
            }

        } catch (err) {
            console.log(err)
            toast.error('something went wrong')
            // await uanAuthInitiate()
        }
        finally {
            setIsVerifying(false);
        }
    };


    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value) || value.length > 1) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            const newOtpValues = [...otpValues];
            newOtpValues[index - 1] = '';
            setOtpValues(newOtpValues);

            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtpValues = [...otpValues];

        for (let i = 0; i < 6; i++) {
            newOtpValues[i] = pastedData[i] || '';
        }

        setOtpValues(newOtpValues);
    };

    const handleOtpVerify = async () => {
        const otpString = otpValues.join('');
        if (otpString.length === 6) {
            try {
                setIsOtpVerifying(true);
                const res = await axios.post(`${newUrl}/api/session/${sessionId}/employment-verification/submit-otp`, {
                    transactionId: txnId,
                    otp: otpString
                })
                console.log(res.data)
                if (res.data.success) {
                    handleChange({
                        target: {
                            name: 'isOtpVerified',
                            value: true
                        }
                    });
                    toast.success(res.data.message)
                } else {
                    toast.error(res.data.data.message)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setIsOtpVerifying(false)
            }
        }
    };

    const handleChangeUAN = async () => {
        try {
            // Reset all states
            setFormData(prevData => ({
                ...prevData,
                uanNumber: '',
                password: '',
                isUanVerified: false,
                showOtpInput: false,
                isOtpVerified: false
            }));
            setOtpValues(['', '', '', '', '', '']);
            setShowPassword(false);

            // Generate new session ID
            // await uanAuthInitiate();

            toast.success('You can now enter new UAN credentials');
        } catch (error) {
            console.error('Error resetting UAN:', error);
            toast.error('Failed to reset. Please try again.');
        }
    };



    // Success State Component
    const SuccessState = () => (
        <div className="w-full mx-auto h-full flex items-center justify-center min-h-[400px]">
            <div className="text-center w-full max-w-3xl px-4">
                {/* Success Animation */}
                <div className="relative mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white animate-pulse" />
                    </div>

                </div>

                {/* Success Message */}
                <div className="mb-8">
                    <h2 className="text-2xl font-orbitron font-bold text-gray-900 mb-3">
                        🎉 EPFO Verification Complete!
                    </h2>
                    <p className="text-gray-600 text-lg mb-4">
                        Your UAN has been successfully verified with EPFO
                    </p>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center mb-2">
                            <Award className="w-6 h-6 text-green-600 mr-2" />
                            <span className="text-green-800 font-semibold">Verification Successful</span>
                        </div>
                        <p className="text-green-700 text-sm">
                            You're all set! Your Provident Fund account is now linked and ready for processing.
                        </p>
                    </div>
                </div>

                {/* Verified Details and Next Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Verified Details */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verified Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">UAN Number</span>
                                <span className="font-medium text-gray-900">
                                    {formData.uanNumber ? `****${formData.uanNumber.slice(-4)}` : '****'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Verification Status</span>
                                <span className="flex items-center text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Verified
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-gray-600">Connection</span>
                                <span className="flex items-center text-blue-600">
                                    <Shield className="w-4 h-4 mr-1" />
                                    Secure
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
                        <div className="space-y-2 flex flex-col items-start text-sm text-blue-800">
                            <p>✅ Your PF account is now connected</p>
                            <p>✅ You can proceed to the next step</p>
                            <p>✅ All your data is secure and encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // If OTP is verified, show success state
    if (formData.isOtpVerified) {
        return <SuccessState />;
    }

    return (
        <div className="w-full mx-auto h-full">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">UAN Login</h2>
                <p className="text-gray-600 text-lg">
                    Enter your Universal Account Number and password to verify your PF account
                </p>
            </div>

            {/* UAN Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 lg:p-6 mb-6 lg:mb-8">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900">Universal Account Number (UAN)</h3>
                        <p className="text-blue-700 text-sm">Secure access to your Provident Fund account</p>
                    </div>
                </div>

                <p className="text-blue-800 text-sm leading-relaxed">
                    Your UAN is a 12-digit unique number assigned to you by EPFO. It helps in tracking your
                    PF contributions across different employers and ensures seamless transfer of funds.
                </p>
            </div>

            {/* Form Fields or OTP Input */}
            {!formData.showOtpInput ? (
                <div className="space-y-4 lg:space-y-4">
                    <FormField
                        label="UAN Number"
                        name="uanNumber"
                        type="text"
                        placeholder="Enter your 12-digit UAN"
                        value={formData.uanNumber}
                        onChange={handleChange}
                        error={errors.uanNumber}
                        icon={<CreditCard className="w-5 h-5 text-gray-400" />}
                        maxLength={12}
                        required
                        helperText="12-digit Universal Account Number from EPFO"
                        disabled={formData.isUanVerified}
                    />

                    {/* Forgot UAN Link */}
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={openUanModal}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline underline-offset-2 transition-colors"
                        >
                            Forgot UAN number?
                        </button>
                    </div>

                    <div className="relative">
                        <FormField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your UAN portal password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            icon={<Key className="w-5 h-5 text-gray-400" />}
                            required
                            helperText="Password for your UAN portal login"
                            disabled={formData.isUanVerified}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            disabled={formData.isUanVerified}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Verify Button */}
                    <div className="pt-4">
                        <button
                            type="button"
                            onClick={handleVerify}
                            disabled={!formData.uanNumber.trim() || !formData.password.trim() || isVerifying || formData.isUanVerified}
                            className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${!formData.uanNumber.trim() || !formData.password.trim() || isVerifying
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : formData.isUanVerified
                                    ? 'bg-green-500 text-white cursor-default'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {isVerifying ? (
                                <>
                                    <Loader className="w-6 h-6 mr-3 animate-spin" />
                                    Verifying UAN Credentials...
                                </>
                            ) : formData.isUanVerified ? (
                                <>
                                    <CheckCircle className="w-6 h-6 mr-3" />
                                    UAN Verified Successfully
                                </>
                            ) : (
                                <>
                                    <Shield className="w-6 h-6 mr-3" />
                                    Verify UAN Credentials
                                </>
                            )}
                        </button>

                        {errors.verification && (
                            <p className="mt-3 text-red-600 text-sm text-center">{errors.verification}</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="text-center mb-4">
                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="text-lg font-semibold text-blue-900">Enter OTP</h3>
                        <p className="text-blue-700 text-sm">
                            We've sent a 6-digit OTP to your registered mobile number
                        </p>
                    </div>

                    <div className="flex justify-center space-x-3 mb-4">
                        {otpValues.map((value, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-12 text-center text-xl font-bold border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                            />
                        ))}
                    </div>

                    {errors.otp && (
                        <p className="text-red-600 text-sm text-center mb-4">{errors.otp}</p>
                    )}

                    {/* Verify OTP Button */}
                    <div className="mb-4">
                        <button
                            type="button"
                            onClick={handleOtpVerify}
                            disabled={otpValues.join('').length !== 6 || formData.isOtpVerified || isOtpVerifying}
                            className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${otpValues.join('').length !== 6 || isOtpVerifying
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : formData.isOtpVerified
                                    ? 'bg-green-500 text-white cursor-default'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                                }`}
                        >
                            {isOtpVerifying ? (
                                <>
                                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                                    Verifying OTP...
                                </>
                            ) : formData.isOtpVerified ? (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    OTP Verified Successfully
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5 mr-2" />
                                    Verify OTP
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                onClick={() => {
                                    setOtpValues(['', '', '', '', '', '']);
                                    console.log('Resending OTP...');
                                }}
                            >
                                Didn't receive OTP? Resend
                            </button>

                            <span className="text-gray-400 text-sm hidden sm:inline">|</span>

                            <button
                                type="button"
                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center justify-center"
                                onClick={handleChangeUAN}
                            >
                                <Key className="w-4 h-4 mr-1" />
                                Change UAN
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Features */}
            <div className="mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                        <Lock className="w-6 h-6 text-green-600 mr-3" />
                        <h4 className="font-semibold text-green-900">Secure Connection</h4>
                    </div>
                    <p className="text-green-800 text-sm">
                        Your credentials are encrypted and transmitted securely. We never store your password.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center mb-3">
                        <Shield className="w-6 h-6 text-blue-600 mr-3" />
                        <h4 className="font-semibold text-blue-900">EPFO Verified</h4>
                    </div>
                    <p className="text-blue-800 text-sm">
                        Direct integration with EPFO systems for real-time verification and data fetching.
                    </p>
                </div>
            </div>

            {/* Help Section */}
            <div className="mt-6 lg:mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm text-gray-700">
                    <p>• <strong>Forgot UAN?</strong> Check your salary slip or contact your HR department</p>
                    <p>• <strong>Forgot Password?</strong> Visit the EPFO portal to reset your password</p>
                    <p>• <strong>New to UAN?</strong> Register at the official EPFO website first</p>
                </div>
            </div>
        </div>
    );
};

export default UanLoginStep;