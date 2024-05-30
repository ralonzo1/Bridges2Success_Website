import React from "react";

export default function Fees() {
    return (
    <main className='bg-white p-4'>
        <h3 className="text-3xl font-semibold my-10">Program Fees</h3>
        <ul className='pl-6'>
            <li className='list-disc'>​​​​​​​<b>Intake: </b>$100.00​​​​​​​</li>
            <li className='list-disc'><b>Workbook:</b> FREE *With completed intake and first session; replacements are $20*​​​​​​​</li>
            <li className='list-disc'><b>Weekly Group Fee:</b> $50.00
                <ul className='pl-6'>
                    <li className='list-circle'>Discounted Weekly Group Fees Available for Participants on social security, disability, TANF, food stamps, and unemployed if actively looking for work.
                    <ul className='pl-6'>
                        <li className='list-square'>​​​​​​​Ongoing documentation required; we will not back date any discounts</li>
                        </ul>
                    </li>
                    <li className='list-circle'>Helping Hands Discount Available
                    <ul className='pl-6'>
                        <li className='list-square'>​​​​​​​Participants may receive up to $15 off their weekly group fee by participating in 3 hours of community service (restrictions apply; ask for information during your intake)​​​​​​​</li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li className='list-disc'>​​​​​​​​​​​​​​​​​​​​​​​​​​<b>​Midterm Assessment:</b> FREE (not required for programs of 20 weeks or less)​</li>
            <li className='list-disc'><b>​​​​​​​​​​​​​​​​​​​​​​​​​​​Makeup Session:</b> $80.00 (required to makeup unexcused absences)</li>
            <li className='list-disc'><b>Individual Session:</b> $100.00 (not required; this is at participant's request)</li>
            <li className='list-disc'><b>Final Assessment:</b> $100.00 (not required for Parenting)</li>
            <li className='list-disc'><b>Domestic Violence Intervention / Aggression Control (AM) Assessment/Evaluation: </b>$200.00
                <ul className='pl-6'>
                    <li className='list-circle'>(not required to enroll in program; only if ordered by referral source)</li>
                </ul>
            </li>    
            <li className='list-disc'>​Parenting Program fees will be discounted 25% if participant is also enrolled in domestic violence intervention with us.\</li>
            <li className='list-disc'><b>Community Service Monitoring: </b> $90.00 (discounted to $80.00 if also enrolled in our other programs.​​​​​​)</li>
        </ul>
        <p className="mt-10">**Please note that fees may vary by location.**</p>
    </main>
        
    );
}