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
import { Class, Professor, Department } from '../types/api';

interface ClassFormProps {
  classData?: Class;
  professors?: Professor[];
  departments?: Department[];
  onSubmit: (data: Class) => void;
  onCancel: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  classData,
  professors = [],
  departments = [],
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Class>({
    defaultValues: classData || {
      name: '',
      description: '',
      term: '',
      professor: '',
      department: '',
    },
  });

  // Register custom handlers for MUI components
  const handleProfessorChange = (professorId: string | null) => {
    setValue('professor', professorId || '');
  };

  const handleDepartmentChange = (departmentId: string | null) => {
    setValue('department', departmentId || '');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {classData ? 'Edit Class' : 'Add New Class'}
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
            <TextField
              required
              fullWidth
              label="Term"
              {...register('term', { required: 'Term is required' })}
              error={!!errors.term}
              helperText={errors.term?.message}
            />
          </Grid>
          <Grid size={12}>
            <Autocomplete
              options={professors.map(prof => prof.id || '')}
              getOptionLabel={(id) => 
                professors.find(p => p.id === id)?.name || ''
              }
              value={classData?.professor || null}
              onChange={(_, newValue) => handleProfessorChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Professor"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Autocomplete
              options={departments.map(dept => dept.id || '')}
              getOptionLabel={(id) => 
                departments.find(d => d.id === id)?.name || ''
              }
              value={classData?.department || null}
              onChange={(_, newValue) => handleDepartmentChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {classData ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};