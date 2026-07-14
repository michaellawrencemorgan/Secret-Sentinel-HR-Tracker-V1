import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

type Section = {
  title: string;
  body?: React.ReactNode;
  items?: string[];
};

const termsSections: Section[] = [
  {
    title: 'Section 1: Preamble, Scope, and Pre-Launch Pilot Disclosure',
    body: (
      <>
        <p>
          These Terms and Conditions constitute a legally binding agreement between Secret Sentinel ("the Company") and you,
          whether acting as an independent, professionally accredited security operator or public safety professional
          ("Sentinel Agent" or "Sentinel") or as an individual receiving logistical, escort, or perimeter support services
          ("User" or "Client").
        </p>
        <p>
          By participating in the Secret Sentinel Pilot Program ("the Pilot" or "Pilot Program"), which constitutes the
          pre-launch phase of the Secret Sentinel technology platform, application, and company, you explicitly acknowledge
          and agree to the unique structural, liability, and operational frameworks defined herein.
        </p>
        <p>
          The Pilot Program is designed explicitly to validate product-market fit, safety baselines, and logistical workflows
          within the Greater Los Angeles and Orange County areas prior to the commercial release of the mobile application.
          Because this is a pre-launch pilot, the allocation of risk, liability, and operational parameters is specifically
          restricted to isolate the Company, its technology infrastructure, and its facility partners from operational exposure.
        </p>
      </>
    ),
  },
  {
    title: 'Section 2: Comprehensive Non-Indemnification and Corporate Liability Insulation',
    body: (
      <>
        <h3>2.1 Mutual Acknowledgment of Platform Status</h3>
        <p>
          The Company operates strictly as an on-demand marketplace technology provider. The Secret Sentinel platform matches
          independent, fully credentialed public safety and security professionals with individuals requiring specialized
          logistics and trauma-informed perimeter support. The Company does not provide security services, transport services,
          or clinical behavioral health care directly.
        </p>
        <h3>2.2 Independent Sentinel Liability and Assumption of Risk</h3>
        <p>
          Every Sentinel Agent operating via the platform during this pre-launch pilot explicitly assumes 100% of the
          operational, civil, and professional liability arising out of or in connection with any shift, transport, or perimeter
          deployment. The Sentinel acknowledges that they are entering active deployments as independent contractors and that
          they maintain sole responsibility for their actions, omissions, professional conduct, and adherence to state and local
          laws.
        </p>
        <h3>2.3 User/Client Assumption of Risk</h3>
        <p>
          Users participating in this Pilot Program acknowledge that services are delivered by independent operators in a
          pre-launch test environment. Users explicitly assume all risks associated with specialized patient logistics, escort
          services, and perimeter management.
        </p>
        <h3>2.4 Strict Corporate Insulation and Limitation of Liability</h3>
        <p>
          To the maximum extent permitted under the laws of the State of California, the Company's liability to any Sentinel
          Agent, User, Client, or third party for any claim, injury, loss, damage, or legal action arising during, out of, or in
          connection with an active Pilot shift, transport, or perimeter deployment is strictly limited to the minimum legal
          requirements that the state of California mandates the Company must shoulder. The Company will shoulder zero liability,
          financial obligations, or indemnification requirements beyond those explicit, non-waivable statutory minimums.
        </p>
        <h3>2.5 Third-Party Facility and Specialist Indemnification (The Erica Bohem Insulation Clause)</h3>
        <p>
          Erica Bohem, her behavioral health placement network, healthcare insurance networks, Al Pitman, Small Steps Housing,
          LLC, and all affiliated Southern California treatment facility providers, owners, directors, and staff shall be held
          entirely harmless and free from any and all liability, claims, damages, costs, or legal actions arising during, out of,
          or in connection with an active Secret Sentinel shift, transport, or perimeter deployment.
        </p>
        <p>
          All operational liability rests solely and exclusively with the independent Sentinel agent and/or the User as dictated
          by these Terms and Conditions. Affiliated facility networks, placement specialists, and clinical staff bear zero legal
          exposure, zero financial responsibility, and zero indemnification obligations for incidents occurring during on-demand
          shifts or pilot operations.
        </p>
      </>
    ),
  },
  {
    title: 'Section 3: Sentinel Agent Status and Independent Contractor Framework',
    body: (
      <>
        <h3>3.1 Strict Absence of Employment Relationship</h3>
        <p>
          No employment, agency, joint venture, or partnership relationship is created or implied between Sentinel Agents and
          Secret Sentinel, nor between Sentinel Agents and any affiliated healthcare network, placement specialist, or treatment
          facility provider. Sentinels operate strictly as independent contractors.
        </p>
        <h3>3.2 Professional Autonomy and Control</h3>
        <p>
          Sentinels retain absolute control over their schedule, acceptance of shifts, and the precise methodology used to execute
          specialized perimeter protection and patient logistics, provided their methods remain strictly within the law and the
          safety bounds of this agreement. Sentinels are not eligible for, and explicitly waive any claim to, workers' compensation,
          unemployment insurance, health benefits, or mileage compensation from the Company or its facility partners.
        </p>
        <h3>3.3 Credentialing and Vetting Requirements</h3>
        <p>
          All Sentinel Agents, except for those specifically classified as non-regulated agents within the{' '}
          <a href="/classifications">Sentinel Classification Index</a>, must maintain active, independent, and professional
          accreditation, including a valid Bureau of Security and Investigative Services (BSIS) Security Guard Registration
          ("Guard Card") and any other state-mandated professional credentials required to operate legally within the state of
          California. Sentinels must instantly notify the platform of any suspension, expiration, or revocation of their
          professional credentials.
        </p>
      </>
    ),
  },
  {
    title: 'Section 4: Operational Boundaries, Use of Force, and Legal Structures',
    body: (
      <>
        <h3>4.1 Non-Physical Discouragement and Trauma-Informed Framework</h3>
        <p>
          Sentinel Agents operate strictly within a non-physical discouragement, conflict resolution, and trauma-informed care
          framework. Sentinels are trained public safety or technology professionals acting as a calm, professional buffer to
          stabilize hostile or sensitive behavioral health situations. Sentinels must strictly operate within non-physical
          boundaries and facility contract parameters.
        </p>
        <h3>4.2 Absolute Restrictions on Use of Force</h3>
        <p>
          Force, including deadly force, can only be deployed in absolute compliance with California law, meaning strictly in
          self-defense or the defense of others from an imminent threat of death or serious bodily injury. Any force deployed
          must be entirely reasonable, proportionate, and legally justifiable under California state law. The Company bears zero
          liability for a Sentinel's deployment of force.
        </p>
        <h3>4.3 Explicit Prohibition on Concealed Carry (Plainclothes Armed Security)</h3>
        <p>
          Under the standard BSIS Security Guard Permit, Sentinel Agents are explicitly prohibited from carrying a concealed
          firearm while on duty. Standard California BSIS permits only authorize the exposed (open) carrying of a firearm while
          the operator is wearing a full, clearly marked, visible uniform bearing company or security insignia.
        </p>
        <p>
          Sentinels are strictly prohibited from utilizing personal Concealed Carry Weapon (CCW) permits to act as armed
          plainclothes or concealed escorts while executing a shift on the Secret Sentinel platform. Any Sentinel executing
          tracking, patient logistics, or escort services in plainclothes or non-uniformed attire must operate completely
          unarmed. Violation of this clause constitutes an immediate breach of state law and results in instant permanent
          termination from the platform.
        </p>
        <h3>4.4 Complete Ammunition and Regulated Substance Purchase Ban (Straw Purchase Prohibition)</h3>
        <p>
          Sentinel Agents are strictly prohibited from purchasing ammunition, firearms, or regulated tactical gear for, or on
          behalf of, any User or Client. Under California state law, all ammunition transactions require an individual background
          check linked directly to the Department of Justice (DOJ) database, verified at the point of sale. Any attempt by a
          Sentinel Agent to procure ammunition on behalf of a Client, regardless of the Client's personal firearm licensing,
          eligibility, or authorization, constitutes an illegal "straw purchase" and a felony offense under the California Penal
          Code.
        </p>
        <p>
          Sentinels are also strictly prohibited from purchasing, procuring, or fetching drugs, alcohol, or any other regulated
          substances, medications, or chemicals (including legal over-the-counter or prescription items classified under standard
          clinical definitions or the Diagnostic and Statistical Manual of Mental Disorders / DSM guidelines, such as cough syrup
          and/or restricted over-the-counter medications) for or on behalf of any User or Client.
        </p>
        <p>
          This creates an even, blanket coverage and absolute prohibition for both ammunition and chemical substances. The
          platform will never facilitate, track, or authorize funds for transactions involving the purchase or delivery of
          ammunition, firearms, or regulated substances. Sentinels must never handle, transport, or assume custody of a Client's
          personal ammunition, firearms, drugs, alcohol, medications, or any related physical property or data.
        </p>
        <h3>4.5 Vehicle and Domestic Weapon Storage</h3>
        <p>
          When off-duty or transporting personal firearms to and from a work site, Sentinels must strictly adhere to California
          storage laws. Firearms must be kept completely unloaded and secured within a locked container (such as a vehicle trunk)
          entirely separate from ammunition. The glove compartment is explicitly excluded as a legal locked container under
          California law.
        </p>
      </>
    ),
  },
  {
    title: 'Section 5: Governing Law, Dispute Resolution, and Severability',
    body: (
      <>
        <h3>5.1 California Governing Law</h3>
        <p>
          These Terms and Conditions, the Pilot Program framework, and all interactions facilitated by the platform shall be
          governed by, interpreted under, and enforced in strict accordance with the laws of the State of California, without
          regard to conflict of law principles.
        </p>
        <h3>5.2 Mandatory Alternative Dispute Resolution (ADR) and Waiver of Lawsuits</h3>
        <p>
          Any legal dispute, claim, or controversy arising out of, relating to, or in connection with these Terms and Conditions,
          the Pilot Program framework, or the use of the platform shall be resolved exclusively through binding Alternative
          Dispute Resolution (ADR), including mediation and/or binding arbitration, instead of through the court system.
        </p>
        <p>
          By accepting these Terms and Conditions, both Sentinel Agents and Users explicitly agree to waive their right to file a
          lawsuit, class action, or jury trial in any state or federal court, including all Los Angeles County, California state,
          or federal courts. All ADR proceedings shall take place exclusively within Los Angeles County, California, under the
          governing rules of the selected California ADR provider, and the minimum liability protections mandated under the
          statutory laws of the State of California shall strictly apply.
        </p>
        <h3>5.3 Severability Clause</h3>
        <p>
          If any provision, clause, sentence, or sub-section of these Terms and Conditions is found by a court of competent
          jurisdiction to be invalid, illegal, or unenforceable under California state law, such provision shall be modified to
          the minimum extent necessary to make it valid and enforceable, while maintaining the original intent of absolute
          corporate liability insulation. The invalidity or unenforceability of any single provision shall not affect the
          validity, legality, or enforceability of any other provision within these Terms and Conditions, which shall remain in
          full force and effect.
        </p>
      </>
    ),
  },
];

const classificationSections: Section[] = [
  {
    title: '1. Legal & BSIS Compliance Filters',
    items: [
      'CA Guard Card: Verified state-certified security registration.',
      'CA CCW Permit: Concealed Carry Weapon (essential for discreet/plainclothes escort).',
      'BSIS Exposed Firearm Permit: Must tie to their Guard Card for open carry.',
      'Chemical/Tear Gas Cert: California-compliant certification for carrying professional-grade pepper spray.',
      'Baton Permit: State-issued certification to carry a tactical baton.',
    ],
  },
  {
    title: '2. Sober Companion & Mental Health Filters',
    items: [
      'Certified Sober Companion / Recovery Coach: Specialized in relapse prevention and safe transport.',
      'RADT / CADC: State-registered or certified Alcohol and Drug Counselors.',
      'De-escalation / Social-Emotional Specialist: Certified in Verbal Judo, CPI (Crisis Prevention), or Handle with Care.',
      'Mental Health First Aid (MHFA): Trained to handle psychological crises.',
    ],
  },
  {
    title: '3. Medical & Emergency Response Filters',
    items: [
      'Narcan/Naloxone Certified: Can legally and safely reverse an opioid overdose (especially valuable for sober companion jobs).',
      'CPR / AED / First Aid: Standard or Advanced Healthcare Provider certification.',
      'EMT / Paramedic: Current or former licensed medical first responders.',
    ],
  },
  {
    title: '4. Tactical & Defensive Filters',
    items: [
      'Taser / CEW Certification: Certified in Conducted Energy Weapons (Axon/TASER).',
      'Defensive Tactics / Combatives: Filter by BJJ, Krav Maga, or Judo, focusing on control and redirection.',
      'Evasive / Defensive Driving: Certified in high-risk transport and security driving.',
    ],
  },
  {
    title: '5. Background & Pedigree Filters',
    items: [
      'Prior Law Enforcement (LEO): Former or retired police, sheriff, or federal law enforcement.',
      'Military Veteran: Can filter by Military Police, Special Operations, etc.',
      'Executive Protection (EP) Graduate: Trained by recognized private academies (ESI, EPI, etc.) for executive protection and high-net-worth client etiquette.',
    ],
  },
];

function LegalShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans selection:bg-slate-950 selection:text-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Sentinel home">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-slate-950 text-white">
              <Shield className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-lg font-bold leading-none tracking-tight">SENTINEL</span>
              <span className="mt-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Protection Network
              </span>
            </span>
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
        <div className="border-b border-slate-200 pb-8">
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">{eyebrow}</div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}

export function TermsAndConditionsPage() {
  return (
    <LegalShell
      eyebrow="App Version 3.1.6(24) | 7-12-26"
      title="Terms and Conditions"
      subtitle="Pre-launch pilot terms for the Secret Sentinel technology platform, Sentinel Agents, Users, Clients, and affiliated pilot workflows."
    >
      <div className="mt-8 space-y-8">
        {termsSections.map((section) => (
          <section key={section.title} className="rounded border border-slate-200 bg-white p-5 shadow-sm md:p-7 legal-copy">
            <h2>{section.title}</h2>
            <div className="mt-4 space-y-4">{section.body}</div>
          </section>
        ))}
      </div>
    </LegalShell>
  );
}

export function ClassificationsPage() {
  return (
    <LegalShell
      eyebrow="Protocols & Procedures | Agent Types | 7-12-26"
      title="Sentinel Agent Classification Index"
      subtitle="Version 1.0 classification filters for legal compliance, mental health support, emergency response, tactical readiness, and professional background review."
    >
      <div className="mt-8 grid gap-5">
        {classificationSections.map((section) => (
          <section key={section.title} className="rounded border border-slate-200 bg-white p-5 shadow-sm md:p-7">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-950">{section.title}</h2>
            <ul className="mt-4 space-y-3">
              {section.items?.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </LegalShell>
  );
}
