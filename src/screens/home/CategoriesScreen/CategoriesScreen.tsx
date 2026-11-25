import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Card } from '../../../components/layout/Card/Card';
import { TopBar } from '../../../components/navigation/TopBar/TopBar';
import { useLocale, useT } from '../../../i18n/locale';
import { serviceCategories, servicePackages } from '../../../mocks/catalog';
import { bs } from '../../../theme/theme';
import { layout } from '../../../theme/tokens';
import { categoryIcon } from '../shared/categoryIcons';

const messages = {
  es: { title: 'Categorías', intro: 'Elige qué quieres hacerle a tu vehículo.', list: 'Categorías de servicio', count: (n: number) => (n === 1 ? '1 paquete' : `${n} paquetes`) },
  en: { title: 'Categories', intro: 'Pick what you want done to your vehicle.', list: 'Service categories', count: (n: number) => (n === 1 ? '1 package' : `${n} packages`) },
};

/** Categorías (Inicio, "Ver todo" de Servicios): two-column grid of categories with the number of packages. */
export function CategoriesScreen({ onOpen }: { onOpen?: (id: string) => void }) {
  const t = useT(messages);
  const locale = useLocale();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100%' }}>
      <TopBar title={t.title} onBack={() => undefined} />
      <Box sx={{ flex: 1, px: `${layout.gutter.mobile}px`, pt: 4, pb: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Typography variant="body1" sx={{ color: bs.text.secondary }}>
          {t.intro}
        </Typography>
        <Box component="ul" aria-label={t.list} sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 3 }}>
          {serviceCategories.map((c) => {
            const Icon = categoryIcon[c.id];
            const n = servicePackages.filter((p) => p.categories.includes(c.id)).length;
            return (
              <Box component="li" key={c.id}>
                <Card onClick={() => onOpen?.(c.id)} label={c.name[locale]}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'grid', placeItems: 'center', width: 52, height: 52, borderRadius: '50%', backgroundColor: bs.surface.subtle, border: `1px solid ${bs.border.subtle}` }}>
                      <Icon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" component="h2">
                        {c.name[locale]}
                      </Typography>
                      <Typography variant="body2" sx={{ color: bs.text.secondary }}>
                        {t.count(n)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
