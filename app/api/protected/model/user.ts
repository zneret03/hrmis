import { removeImageViaPath, getImagePath } from '../../helpers/image/image';
import {
  generalErrorResponse,
  successResponse,
  conflictRequestResponse,
  badRequestResponse,
  unauthorizedResponse,
} from '../../helpers/response';
import { createClient } from '@/config';
import { UserForm, Users } from '@/lib/types/users';

interface RevokeUser {
  banUntil: string;
  archivedAt: Date | null;
}

interface UpdateUserInfo extends UserForm {
  oldAvatar: string;
  avatar: string;
}

interface SignUp extends Users {
  password: string;
}

export const updatePassword = async (password: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly updated password',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const verifyEmail = async (email: string, pathname: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${pathname}?password-reset=true`,
    });

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    return successResponse({
      message: 'Successfuly verified email',
      path: `${pathname}?password-reset=true`,
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const revokeUser = async (
  { banUntil, archivedAt }: RevokeUser,
  id: string,
) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.admin.updateUserById(id, {
      ban_duration: banUntil,
    });

    if (error) {
      return generalErrorResponse({ error: error.message });
    }

    const { error: userError } = await supabase
      .from('users')
      .update({
        archived_at: archivedAt,
      })
      .eq('id', id);

    if (userError) {
      return generalErrorResponse({ error: userError.message });
    }

    return successResponse({
      message: 'Successfuly revoked user',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const updateUserInfo = async (body: UpdateUserInfo, id: string) => {
  try {
    const {
      email,
      employee_id,
      role,
      username,
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
    } = body;
    const supabase = await createClient();
    const isEqualAvatar = body.oldAvatar !== body.avatar && !!body.oldAvatar;

    //remove old avatar
    if (isEqualAvatar) {
      removeImageViaPath(supabase, getImagePath(body.oldAvatar as string));
    }

    const newData = {
      email,
      employee_id,
      role,
      username,
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
    };

    const { error: userError } = await supabase
      .from('users')
      .update(newData)
      .eq('id', id);

    if (
      userError?.message ===
      'duplicate key value violates unique constraint "users_username_key"'
    ) {
      return conflictRequestResponse({
        error: 'username already exist, please try again.',
      });
    }

    if (userError) {
      if (typeof body.oldAvatar === 'string') {
        removeImageViaPath(supabase, getImagePath(body.oldAvatar as string));
      }
      return badRequestResponse({ error: userError.message || '' });
    }

    return successResponse({
      message: 'Successfully updated user details.',
    });
  } catch (error) {
    const newError = error as Error;
    return generalErrorResponse({ error: newError.message });
  }
};

export const signUp = async (body: SignUp) => {
  try {
    const supabase = await createClient();

    const {
      email,
      employee_id,
      role,
      username,
      avatar,

      //Personal Information
      first_name,
      last_name,
      middle_name,
      birthdate,
      gender,
      civil_status,

      //Contact & Address
      contact_number,
      address,

      //Employment Details
      position,
      employment_status,
      date_of_original_appointment,

      //Statory / Government IDs
      bp_number,
      philhealth,
      pagibig,
      tin,
    } = body;

    const { data: foundUser, error: foundUserError } = await supabase
      .from('users')
      .select('email')
      .or(`username.eq.${body.username}`)
      .limit(1)
      .maybeSingle();

    if (foundUserError) {
      if (typeof body.avatar === 'string') {
        removeImageViaPath(supabase, getImagePath(body.avatar as string));
      }

      return unauthorizedResponse({ error: foundUserError?.message });
    }

    if (foundUser) {
      if (typeof body.avatar === 'string') {
        removeImageViaPath(supabase, getImagePath(body.avatar as string));
      }
      return conflictRequestResponse({
        error: 'username already exist please try again.',
      });
    }

    const { error, data } = await supabase.auth.admin.createUser({
      email: body.email as string,
      password: body.password as string,
      email_confirm: true,
      user_metadata: {
        username: body.username,
        employee_id: body.employee_id,
        role: body.role,
      },
    });

    if (error) {
      if (typeof body.avatar === 'string') {
        removeImageViaPath(supabase, getImagePath(body.avatar as string));
      }
      return conflictRequestResponse({
        error: error?.message,
      });
    }

    const { error: userError } = await supabase.from('users').upsert(
      {
        id: data.user.id,
        email,
        employee_id,
        role,
        username,
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
      },
      { onConflict: 'id' },
    );

    if (userError) {
      if (body.avatar) {
        removeImageViaPath(supabase, getImagePath(body.avatar as string));
      }
      await supabase.auth.admin.deleteUser(data.user.id);
      return badRequestResponse({ error: userError.message || '' });
    }

    const { error: creditUser } = await supabase
      .from('leave_credits')
      .insert({ user_id: data.user.id, credits: 0 });

    if (creditUser) {
      if (body.avatar) {
        removeImageViaPath(supabase, getImagePath(body.avatar as string));
      }
      await supabase.auth.admin.deleteUser(data.user.id);
      return badRequestResponse({ error: creditUser.message || '' });
    }

    const { error: pdsError } = await supabase.from('pds').insert({
      user_id: data.user.id,
    });

    if (pdsError) {
      if (body.avatar) {
        removeImageViaPath(supabase, getImagePath(body.avatar as string));
      }
      await supabase.auth.admin.deleteUser(data.user.id);
      return badRequestResponse({ error: pdsError.message || '' });
    }

    return successResponse({
      message: 'Sign up successfully',
      userId: data.user.id,
    });
  } catch (error) {
    const newError = error as Error;
    console.error(error);
    return generalErrorResponse({ error: newError.message });
  }
};
