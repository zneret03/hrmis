import { JSX } from 'react';
import { FileLeaveDialog } from '@/app/auth/components/FileLeaveDialog';
import { AttendanceLeaves } from './components/AttendanceLeave';
import { UserDetails } from '@/app/components/UserDetails';
import { fetchUserWitHCredits } from '@/services/leave_credits/leave_credits.services';
import { Container } from '@/components/custom/Container';
import { LeaveCard } from '@/app/components/LeaveCard';

import { format } from 'date-fns';
import { AtSign, Briefcase, User, IdCardLanyard } from 'lucide-react';
import { EmployeeInformation } from './components/EmployeeInformation';
import { getAttendanceSummary } from '@/services/attendance/attendance.services';
import { getLeaveCategories } from '@/services/leave_categories/leave-categories.services';
import { getLeaveApplications } from '@/services/leave_applications/leave-applications.services';
import { LeaveApplicationsForm } from '@/lib/types/leave_application';
import { CancelLeaveDialog } from './components/CancelLeave';
import { EmptyPlaceholder } from '@/components/custom/EmptyPlaceholder';
import { PDFAction } from '@/app/components/pds/PDFAction';
import { UpdatePDFDialog } from '@/app/components/pds/PDFDialog';
import { PdfForm } from '@/app/components/pds/PdfForm';
import { fetchUserPds } from '@/services/pds/pds.service';
import { AwardDialog } from '@/app/components/AwardDialog';
import { unreadAwards } from '@/services/awards/awards.service';
import { Banner } from '@/app/components/Banner';
import { MenuOptions } from '@/lib/types/MenuOptions';

export default async function PersonalManagement({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<JSX.Element> {
  const { userId } = await params;
  const response = await fetchUserWitHCredits(userId);

  const employeeId = response.users.employee_id;
  const today = new Date();
  const todayMonth = (today.getMonth() + 1).toString();
  const formatted = todayMonth.padStart(2, '0');

  const pdsInfo = await fetchUserPds(userId);

  const unopenAwards = await unreadAwards();

  const attendanceResponse = await getAttendanceSummary(
    employeeId,
    `?page=1&perPage=31&sortBy=created_at&month=${formatted}&year=${today.getFullYear()}`,
  );

  const { leave_applications: leaveApplications } = await getLeaveApplications(
    `?page=1&perPage=5&limt=5&sortBy=status`,
  );

  const category = await getLeaveCategories('');
  const unreadRewards = unopenAwards.awards.length;

  const contactInformation: MenuOptions[] = [
    { label: 'Email', value: response.users.email },
    { label: 'Mobile Number', value: response.users.contact_number },
    { label: 'Permanent Address', value: response.users.address },
  ];

  const personalInformation: MenuOptions[] = [
    {
      label: 'Name',
      value: `${response.users.first_name} ${response.users.middle_name} ${response.users.last_name}`,
    },
    {
      label: 'Birth date',
      value: response.users.birthdate,
    },
    {
      label: 'Gender',
      value: response.users.gender,
    },
    {
      label: 'Civil Status',
      value: response.users.civil_status,
    },
  ];

  const employmentDetails: MenuOptions[] = [
    { label: 'Position', value: response.users.position },
    { label: 'Employment Status', value: response.users.employment_status },
    {
      label: 'Date of Original Appointment',
      value: format(
        response.users.date_of_original_appointment,
        'MMMM d, yyyy, h:mm:ss a',
      ),
    },
  ];

  const governemntIdsDetails: MenuOptions[] = [
    { label: 'BP Number', value: response.users.bp_number },
    { label: 'Philhealth', value: response.users.philhealth },
    {
      label: 'Pagibig',
      value: response.users.pagibig,
    },

    {
      label: 'Tin',
      value: response.users.tin,
    },
  ];

  return (
    <Container
      title="Personal Data Management"
      description="You can update your PDS here"
    >
      {unreadRewards > 0 && (
        <Banner
          path={`/employee/${userId}/nominated_awards`}
          rewardCount={unreadRewards}
        />
      )}
      <UserDetails
        {...{
          users: attendanceResponse.users,
          attendance: {
            daysPresent: attendanceResponse.attendance?.days_present || 0,
            daysAbsent: attendanceResponse.attendance?.days_absent || 0,
            tardiness_count:
              attendanceResponse?.attendance?.tardiness_count || 0,
          },
          credits: attendanceResponse.userCredits?.credits,
          isAdmin: false,
        }}
      />

      <section className="grid grid-cols-4 gap-2 py-4">
        <EmployeeInformation
          title="Contact Information"
          icon={<AtSign className="text-blue-500" />}
          employeeInfo={contactInformation}
        />
        <EmployeeInformation
          title="Personal Information"
          icon={<Briefcase className="text-blue-500" />}
          employeeInfo={personalInformation}
        />

        <EmployeeInformation
          title="Employment Information"
          icon={<User className="text-blue-500" />}
          employeeInfo={employmentDetails}
        />

        <EmployeeInformation
          title="Government Ids Details"
          icon={<IdCardLanyard className="text-blue-500" />}
          employeeInfo={governemntIdsDetails}
        />
      </section>

      <section className="flex gap-2">
        <div className="flex-1">
          <PDFAction data={pdsInfo} />
          <PdfForm file={pdsInfo.file} />
        </div>
        <div className="flex-1 space-y-4">
          <AttendanceLeaves />
          {leaveApplications.map((item: LeaveApplicationsForm) => (
            <LeaveCard key={item.id} {...item} />
          ))}

          {leaveApplications.length <= 0 && (
            <div className="text-center">
              <EmptyPlaceholder />
            </div>
          )}
        </div>
      </section>

      <FileLeaveDialog category={category.leave_categories} />
      <CancelLeaveDialog />
      <UpdatePDFDialog userId={userId} />
      <AwardDialog />
    </Container>
  );
}
