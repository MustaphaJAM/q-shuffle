import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const ExamReview = ({ exam }) => {
    const [teacherInfo, setTeacherInfo] = useState({
        teacherName: '',
        department: '',
        examDate: new Date().toISOString().split('T')[0],
        academicYear: '',
        semester: '',
        notes: ''
    });

    const printableRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generatePDF = () => {
        const element = printableRef.current;
        const opt = {
            margin: [0.5, 0.5],
            filename: `exam-${exam?.name || 'document'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: {
                unit: 'in',
                format: 'a4',
                orientation: 'portrait'
            }
        };

        html2pdf().set(opt).from(element).toPdf().get('pdf').then(pdf => {
            const totalPages = pdf.internal.getNumberOfPages();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 0.5, { align: 'center' });
            }
        }).save();
    };

    const isFormValid = () => {
        return teacherInfo.teacherName && teacherInfo.examDate;
    };

    return (
        <div className="w-full">
            {/* Teacher Input Form */}
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 p-4">
                        <h2 className="text-xl font-semibold text-gray-800">Exam Information</h2>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teacher Name *
                                </label>
                                <input
                                    type="text"
                                    name="teacherName"
                                    value={teacherInfo.teacherName}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    name="department"
                                    value={teacherInfo.department}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Exam Date *
                                </label>
                                <input
                                    type="date"
                                    name="examDate"
                                    value={teacherInfo.examDate}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Academic Year
                                </label>
                                <input
                                    type="text"
                                    name="academicYear"
                                    value={teacherInfo.academicYear}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Semester
                                </label>
                                <input
                                    type="text"
                                    name="semester"
                                    value={teacherInfo.semester}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes
                                </label>
                                <input
                                    type="text"
                                    name="notes"
                                    value={teacherInfo.notes}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                />
                            </div>
                        </div>
                        <button
                            onClick={generatePDF}
                            disabled={!isFormValid()}
                            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Generate PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden PDF Content */}
            <div className="">
                <div ref={printableRef} className="bg-white p-8 max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">{exam?.name}</h1>
                        <p className="text-gray-600 mb-4">{exam?.description}</p>
                        <p className="text-sm">Teacher: {teacherInfo.teacherName}</p>
                        {teacherInfo.department && (
                            <p className="text-sm">Department: {teacherInfo.department}</p>
                        )}
                    </div>

                    {/* Student Information Section */}
                    <div className="border border-gray-300 p-4 mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="mb-4">
                                    <strong>Student Name:</strong> ________________________________
                                </p>
                                <p className="mb-4">
                                    <strong>Student ID:</strong> ___________________________________
                                </p>
                                <p className="mb-4">
                                    <strong>Class/Section:</strong> ________________________________
                                </p>
                            </div>
                            <div>
                                <p className="mb-4">
                                    <strong>Date:</strong> {teacherInfo.examDate}
                                </p>
                                <p className="mb-4">
                                    <strong>Duration:</strong> {exam?.duration} minutes
                                </p>
                                <p className="mb-4">
                                    <strong>Pass Percentage:</strong> {exam?.passPercent}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Instructions Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold mb-2">Instructions:</h2>
                        <ul className="list-disc pl-6">
                            <li>Read all questions carefully before answering</li>
                            <li>Write your answers clearly and legibly</li>
                            <li>All questions are compulsory unless stated otherwise</li>
                            {teacherInfo.notes && <li>{teacherInfo.notes}</li>}
                        </ul>
                    </div>

                    {/* Questions Section */}
                    <div className="mt-8">
                        {exam?.questions?.map((question, index) => (
                            <div key={question.id} className="mb-8">
                                <p className="font-medium mb-2">
                                    {index + 1}. {question.text}
                                </p>
                                <div className="pl-6">
                                    {question.options?.map((option, optIndex) => (
                                        <div key={optIndex} className="mb-2">
                                            <label className="flex items-center space-x-2">
                                                <span>□</span>
                                                <span className="w-6">{String.fromCharCode(65 + optIndex)}.</span>
                                                <span>{option}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamReview;