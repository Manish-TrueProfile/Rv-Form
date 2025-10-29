import React from 'react';
import { User, Calendar, Phone, CheckCircle, Edit3, Mail } from 'lucide-react';
import FormField from '../ui/FormField';

const PersonalDetailsStep = ({ formData, handleChange, errors }) => {
    console.log('DOB value:', formData.dob, 'Type:', typeof formData.dob);
    console.log('Full formData:', formData);

    // Format date for HTML date input (expects YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        console.log('Formatting date:', dateString);

        // If already in YYYY-MM-DD format, return as is
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.log('Already in YYYY-MM-DD format');
            return dateString;
        }

        // Try to parse DD/MM/YYYY format
        const parts = dateString.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            console.log('Converted from DD/MM/YYYY to:', formatted);
            return formatted;
        }

        // Try to parse DD-MM-YYYY format
        const dashParts = dateString.split('-');
        if (dashParts.length === 3 && dashParts[0].length === 2) {
            const [day, month, year] = dashParts;
            const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            console.log('Converted from DD-MM-YYYY to:', formatted);
            return formatted;
        }

        console.log('Could not parse date format, returning as is');
        // Try to parse other formats or return as is
        return dateString;
    };

    const formattedDob = formatDateForInput(formData.dob);
    console.log('Final formatted DOB:', formattedDob);
    return (
        <div className="max-w-2xl mx-auto h-full">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Personal Details</h2>
                <p className="text-gray-600 text-lg">
                    We've auto-filled your information from DigiLocker. Please review and edit if needed.
                </p>
            </div>

            {/* Auto-fetch notification */}
            {(formData.digiLockerConnected || formData.customDetailsConnected) && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 lg:mb-8">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-green-800">Information Auto-Filled</p>
                            <p className="text-sm text-green-700">
                                Details have been securely fetched from your verified documents
                            </p>
                        </div>
                        <Edit3 className="w-4 h-4 text-green-500 ml-auto" />
                    </div>
                </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        label="Full Name"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={errors.firstName}
                        icon={<User className="w-5 h-5 text-gray-400" />}
                        required
                    />

                    {/* <FormField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        icon={<User className="w-5 h-5 text-gray-400" />}
                        required
                    /> */}
                    <FormField
                        label="Date of Birth"
                        name="dob"
                        type="date"
                        value={formattedDob || '1990-01-01'}
                        onChange={handleChange}
                        error={errors.dob}
                        icon={<Calendar className="w-5 h-5 text-gray-400" />}
                        required
                    />
                </div>


                <FormField
                    label="Mobile Number"
                    name="mobile"
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                    maxLength={10}
                    required
                />

                <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    required
                />

                <FormField
                    label="Father's Name"
                    name="fathersName"
                    type="text"
                    placeholder="Enter your father's name"
                    value={formData.fathersName}
                    onChange={handleChange}
                    error={errors.fathersName}
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    required
                />
            </div>

            {/* Info Box */}
            <div className="mt-6 lg:mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Data Accuracy</h4>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            Please ensure all details are accurate as they will be used for verification purposes.
                            You can edit any field if the auto-filled information needs correction.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsStep;