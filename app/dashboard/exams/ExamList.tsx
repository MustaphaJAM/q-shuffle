'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { CalendarDays, Edit2, Trash2, EyeOff, Eye } from 'lucide-react';

interface Exam {
  id: string;
  name: string;
  description: string;
  published: boolean;
}

const ExamList = ({
  exams,
  onUpdateStatus,
  onDeleteExam,
}: {
  exams: Exam[];
  onUpdateStatus: (id: string, published: boolean) => void;
  onDeleteExam: (id: string) => void;
}) => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});

  const handleShowMore = () => setVisibleCount((prev) => Math.min(prev + 5, exams.length));
  const handleShowLess = () => setVisibleCount(5);

  const handleUpdateStatusClick = async (id: string, published: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    await onUpdateStatus(id, published);
    setLoadingStates((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exams.slice(0, visibleCount).map((exam) => (
          <Card key={exam.id} className="transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex h-full flex-col space-y-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-semibold text-gray-900">{exam.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays className="h-4 w-4" />
                      <Badge variant={exam.published ? 'secondary' : 'default'}>
                        {exam.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="line-clamp-2 flex-grow text-sm text-gray-600">{exam.description}</p>

                <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row">
                  <Link href={`/dashboard/exams/${exam.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant={exam.published ? 'secondary' : 'default'}
                    onClick={() => handleUpdateStatusClick(exam.id, !exam.published)}
                    disabled={loadingStates[exam.id]}
                    className="w-full sm:w-auto"
                  >
                    {loadingStates[exam.id] ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                    ) : exam.published ? (
                      <EyeOff className="mr-2 h-4 w-4" />
                    ) : (
                      <Eye className="mr-2 h-4 w-4" />
                    )}
                    {loadingStates[exam.id]
                      ? exam.published
                        ? 'Unpublishing...'
                        : 'Publishing...'
                      : exam.published
                        ? 'Unpublish'
                        : 'Publish'}
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => setExamToDelete(exam)}
                    className="w-full sm:w-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(visibleCount < exams.length || visibleCount > 5) && (
        <div className="sticky bottom-4 flex justify-center">
          <Button
            variant="outline"
            onClick={visibleCount < exams.length ? handleShowMore : handleShowLess}
            className="bg-white shadow-md"
          >
            {visibleCount < exams.length ? 'Show More' : 'Show Less'}
          </Button>
        </div>
      )}

      <Dialog open={!!examToDelete} onOpenChange={() => setExamToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{examToDelete?.name}&quot;? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExamToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (examToDelete) {
                  onDeleteExam(examToDelete.id);
                  setExamToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamList;
