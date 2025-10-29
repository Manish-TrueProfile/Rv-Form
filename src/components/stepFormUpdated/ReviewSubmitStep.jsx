import React from 'react';
import { CheckCircle, User, Phone, Mail, Home, FileText, Calendar, CreditCard, Shield, Edit, Loader } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PdfDocument from './PdfDocument';

const ReviewSubmitStep = ({ formData, goToStep, isSubmitting, handleSubmit }) => {
    const ReviewSection = ({ title, icon, children, stepNumber, bgColor = "bg-gray-50" }) => (
        <div className={`${bgColor} border border-gray-200 rounded-xl p-6 mb-6`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <button
                    type="button"
                    onClick={() => goToStep(stepNumber)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                </button>
            </div>
            {children}
        </div>
    );

    const InfoRow = ({ label, value, highlight = false }) => (
        <div className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm text-gray-600">{label}:</span>
            <span className={`text-sm font-medium ${highlight ? 'text-blue-600' : 'text-gray-900'}`}>
                {value || 'Not provided'}
            </span>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto h-full overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Review & Submit</h2>
                <p className="text-gray-600 text-lg">
                    Please review all information before final submission
                </p>
            </div>

            {/* Personal Details */}
            <ReviewSection
                title="Personal Information"
                icon={<User className="w-5 h-5 text-white" />}
                stepNumber={2}
                bgColor="bg-blue-50"
            >
                <div className="grid grid-cols-1 md:grid-cols-1">
                    <div>
                        <InfoRow label="Full Name" value={`${formData.fullName}`} />
                        <InfoRow label="Father's Name" value={formData.fathersName} />
                    </div>
                    <div>
                        <InfoRow label="Date of Birth" value={formData.dob} />
                        <InfoRow label="Mobile Number" value={formData.mobile} />
                    </div>
                </div>
            </ReviewSection>

            {/* Address Information */}
            <ReviewSection
                title="Address Information"
                icon={<Home className="w-5 h-5 text-white" />}
                stepNumber={3}
                bgColor="bg-green-50"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Permanent Address</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>{formData.permanentAddress.street}</p>
                            <p>{formData.permanentAddress.city}, {formData.permanentAddress.state}</p>
                            <p>PIN: {formData.permanentAddress.pincode}</p>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Address</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            {formData.sameAsPermanent ? (
                                <p className="italic text-blue-600">Same as permanent address</p>
                            ) : (
                                <>
                                    <p>{formData.currentAddress.street}</p>
                                    <p>{formData.currentAddress.city}, {formData.currentAddress.state}</p>
                                    <p>PIN: {formData.currentAddress.pincode}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </ReviewSection>

            {/* UAN Information */}
            <ReviewSection
                title="UAN Login Details"
                icon={<CreditCard className="w-5 h-5 text-white" />}
                stepNumber={4}
                bgColor="bg-yellow-50"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoRow label="UAN Number" value={formData.uanNumber} highlight={true} />
                    <InfoRow label="Password" value={formData.password ? '••••••••' : 'Not provided'} />
                </div>
            </ReviewSection>

            {/* Uploaded Documents */}
            <ReviewSection
                title="Uploaded Documents"
                icon={<FileText className="w-5 h-5 text-white" />}
                stepNumber={5}
                bgColor="bg-purple-50"
            // stepNumber={6}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center">
                                <FileText className="w-5 h-5 text-blue-500 mr-3" />
                                <span className="text-sm font-medium">Resume</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${formData.resume ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {formData.resume ? 'Uploaded' : 'Missing'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center">
                                <Home className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-sm font-medium">Address Proof</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${formData.addressProof ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {formData.addressProof ? 'Uploaded' : 'Missing'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center">
                                <CreditCard className="w-5 h-5 text-yellow-500 mr-3" />
                                <span className="text-sm font-medium">Salary Slips</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${formData.salarySlips.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {formData.salarySlips.length > 0 ? `${formData.salarySlips.length} files` : 'Missing'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div className="flex items-center">
                                <Shield className="w-5 h-5 text-purple-500 mr-3" />
                                <span className="text-sm font-medium">Certificates</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${formData.certificates.length > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {formData.certificates.length > 0 ? `${formData.certificates.length} files` : 'Optional'}
                            </span>
                        </div>
                    </div>
                </div>
            </ReviewSection>

            {/* DigiLocker Status */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 lg:p-6 mb-6 lg:mb-8">
                <div className="flex items-center">
                    <Shield className="w-8 h-8 text-blue-600 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900">Identity Verification</h3>
                        <p className={`text-sm ${formData.digiLockerConnected || formData.customDetailsConnected ? 'text-green-700' : 'text-gray-600'}`}>
                            Status: {formData.digiLockerConnected ? 'DigiLocker Connected & Verified' :
                                formData.customDetailsConnected ? 'Custom Details Verified' : 'Not Verified'}
                        </p>
                    </div>
                    {(formData.digiLockerConnected || formData.customDetailsConnected) && (
                        <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                    )}
                </div>
            </div>

            {/* Final Submission */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 lg:p-8 text-center">
                <div className="mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Download</h3>
                    <p className="text-gray-600">
                        Your data is ready. Click the button below to generate and download your PDF summary.
                    </p>
                </div>

                <PDFDownloadLink
                    document={<PdfDocument data={formData} />}
                    onClick={() => console.log(formData)}
                    fileName={`${formData.fullName.split(' ')[0]}'s_TrueProfile_Validation.pdf`}
                    className="w-full max-w-md mx-auto flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                    {({ blob, url, loading, error }) =>
                        loading ? (
                            <>
                                <Loader className="w-6 h-6 mr-3 animate-spin" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-6 h-6 mr-3" />
                                Download PDF Summary
                            </>
                        )
                    }
                </PDFDownloadLink>
            </div>
        </div>
    );
};

export default ReviewSubmitStep;