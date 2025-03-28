import axios from 'axios';
import { Student, Class, Professor, Department } from '../types/api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const studentApi = {
  getAll: () => api.get<Student[]>('/students').then(res => res.data),
  getById: (id: string) => api.get<Student>(`/students/${id}`).then(res => res.data),
  create: (student: Student) => api.post<Student>('/students', student).then(res => res.data),
  update: (id: string, student: Student) => api.put<Student>(`/students/${id}`, student).then(res => res.data),
  delete: (id: string) => api.delete(`/students/${id}`),
};

export const classApi = {
  getAll: () => api.get<Class[]>('/classes').then(res => res.data),
  getById: (id: string) => api.get<Class>(`/classes/${id}`).then(res => res.data),
  create: (classData: Class) => api.post<Class>('/classes', classData).then(res => res.data),
  update: (id: string, classData: Class) => api.put<Class>(`/classes/${id}`, classData).then(res => res.data),
  delete: (id: string) => api.delete(`/classes/${id}`),
  getStudents: (id: string) => api.get<Student[]>(`/classes/${id}/students`).then(res => res.data),
};

export const professorApi = {
  getAll: () => api.get<Professor[]>('/professors').then(res => res.data),
  getById: (id: string) => api.get<Professor>(`/professors/${id}`).then(res => res.data),
  create: (professor: Professor) => api.post<Professor>('/professors', professor).then(res => res.data),
  update: (id: string, professor: Professor) => api.put<Professor>(`/professors/${id}`, professor).then(res => res.data),
  delete: (id: string) => api.delete(`/professors/${id}`),
};

export const departmentApi = {
  getAll: () => api.get<Department[]>('/departments').then(res => res.data),
  getById: (id: string) => api.get<Department>(`/departments/${id}`).then(res => res.data),
  create: (department: Department) => api.post<Department>('/departments', department).then(res => res.data),
  update: (id: string, department: Department) => api.put<Department>(`/departments/${id}`, department).then(res => res.data),
  delete: (id: string) => api.delete(`/departments/${id}`),
  getClasses: (id: string) => api.get<Class[]>(`/departments/${id}/classes`).then(res => res.data),
  getProfessors: (id: string) => api.get<Professor[]>(`/departments/${id}/professors`).then(res => res.data),
};
