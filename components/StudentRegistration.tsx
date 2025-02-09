import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StudentRegistrationData, ExamSession } from '@/types/exam';

interface StudentRegistrationProps {
  onRegistrationComplete: (session: ExamSession) => void;
  publicLink: string;
}

export const StudentRegistration: React.FC<StudentRegistrationProps> = ({
  onRegistrationComplete,
  publicLink,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/exams/${publicLink}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: data.studentName,
          studentSurname: data.studentSurname,
          studentCNE: data.studentCNE,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.error);

      onRegistrationComplete(responseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Input
            id="studentName"
            label="First Name"
            type="text"
            register={register}
            errors={errors}
            disabled={loading}
            validation={{
              required: true,
              maxLength: 50,
            }}
            className="mb-4"
          />
          <Input
            id="studentSurname"
            label="Last Name"
            type="text"
            register={register}
            errors={errors}
            disabled={loading}
            validation={{
              required: true,
              maxLength: 50,
            }}
            className="mb-4"
          />
          <Input
            id="studentCNE"
            label="CNE Number"
            type="text"
            register={register}
            errors={errors}
            disabled={loading}
            validation={{
              required: true,
              pattern: {
                value: /^[0-9]+$/,
                message: 'CNE must contain only numbers',
              },
            }}
            className="mb-4"
          />
          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Start Exam'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
