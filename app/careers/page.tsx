import type { Metadata } from 'next';
import { CareerApplicationForm } from '@/components/career-application-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { careerBoardLinks, careersEmailReady, type CareerRole } from '@/lib/careers';
import './careers.css';

export const metadata: Metadata = { title: 'Careers', description: 'Explore driver and cook opportunities with College Boy Cheesesteaks.' };

const roles: { id: CareerRole; title: string; summary: string; details: string[] }[] = [
  { id: 'driver', title: 'Truck driver', summary: 'Help the red truck get where the people are.', details: ['Drive and help position the food truck at scheduled stops and events.', 'Work with the team on a safe, on-time setup and close.'] },
  { id: 'cook', title: 'Truck cook', summary: 'Bring the real Philly experience to the window.', details: ['Prepare cheesesteaks and sides with care and consistency.', 'Keep the cooking area clean and support service at stops and events.'] },
];

export default function CareersPage() {
  return <><SiteHeader /><main className="careers-page">
    <section className="careers-hero"><span className="eyebrow">JOIN THE CREW</span><h1>Help us deliver<br /><em>authenticity.</em></h1><p>We&apos;re building the team behind the red truck. Drivers and cooks help bring a real Philly cheesesteak experience to Los Angeles.</p><a className="button button-cream" href="#apply">Apply with your résumé</a></section>
    <section className="careers-roles" aria-labelledby="career-roles-title"><div className="careers-heading"><span className="eyebrow">OPPORTUNITIES</span><h2 id="career-roles-title">Find your place on the truck.</h2><p>Choose a role and tell us why you want to join College Boy. Specific openings, requirements, schedules and compensation are confirmed during hiring.</p></div>
      <div className="careers-role-grid">{roles.map(role => <article key={role.id} className="careers-role"><span className="careers-role-tag">{role.id === 'driver' ? '01 / ON THE ROAD' : '02 / ON THE GRILL'}</span><h3>{role.title}</h3><p>{role.summary}</p><ul>{role.details.map(detail => <li key={detail}>{detail}</li>)}</ul><a className="careers-role-apply" href={`#apply`}>Apply for {role.title} <span aria-hidden="true">↗</span></a>
        <div className="career-boards"><span>Job boards</span>{(['indeed', 'ziprecruiter'] as const).map(board => {
          const href = careerBoardLinks[role.id][board];
          const name = board === 'indeed' ? 'Indeed' : 'ZipRecruiter';
          return href ? <a key={board} href={href} target="_blank" rel="noopener noreferrer">Apply on {name} ↗</a> : <span key={board}>{name} listing pending</span>;
        })}</div>
      </article>)}</div>
    </section>
    <section className="careers-apply" id="apply" aria-labelledby="career-apply-title"><div><span className="eyebrow">YOUR NEXT STOP</span><h2 id="career-apply-title">Tell us about yourself.</h2><p>Complete the application and attach a PDF résumé. Your application will be emailed to College Boy when the hiring inbox is connected.</p><p>If the online form is not yet available, you can <a href="mailto:info@collegeboysteaks.com?subject=College%20Boy%20employment%20inquiry">email College Boy directly</a> and attach your résumé in your email app.</p></div><CareerApplicationForm available={careersEmailReady} /></section>
  </main><SiteFooter /></>;
}
