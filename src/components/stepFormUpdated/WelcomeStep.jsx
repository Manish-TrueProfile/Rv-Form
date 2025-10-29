import React from 'react';
import { Shield, ExternalLink, Loader, CheckCircle, FileText, Lock, Zap, Clock, Award, Users } from 'lucide-react';

const WelcomeStep = ({ createSession }) => {
    return (
        <div className="text-center mx-auto h-full w-full  justify-center">
            {/* Welcome Header */}
            <div className="mb-8 lg:mb-6">
                {/* <div className="mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-sm flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                </div> */}

                <h1 className="text-4xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {/* <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> */}
                    <div className="flex font-orbitron items-center font-bold justify-center gap-2 py-1.5 "> Welcome to
                        <span className=" text-xl font-bold text-nowrap">TRUE PROFILE</span>
                        <span className=" px-1.5 bg-[#20b8c8] text-zinc-100 inline-block text-sm rounded font-orbitron">RV</span>
                    </div>
                    {/* </span> */}
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
                    Let's get you verified and registered in just a few simple steps
                </p>
            </div>

            {/* Candidate ID Display */}
            <div className=" gap-4 w-full">
                {/* <div className='w-1/2'> */}
                {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8 border border-blue-100">
                    <div className="flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-800">Candidate ID</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 tracking-wider">
                        TP-2024-MK-001
                    </div>
                </div> */}

                {/* DigiLocker Connection */}
                {/* </div> */}
                {/* Description Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                    {/* Preparation Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Documents Ready?</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Before we begin, please keep your essential documents like Aadhaar/PAN, address proof,
                            and certificates ready. We'll help you verify and upload them step-by-step.
                        </p>
                    </div>

                    {/* Process Overview Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Simple Process</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            The process includes ID verification, DigiLocker connection, address confirmation,
                            UAN login, and document uploads. We'll guide you through each step.
                        </p>
                    </div>
                </div>

                {/* Process Steps Preview */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">What's Next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                                1
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">DigiLocker</h4>
                            <p className="text-sm text-gray-600">Connect securely to auto-fill your details</p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                                2
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Verification</h4>
                            <p className="text-sm text-gray-600">Verify personal details and addresses</p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                                3
                            </div>
                            <h4 className="font-semibold text-gray-800 mb-2">Documents</h4>
                            <p className="text-sm text-gray-600">Upload and verify your documents</p>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Quick Process</h4>
                        <p className="text-gray-600">Complete in just 5-7 minutes</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Bank-Level Security</h4>
                        <p className="text-gray-600">Your data is encrypted and protected</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">Government Verified</h4>
                        <p className="text-gray-600">Official DigiLocker integration</p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-blue-600 mr-2" />
                        <span className="font-semibold text-gray-800">Trusted by 50,000+ professionals</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">99.9%</div>
                            <div>Uptime</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">256-bit</div>
                            <div>Encryption</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600">ISO 27001</div>
                            <div>Certified</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeStep;











