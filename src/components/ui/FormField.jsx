import React from 'react';

const FormField = ({
    label,
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    error,
    icon,
    required = false,
    helperText = '',
    maxLength,
    disabled = false,
    rows = 3,
    ...rest
}) => {
    const isTextarea = type === 'textarea';

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative rounded-md">
                {icon && !isTextarea && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {icon}
                    </div>
                )}

                {isTextarea ? (
                    <textarea
                        id={name}
                        name={name}
                        disabled={disabled}
                        rows={rows}
                        className={`block w-full pl-4 min-h-20 max-h-52 pr-4 py-2 border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' :
                            'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
                            }`}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        maxLength={maxLength}
                        {...rest}
                    />
                ) : (
                    <input
                        type={type}
                        id={name}
                        name={name}
                        disabled={disabled}
                        className={`block w-full ${icon ? 'pl-10' : 'pl-4'
                            } pr-4 py-2 border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' :
                                'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'
                            }`}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        maxLength={maxLength}
                        {...rest}
                    />
                )}
            </div>

            {helperText && !error && (
                <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}

            {error && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormField;