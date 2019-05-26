// 获取音频资源，控制音频的播放与暂停
(function ($, root) {
    // play pause getAudio
    function AudioManager () {
        // create audio
        this.audio = new Audio();
        // this.src = src;
        this.status = 'pause'; // audio 默认状态

    };

    AudioManager.prototype = {
        play: function () {
            this.audio.play();
            this.status = 'play';
        },
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        getAudio: function (src) {
            // console.log(src);
            this.audio.src = src;
            this.audio.load(); // 加载
        },
        playTo: function (time) {
            this.audio.currentTime = time;
        }
    }

    // root.audioManager = AudioManager;
    root.audioManager = new AudioManager();

})(window.Zepto, window.player ||( window.player = {}))