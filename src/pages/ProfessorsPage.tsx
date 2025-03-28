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
import { ProfessorForm } from '../components/ProfessorForm';
import { professorApi } from '../api/client';
import { Professor } from '../types/api';

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'address', label: 'Address', minWidth: 200 },
  { id: 'phone', label: 'Phone', minWidth: 130 },
  { id: 'hireDate', label: 'Hire Date', minWidth: 130 },
];

export const ProfessorsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | undefined>();
  const queryClient = useQueryClient();

  const { data: professors = [], isLoading } = useQuery({
    queryKey: ['professors'],
    queryFn: professorApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: professorApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Professor }) =>
      professorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: professorApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professors'] });
    },
  });

  const handleOpenForm = (professor?: Professor) => {
    setSelectedProfessor(professor);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedProfessor(undefined);
    setIsFormOpen(false);
  };

  const handleSubmit = (data: Professor) => {
    if (selectedProfessor?.id) {
      updateMutation.mutate({ id: selectedProfessor.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (professor: Professor) => {
    if (professor.id) {
      deleteMutation.mutate(professor.id);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Professors</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          Add Professor
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={professors}
        onEdit={handleOpenForm}
        onDelete={handleDelete}
      />

      <Dialog
        open={isFormOpen}
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
      >
        <ProfessorForm
          professor={selectedProfessor}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
        />
      </Dialog>
    </Container>
  );
};