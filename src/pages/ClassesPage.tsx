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
import { ClassForm } from '../components/ClassForm';
import { classApi, professorApi, departmentApi } from '../api/client';
import { Class } from '../types/api';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'term', label: 'Term', minWidth: 100 },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'professor', label: 'Professor', minWidth: 150 },
  { id: 'department', label: 'Department', minWidth: 150 },
];

export const ClassesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | undefined>();
  const queryClient = useQueryClient();

  // Fetch classes, professors, and departments data
  const { data: classes = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ['classes'],
    queryFn: classApi.getAll,
  });

  const { data: professors = [] } = useQuery({
    queryKey: ['professors'],
    queryFn: professorApi.getAll,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: classApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Class }) =>
      classApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: classApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  const handleOpenForm = (classData?: Class) => {
    setSelectedClass(classData);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedClass(undefined);
    setIsFormOpen(false);
  };

  const handleSubmit = (data: Class) => {
    if (selectedClass?.id) {
      updateMutation.mutate({ id: selectedClass.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (classData: Class) => {
    if (classData.id) {
      deleteMutation.mutate(classData.id);
    }
  };

  if (isLoadingClasses) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Classes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Class
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={classes.map(cls => ({
          ...cls,
          professor: professors.find(p => p.id === cls.professor)?.name || cls.professor,
          department: departments.find(d => d.id === cls.department)?.name || cls.department,
        }))}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
      />

      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <ClassForm
          classData={selectedClass}
          professors={professors}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </Dialog>
    </Container>
  );
};