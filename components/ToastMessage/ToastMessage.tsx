import styles from './ToastMessage.module.scss';
import classNames from 'classnames/bind';
import {
  faCheckCircle,
  faInfoCircle,
  faExclamationCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { memo, useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function ToastMessage({ toastMessage }) {
  useEffect(() => {
    const main = document.querySelector('.' + cx('toast-container'));
    if (main) {
      const toast = document.createElement('div');

      // Auto remove toast
      const autoRemoveId = setTimeout(function () {
        main.removeChild(toast);
      }, toastMessage.duration + 1000);

      // Remove toast when clicked
      toast.onclick = function (e) {
        const target = e.target as HTMLElement;
        if (target.closest(cx('.' + cx('toast__close')))) {
          main.removeChild(toast);
          clearTimeout(autoRemoveId);
        }
      };

      const icons = {
        success: 'fas fa-check-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-circle',
        error: 'fas fa-exclamation-circle',
      };
      const icon = icons[toastMessage.type];
      const delay = (toastMessage.duration / 1000).toFixed(2);

      toast.classList.add(cx('toast'), cx(`toast--${toastMessage.type}`));

      toast.innerHTML = `<div class=${cx('toast__icon')}>
                        <i class="${icon}"></i>
                        </div>
                        <div class=${cx('toast__body')}>
                            <h3 class=${cx('toast__title')}>${
        toastMessage.title
      }</h3>
                            <p class=${cx('toast__msg')}>${
        toastMessage.message
      }</p>
                        </div>
                        <div class=${cx('toast__close')}>
                        <i class="fas fa-times"></i>
                        </div>`;

      main.appendChild(toast);
    }
  }, [toastMessage]);

  return <div className={cx('toast-container')}></div>;
}

export default memo(ToastMessage);
