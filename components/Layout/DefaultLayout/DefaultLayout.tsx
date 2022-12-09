import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';
import FilterMovie from './FilterMovie';
import DefaultPage from '../../../pages/DefaultPage/[...slug]';
import Notification from './Notification/Notification';
import Head from 'next/head';

function DefaultLayout({ children }: any) {
  return (
    <div>
      <Header />
      <Navbar />
      <main className="main-content">
        <div className="container">
          <Notification />
          {children.type === (<DefaultPage />).type ? (
            <>
              <FilterMovie /> <DefaultPage />
            </>
          ) : (
            children
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default DefaultLayout;
