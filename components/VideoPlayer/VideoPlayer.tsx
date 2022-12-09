import classNames from 'classnames/bind';
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
  handleWatchList,
} from '../../Services/MovieService';
// import styles from './VideoPlayer.scss';
import axios from 'axios';
import { FilterContext } from '../../Store/FilterContext';
import 'material-icons/iconfont/material-icons.css';

// const cx = classNames.bind(styles);

function VideoPlayer({
  // movieid,
  tap,
  isEpisodes,
  data,
}) {
  const [isFocusVideo, setIsFocusVideo] = useState(false);
  const { user } = useContext(FilterContext);

  useEffect(() => {
    const video_player: HTMLElement = document.querySelector(
      '#video-player'
    ) as HTMLElement;
    const mainVideo: HTMLVideoElement = video_player.querySelector(
      '#main-video'
    ) as HTMLVideoElement;
    const progressAreaTime: HTMLVideoElement = video_player.querySelector(
      '.progressAreaTime'
    ) as HTMLVideoElement;
    const controls: HTMLElement = video_player.querySelector(
      '.controls'
    ) as HTMLElement;
    const controlsList = video_player.querySelector('.controls-list');
    const progressArea: HTMLVideoElement = video_player.querySelector(
      '.progress-area'
    ) as HTMLVideoElement;
    const progress_Bar: HTMLElement = video_player.querySelector(
      '.progress-bar'
    ) as HTMLElement;
    const fast_rewind: HTMLElement = video_player.querySelector(
      '.fast-rewind'
    ) as HTMLElement;
    const play_pause: HTMLElement = video_player.querySelector(
      '.controls-list .play-pause'
    ) as HTMLElement;
    const play_pause_large: HTMLElement = video_player.querySelector(
      '.play-video .play-pause'
    ) as HTMLElement;
    const fast_forward: HTMLElement = video_player.querySelector(
      '.fast-forward'
    ) as HTMLElement;
    const volume: HTMLElement = video_player.querySelector(
      '.volume'
    ) as HTMLElement;
    const volume_range: HTMLInputElement = video_player.querySelector(
      '.volume-range'
    ) as HTMLInputElement;
    const current: HTMLElement = video_player.querySelector(
      '.current'
    ) as HTMLElement;
    const totalDuration: HTMLElement = video_player.querySelector(
      '.duration'
    ) as HTMLElement;
    const auto_play: HTMLElement = video_player.querySelector(
      '.auto-play'
    ) as HTMLElement;
    const settingsBtn: HTMLElement = video_player.querySelector(
      '.settingsBtn'
    ) as HTMLElement;
    const picture_in_picutre: HTMLElement = video_player.querySelector(
      '.picture-in-picutre'
    ) as HTMLElement;
    const fullscreen: HTMLElement = video_player.querySelector(
      '.fullscreen'
    ) as HTMLElement;
    const settings: HTMLElement = video_player.querySelector(
      '#settings'
    ) as HTMLElement;
    const playback: NodeListOf<HTMLElement> =
      video_player.querySelectorAll('.playback li');

    // Play video function
    const playVideo = () => {
      play_pause.innerHTML = 'pause';
      play_pause_large.innerHTML = 'pause';
      // play_pause.title = 'pause';
      video_player.classList.remove('paused');
      mainVideo.play();
      // axios.post(
      //   'https://api.themoviedb.org/3/account/14271386/watchlist?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
      //   {
      //     media_type: 'movie',
      //     media_id: movieid,
      //     watchlist: true,
      //   }
      // );

      handleWatchList(user?.id, {
        media_type: isEpisodes ? 'tv' : 'movie',
        media_id: +data?.id,
        watchlist: true,
      });
    };

    // Pause video function
    const pauseVideo = () => {
      play_pause.innerHTML = 'play_arrow';
      play_pause_large.innerHTML = 'play_arrow';
      // play_pause.title = 'play';
      video_player.classList.add('paused');
      mainVideo.pause();
    };

    mainVideo.onplay = () => {
      playVideo();
    };

    mainVideo.onpause = () => {
      pauseVideo();
    };

    window.onkeydown = function (e) {};

    play_pause.onclick = function () {
      const isVideoPaused = video_player.classList.contains('paused');
      isVideoPaused ? playVideo() : pauseVideo();

      if (isVideoPaused) {
        setTimeout(function () {
          play_pause_large.style.opacity = String(1);
        }, 50);
        setTimeout(function () {
          play_pause_large.style.opacity = String(0);
        }, 150);
      } else {
        play_pause_large.style.opacity = String(1);
      }
    };

    play_pause_large.onclick = function () {
      const isVideoPaused = video_player.classList.contains('paused');
      isVideoPaused ? playVideo() : pauseVideo();
    };

    play_pause_large.onmouseenter = function () {
      play_pause_large.style.opacity = String(1);
    };

    play_pause_large.onmouseleave = function () {
      const isVideoPaused = video_player.classList.contains('paused');
      isVideoPaused
        ? (play_pause_large.style.opacity = String(1))
        : (play_pause_large.style.opacity = String(0));
    };

    mainVideo.onclick = function (e) {
      setIsFocusVideo(true);
      e.stopPropagation();
      const isVideoPaused = video_player.classList.contains('paused');
      isVideoPaused ? playVideo() : pauseVideo();

      if (isVideoPaused) {
        setTimeout(function () {
          play_pause_large.style.opacity = String(1);
        }, 50);
        setTimeout(function () {
          play_pause_large.style.opacity = String(0);
        }, 150);
      } else {
        play_pause_large.style.opacity = String(1);
      }
    };

    // fast_rewind video function
    fast_rewind.onclick = function () {
      mainVideo.currentTime -= 10;
    };

    // fast_forward video function
    fast_forward.onclick = function () {
      mainVideo.currentTime += 10;
    };

    // rewind forward video keydown

    // Load video duration
    function formatDuration(time, durationEl) {
      let hours = String(Math.floor(time / 3600));
      let mins = String(Math.floor(time / 60));
      let seconds = String(Math.floor(time % 60));
      // if seconds are less then 10 then add 0 at the begning
      if (Number(hours) === 0) {
        if (Number(seconds) < 10) {
          seconds = '0' + seconds;
        }
        // seconds < 10 ? (seconds = '0' + seconds) : seconds;
        durationEl.innerHTML = `${mins}:${seconds}`;
      } else {
        if (Number(mins) < 10) {
          mins = '0' + mins;
        }
        // mins < 10 ? (mins = '0' + mins) : mins;
        if (Number(seconds) < 10) {
          seconds = '0' + seconds;
        }
        // seconds < 10 ? (seconds = '0' + seconds) : seconds;
        durationEl.innerHTML = `${hours}:${mins}:${seconds}`;
      }
    }
    // total video duration
    mainVideo.onloadeddata = function (e) {
      const target = e.target as HTMLVideoElement;
      let videoDuration = target.duration;
      formatDuration(videoDuration, totalDuration);
    };

    // Current video duration

    // progressArea width video currentTime change
    mainVideo.ontimeupdate = function (e) {
      const target = e.target as HTMLVideoElement;
      let currentVideoTime = target.currentTime;
      formatDuration(currentVideoTime, current);

      let progressWidth = target.currentTime / target.duration;
      progressArea.style.setProperty(
        '--progress-position',
        progressWidth.toString()
      );
    };

    progressArea.addEventListener('mousemove', handleTimelineUpdate);

    progressArea.addEventListener('mousedown', toggleScrubbing);

    document.addEventListener('mouseup', (e) => {
      if (isScrubbing) toggleScrubbing(e);
    });

    document.addEventListener('mousemove', (e) => {
      if (isScrubbing) handleTimelineUpdate(e);
    });

    let isScrubbing = false;
    let wasPaused;
    function toggleScrubbing(e) {
      const rect = progressArea.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.left), rect.width) / rect.width;
      isScrubbing = e.buttons === 1;
      if (isScrubbing) {
        wasPaused = mainVideo.paused;
        mainVideo.pause();
      } else {
        if (e.buttons !== 2) {
          mainVideo.currentTime = percent * mainVideo.duration;
          if (!wasPaused) mainVideo.play();
        }
      }
      handleTimelineUpdate(e);
    }
    function handleTimelineUpdate(e) {
      const rect = progressArea.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.left), rect.width) / rect.width;
      progressArea.style.setProperty('--preview-position', percent.toString());
      if (isScrubbing) {
        e.preventDefault();
        progressArea.style.setProperty(
          '--progress-position',
          percent.toString()
        );
      }
    }
    // Update progress area time and display block on mouse move
    progressArea.onmousemove = function (e) {
      let progressWidthval = progressArea.clientWidth;
      let x = e.offsetX;
      let videoDuration = mainVideo.duration;
      let progressTime = Math.floor((x / progressWidthval) * videoDuration);
      formatDuration(progressTime, progressAreaTime);
      // progressAreaTime active
      if (x >= progressWidthval - 20) {
        x = progressWidthval - 20;
      } else if (x <= 15) {
        x = 15;
      } else {
        x = e.offsetX;
      }
      progressAreaTime.style.setProperty('--progress-AreaTime', `${x}px`);
      progressAreaTime.style.display = 'block';
    };

    progressArea.onmouseenter = function (e) {
      progress_Bar.style.display = 'block';
    };

    progressArea.onmouseleave = function (e) {
      progressAreaTime.style.display = 'none';
      progress_Bar.style.display = 'none';
    };

    progressArea.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // change volume
    mainVideo.onvolumechange = function () {
      volume_range.value = String(mainVideo.volume);
      if (+volume_range.value === 0) {
        volume_range.value = String(0);
        volume.innerHTML = 'volume_off';
      } else if (+volume_range.value < 0.4) {
        volume.innerHTML = 'volume_down';
      } else {
        volume.innerHTML = 'volume_up';
      }
    };

    volume_range.oninput = (e) => {
      const target = e.target as HTMLInputElement;
      mainVideo.volume = +target.value;
      mainVideo.muted = +target.value === 0;
    };

    volume.onclick = () => {
      if (+volume_range.value === 0) {
        volume_range.value = String(70);
        mainVideo.volume = 0.7;
        volume.innerHTML = 'volume_up';
      } else {
        volume_range.value = String(0);
        mainVideo.volume = 0;
        volume.innerHTML = 'volume_off';
      }
    };

    // Auto play
    auto_play.onclick = function () {
      auto_play.classList.toggle('active');
      if (auto_play.classList.contains('active')) {
        auto_play.title = 'Autoplay is on';
      } else {
        auto_play.title = 'Autoplay is off';
      }
    };

    mainVideo.onended = function () {
      if (auto_play.classList.contains('active')) {
        playVideo();
      } else {
        play_pause.innerHTML = 'replay';
        play_pause.title = 'Replay';
      }
    };

    // Picture in picture
    picture_in_picutre.onclick = function () {
      mainVideo.requestPictureInPicture();
    };

    // Full screen function
    fullscreen.onclick = function () {
      if (!video_player.classList.contains('openFullScreen')) {
        video_player.classList.add('openFullScreen');
        fullscreen.innerHTML = 'fullscreen_exit';
        video_player.requestFullscreen();
      } else {
        video_player.classList.remove('openFullScreen');
        fullscreen.innerHTML = 'fullscreen';
        document.exitFullscreen();
      }
    };

    // Open settings

    settingsBtn.onclick = function () {
      settings.classList.toggle('active');
      settingsBtn.classList.toggle('active');
    };

    // Playback Rate
    function removeActiveClasses(e) {
      e.forEach((event) => {
        event.classList.remove('active');
      });
    }

    playback.forEach((event) => {
      event.onclick = () => {
        removeActiveClasses(playback);
        event.classList.add('active');
        let speed = event.getAttribute('data-speed');
        mainVideo.playbackRate = +speed;
      };
    });

    // Mouse controls
    var isCollapsed = false;
    controls.onmouseenter = () => {
      controls.classList.add('active');
      isCollapsed = true;
      clearInterval(timeOutClick);
      clearInterval(timeOutMouseenter);
    };

    controls.onmouseenter = () => {
      controls.classList.add('active');
      isCollapsed = true;
      clearInterval(timeOutClick);
      clearInterval(timeOutMouseenter);
    };

    controls.onmouseleave = () => {
      isCollapsed = false;
      if (video_player.classList.contains('paused')) {
        controls.classList.add('active');
      } else {
        controls.classList.add('active');
        clearInterval(timeOutClick);
        timeOutMouseenter = window.setTimeout(() => {
          controls.classList.remove('active');
        }, 5000);
      }
    };

    var timeOutMouseenter = 0;
    video_player.onmouseenter = () => {
      if (video_player.classList.contains('paused')) {
        controls.classList.add('active');
      } else {
        controls.classList.add('active');
        clearInterval(timeOutClick);
        timeOutMouseenter = window.setTimeout(() => {
          controls.classList.remove('active');
        }, 5000);
      }
    };

    var timeOutClick = 0;
    video_player.onclick = (e) => {
      setIsFocusVideo(true);
      e.stopPropagation();
      if (video_player.classList.contains('paused')) {
        controls.classList.add('active');
      } else {
        controls.classList.add('active');
        clearInterval(timeOutMouseenter);
        timeOutClick = window.setTimeout(() => {
          controls.classList.remove('active');
        }, 5000);
      }
    };

    video_player.onmouseleave = () => {
      if (video_player.classList.contains('paused')) {
        controls.classList.add('active');
      }
    };

    window.onclick = () => {
      setIsFocusVideo(false);
    };

    // prevent user right click to check menu property
    video_player.oncontextmenu = (e) => {
      e.preventDefault();
    };
  }, [isEpisodes || tap]);

  useEffect(() => {
    const video_player = document.querySelector('#video-player');
    const mainVideo: HTMLVideoElement = video_player.querySelector(
      '#main-video'
    ) as HTMLVideoElement;
    const controls = video_player.querySelector('.controls');
    const play_pause = video_player.querySelector('.controls-list .play-pause');
    const play_pause_large: HTMLElement = video_player.querySelector(
      '.play-video .play-pause'
    ) as HTMLElement;

    // Play video function
    const playVideo = () => {
      play_pause.innerHTML = 'pause';
      play_pause_large.innerHTML = 'pause';
      // play_pause.title = 'pause';
      video_player.classList.remove('paused');
      mainVideo.play();

      handleWatchList(user?.id, {
        media_type: isEpisodes ? 'tv' : 'movie',
        media_id: +data?.id,
        watchlist: true,
      });
    };

    // Pause video function
    const pauseVideo = () => {
      play_pause.innerHTML = 'play_arrow';
      play_pause_large.innerHTML = 'play_arrow';
      // play_pause.title = 'play';
      video_player.classList.add('paused');
      mainVideo.pause();
    };

    window.onkeydown = function (e) {
      if (isFocusVideo === true) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          mainVideo.currentTime += 10;
          play_pause_large.style.opacity = String(0);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          mainVideo.currentTime -= 10;
          play_pause_large.style.opacity = String(0);
        }

        const isVideoPaused = video_player.classList.contains('paused');
        if (isVideoPaused) {
          if (e.keyCode === 32) {
            e.preventDefault();
            playVideo();
            if (isVideoPaused) {
              setTimeout(function () {
                play_pause_large.style.opacity = String(1);
              }, 50);
              setTimeout(function () {
                play_pause_large.style.opacity = String(0);
              }, 150);
            } else {
              play_pause_large.style.opacity = String(1);
            }
            if (video_player.classList.contains('paused')) {
              controls.classList.add('active');
            } else {
              controls.classList.remove('active');
            }
          }
        } else {
          if (e.keyCode === 32) {
            e.preventDefault();
            pauseVideo();
            if (isVideoPaused) {
              setTimeout(function () {
                play_pause_large.style.opacity = String(1);
              }, 50);
              setTimeout(function () {
                play_pause_large.style.opacity = String(0);
              }, 150);
            } else {
              play_pause_large.style.opacity = String(1);
            }
            if (video_player.classList.contains('paused')) {
              controls.classList.add('active');
            } else {
              controls.classList.remove('active');
            }
          }
        }
      }
    };
  }, [isFocusVideo || isEpisodes || tap]);

  return (
    <section className="video-body">
      <div className="video-body-container">
        <div id="video-player" className="paused">
          <video preload="metadata" id="main-video">
            <source
              src={
                // ''
                !isEpisodes
                  ? '/Videos/River flows in you Remix - Walker Style.mp4'
                  : `/Videos/televisons_film/The_Witcher_S1_Ep${
                      tap <= 8 ? tap : 8
                    }.mp4`
              }
              type="video/mp4"
            />
          </video>
          <span className="play-video">
            <i className="material-icons play-pause">play_arrow</i>
          </span>
          <p className="caption-text"></p>
          <div className="progressAreaTime">0:00</div>

          <div className="controls">
            <div className="progress-area">
              <div className="progress-bar"></div>
            </div>

            <div className="controls-list">
              <div className="controls-left">
                <span className="icon">
                  <i className="material-icons fast-rewind" title="Back 10s">
                    replay_10
                  </i>
                </span>

                <span className="icon">
                  <i className="material-icons play-pause">play_arrow</i>
                </span>

                <span className="icon">
                  <i className="material-icons fast-forward" title="Next 10s">
                    forward_10
                  </i>
                </span>

                <span className="icon">
                  <i className="material-icons volume">volume_up</i>

                  <input
                    className="volume-range"
                    type="range"
                    min="0"
                    max="1"
                    step="any"
                  />
                </span>

                <div className="timer">
                  <span className="current">0:00</span>
                  <span> / </span>
                  <span className="duration">0:00</span>
                </div>
              </div>

              <div className="controls-right">
                <span className="icon">
                  <i className="material-icons auto-play"></i>
                </span>

                <span className="icon">
                  <i className="material-icons settingsBtn">settings</i>
                </span>

                <span className="icon">
                  <i className="material-icons picture-in-picutre">
                    picture_in_picture_alt
                  </i>
                </span>

                <span className="icon">
                  <i className="material-icons fullscreen">fullscreen</i>
                </span>
              </div>
            </div>
          </div>

          <div id="settings">
            <div className="playback">
              <span>Playback Speed</span>
              <ul>
                <li data-speed="0.25">0.25</li>

                <li data-speed="0.5">0.5</li>

                <li data-speed="0.75">0.75</li>

                <li data-speed="1" className="active">
                  Normal
                </li>

                <li data-speed="1.25">1.25</li>

                <li data-speed="1.5">1.5</li>

                <li data-speed="1.75">1.75</li>

                <li data-speed="2">2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(VideoPlayer);
