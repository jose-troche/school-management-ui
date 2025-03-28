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
import { DepartmentForm } from '../components/DepartmentForm';
import { departmentApi, professorApi } from '../api/client';
import { Department } from '../types/api';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'headOfDepartment', label: 'Head of Department', minWidth: 170 },
];

export const DepartmentsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>();
  const queryClient = useQueryClient();

  // Fetch departments and professors data
  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentApi.getAll,
  });

  const { data: professors = [] } = useQuery({
    queryKey: ['professors'],
    queryFn: professorApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: departmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Department }) =>
      departmentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: departmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });

  const handleOpenForm = (department?: Department) => {
    setSelectedDepartment(department);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedDepartment(undefined);
    setIsFormOpen(false);
  };

  const handleSubmit = (data: Department) => {
    if (selectedDepartment?.id) {
      updateMutation.mutate({ id: selectedDepartment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (department: Department) => {
    if (department.id) {
      deleteMutation.mutate(department.id);
    }
  };

  if (isLoadingDepartments) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Departments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Department
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={departments.map(dept => ({
          ...dept,
          headOfDepartment: professors.find(p => p.id === dept.headOfDepartment)?.name || dept.headOfDepartment,
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
        <DepartmentForm
          department={selectedDepartment}
          professors={professors}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </Dialog>
    </Container>
  );
};