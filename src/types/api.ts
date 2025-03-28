export interface Student {
  id?: string;
  name: string;
  birthDate?: string;
  address?: string;
  phone?: string;
  enrolledClasses?: string[];
}

export interface Class {
  id?: string;
  name: string;
  description?: string;
  term: string;
  students?: string[];
  professor?: string;
  department?: string;
}

export interface Professor {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  hireDate?: string;
  classes?: string[];
}

export interface Department {
  id?: string;
  name: string;
  description?: string;
  headOfDepartment?: string;
  classes?: string[];
}

export interface ApiError {
  message: string;
}