import classNames from 'classnames/bind';
import {
  faUser,
  faAt,
  faEye,
  faEyeSlash,
  faLock,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getMovieById,
  getMovieSeriesById,
  signIn,
  signUp,
} from '../../Services/MovieService';
import styles from './SignIn.module.scss';
import axios from 'axios';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import md5 from 'md5';
import { FilterContext } from '../../Store/FilterContext';

const cx = classNames.bind(styles);

function SingIn({
  isOpenFormSigIn,
  isActiveSigInContent,
  isActiveSigUpContent,
  setIsOpenFormSigIn,
  setIsActiveSigInContent,
  setIsActiveSigUpContent,
  setToastMessage,
  setDataAccount,
}) {
  const [isEye1Slash, setIsEye1Slash] = useState(false);
  const [isEye2Slash, setIsEye2Slash] = useState(false);
  const [isEye3Slash, setIsEye3Slash] = useState(false);
  const [isError, setIsError] = useState(false);
  const { setUser } = useContext(FilterContext);

  useEffect(() => {
    const eye1: HTMLElement = document.querySelector(
      '#eye-signin .' + cx('fa-eye')
    ) as HTMLElement;
    const input_password_signin = document.querySelector(
      '.' + cx('group-input-password-signin')
    );
    // eye password sign in
    eye1.onclick = function () {
      // eye1.classList.toggle('fa-eye-slash');
      setIsEye1Slash(!isEye1Slash);
      if (!isEye1Slash) {
        input_password_signin.setAttribute('type', 'text');
      } else {
        input_password_signin.setAttribute('type', 'password');
      }
    };

    const eye2: HTMLElement = document.querySelector(
      '#eye-singup .' + cx('fa-eye')
    ) as HTMLElement;
    const input_password_signup = document.querySelector(
      '.' + cx('group-input-password-signup')
    );

    // eye password sign up
    eye2.onclick = function () {
      // eye2.classList.toggle('fa-eye-slash');
      setIsEye2Slash(!isEye2Slash);
      if (!isEye2Slash) {
        input_password_signup.setAttribute('type', 'text');
      } else {
        input_password_signup.setAttribute('type', 'password');
      }
    };

    // eye retype password sign up
    const eye3: HTMLElement = document.querySelector(
      '#eye-singup-retype .' + cx('fa-eye')
    ) as HTMLElement;
    const retype_input_password_signup = document.querySelector(
      '.' + cx('group-retype-input-password-signup')
    );

    eye3.onclick = function () {
      // eye3.classList.toggle('fa-eye-slash');
      setIsEye3Slash(!isEye3Slash);
      if (!isEye3Slash) {
        retype_input_password_signup.setAttribute('type', 'text');
      } else {
        retype_input_password_signup.setAttribute('type', 'password');
      }
    };

    const signIn_content = document.querySelector('.' + cx('signIn-content'));
    const form_sign = document.querySelector('.' + cx('form-sign'));
    const model_sign = document.querySelector('.' + cx('model-sign'));
    const signUp_content = document.querySelector('.' + cx('signUp-content'));

    //txt_signIn active
    const txt_signIn: HTMLElement = document.querySelector(
      '.' + cx('txt-signIn')
    ) as HTMLElement;
    txt_signIn.onclick = function () {
      setIsActiveSigUpContent(false);
      setIsActiveSigInContent(true);
    };

    //txt_signUp active
    const txt_signUp: HTMLElement = document.querySelector(
      '.' + cx('txt-signUp')
    ) as HTMLElement;
    txt_signUp.onclick = function () {
      setIsActiveSigInContent(false);
      setIsActiveSigUpContent(true);
    };

    //x-mark active: disable form, clear text
    const xmark: HTMLElement = document.querySelector(
      '.' + cx('model-sign') + ' .' + cx('fa-xmark')
    ) as HTMLElement;
    const input: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      'input[type ="text"]'
    );
    const input_Email: NodeListOf<HTMLInputElement> = document.querySelectorAll(
      'input[type ="email"]'
    );
    const input_Password: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('input[type ="password"]');
    const sign_wrapper = document.querySelectorAll('.' + cx('sign-wrapper'));

    xmark.onclick = function () {
      // model_sign.classList.remove(cx('active'));
      // form_sign.classList.remove(cx('active'));
      // signIn_content.classList.remove(cx('active'));
      // signUp_content.classList.remove(cx('active'));
      setIsOpenFormSigIn(false);
      setIsActiveSigInContent(false);
      setIsActiveSigUpContent(false);

      sign_wrapper.forEach(function (sign_wrapper) {
        sign_wrapper.classList.remove('.' + cx('error'));
      });

      input.forEach(function (input) {
        input.value = null;
      });
      input_Email.forEach(function (input_Email) {
        input_Email.value = null;
      });
      input_Password.forEach(function (input_Password) {
        input_Password.value = null;
      });
    };
  }, [isEye1Slash || isEye2Slash || isEye3Slash]);

  useEffect(() => {
    function Validator(options) {
      // Object lưu các rule

      var selectorRules = {};

      function validate(inputElement, rule) {
        // var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement;
        var rules = selectorRules[rule.selector];
        // Lặp các rule và kiểm trailer
        // Nếu có lỗi dừng kiểm tra

        var errorMessage;
        for (var i = 0; i < rules.length; i++) {
          errorMessage = rules[i](inputElement.value);

          if (errorMessage) break;
        }

        if (errorMessage) {
          setIsError(true);
          errorElement.nextElementSibling.innerHTML = errorMessage;
          errorElement.classList.add(cx('error'));
        } else {
          setIsError(false);
          errorElement.nextElementSibling.innerHTML = '';
          errorElement.classList.remove(cx('error'));
        }
      }

      var form_SignIn_Elememt = document.querySelector(options.form_SignIn);
      var form_SignUp_Elememt = document.querySelector(options.form_SignUp);

      if (form_SignIn_Elememt && form_SignUp_Elememt) {
        // Lắng nghe khi submit form_SignIn_Elememt
        form_SignIn_Elememt.onsubmit = function (e) {
          e.preventDefault();
          options.rules.forEach(function (rule) {
            var inputElement_signIn = form_SignIn_Elememt.querySelector(
              rule.selector
            );
            if (inputElement_signIn) {
              validate(inputElement_signIn, rule);
            }
          });
          if (isError === false) {
            const email: HTMLInputElement = document.getElementById(
              'group-input-email-signin'
            ) as HTMLInputElement;
            const password: HTMLInputElement = document.getElementById(
              'group-input-password-signin'
            ) as HTMLInputElement;

            signIn({
              email: email.value,
              password: md5(password.value),
              user_token: token(),
            })
              .then((response) => {
                if (response.data?.success === false) {
                  email.parentElement.nextElementSibling.innerHTML =
                    '* Tài khoản không tồn tại';
                  email.parentElement.classList.add(cx('error'));
                } else {
                  if (response.data.isLogin === true) {
                    setDataAccount(response?.data.result);
                    setUser(response?.data.result);
                    setIsOpenFormSigIn(false);
                    setIsActiveSigInContent(false);
                    window.localStorage.setItem(
                      'userToken',
                      response?.data.result.user_token
                    );
                    window.localStorage.setItem('isLoggedIn', 'true');
                    password.parentElement.nextElementSibling.innerHTML = '';
                    password.parentElement.classList.remove(cx('error'));
                  } else {
                    password.parentElement.nextElementSibling.innerHTML =
                      '* Sai mật khẩu';
                    password.parentElement.classList.add(cx('error'));
                  }
                }
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          }
        };

        // Lắng nghe khi submit form_SignUp_Elememt
        form_SignUp_Elememt.onsubmit = function (e) {
          e.preventDefault();
          options.rules.forEach(function (rule) {
            var inputElement_signUp = form_SignUp_Elememt.querySelector(
              rule.selector
            );
            if (inputElement_signUp) {
              validate(inputElement_signUp, rule);
            }
          });

          if (isError === false) {
            const username: HTMLInputElement = document.getElementById(
              'group-input-username'
            ) as HTMLInputElement;
            const email: HTMLInputElement = document.getElementById(
              'group-input-email-signup'
            ) as HTMLInputElement;
            const password: HTMLInputElement = document.getElementById(
              'group-retype-input-password-signup'
            ) as HTMLInputElement;

            signUp({
              id: Date.now(),
              user_name: username.value,
              email: email.value,
              password: md5(password.value),
              created_by: username.value,
              avatar: `${Math.floor(Math.random() * 10) + 1}`,
              user_token: token(),
            })
              .then((response) => {
                if (response.data.isSignUp === true) {
                  email.parentElement.nextElementSibling.innerHTML = '';
                  email.parentElement.classList.remove(cx('error'));
                  setToastMessage({
                    title: 'Thành công!',
                    message:
                      'Bạn đã đăng ký thành công tài khoản tại PhimHay247.',
                    type: 'success',
                    duration: 7000,
                  });
                } else {
                  email.parentElement.nextElementSibling.innerHTML =
                    '* Email đã tồn tại';
                  email.parentElement.classList.add(cx('error'));
                }
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          }
        };

        options.rules.forEach(function (rule) {
          // Lưu lại các rules cho mỗi input
          if (Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule.test);
          } else {
            selectorRules[rule.selector] = [rule.test];
          }

          var inputElement_signIn = form_SignIn_Elememt.querySelector(
            rule.selector
          );

          if (inputElement_signIn) {
            inputElement_signIn.onblur = function () {
              validate(inputElement_signIn, rule);
            };

            inputElement_signIn.oninput = function () {
              var errorElement = inputElement_signIn.parentElement;

              errorElement.nextElementSibling.innerHTML = '';
              errorElement.classList.remove(cx('error'));
            };
          }

          var inputElement_signUp = form_SignUp_Elememt.querySelector(
            rule.selector
          );
          if (inputElement_signUp) {
            inputElement_signUp.onblur = function () {
              validate(inputElement_signUp, rule);
            };

            inputElement_signUp.oninput = function () {
              var errorElement = inputElement_signUp.parentElement;

              errorElement.nextElementSibling.innerHTML = '';
              errorElement.classList.remove(cx('error'));
            };
          }
        });
      }
    }

    Validator.isRequired = function (selector, message) {
      return {
        selector: selector,
        test: function (value) {
          return value.trim()
            ? undefined
            : message || '* Vui lòng nhập trường này';
        },
      };
    };

    Validator.isEmail = function (selector, message) {
      return {
        selector: selector,
        test: function (value) {
          var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return regex.test(value) ? undefined : '* Vui lòng nhập Email';
        },
      };
    };

    Validator.minLength = function (selector, min, message) {
      return {
        selector: selector,
        test: function (value) {
          return value.length >= min
            ? undefined
            : message || `* Vui nhập tối thiểu ${min} kí tự`;
        },
      };
    };

    Validator.isConfirmed = function (selector, getConfirmValue, message) {
      return {
        selector: selector,
        test: function (value) {
          return value === getConfirmValue()
            ? undefined
            : message || '* Giá trị nhập vào không chính xác';
        },
      };
    };

    Validator({
      form_SignIn: '#form-signIn',
      form_SignUp: '#form-signUp',
      rules: [
        Validator.isRequired('#group-input-username', undefined),
        Validator.isRequired(
          '#group-input-username',
          '* Vui lòng nhập tên đầy đủ của bạn'
        ),
        Validator.isRequired('#group-input-email-signin', undefined),
        Validator.isRequired('#group-input-password-signin', undefined),
        Validator.isRequired('#group-input-email-signup', undefined),
        Validator.isRequired('#group-input-password-signup', undefined),
        Validator.isRequired('#group-retype-input-password-signup', undefined),

        Validator.isEmail('#group-input-email-signin', undefined),
        Validator.minLength('#group-input-password-signin', 6, undefined),
        Validator.isEmail('#group-input-email-signup', undefined),
        Validator.minLength('#group-input-password-signup', 6, undefined),
        Validator.isConfirmed(
          '#group-retype-input-password-signup',
          function () {
            return (
              document.querySelector(
                '#group-input-password-signup'
              ) as HTMLInputElement
            ).value;
          },
          '* Mật khẩu nhập lại không chính xác'
        ),
      ],
    });
  }, []);

  const responseFacebook = (response) => {
    signIn({
      id: response.userID,
      user_name: response.name,
      avatar: response.picture.data.url,
      user_token: response.accessToken,
    })
      .then((responseAccount) => {
        if (responseAccount.data?.isLogin === true) {
          setDataAccount(responseAccount?.data.result);
          setUser(responseAccount?.data.result);
          setIsOpenFormSigIn(false);
          setIsActiveSigInContent(false);
          window.localStorage.setItem(
            'userToken',
            responseAccount?.data.result.user_token
          );
          window.localStorage.setItem('isLoggedIn', 'true');
        }
        if (responseAccount.data?.isSignUp === true) {
          setDataAccount({
            id: response.userID,
            user_name: response.name,
            avatar: response.picture.data.url,
            user_token: response.accessToken,
          });
          setIsOpenFormSigIn(false);
          setIsActiveSigInContent(false);
          setToastMessage({
            title: 'Thành công!',
            message: 'Bạn đã đăng ký thành công tài khoản tại PhimHay247.',
            type: 'success',
            duration: 7000,
          });
          window.localStorage.setItem(
            'userToken',
            responseAccount?.data.result.user_token
          );
          window.localStorage.setItem('isLoggedIn', 'true');
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  };

  const rand = function () {
    return Math.random().toString(36).substring(2); // remove `0.`
  };

  const token = function () {
    return rand() + rand() + rand() + rand(); // to make it longer
  };

  return (
    <div
      className={cx('model-sign', {
        active: isOpenFormSigIn,
      })}
    >
      <div
        className={cx('form-sign', {
          active: isOpenFormSigIn,
        })}
      >
        {/* <i className={cx('fa-solid fa-xmark')}></i> */}
        <FontAwesomeIcon className={cx('fa-xmark')} icon={faXmark} />
        <div className={cx('form-sign-body')}>
          <form
            action=""
            method="POST"
            className={cx('signIn-content', {
              active: isActiveSigInContent,
            })}
            id="form-signIn"
          >
            <h2>Sign In</h2>

            <div className={cx('form-input')}>
              <label htmlFor="group-input-email-signin">Email</label>
              <div className={cx('sign-wrapper')}>
                {/* <i className={cx('fa-regular fa-at')}></i> */}
                <FontAwesomeIcon className={cx('fa-at')} icon={faAt} />
                <input
                  type="email"
                  className={cx('group-input-email-signin')}
                  id="group-input-email-signin"
                  placeholder="Nhập Email"
                />
              </div>
              <span className={cx('form-message')}></span>
            </div>

            <div className={cx('form-input')}>
              <label htmlFor="group-input-password-signin">Mật khẩu</label>
              <div className={cx('sign-wrapper')}>
                {/* <i className={cx('fa-solid fa-lock')}></i> */}
                <FontAwesomeIcon className={cx('fa-lock')} icon={faLock} />
                <input
                  type="password"
                  className={cx('group-input-password-signin')}
                  id="group-input-password-signin"
                  placeholder="Nhập mật khẩu"
                />
                <div
                  id="eye-signin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                  }}
                >
                  {/* <i className={cx('fa-regular fa-eye')}></i> */}
                  <FontAwesomeIcon
                    className={cx('fa-eye')}
                    icon={isEye1Slash === false ? faEye : faEyeSlash}
                  />
                </div>
              </div>
              <span className={cx('form-message')}></span>
            </div>

            <input
              className={cx('submit-sign')}
              type="submit"
              value="Đăng nhập"
            />

            <div className={cx('notity-sign')}>
              <p>
                Bạn chưa có tài khoản?
                <span className={cx('txt-signUp')}> Đăng ký</span>
              </p>
            </div>

            <FacebookLogin
              appId="820070179113499"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              render={(renderProps) => (
                <div
                  onClick={renderProps.onClick}
                  className={cx('sign-facebook')}
                >
                  <p>
                    <FontAwesomeIcon
                      className={cx('fa-facebook-f')}
                      icon={faFacebookF}
                    />
                    Đăng nhập bằng Facebook
                  </p>
                </div>
              )}
            />

            {/* <i className={cx('fa-brands fa-facebook-f')}></i> */}
            {/* <div className={cx('sign-facebook')}>
              <a href="">

              <FontAwesomeIcon
                  className={cx('fa-facebook-f')}
                  icon={faFacebookF}
                />
                Đăng nhập bằng Facebook
              </a>
            </div> */}

            <div className={cx('sign-google')}>
              <p>
                {/* <i className={cx('fa-brands fa-google')}></i> */}
                <FontAwesomeIcon className={cx('fa-google')} icon={faGoogle} />
                Đăng nhập bằng Google
              </p>
            </div>
          </form>

          <form
            action=""
            method="POST"
            className={cx('signUp-content', {
              active: isActiveSigUpContent,
            })}
            id="form-signUp"
          >
            <h2>Sign Up</h2>

            <div className={cx('form-input')}>
              <label htmlFor="group-input-username">Tên đầy đủ</label>
              <div className={cx('sign-wrapper')}>
                {/* <i className={cx('fa-regular fa-user')}></i> */}
                <FontAwesomeIcon className={cx('fa-user')} icon={faUser} />
                <input
                  type="text"
                  className={cx('group-input-username')}
                  id="group-input-username"
                  placeholder="Nhập tên đầy đủ"
                />
              </div>
              <span className={cx('form-message')}></span>
            </div>

            <div className={cx('form-input')}>
              <label htmlFor="group-input-email-signup">Email</label>
              <div className={cx('sign-wrapper')}>
                {/* <i className={cx('fa-regular fa-at')}></i> */}
                <FontAwesomeIcon className={cx('fa-at')} icon={faAt} />
                <input
                  type="email"
                  className={cx('group-input-email-signup')}
                  id="group-input-email-signup"
                  placeholder="Nhập Email"
                />
              </div>
              <span className={cx('form-message')}></span>
            </div>

            <div className={cx('form-input')}>
              <label htmlFor="group-input-password-signup">Mật khẩu</label>
              <div className={cx('sign-wrapper')}>
                {/* <i className={cx('fa-solid fa-lock')}></i> */}
                <FontAwesomeIcon className={cx('fa-lock')} icon={faLock} />
                <input
                  type="password"
                  className={cx('group-input-password-signup')}
                  id="group-input-password-signup"
                  placeholder="Nhập mật khẩu"
                />
                <div
                  id="eye-singup"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                  }}
                >
                  {/* <i className={cx('fa-regular fa-eye')}></i> */}
                  <FontAwesomeIcon
                    className={cx('fa-eye')}
                    icon={isEye2Slash === false ? faEye : faEyeSlash}
                  />
                </div>
              </div>
              <span className={cx('form-message')}></span>
            </div>

            <div className={cx('form-input')}>
              <label htmlFor="group-retype-input-password-signup">
                Nhập lại mật khẩu
              </label>
              <div className={cx('sign-wrapper')}>
                {/* <i className={cx('fa-solid fa-lock')}></i> */}
                <FontAwesomeIcon className={cx('fa-lock')} icon={faLock} />
                <input
                  type="password"
                  className={cx('group-retype-input-password-signup')}
                  id="group-retype-input-password-signup"
                  placeholder="Nhập lại mật khẩu"
                />
                <div
                  id="eye-singup-retype"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                  }}
                >
                  {/* <i className={cx('fa-regular fa-eye')}></i> */}
                  <FontAwesomeIcon
                    className={cx('fa-eye')}
                    icon={isEye3Slash === false ? faEye : faEyeSlash}
                  />
                </div>
              </div>
              <span className={cx('form-message')}></span>
            </div>

            <input
              className={cx('submit-sign')}
              type="submit"
              value="Đăng ký"
            />

            <div className={cx('notity-sign')}>
              <p>
                Bạn đã có tài khoản?
                <span className={cx('txt-signIn')}> Đăng nhập</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default memo(SingIn);
