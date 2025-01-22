// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Switch } from '@/components/ui/switch';
// import Input from '@/components/ui/input';
// import { Copy, Check } from 'lucide-react';

// export default function PublishExamPage() {
//     const params = useParams();
//     const [exam, setExam] = useState(null);
//     const [copied, setCopied] = useState(false);
//     const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

//     useEffect(() => {
//         const fetchExam = async () => {
//             const response = await fetch(`/api/exams/${params.examId}`);
//             const data = await response.json();
//             setExam(data);
//         };

//         fetchExam();
//     }, [params.examId]);

//     const togglePublic = async () => {
//         try {
//             const response = await fetch(`/api/exams/${params.examId}/publish`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     publicActive: !exam.publicActive,
//                 }),
//             });
//             const updatedExam = await response.json();
//             setExam(updatedExam);
//         } catch (error) {
//             console.error('Failed to toggle public status:', error);
//         }
//     };

//     const copyLink = () => {
//         const link = `${baseUrl}/exams/public/${params.examId}`;
//         navigator.clipboard.writeText(link);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//     };

//     if (!exam) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <Card className="w-full max-w-2xl mx-auto mt-8">
//             <CardHeader>
//                 <CardTitle>Publish Exam: {exam.name}</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//                 <div className="flex items-center justify-between">
//                     <span>Make exam public</span>
//                     <Switch
//                         checked={exam.publicActive}
//                         onCheckedChange={togglePublic}
//                     />
//                 </div>

//                 {exam.publicActive && (
//                     <div className="space-y-4">
//                         <div className="flex items-center gap-2">
//                             <Input
//                                 readOnly
//                                 value={`${baseUrl}/exams/public/${params.examId}`}
//                             />
//                             <Button
//                                 size="icon"
//                                 onClick={copyLink}
//                             >
//                                 {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                             </Button>
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <span>Allow navigation between questions</span>
//                             <Switch
//                                 checked={exam.allowNavigation}
//                                 onCheckedChange={async (checked) => {
//                                     const response = await fetch(`/api/exams/${params.examId}`, {
//                                         method: 'PATCH',
//                                         headers: { 'Content-Type': 'application/json' },
//                                         body: JSON.stringify({ allowNavigation: checked }),
//                                     });
//                                     const updatedExam = await response.json();
//                                     setExam(updatedExam);
//                                 }}
//                             />
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <span>Show results after completion</span>
//                             <Switch
//                                 checked={exam.showResults}
//                                 onCheckedChange={async (checked) => {
//                                     const response = await fetch(`/api/exams/${params.examId}`, {
//                                         method: 'PATCH',
//                                         headers: { 'Content-Type': 'application/json' },
//                                         body: JSON.stringify({ showResults: checked }),
//                                     });
//                                     const updatedExam = await response.json();
//                                     setExam(updatedExam);
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }