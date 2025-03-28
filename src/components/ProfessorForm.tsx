import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import { Professor } from '../types/api';

interface ProfessorFormProps {
  professor?: Professor;
  onSubmit: (data: Professor) => void;
  onCancel: () => void;
}

export const ProfessorForm: React.FC<ProfessorFormProps> = ({
  professor,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Professor>({
    defaultValues: professor || {
      name: '',
      address: '',
      phone: '',
      hireDate: '',
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {professor ? 'Edit Professor' : 'Add New Professor'}
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
              label="Address"
              {...register('address')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Phone"
              {...register('phone')}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Hire Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('hireDate')}
            />
          </Grid>
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {professor ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};