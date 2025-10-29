import React from 'react';
import { Upload, DollarSign, Award, Home, X, CheckCircle } from 'lucide-react';

const DocumentUploadStep = ({ formData, handleChange, errors }) => {
    const removeFile = (fieldName, index = null) => {
        if (index !== null) {
            // For array fields like salarySlips, certificates
            const updatedFiles = formData[fieldName].filter((_, i) => i !== index);
            handleChange({
                target: {
                    name: fieldName,
                    files: updatedFiles
                }
            });
        } else {
            // For single file fields
            handleChange({
                target: {
                    name: fieldName,
                    files: []
                }
            });
        }
    };

    const FileUploadSection = ({
        title,
        name,
        icon,
        accept = "image/*,.pdf",
        multiple = false,
        required = false,
        description,
        files,
        bgColor = "bg-gray-50"
    }) => (
        <div className={`${bgColor} border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-all duration-300`}>
            <div className="text-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    {icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                    {title} {required && <span className="text-red-500">*</span>}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{description}</p>
            </div>

            <div className="text-center">
                <label htmlFor={name} className="cursor-pointer">
                    <div className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        <Upload className="w-5 h-5 mr-2" />
                        <span className="font-medium">
                            {files && files.length > 0
                                ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
                                : `Upload ${multiple ? 'files' : 'file'}`
                            }
                        </span>
                    </div>
                    <input
                        id={name}
                        name={name}
                        type="file"
                        className="sr-only"
                        onChange={handleChange}
                        accept={accept}
                        multiple={multiple}
                    />
                </label>
            </div>

            {/* Display uploaded files */}
            {files && files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 text-blue-500 mr-3" />
                                <div>
                                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(name, multiple ? index : null)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {errors[name] && (
                <p className="mt-3 text-sm text-red-600 text-center">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto h-full overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Document Upload</h2>
                <p className="text-gray-600 text-lg">
                    Please upload the required documents for verification
                </p>
            </div>

            {/* Upload Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
                {/* Address Proof */}
                <FileUploadSection
                    title="Address Proof"
                    name="addressProof"
                    icon={<Home className="w-6 h-6 text-white" />}
                    accept="image/*,.pdf"
                    required={true}
                    description="Utility bill, bank statement, or rental agreement (PDF/Image, max 5MB)"
                    files={formData.addressProof ? [formData.addressProof] : []}
                    bgColor="bg-green-50"
                />

                {/* Salary Slips */}
                <FileUploadSection
                    title="Salary Slips"
                    name="salarySlips"
                    icon={<DollarSign className="w-6 h-6 text-white" />}
                    accept="image/*,.pdf"
                    multiple={true}
                    required={true}
                    description="Last 3 months salary slips (PDF/Image, max 5MB each)"
                    files={formData.salarySlips}
                    bgColor="bg-yellow-50"
                />

                {/* Certificates */}
                <FileUploadSection
                    title="Educational Certificates"
                    name="certificates"
                    icon={<Award className="w-6 h-6 text-white" />}
                    accept="image/*,.pdf"
                    multiple={true}
                    required={false}
                    description="Degree, diploma, or certification documents (PDF/Image, max 5MB each)"
                    files={formData.certificates}
                    bgColor="bg-purple-50"
                />
            </div>

            {/* Upload Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 lg:p-6 mb-6 lg:mb-8">
                <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-3">Upload Guidelines</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <div>
                                <p className="mb-2">✓ Ensure documents are clear and readable</p>
                                <p className="mb-2">✓ Maximum file size: 5MB per document</p>
                            </div>
                            <div>
                                <p className="mb-2">✓ Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
                                <p className="mb-2">✓ All documents will be verified for authenticity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Upload Progress</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${formData.addressProof ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            <Home className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-medium">Address Proof</p>
                        <p className={`text-xs ${formData.addressProof ? 'text-green-600' : 'text-gray-400'}`}>
                            {formData.addressProof ? 'Uploaded' : 'Required'}
                        </p>
                    </div>

                    <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${formData.salarySlips.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-medium">Salary Slips</p>
                        <p className={`text-xs ${formData.salarySlips.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formData.salarySlips.length > 0 ? `${formData.salarySlips.length} files` : 'Required'}
                        </p>
                    </div>

                    <div className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${formData.certificates.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                            <Award className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-medium">Certificates</p>
                        <p className={`text-xs ${formData.certificates.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            {formData.certificates.length > 0 ? `${formData.certificates.length} files` : 'Optional'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadStep;