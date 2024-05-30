import React from "react";

export default function Attendance() {
    return (
    <main className='bg-white p-4'>
        <h3 className="text-3xl font-semibold my-10">Attendance Policy</h3>
        <p className="pb-4">Group will begin on time. A 10-minute grace period is offered in case of emergency. If a participant is consistently late to group, they will no longer be eligible for the grace period.</p>
        <ul className='pl-6 pb-4'>
            <li className='list-disc'>The following scenarios will be the ONLY considerations for a possible excused absence:
            <ul className='pl-6 pb-4'>
                <li className="list-circle">Participant or participant’s minor child is hospitalized or requires emergency care during time of group.</li>
                <li className="list-circle">Court hearing is scheduled during participant’s scheduled group time.</li>
                <li className="list-circle">Participant is incarcerated.</li>
            </ul>
            </li>
            <li className='list-disc pb-4'>Any excused absence must be approved, and signed off by the Director.</li>
            <li className='list-disc'>Verifiable documentation such as letterhead, order from the court, hospital documentation, etc. will be required to support absence. Such proof must include the date, time, and reason for the absence and is required to be turned in immediately following the absence, within one week of returning to group.​​ In the event of an excused absence, the participant may attend a different group within the same calendar week (Tuesday-Saturday), at their regular group rate, if they would like to but they will not be required to do so.</li>
        </ul>
        <p className="pb-4">If the participant is scheduled to work during their assigned weekly group session they may turn in verifiable proof and then attend an alternate group, during the week (Tuesday-Saturday), to avoid accruing an absence.</p>
        <ul className='pl-6 pb-4'>
            <li className='list-disc'>Such proof must be official (company letterhead, logo, etc.) and must indicate the date and time participant was working.</li>
            <li className='list-disc'>
The week goes Tuesday through Saturday. If the participant fails to turn in documentation and attend an alternate group, the absence will be unexcused.</li>
            <li className='list-disc'>Providing the documentation and arranging to attend an alternate group is the sole responsibility of the participant.</li>
        </ul>
        <p>In the absence of the above circumstance the absence will be considered unexcused.</p>
        <ul className='pl-6 pb-4'>
            <li className='list-disc'>Unexcused absences will result in the following:
            <ul className="pl-6">
                <li className="list-circle">Completion of a makeup session will be required to make up the absence.
                    <ul className="pl-6">
                    <li className="list-square">Makeup sessions must be scheduled upon the participant’s return to group and should be completed within two weeks of the absence. Participants must be at a zero balance to schedule this appointment.</li>
                    <li className="list-square">Scheduling, payment, and completion of the makeup session are the sole responsibility of the participant.</li>                    
                    <li className="list-square">Once the makeup session has been completed the absence will be removed from the participant’s record.</li>
                    </ul>
                 </li>
                 <li className="list-circle">If at any time the participant has more than three unexcused absences, that have not been made up, they will be eligible for non-compliance from the program.
                    <ul className="pl-6">
                        <li className="list-square">If the participant is non-complied, they will be required to complete a new intake, and pay their outstanding balance in full prior, to re-engaging in the program. They will not receive credit for any previously completed sessions.</li>
                    </ul>
                </li>
            </ul>
            </li>
        </ul>
        <p>Any other attendance issues, or to submit required documentation, please e-mail the office immediately at office@bridges2success.com. Please put in the subject line of your e-mail the reason for the e-mail. For example: WORKING: NEED TO ATTEND ALTERNATE GROUP or ER: NEED TO EXCUSE ABSENCE. This way we can prioritize these e-mails.</p>

    </main>
        
    );
}