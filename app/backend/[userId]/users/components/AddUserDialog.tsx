'use client';

import { JSX, useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Separator } from '@/components/ui/separator';
import { Label } from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/custom/CustomButton';
import { regularEmailRegex } from '@/helpers/reusableRegex';
import { useUserDialog } from '@/services/auth/states/user-dialog';
import { UserForm } from '@/lib/types/users';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { signUp } from '@/services/users/users.services';
import { ImageUpload } from '@/components/custom/ImageUpload';
import { isEmpty } from 'lodash';
import {
  employmentStatus,
  roleTypes,
  civilStatus,
  genderStatus,
} from '@/app/auth/sign-in/helpers/constants';

interface AddUserDialog extends UserForm {
  password: string;
  confirmPassword: string;
  avatar: File[];
}

interface UserFormData extends UserForm {
  avatar: File[];
}

export function AddUserDialog(): JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>('');

  const { open, toggleOpen, type } = useUserDialog(
    useShallow((state) => ({
      open: state.open,
      type: state.type,
      toggleOpen: state.toggleOpenDialog,
    })),
  );

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setError,
    control,
  } = useForm<AddUserDialog>();

  const resetVariable = (): void => {
    reset({
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
      employee_id: '',
      role: '',
    });
    setMessage('');
    router.refresh();
    toggleOpen?.(false, null, null);
  };

  const onSubmit = async (data: AddUserDialog): Promise<void> => {
    const {
      email,
      username,
      role,
      employee_id,
      avatar,
      first_name,
      last_name,
      middle_name,
      birthdate,
      gender,
      civil_status,
      contact_number,
      address,
      position,
      employment_status,
      date_of_original_appointment,
      bp_number,
      philhealth,
      pagibig,
      tin,
      password,
      confirmPassword,
    } = data;

    startTransition(async () => {
      try {
        if (password !== confirmPassword) {
          setError('confirmPassword', {
            message: "password doesn't matched",
          });
          return;
        }

        const newData = {
          email,
          username: username?.toLowerCase() as string,
          password,
          role,
          employee_id,
          avatar: avatar || [],
          first_name,
          last_name,
          middle_name,
          birthdate: isEmpty(birthdate) ? null : '',
          gender,
          civil_status,
          contact_number,
          address,
          position,
          employment_status,
          date_of_original_appointment: isEmpty(date_of_original_appointment)
            ? null
            : '',
          bp_number,
          philhealth,
          pagibig,
          tin,
        };

        await signUp(newData as UserFormData);
        resetVariable();
      } catch (error) {
        setMessage(error as string);
      }
    });
  };

  const isOpenDialog = open && type === 'add';

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={() => toggleOpen?.(false, null, null)}
    >
      <DialogContent className="overflow-auto sm:max-h-[40rem] sm:max-w-[70rem]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          <Input
            title="Email"
            {...register('email', {
              required: 'Field is required.',

              pattern: {
                value: regularEmailRegex,
                message: 'invalid email address',
              },
            })}
            hasError={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <Input
            title="Username"
            {...register('username', {
              required: 'Field is required.',
            })}
            hasError={!!errors.email}
            errorMessage={errors.email?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            title="Password"
            type="password"
            {...register('password', {
              required: 'Field is required.',
            })}
            hasError={!!errors.password}
            errorMessage={errors.password?.message}
          />
          <Input
            title="Confirm Password"
            type="password"
            {...register('confirmPassword', {
              required: 'Field is required.',
            })}
            hasError={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="mb-1.5 text-sm font-medium">Role*</Label>
            <Controller
              name="role"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value as string}
                  onValueChange={(e) => onChange(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleTypes.map((item, index) => (
                      <SelectItem key={`${item}-${index}`} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {!!errors.role && (
              <h1 className="text-sm text-red-500">{errors.role.message}</h1>
            )}
          </div>

          <Input
            title="Employee ID"
            hasError={!!errors.employee_id}
            errorMessage={errors.employee_id?.message}
            {...register('employee_id', {
              required: 'This field is required.',
            })}
          />
        </div>

        <div className="space-y-2">
          <Controller
            control={control}
            name="avatar"
            render={({ field: { onChange, value } }) => (
              <ImageUpload
                title="Image"
                pendingFiles={value as File[]}
                isLoading={isPending}
                acceptedImageCount={1}
                setPendingFiles={(value) => onChange(value)}
              />
            )}
          />
        </div>

        <h1 className="text-xl font-medium">Personal Information</h1>
        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Input title="First Name" isOptional {...register('first_name')} />

          <Input isOptional title="Middle Name" {...register('middle_name')} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input title="Last Name" isOptional {...register('last_name')} />

          <Input
            type="date"
            isOptional
            title="Birth date"
            {...register('birthdate')}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label className="mb-1.5 text-sm font-medium">Civil Status</Label>
            <Controller
              name="civil_status"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value as string}
                  onValueChange={(e) => onChange(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select civil status" />
                  </SelectTrigger>
                  <SelectContent>
                    {civilStatus.map((item, index) => (
                      <SelectItem key={`${item}-${index}`} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label className="mb-1.5 text-sm font-medium">Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value as string}
                  onValueChange={(e) => onChange(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender status" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderStatus.map((item, index) => (
                      <SelectItem key={`${item}-${index}`} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <h1 className="text-xl font-medium">Contact & Address</h1>
        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Input
            title="Contact Number"
            type="number"
            isOptional
            {...register('contact_number')}
          />

          <Input isOptional title="Address" {...register('address')} />
        </div>

        <h1 className="text-xl font-medium">Employment Details</h1>
        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Input title="Position" {...register('position')} isOptional />

          <div className="space-y-2">
            <Label className="mb-1.5 text-sm font-medium">
              Employee Status
            </Label>
            <Controller
              name="employment_status"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  value={value as string}
                  onValueChange={(e) => onChange(e)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentStatus.map((item, index) => (
                      <SelectItem key={`${item}-${index}`} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <Input
          type="date"
          title="Date of original employment"
          {...register('date_of_original_appointment')}
          isOptional
        />

        <h1 className="text-xl font-medium">Statutory / Government IDs</h1>
        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <Input title="BP Number" {...register('bp_number')} isOptional />

          <Input title="Philhealth" {...register('philhealth')} isOptional />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Input title="Pagibig" {...register('pagibig')} isOptional />

          <Input title="Tin" {...register('tin')} isOptional />
        </div>
        {!!message && <p className="text-sm text-red-500">{message}</p>}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => resetVariable()}
            >
              Cancel
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <CustomButton
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
              isLoading={isPending}
            >
              <Plus />
              Register
            </CustomButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
