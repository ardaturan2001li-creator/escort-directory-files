import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGroupedCountriesWithCities, slugify } from '@/lib/countryCities';
import BottomSeoArticle from '@/components/BottomSeoArticle';
import { dicts, Language } from '@/lib/i18n';

export async function generateStaticParams() {
  const languages = ['en', 'de', 'fr', 'es', 'it', 'nl', 'tr', 'ar'];
  const groups = getGroupedCountriesWithCities();
  
  const params: any[] = [];
  for (const lang of languages) {
    for (const g of groups) {
      if (g.slug) {
        params.push({ lang, countrySlug: g.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata(props: { params: Promise<{ lang: string; countrySlug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang as Language;
  const groups = getGroupedCountriesWithCities();
  const group = groups.find(g => g.slug === params.countrySlug);
  
  if (!group) return {};

  const countryName = group.label[lang] || group.country;
  const title = `${countryName} Escorts | Top VIP Companions & Call Girls`;
  const description = `Find the best verified escorts, call girls, and VIP companions in ${countryName}. Browse all top cities and book directly.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/country/${params.countrySlug}`,
    },
  };
}

export default async function CountryHubPage(props: { params: Promise<{ lang: string; countrySlug: string }> }) {
  const params = await props.params;
  const lang = params.lang as Language;
  const dict = dicts[lang] || dicts.en;
  
  const groups = getGroupedCountriesWithCities();
  const group = groups.find(g => g.slug === params.countrySlug);
  
  if (!group) notFound();

  const countryName = group.label[lang] || group.country;
  
  const seoArticle = {
    tr: `**${countryName}** bolgesindeki en seckin ve dogrulanmis escort profillerine hos geldiniz. \nBu rehberde, ${countryName} icerisindeki eglence hayatinin kalbinin attigi en populer sehirleri (toplam ${group.cities.length} sehir) bulabilirsiniz. Sitemizde yer alan tum profiller %100 gercek ve HD fotograflidir.\nIster is seyahati, ister tatil icin ${countryName} bolgesinde olun, VIP modellerimiz size unutulmaz bir deneyim sunmak icin burada. Hemen asagidaki sehirlerden birini secerek yerel escortlara goz atin.`,
    en: `Welcome to the most exclusive and verified escort profiles in **${countryName}**. \nIn this directory, you can find the most popular cities (total ${group.cities.length} cities) where the nightlife of ${countryName} beats. All profiles on our site are 100% real and HD photographed.\nWhether you are in ${countryName} for a business trip or vacation, our VIP models are here to offer you an unforgettable experience. Browse local escorts by selecting one of the cities below.`,
    de: `Willkommen bei den exklusivsten und verifiziertesten Escort-Profilen in **${countryName}**. \nIn diesem Verzeichnis finden Sie die beliebtesten Stadte (insgesamt ${group.cities.length} Stadte), in denen das Nachtleben von ${countryName} pulsiert. Alle Profile auf unserer Seite sind zu 100% echt und mit HD-Fotos versehen.\nEgal, ob Sie geschaftlich oder im Urlaub in ${countryName} sind, unsere VIP-Modelle sind hier, um Ihnen ein unvergessliches Erlebnis zu bieten. Durchsuchen Sie lokale Escorts, indem Sie unten eine der Stadte auswahlen.`
  }[lang] || `Welcome to the most exclusive escort profiles in **${countryName}**. Select a city below to browse VIP companions.`;

  return (
    <div className="flex flex-col min-h-screen bg-[#060608]">
      <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full space-y-10">
        
        <div className="text-xs text-neutral-500 flex items-center gap-2">
          <Link href={`/${lang}`} className="hover:text-red-400">Home</Link>
          <span>/</span>
          <span className="text-neutral-300">{countryName}</span>
        </div>

        <section className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {countryName} Escorts & Companions
          </h1>
          <p className="text-neutral-400 text-sm max-w-2xl">
            Browse {group.totalModels} verified VIP companions across {group.cities.length} cities in {countryName}.
          </p>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {group.cities.map((city) => (
            <Link 
              key={city.slug}
              href={`/${lang}/${city.slug}`}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-red-500/50 hover:bg-neutral-800 transition group flex flex-col items-center text-center gap-2"
            >
              <div className="text-lg font-bold text-white group-hover:text-red-400 transition">
                {city.name}
              </div>
              <div className="text-xs text-neutral-500 font-semibold bg-black px-2 py-1 rounded-md">
                {city.count} Models
              </div>
            </Link>
          ))}
        </section>

        <BottomSeoArticle article={seoArticle} />
      </main>
    </div>
  );
}
