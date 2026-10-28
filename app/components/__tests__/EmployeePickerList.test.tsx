import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeePickerList } from '@/app/components/EmployeePickerList';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/backend/admin-1/service-record',
}));

const EMPLOYEES = [
  {
    id: 'e1',
    name: 'Rosum, Jan',
    email: 'jan.rosum@example.com',
    employee_id: '10-023',
  },
  {
    id: 'e2',
    name: 'Santos, Maria',
    email: 'maria.santos@example.com',
    employee_id: '130-5',
  },
];

const search = (value: string) =>
  fireEvent.change(screen.getByPlaceholderText('Search employees...'), {
    target: { value },
  });

beforeEach(() => vi.clearAllMocks());

describe('EmployeePickerList', () => {
  it('lists every employee by default', () => {
    render(<EmployeePickerList employees={EMPLOYEES} />);
    expect(screen.getByText('Rosum, Jan')).toBeInTheDocument();
    expect(screen.getByText('Santos, Maria')).toBeInTheDocument();
  });

  it('filters by name, email, or employee ID', () => {
    render(<EmployeePickerList employees={EMPLOYEES} />);

    search('santos');
    expect(screen.queryByText('Rosum, Jan')).toBeNull();
    expect(screen.getByText('Santos, Maria')).toBeInTheDocument();

    search('jan.rosum@');
    expect(screen.getByText('Rosum, Jan')).toBeInTheDocument();
    expect(screen.queryByText('Santos, Maria')).toBeNull();

    search('130-5');
    expect(screen.getByText('Santos, Maria')).toBeInTheDocument();
    expect(screen.queryByText('Rosum, Jan')).toBeNull();
  });

  it('shows an empty state when nothing matches', () => {
    render(<EmployeePickerList employees={EMPLOYEES} />);
    search('nobody');
    expect(screen.getByText('No employees found.')).toBeInTheDocument();
  });

  it('opens the selected employee under the current path', () => {
    render(<EmployeePickerList employees={EMPLOYEES} />);
    fireEvent.click(screen.getByText('Santos, Maria'));
    expect(push).toHaveBeenCalledWith('/backend/admin-1/service-record/e2');
  });
});
