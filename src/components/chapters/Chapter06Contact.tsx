import { useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, Send, AlertCircle, ArrowUpRight } from 'lucide-react';
import { socialData } from '../../data/social';
import { personalData } from '../../data/personal';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import {
  validateContactForm,
  type ContactFormValues,
} from '../../utils/portfolioLogic';
import { MangaPage } from '../manga/MangaPage';
import { ChapterHeading } from '../manga/ChapterHeading';
import { MangaButton } from '../manga/MangaButton';
import { Tilt3DCard } from '../manga/Tilt3DCard';
import { DraggablePanel } from '../manga/DraggablePanel';

const INITIAL_FORM: ContactFormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function Chapter06Contact() {
  const [formValues, setFormValues] = useState<ContactFormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [submitState, setSubmitState] = useState<'idle' | 'error' | 'submitted'>('idle');
  const [sentRecord, setSentRecord] = useState<ContactFormValues | null>(null);

  const triggerContactSentSignal = usePortfolioStore((s) => s.triggerContactSentSignal);
  const setSceneInteractionNote = usePortfolioStore((s) => s.setSceneInteractionNote);

  const handleFieldChange = (field: keyof ContactFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateContactForm(formValues);

    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmitState('error');
      return;
    }

    setErrors({});
    setSentRecord({ ...formValues });
    setSubmitState('submitted');
    setFormValues(INITIAL_FORM);
    triggerContactSentSignal();
    setSceneInteractionNote('3D Wax-Sealed Letter unsealed at the Moon Shrine.');
  };

  const handleReset = () => {
    setSentRecord(null);
    setSubmitState('idle');
    setErrors({});
  };

  return (
    <MangaPage id="contact" tone="dark-wine" ariaLabelledBy="contact-heading">
      <ChapterHeading
        id="contact-heading"
        theme="dark"
        chapterNumber="CHAPTER 06 · FINAL LETTER"
        title="Contact & Connections"
        subtitle="Leave a sealed letter for collaborations, software engineering opportunities, or technical conversations—and watch the 3D Moon Shrine envelope unseal."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Social Profiles & Availability */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-5">
          <DraggablePanel className="pointer-events-auto" label="Direct Channels Card">
            <Tilt3DCard intensity={6}>
            <div className="border-2 border-[#E8BFC9] bg-[#211E25]/96 p-6 shadow-[6px_6px_0_#B84955]">
              <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#E8BFC9]">
                DIRECT CHANNELS
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#FFF9F1]">
                {personalData.name}
              </h3>
              <p className="mt-1 text-sm text-[#E8BFC9]">
                {personalData.title} · BCA Graduate (RTMNU, 2026)
              </p>

              <ul className="mt-6 space-y-4">
                {socialData.map((profile) => (
                  <li
                    key={profile.id}
                    className="border-b border-[#E8BFC9]/20 pb-3 last:border-b-0 last:pb-0"
                  >
                    <p className="font-mono-tabular text-xs text-[#E8BFC9]">
                      {profile.platform}
                    </p>
                    {profile.href ? (
                      <a
                        href={profile.href}
                        target={profile.platform === 'Email' ? undefined : '_blank'}
                        rel={profile.platform === 'Email' ? undefined : 'noopener noreferrer'}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#FFF9F1] underline decoration-[#B84955] underline-offset-4 hover:text-[#E8BFC9]"
                      >
                        {profile.handleDisplay}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <div className="mt-1">
                        <p className="text-sm font-medium text-[#FFF9F1]">
                          {profile.handleDisplay}
                        </p>
                        <p className="mt-0.5 text-xs text-[#A9BBCF]">{profile.note}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            </Tilt3DCard>
          </DraggablePanel>

          <DraggablePanel className="pointer-events-auto" label="Contact Form Note">
            <div className="border border-dashed border-[#E8BFC9]/55 bg-[#301B29]/95 p-5 text-sm leading-relaxed text-[#F6EBDD]">
              <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#E8BFC9]">
                NOTE ON CONTACT FORM
              </p>
              <p className="mt-2">
                This interactive letter validates your message directly in the browser and animates
                the 3D shrine envelope. Connect it to your preferred mail endpoint or Formspree action
                when deploying to production.
              </p>
            </div>
          </DraggablePanel>
        </div>

        {/* Right Column: Interactive Sealed Letter Form */}
        <div className="pointer-events-auto lg:col-span-7">
          <DraggablePanel className="pointer-events-auto" label="Sealed Letter Form">
            <div className="border-2 border-[#211E25] bg-[#FFF9F1]/96 p-6 text-[#211E25] shadow-[8px_8px_0_#B84955] sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b-2 border-[#211E25]/15 pb-4">
              <div className="flex items-center gap-2.5">
                <Mail className="h-5 w-5 text-[#B84955]" aria-hidden="true" />
                <h3 className="font-display text-2xl font-bold text-[#211E25]">
                  Sealed Letter
                </h3>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-[#632D40]">
                TO: {personalData.shortBrand}
              </span>
            </div>

            {submitState === 'submitted' && sentRecord ? (
              <div
                role="status"
                aria-live="polite"
                className="border-2 border-[#211E25] bg-[#F6EBDD] p-6"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-6 w-6 shrink-0 text-[#632D40]"
                    aria-hidden="true"
                  />
                  <div>
                    <h4 className="font-display text-xl font-bold text-[#211E25]">
                      Letter Sealed & Ready
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#301B29]">
                      Thank you, <span className="font-semibold">{sentRecord.name}</span>. Your
                      letter regarding{' '}
                      <span className="font-semibold">&ldquo;{sentRecord.subject}&rdquo;</span> has
                      been validated and recorded in this session.
                    </p>
                    <p className="mt-2 text-xs text-[#632D40]">
                      Reply-to recorded: {sentRecord.email}
                    </p>
                    <div className="mt-5">
                      <MangaButton variant="secondary" size="sm" onClick={handleReset}>
                        Write Another Letter
                      </MangaButton>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {submitState === 'error' && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 border-2 border-[#B84955] bg-[#F8E4EA] p-4 text-sm text-[#301B29]"
                  >
                    <AlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#B84955]"
                      aria-hidden="true"
                    />
                    <span>Please check the highlighted fields before sealing your letter.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold tracking-wide text-[#301B29]"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formValues.name}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      placeholder="e.g. Amina Deshmukh"
                      className="mt-1.5 min-h-[44px] w-full border-2 border-[#211E25] bg-[#FFF9F1] px-3.5 py-2 text-sm text-[#211E25] placeholder:text-[#632D40]/50"
                    />
                    {errors.name && (
                      <p id="contact-name-error" className="mt-1.5 text-xs font-medium text-[#B84955]">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold tracking-wide text-[#301B29]"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formValues.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      placeholder="you@domain.com"
                      className="mt-1.5 min-h-[44px] w-full border-2 border-[#211E25] bg-[#FFF9F1] px-3.5 py-2 text-sm text-[#211E25] placeholder:text-[#632D40]/50"
                    />
                    {errors.email && (
                      <p id="contact-email-error" className="mt-1.5 text-xs font-medium text-[#B84955]">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold tracking-wide text-[#301B29]"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    value={formValues.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                    placeholder="Software developer role or project inquiry"
                    className="mt-1.5 min-h-[44px] w-full border-2 border-[#211E25] bg-[#FFF9F1] px-3.5 py-2 text-sm text-[#211E25] placeholder:text-[#632D40]/50"
                  />
                  {errors.subject && (
                    <p id="contact-subject-error" className="mt-1.5 text-xs font-medium text-[#B84955]">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold tracking-wide text-[#301B29]"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    required
                    value={formValues.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    placeholder="Write your letter here..."
                    className="mt-1.5 w-full border-2 border-[#211E25] bg-[#FFF9F1] px-3.5 py-2.5 text-sm text-[#211E25] placeholder:text-[#632D40]/50"
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="mt-1.5 text-xs font-medium text-[#B84955]">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <MangaButton type="submit" variant="primary" size="lg">
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Seal & Send Letter
                  </MangaButton>
                </div>
              </form>
            )}
            </div>
          </DraggablePanel>
        </div>
      </div>
    </MangaPage>
  );
}
