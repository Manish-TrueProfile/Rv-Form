import React, { useState, useRef } from 'react';
import { Upload, FileText, Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ResumeUploadStep = ({ formData, errors, setFormData }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [educationDetails, setEducationDetails] = useState(formData.educationDetails || []);
    const [experienceDetails, setExperienceDetails] = useState(formData.experienceDetails || []);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newEducationData, setNewEducationData] = useState(null);
    const [newExperienceData, setNewExperienceData] = useState(null);
    const [processingError, setProcessingError] = useState(null);
    const [activeTab, setActiveTab] = useState('education'); // 'education' or 'experience'
    const fileInputRef = useRef(null);

    const handleRemoveResume = () => {
        setFormData(prev => ({
            ...prev,
            resume: null,
            educationDetails: [],
            experienceDetails: []
        }));
        setEducationDetails([]);
        setExperienceDetails([]);
        setProcessingError(null);
        // Clear file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success('Resume removed successfully');
    };

    const newUrl = 'https://96890ebaf04d.ngrok-free.app';
    const sessionId = formData.sessionId || localStorage.getItem('sessionId');



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Clear any previous errors
            setProcessingError(null);

            // Update form data with resume file
            setFormData(prev => ({
                ...prev,
                resume: file
            }));

            // Start processing
            setIsProcessing(true);

            try {
                // Create FormData for file upload
                const formDataObj = new FormData();
                formDataObj.append('resume', file);

                // Make actual API call
                const uploadResumeRes = await axios.post(`${newUrl}/api/session/${sessionId}/resume/upload`, formDataObj, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log(uploadResumeRes.data)

                if (uploadResumeRes.data.success) {
                    const resumeData = uploadResumeRes.data.extractedData;

                    // Map employment data to expected format
                    if (resumeData.employment && resumeData.employment.length > 0) {
                        const mappedExperienceData = resumeData.employment.map((exp, index) => ({
                            id: index + 1,
                            position: exp.jobTitle || '',
                            company: exp.companyName || '',
                            duration: exp.duration || (exp.startDate && exp.endDate
                                ? `${new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${exp.endDate === 'Present' ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                                : ''),
                            location: exp.location || '',
                            description: exp.description || ''
                        }));

                        setExperienceDetails(mappedExperienceData);
                        setFormData(prev => ({
                            ...prev,
                            experienceDetails: mappedExperienceData
                        }));
                    } else {
                        setExperienceDetails([]);
                        setFormData(prev => ({
                            ...prev,
                            experienceDetails: []
                        }));
                    }

                    // Map education data to expected format
                    if (resumeData.education && resumeData.education.length > 0) {
                        const mappedEducationData = resumeData.education.map((edu, index) => ({
                            id: index + 1,
                            degree: edu.degree ? `${edu.degree}${edu.specialization ? ` in ${edu.specialization}` : ''}` : '',
                            institution: edu.institution || '',
                            year: edu.yearOfPassing || '',
                            grade: edu.grade || '',
                            description: edu.board ? `Board: ${edu.board}` : ''
                        }));

                        setEducationDetails(mappedEducationData);
                        setFormData(prev => ({
                            ...prev,
                            educationDetails: mappedEducationData
                        }));
                    } else {
                        setEducationDetails([]);
                        setFormData(prev => ({
                            ...prev,
                            educationDetails: []
                        }));
                    }

                    // Update personal info if available
                    if (resumeData.personal) {
                        setFormData(prev => ({
                            ...prev,
                            name: resumeData.personal.name || prev.name,
                            email: resumeData.personal.email || prev.email,
                            phone: resumeData.personal.phone || prev.phone,
                            address: resumeData.personal.address || prev.address,
                            linkedin: resumeData.personal.linkedin || prev.linkedin,
                            github: resumeData.personal.github || prev.github,
                            skills: resumeData.personal.skills || prev.skills
                        }));
                    }

                    setProcessingError(null);
                    toast.success('Resume processed successfully!');
                } else {
                    throw new Error(uploadResumeRes.data.message || 'Failed to process resume');
                }
            } catch (error) {
                console.error('Error uploading resume:', error);
                setProcessingError(error.response?.data?.message || error.message || 'Failed to process resume. Please try again.');
                toast.error('Failed to process resume');
            } finally {
                setIsProcessing(false);
            }
        }
    }; const handleEditEducation = (index) => {
        setEditingIndex(index);
    };

    const handleSaveEducation = (index, updatedEducation) => {
        const updatedDetails = [...educationDetails];
        updatedDetails[index] = { ...updatedDetails[index], ...updatedEducation };
        setEducationDetails(updatedDetails);
        setFormData(prev => ({
            ...prev,
            educationDetails: updatedDetails
        }));
        setEditingIndex(null);
    };

    const handleDeleteEducation = (index) => {
        const updatedDetails = educationDetails.filter((_, i) => i !== index);
        setEducationDetails(updatedDetails);
        setFormData(prev => ({
            ...prev,
            educationDetails: updatedDetails
        }));
    };

    const handleAddEducation = () => {
        const newEducation = {
            id: Date.now(),
            degree: "",
            institution: "",
            year: "",
            grade: "",
            description: ""
        };
        setNewEducationData(newEducation);
        setIsAddingNew(true);
        // Clear any processing errors when user manually adds education
        setProcessingError(null);
    };

    const handleEditExperience = (index) => {
        setEditingIndex(index);
    };

    const handleSaveExperience = (index, updatedExperience) => {
        const updatedDetails = [...experienceDetails];
        updatedDetails[index] = { ...updatedDetails[index], ...updatedExperience };
        setExperienceDetails(updatedDetails);
        setFormData(prev => ({
            ...prev,
            experienceDetails: updatedDetails
        }));
        setEditingIndex(null);
    };

    const handleDeleteExperience = (index) => {
        const updatedDetails = experienceDetails.filter((_, i) => i !== index);
        setExperienceDetails(updatedDetails);
        setFormData(prev => ({
            ...prev,
            experienceDetails: updatedDetails
        }));
    };

    const handleAddExperience = () => {
        const newExperience = {
            id: Date.now(),
            position: "",
            company: "",
            duration: "",
            location: "",
            description: ""
        };
        setNewExperienceData(newExperience);
        setIsAddingNew(true);
        // Clear any processing errors when user manually adds experience
        setProcessingError(null);
    };

    const EducationCard = ({ education, index, isEditing, isNew = false }) => {
        const [editData, setEditData] = useState(education);
        const [fieldErrors, setFieldErrors] = useState({});

        const handleCancel = () => {
            if (isNew) {
                setIsAddingNew(false);
                setNewEducationData(null);
            } else {
                setEditingIndex(null);
            }
            setFieldErrors({});
        };

        const handleSave = () => {
            // Validate fields
            const errors = {};
            if (!editData.degree.trim()) errors.degree = 'Degree is required';
            if (!editData.institution.trim()) errors.institution = 'Institution is required';
            if (!editData.year.trim()) errors.year = 'Year is required';
            if (!editData.grade.trim()) errors.grade = 'Grade is required';
            if (!editData.description.trim()) errors.description = 'Description is required';

            setFieldErrors(errors);

            // If there are errors, don't save
            if (Object.keys(errors).length > 0) {
                return;
            }

            // If data exists and no errors, save the education
            if (isAddingNew) {
                // Adding new education
                const updatedDetails = [editData, ...educationDetails];
                setEducationDetails(updatedDetails);
                setFormData(prev => ({
                    ...prev,
                    educationDetails: updatedDetails
                }));
                setIsAddingNew(false);
                setNewEducationData(null);
            } else {
                // Editing existing education
                handleSaveEducation(index, editData);
            }
            setFieldErrors({});
        };

        if (isEditing) {
            return (
                <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                <input
                                    type="text"
                                    value={editData.degree}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, degree: e.target.value }));
                                        if (fieldErrors.degree) {
                                            setFieldErrors(prev => ({ ...prev, degree: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.degree ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.degree && <p className="text-red-500 text-xs mt-1">{fieldErrors.degree}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                                <input
                                    type="text"
                                    value={editData.institution}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, institution: e.target.value }));
                                        if (fieldErrors.institution) {
                                            setFieldErrors(prev => ({ ...prev, institution: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.institution ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.institution && <p className="text-red-500 text-xs mt-1">{fieldErrors.institution}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                <input
                                    type="text"
                                    value={editData.year}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, year: e.target.value }));
                                        if (fieldErrors.year) {
                                            setFieldErrors(prev => ({ ...prev, year: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.year ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.year && <p className="text-red-500 text-xs mt-1">{fieldErrors.year}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                                <input
                                    type="text"
                                    value={editData.grade}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, grade: e.target.value }));
                                        if (fieldErrors.grade) {
                                            setFieldErrors(prev => ({ ...prev, grade: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.grade ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.grade && <p className="text-red-500 text-xs mt-1">{fieldErrors.grade}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => {
                                    setEditData(prev => ({ ...prev, description: e.target.value }));
                                    if (fieldErrors.description) {
                                        setFieldErrors(prev => ({ ...prev, description: '' }));
                                    }
                                }}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{education.degree}</h3>
                        <p className="text-blue-600 font-medium mb-2">{education.institution}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span>{education.year}</span>
                            <span className="font-medium text-green-600">{education.grade}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{education.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                        <button
                            onClick={() => handleEditEducation(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteEducation(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ExperienceCard = ({ experience, index, isEditing, isNew = false }) => {
        const [editData, setEditData] = useState(experience);
        const [fieldErrors, setFieldErrors] = useState({});

        const handleCancel = () => {
            if (isNew) {
                setIsAddingNew(false);
                setNewExperienceData(null);
            } else {
                setEditingIndex(null);
            }
            setFieldErrors({});
        };

        const handleSave = () => {
            // Validate fields
            const errors = {};
            if (!editData.position.trim()) errors.position = 'Position is required';
            if (!editData.company.trim()) errors.company = 'Company is required';
            if (!editData.duration.trim()) errors.duration = 'Duration is required';
            if (!editData.location.trim()) errors.location = 'Location is required';
            if (!editData.description.trim()) errors.description = 'Description is required';

            setFieldErrors(errors);

            // If there are errors, don't save
            if (Object.keys(errors).length > 0) {
                return;
            }

            // If data exists and no errors, save the experience
            if (isAddingNew) {
                // Adding new experience
                const updatedDetails = [editData, ...experienceDetails];
                setExperienceDetails(updatedDetails);
                setFormData(prev => ({
                    ...prev,
                    experienceDetails: updatedDetails
                }));
                setIsAddingNew(false);
                setNewExperienceData(null);
            } else {
                // Editing existing experience
                handleSaveExperience(index, editData);
            }
            setFieldErrors({});
        };

        if (isEditing) {
            return (
                <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-lg">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <input
                                    type="text"
                                    value={editData.position}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, position: e.target.value }));
                                        if (fieldErrors.position) {
                                            setFieldErrors(prev => ({ ...prev, position: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.position ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.position && <p className="text-red-500 text-xs mt-1">{fieldErrors.position}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <input
                                    type="text"
                                    value={editData.company}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, company: e.target.value }));
                                        if (fieldErrors.company) {
                                            setFieldErrors(prev => ({ ...prev, company: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.company ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.company && <p className="text-red-500 text-xs mt-1">{fieldErrors.company}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    type="text"
                                    value={editData.duration}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, duration: e.target.value }));
                                        if (fieldErrors.duration) {
                                            setFieldErrors(prev => ({ ...prev, duration: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.duration ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.duration && <p className="text-red-500 text-xs mt-1">{fieldErrors.duration}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={editData.location}
                                    onChange={(e) => {
                                        setEditData(prev => ({ ...prev, location: e.target.value }));
                                        if (fieldErrors.location) {
                                            setFieldErrors(prev => ({ ...prev, location: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.location ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {fieldErrors.location && <p className="text-red-500 text-xs mt-1">{fieldErrors.location}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={editData.description}
                                onChange={(e) => {
                                    setEditData(prev => ({ ...prev, description: e.target.value }));
                                    if (fieldErrors.description) {
                                        setFieldErrors(prev => ({ ...prev, description: '' }));
                                    }
                                }}
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {fieldErrors.description && <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>}
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{experience.position}</h3>
                        <p className="text-blue-600 font-medium mb-2">{experience.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span>{experience.duration}</span>
                            <span className="font-medium text-green-600">{experience.location}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{experience.description}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                        <button
                            onClick={() => handleEditExperience(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteExperience(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 ">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Resume Upload & Profile Details</h2>
                <p className="text-gray-600">Upload your resume to automatically extract and verify your profile information including education, experience, and personal details</p>
            </div>

            {/* Resume Upload Section */}
            {!formData.resume && !isProcessing && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-xl p-8 text-center">
                    <div className="mb-4">
                        <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                        <p className="text-gray-600 mb-6">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Choose File
                    </button>
                    {errors.resume && <p className="text-red-500 text-sm mt-2">{errors.resume}</p>}
                </div>
            )}

            {/* Processing State */}
            {isProcessing && (
                <div className="bg-white border border-blue-200 rounded-xl p-8 text-center">
                    <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Resume</h3>
                    <p className="text-gray-600 mb-4">Analyzing resume and extracting profile information...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500">This may take a few seconds</p>
                </div>
            )}

            {/* Resume Uploaded State */}
            {formData.resume && !isProcessing && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FileText className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="font-medium text-green-900">{formData.resume.name}</p>
                                <p className="text-sm text-green-700">Resume uploaded successfully</p>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveResume}
                            className="flex items-center px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                        </button>
                    </div>
                </div>
            )}

            {/* Education & Experience Details Section - Only show when resume is uploaded */}
            {formData.resume && !isProcessing && (
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                        <button
                            onClick={() => setActiveTab('education')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'education'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Education
                        </button>
                        <button
                            onClick={() => setActiveTab('experience')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'experience'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Experience
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'education' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">Education Details</h3>
                                <button
                                    onClick={handleAddEducation}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Education
                                </button>
                            </div>

                            {/* Processing Error Message */}
                            {processingError && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{processingError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {educationDetails.length > 0 ? (
                                <div className="space-y-4">
                                    {isAddingNew && newEducationData && (
                                        <EducationCard
                                            key="new"
                                            education={newEducationData}
                                            index={-1}
                                            isEditing={true}
                                            isNew={true}
                                        />
                                    )}
                                    {educationDetails.map((education, index) => (
                                        <EducationCard
                                            key={education.id}
                                            education={education}
                                            index={index}
                                            isEditing={editingIndex === index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {isAddingNew && newEducationData ? (
                                        <EducationCard
                                            key="new"
                                            education={newEducationData}
                                            index={-1}
                                            isEditing={true}
                                            isNew={true}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No education details found. You can add them manually.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold text-gray-900">Experience Details</h3>
                                <button
                                    onClick={handleAddExperience}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Experience
                                </button>
                            </div>

                            {/* Processing Error Message */}
                            {processingError && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-800">{processingError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {experienceDetails.length > 0 ? (
                                <div className="space-y-4">
                                    {isAddingNew && newExperienceData && (
                                        <ExperienceCard
                                            key="new"
                                            experience={newExperienceData}
                                            index={-1}
                                            isEditing={true}
                                            isNew={true}
                                        />
                                    )}
                                    {experienceDetails.map((experience, index) => (
                                        <ExperienceCard
                                            key={experience.id}
                                            experience={experience}
                                            index={index}
                                            isEditing={editingIndex === index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {isAddingNew && newExperienceData ? (
                                        <ExperienceCard
                                            key="new"
                                            experience={newExperienceData}
                                            index={-1}
                                            isEditing={true}
                                            isNew={true}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No experience details found. You can add them manually.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {(errors.educationDetails || errors.experienceDetails) && (
                        <p className="text-red-500 text-sm text-center">
                            {errors.educationDetails || errors.experienceDetails}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResumeUploadStep;