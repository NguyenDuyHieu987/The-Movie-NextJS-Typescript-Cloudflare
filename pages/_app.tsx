import type { AppProps } from 'next/app';
import DefaultLayout from '../components/Layout/DefaultLayout/DefaultLayout';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '../components/Episodes/Episodes.scss';
import '../components/SlideShow/owl-carrousel.scss';
import '../components/VideoPlayer/VideoPlayer.scss';
import '../components/GlobalStyles/GlobalStyles.scss';
import '../components/TrailerItem/TrailerItem.scss';
import FilterProvider from '../Store/FilterProvider';
import NextNProgress from 'nextjs-progressbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FilterProvider>
      <NextNProgress
        stopDelayMs={300}
        options={{ easing: 'ease', speed: 500 }}
        color="#00c4ffb0"
        showOnShallow={true}
        height={3}
      />
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </FilterProvider>
  );
}

export default MyApp;
