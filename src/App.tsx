import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { StudentsPage } from './pages/StudentsPage';
import { ClassesPage } from './pages/ClassesPage';
import { ProfessorsPage } from './pages/ProfessorsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { ClassDetailsPage } from './pages/ClassDetailsPage';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                School Management
              </Typography>
              <Button color="inherit" component={Link} to="/students">
                Students
              </Button>
              <Button color="inherit" component={Link} to="/classes">
                Classes
              </Button>
              <Button color="inherit" component={Link} to="/professors">
                Professors
              </Button>
              <Button color="inherit" component={Link} to="/departments">
                Departments
              </Button>
            </Toolbar>
          </AppBar>
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/professors" element={<ProfessorsPage />} />
              <Route path="/departments" element={<DepartmentsPage />} />
              <Route path="/classes/:id" element={<ClassDetailsPage />} />
              <Route path="/" element={<StudentsPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
