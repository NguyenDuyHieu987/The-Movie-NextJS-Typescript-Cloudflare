import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import {
  getAvatar,
  getDaTaSearch,
  getUserToken,
} from '../../../../Services/MovieService';
import ItemSearch from '../../../SearchRender/ItemSearch';
import SearchRender from '../../../SearchRender/SearchRender';
import ToastMessage from '../../../ToastMessage/ToastMessage';
import SignIn from '../../../SignIn';
import { FilterContext } from '../../../../Store/FilterContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

const cx = classNames.bind(styles);

function Header() {
  const [valueInput, setValueInput] = useState('');
  const [toastMessage, setToastMessage] = useState({});
  const [isFoucusSearch, setIsFocuSearch] = useState(false);
  const [isChangeInput, setIsChangeInput] = useState(false);
  const [dataSearch, setDataSearch] = useState([]);
  const [pageSearch, setPageSearch] = useState(1);
  const [isOpenFormSigIn, setIsOpenFormSigIn] = useState(false);
  const [isActiveSigInContent, setIsActiveSigInContent] = useState(false);
  const [isActiveSigUpContent, setIsActiveSigUpContent] = useState(false);
  const [dataAccount, setDataAccount] = useState<any>();
  const { user, setUser } = useContext(FilterContext);
  // const navigate = useNavigate();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isChangeInput) {
  //       setValueInput(null);
  //     setIsFocuSearch(false);
  //   }
  // }, [isChangeInput]);

  const handleOnChangeTextSearch = async (text: any) => {
    setValueInput(text);

    if (text.length === 0) {
      setDataSearch([]);
      setIsFocuSearch(false);
      setIsChangeInput(false);
    } else if (text.length >= 1) {
      setIsFocuSearch(true);
      setIsChangeInput(true);
      await axios
        .get(
          // `https://api.themoviedb.org/3/search/multi?api_key=fe1b70d9265fdb22caa86dca918116eb&query=${text}`
          `https://the-movie-node.onrender.com/search/multi?api=hieu987&query=${text}`
        )
        .then((searchMovieResponse) => {
          setDataSearch(searchMovieResponse.data.results);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });

      const xMark = document.getElementsByClassName(cx('x-mark'));
      xMark[0]?.addEventListener('mousedown', (e) => {
        e.preventDefault();
        setValueInput('');
        setIsFocuSearch(false);
        setIsChangeInput(false);
      });

      window.onkeydown = (e: any) => {
        if (text !== '') {
          if (e.key === 'Enter') {
            e.preventDefault();
            setIsChangeInput(false);
            // navigate(`/Searh/${text.replace(/\s/g, '-')}/`);
            router.push(`/DefaultPage/Search/${text.replace(/\s/g, '-')}`);
          }
        }
      };
    }
  };

  // const handleOnClickXmark = () => {
  //     setValueInput('');
  //   setIsFocuSearch(true);
  //   setIsChangeInput(false);
  // };

  const getData = () => {
    getDaTaSearch(valueInput, pageSearch).then((movieRespone: any) => {
      setDataSearch(dataSearch.concat(movieRespone.data.results));
    });
  };

  useEffect(() => {
    const loggedIn = window.localStorage.getItem('isLoggedIn');
    const userToken = window.localStorage.getItem('userToken');
    if (userToken !== null && loggedIn === 'true') {
      getUserToken({ user_token: userToken }).then((accountResponse) => {
        if (accountResponse.data.isLogin === true) {
          setDataAccount(accountResponse.data.result);
        }
      });
    }
  }, []);

  useEffect(() => {
    // document
    //   .querySelector('.' + cx('textbox-SearchFilm'))
    //   .addEventListener('blur', () => {
    //     setIsChangeInput(false);
    //   });
    if (!dataAccount) {
      window.addEventListener('click', () => {
        setIsChangeInput(false);
      });
      document
        .querySelector('.' + cx('textbox-SearchFilm'))
        .addEventListener('click', (e) => {
          e.stopPropagation();
        });

      const btn_signIn: HTMLElement = document.querySelector(
        '.' + cx('btn-signIn')
      ) as HTMLElement;

      btn_signIn.onclick = function () {
        // signIn_content.classList.toggle('active');
        // form_sign.classList.toggle('active');
        // model_sign.classList.toggle('active');
        setIsOpenFormSigIn(true);
        setIsActiveSigInContent(true);
      };

      // SignUp
      const btn_signUp: HTMLElement = document.querySelector(
        '.' + cx('btn-signUp')
      ) as HTMLElement;

      btn_signUp.onclick = function () {
        // signUp_content.classList.toggle('active');
        // form_sign.classList.toggle('active');
        // model_sign.classList.toggle('active');
        setIsOpenFormSigIn(true);
        setIsActiveSigUpContent(true);
      };
    } else {
      const btn_logOut: HTMLElement = document.querySelector(
        '.' + cx('btn-logOut')
      ) as HTMLElement;
      btn_logOut.onclick = function () {
        setDataAccount(undefined);
        setUser({});
        setIsOpenFormSigIn(true);
        setIsActiveSigInContent(true);
        window.localStorage.removeItem('userToken');
        window.localStorage.removeItem('isLoggedIn');
      };
    }
  }, [dataAccount]);

  const handleOnClickBtnSearch = (e: any) => {
    if (valueInput !== '') {
      e.preventDefault();
      setIsChangeInput(false);
      // navigate(`/Searh/${valueInput.replace(/\s/g, '-')}/`);
      router.push(`/DefaultPage/Search/${valueInput.replace(/\s/g, '-')}`);
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <meta name="color-scheme" content="light only">  */}
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        {/* <link rel="icon" href="%PUBLIC_URL%/favicon.ico" /> */}
        {/* <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" /> */}

        {/* font-awesome  */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        />

        {/* Google Material-Icons  */}
        <link
          href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
          rel="stylesheet"
        />

        {/* <link
          href="../../../../constants/icons/google-icons/node_modules/material-icons/iconfont/material-icons.css"
          rel="stylesheet"
        /> */}

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>

        <link
          rel="shortcut icon"
          href="/Images/film-reel-dark.png"
          type="image/x-icon"
        />
        <title>PhimHay247</title>
      </Head>
      <header className={cx('header')} id="header">
        <div className={cx('container')} id="start-point">
          <div className={cx('owl-items-header')}>
            <div className={cx('header-brand')}>
              <h1 className={cx('logo')} title="Trang chủ">
                <Link href="/">PhimHay247</Link>
              </h1>
            </div>

            {/* <div className={cx('btn-toggle-navbar')}>
                  <input type="checkbox" className={cx('nav-btn')} id="nav-btn" />
                  <label for="nav-btn" className={cx('nav-icon')}>
                    <span className={cx('nav-icon-main')}></span>
                  </label>
                </div> */}

            <form className={cx('search-bar')} action="" method="GET">
              <input
                className={cx('textbox-SearchFilm')}
                id="textbox-SearchFilm"
                type="text"
                placeholder=""
                autoComplete="off"
                required
                value={valueInput}
                onChange={(e) => handleOnChangeTextSearch(e.target.value)}
              />

              <label
                htmlFor="textbox-SearchFilm"
                className={cx('search-label')}
              >
                {!isFoucusSearch ? 'Nhập tên phim...' : ''}
              </label>

              {isFoucusSearch ? (
                <FontAwesomeIcon
                  className={cx('x-mark')}
                  icon={faXmark}
                  // onClick={handleOnClickXmark}
                />
              ) : null}

              <button
                // type="submit"
                className={cx('btn-SearchFilm')}
                title="Tìm kiếm"
                onMouseDown={handleOnClickBtnSearch}
              >
                <FontAwesomeIcon icon={faSearch} className={cx('fa-search')} />
              </button>

              {isChangeInput ? (
                <SearchRender
                  dataSearch={dataSearch}
                  // setIsChangeInput={setIsChangeInput}
                />
              ) : null}
            </form>

            <div className={cx('account')}>
              {dataAccount ? (
                <div className={cx('account-container')}>
                  <p className={cx('account-username')}>
                    {dataAccount?.user_name}
                  </p>
                  <div className={cx('account-avatar')}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      // src={
                      //   dataAccount?.avatar.length <= 3
                      //     ? getAvatar(dataAccount?.avatar)
                      //     : dataAccount?.avatar
                      // }
                      src={
                        dataAccount.avatar?.length <= 3
                          ? `/Images/account/account${dataAccount.avatar}.jpg`
                          : dataAccount.avatar
                      }
                      alt=""
                    />
                  </div>
                </div>
              ) : null}
              {!dataAccount ? (
                <>
                  <div className={cx('sign')}>
                    <div className={cx('wrapper-sign')}>
                      <span className={cx('btn-signIn')}>Đăng nhập</span>
                    </div>
                    <div className={cx('wrapper-sign')}>
                      <span className={cx('btn-signUp')}>Đăng ký</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className={cx('wrapper-sign')}>
                  <span className={cx('btn-logOut')}>Đăng xuất</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <SignIn
        isOpenFormSigIn={isOpenFormSigIn}
        isActiveSigInContent={isActiveSigInContent}
        isActiveSigUpContent={isActiveSigUpContent}
        setIsOpenFormSigIn={setIsOpenFormSigIn}
        setIsActiveSigInContent={setIsActiveSigInContent}
        setIsActiveSigUpContent={setIsActiveSigUpContent}
        setToastMessage={setToastMessage}
        setDataAccount={setDataAccount}
      />
      <ToastMessage toastMessage={toastMessage} />
    </>
  );
}

export default memo(Header);
