import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
  Autocomplete,
} from '@mui/material';
import { Department, Professor } from '../types/api';

interface DepartmentFormProps {
  department?: Department;
  professors?: Professor[];
  onSubmit: (data: Department) => void;
  onCancel: () => void;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({
  department,
  professors = [],
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Department>({
    defaultValues: department || {
      name: '',
      description: '',
      headOfDepartment: '',
    },
  });

  // Register custom handler for MUI Autocomplete
  const handleHeadOfDepartmentChange = (professorId: string | null) => {
    setValue('headOfDepartment', professorId || '');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {department ? 'Edit Department' : 'Add New Department'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              required
              fullWidth
              label="Name"
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              {...register('description')}
            />
          </Grid>
          <Grid size={12}>
            <Autocomplete
              options={professors.map(prof => prof.id || '')}
              getOptionLabel={(id) => 
                professors.find(p => p.id === id)?.name || ''
              }
              value={department?.headOfDepartment || null}
              onChange={(_, newValue) => handleHeadOfDepartmentChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Head of Department"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {department ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};