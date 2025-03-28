import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Button,
  Box,
  Dialog,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataTable } from '../components/DataTable';
import { StudentForm } from '../components/StudentForm';
import { studentApi } from '../api/client';
import { Student } from '../types/api';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'birthDate', label: 'Birth Date', minWidth: 100 },
  { id: 'address', label: 'Address', minWidth: 170 },
  { id: 'phone', label: 'Phone', minWidth: 100 },
];

export const StudentsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: studentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Student }) =>
      studentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const handleOpenForm = (student?: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedStudent(undefined);
    setIsFormOpen(false);
  };

  const handleSubmit = (data: Student) => {
    if (selectedStudent?.id) {
      updateMutation.mutate({ id: selectedStudent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (student: Student) => {
    if (student.id) {
      deleteMutation.mutate(student.id);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Students</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Student
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={students}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
      />

      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <StudentForm
          student={selectedStudent}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </Dialog>
    </Container>
  );
};
