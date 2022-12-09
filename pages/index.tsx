import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Header from '../components/Layout/DefaultLayout/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Home';
import DefaultLayout from '../components/Layout/DefaultLayout';
import DefaultPage from './DefaultPage';
import PrevPlayMovie from './PrevPlayMovie';
import PlayPage from './PlayPage';
import Home from './Home';
import Follow from './Follow';
import Rank from './Rank';
import Navbar from '../components/Layout/DefaultLayout/Navbar';
import {
  getNowPlaying,
  getPopular,
  getTopRated,
  getTrending,
  getUpComing,
} from '../Services/MovieService';

const App: NextPage = ({
  trending,
  nowplaying,
  upcoming,
  popular,
  toparated,
}: any) => {
  return (
    <>
      <Home
        trending={trending}
        nowplaying={nowplaying}
        upcoming={upcoming}
        popular={popular}
        toparated={toparated}
      />
    </>
  );
};

// export async function getServerSideProps() {
//   const trending = await getTrending(1).then((res) => {
//     return res.data.results.slice(0, 10);
//   });
//   const nowplaying = await getNowPlaying(1).then((res) => {
//     return res.data.results;
//   });
//   const upcoming = await getUpComing(1).then((res) => {
//     return res.data.results.slice(0, 12);
//   });

//   const popular = await getPopular(1).then((res) => {
//     return res.data.results.slice(0, 13);
//   });

//   const toparated = await getTopRated(1).then((res) => {
//     return res.data.results.slice(0, 12);
//   });

//   return {
//     props: {
//       trending,
//       nowplaying,
//       upcoming,
//       popular,
//       toparated,
//     },
//   };
// }

export default App;
