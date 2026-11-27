import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import Instagram from '@mui/icons-material/Instagram';
import LanguageOutlined from '@mui/icons-material/LanguageOutlined';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import WhatsApp from '@mui/icons-material/WhatsApp';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { useState, type ReactNode } from 'react';
import { useNav } from '../../../app/nav';
import { SearchField } from '../../../components/fields/SearchField/SearchField';
import { ToastProvider, useToast } from '../../../components/feedback/Toast/Toast';
import { ListGroup, ListRow } from '../../../components/layout/ListRow/ListRow';
import { TabPanel, Tabs } from '../../../components/navigation/Tabs/Tabs';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { FilterChipGroup } from '../../../components/selection/FilterChip/FilterChip';
import { NoResultsState } from '../../../components/screen-states/StatePresets/StatePresets';
import { useLocale, useT } from '../../../i18n/locale';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { contactChannels, faqCategoryLabels, faqItems, type ContactChannel, type FaqCategory } from '../data';
import { IconBubble, ScreenRoot, pick } from '../ui';

const messages = {
  es: {
    title: 'Centro de ayuda',
    tabs: 'Secciones del centro de ayuda',
    faq: 'Preguntas frecuentes',
    contact: 'Contáctanos',
    search: 'Buscar en preguntas frecuentes',
    all: 'Todas',
    categories: 'Categorías',
    opening: (what: string) => `Abriendo ${what}…`,
    contactIntro: '¿No encontraste lo que buscabas? Escríbenos o llámanos, te respondemos rápido.',
  },
  en: {
    title: 'Help center',
    tabs: 'Help center sections',
    faq: 'FAQ',
    contact: 'Contact us',
    search: 'Search the FAQ',
    all: 'All',
    categories: 'Categories',
    opening: (what: string) => `Opening ${what}…`,
    contactIntro: 'Did not find what you were looking for? Write or call us, we reply fast.',
  },
};

const channelIcon: Record<ContactChannel['id'], ReactNode> = {
  phone: <SupportAgentOutlined />,
  whatsapp: <WhatsApp />,
  web: <LanguageOutlined />,
  instagram: <Instagram />,
};

type TabValue = 'faq' | 'contact';
type Category = FaqCategory | 'all';

export interface HelpCenterScreenProps {
  initialTab?: TabValue;
  initialQuery?: string;
}

function Faq({ initialQuery = '' }: { initialQuery?: string }) {
  const t = useT(messages);
  const locale = useLocale();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category>('all');
  const [expanded, setExpanded] = useState<string | null>('cancel');

  const q = query.trim().toLocaleLowerCase(locale);
  const visible = faqItems.filter(
    (f) => (category === 'all' || f.category === category) && (!q || `${pick(f.q, locale)} ${pick(f.a, locale)}`.toLocaleLowerCase(locale).includes(q)),
  );
  const options = [{ value: 'all' as Category, label: t.all }, ...(Object.keys(faqCategoryLabels) as FaqCategory[]).map((c) => ({ value: c as Category, label: pick(faqCategoryLabels[c], locale) }))];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, pt: 4 }}>
      <Box sx={{ px: `${layout.gutter.mobile}px` }}>
        <SearchField label={t.search} hideLabel value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder={t.search} />
      </Box>
      <Box sx={{ pl: `${layout.gutter.mobile}px` }}>
        <FilterChipGroup selectionMode="single" label={t.categories} value={category} onChange={setCategory} options={options} />
      </Box>
      <Box sx={{ px: `${layout.gutter.mobile}px`, pb: 6 }}>
        {visible.length === 0 ? (
          <NoResultsState layout="inline" query={query.trim()} onClear={() => { setQuery(''); setCategory('all'); }} />
        ) : (
          visible.map((f) => (
            <Accordion
              key={f.id}
              expanded={expanded === f.id}
              onChange={(_, open) => setExpanded(open ? f.id : null)}
              slotProps={{ heading: { component: 'h3' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls={`${f.id}-panel`} id={`${f.id}-header`}>
                {pick(f.q, locale)}
              </AccordionSummary>
              <AccordionDetails id={`${f.id}-panel`}>{pick(f.a, locale)}</AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
}

function Contact() {
  const t = useT(messages);
  const locale = useLocale();
  const toast = useToast();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 5, pb: 6 }}>
      <Box component="p" sx={{ m: 0, px: `${layout.gutter.mobile}px`, pb: 2, color: bs.text.secondary, font: 'inherit', fontSize: 15, lineHeight: 1.5 }}>
        {t.contactIntro}
      </Box>
      <ListGroup label={t.contact}>
        {contactChannels.map((c) => (
          <ListRow
            key={c.id}
            leading={<IconBubble>{channelIcon[c.id]}</IconBubble>}
            title={pick(c.title, locale)}
            description={
              <>
                <Box component="span" sx={{ display: 'block', color: bs.text.primary, overflowWrap: 'anywhere' }}>
                  {c.value}
                </Box>
                <Box component="span" sx={{ display: 'block' }}>
                  {pick(c.hint, locale)}
                </Box>
              </>
            }
            onClick={() => toast.show({ message: t.opening(pick(c.title, locale)), severity: 'info' })}
          />
        ))}
      </ListGroup>
    </Box>
  );
}

function Content({ initialTab = 'faq', initialQuery }: HelpCenterScreenProps) {
  const t = useT(messages);
  const nav = useNav();
  const [tab, setTab] = useState<TabValue>(initialTab);
  return (
    <ScreenRoot>
      <TopBar title={t.title} onBack={nav.back} />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ px: `${layout.gutter.mobile}px` }}>
          <Tabs
            idPrefix="help"
            label={t.tabs}
            value={tab}
            onChange={setTab}
            items={[
              { value: 'faq', label: t.faq },
              { value: 'contact', label: t.contact },
            ]}
          />
        </Box>
        <TabPanel idPrefix="help" value="faq" current={tab}>
          <Faq initialQuery={initialQuery} />
        </TabPanel>
        <TabPanel idPrefix="help" value="contact" current={tab}>
          <Contact />
        </TabPanel>
      </Box>
    </ScreenRoot>
  );
}

/** Centro de ayuda (s77 FAQ, s79/s80 Contáctanos): tabs with searchable FAQ accordions and contact channels. */
export function HelpCenterScreen(props: HelpCenterScreenProps) {
  return (
    <ToastProvider>
      <Content {...props} />
    </ToastProvider>
  );
}
