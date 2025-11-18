// musesedo Premium Müzik Player
class musesedoPlayer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentScore = null;
        this.visualObj = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.volumeControl = document.getElementById('volume');
        this.timeDisplay = document.getElementById('time-display');
        this.notationDiv = document.getElementById('notation');
        this.fileUpload = document.getElementById('mscz-upload');
        this.loadScoreBtn = document.getElementById('load-score');
    }

    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.loadScoreBtn.addEventListener('click', () => this.uploadScore());
        
        this.volumeControl.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        // Örnek bir müzik yükle (test için)
        this.loadExampleScore();
    }

    loadExampleScore() {
        // Basit bir ABC notasyon örneği
        const abcNotation = `
X:1
T:Test Müzik Parçası
C:musesedo
M:4/4
L:1/4
K:C
| C D E F | G A B c | c B A G | F E D C |
`;
        this.renderScore(abcNotation);
    }

    renderScore(abcNotation) {
        // ABCJS ile notayı görselleştir
        this.visualObj = ABCJS.renderAbc("notation", abcNotation, {
            responsive: "resize",
            scale: 1.0
        });
        
        this.currentScore = abcNotation;
    }

    play() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isPlaying = true;
        this.updateControls();
        
        // Basit bir demo ses çal
        this.playDemoSound();
        
        console.log("Müzik çalınıyor...");
    }

    pause() {
        this.isPlaying = false;
        this.updateControls();
        console.log("Müzik duraklatıldı");
    }

    stop() {
        this.isPlaying = false;
        this.progressBar.value = 0;
        this.updateTimeDisplay(0, 100);
        this.updateControls();
        console.log("Müzik durduruldu");
    }

    playDemoSound() {
        // Basit bir demo ses (gerçek implementasyon için Tone.js veya Web Audio API)
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 440; // A4 notasının frekansı
        gainNode.gain.value = this.volumeControl.value / 100;
        
        oscillator.start();
        
        // 1 saniye sonra durdur
        setTimeout(() => {
            oscillator.stop();
            if (this.isPlaying) {
                this.playDemoSound(); // Döngü devam etsin
            }
        }, 1000);
    }

    setVolume(volume) {
        console.log(`Ses seviyesi: ${volume}`);
    }

    updateControls() {
        this.playBtn.disabled = this.isPlaying;
        this.pauseBtn.disabled = !this.isPlaying;
    }

    updateTimeDisplay(current, total) {
        const currentTime = this.formatTime(current);
        const totalTime = this.formatTime(total);
        this.timeDisplay.textContent = `${currentTime} / ${totalTime}`;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    uploadScore() {
        const file = this.fileUpload.files[0];
        if (!file) {
            alert('Lütfen bir nota dosyası seçin!');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Burada .mscz dosyasını işleyeceğiz
            console.log('Dosya yüklendi:', file.name);
            alert(`"${file.name}" dosyası yüklendi! (Demo modu)`);
            
            // Geçici olarak örnek bir ABC notasyon göster
            this.loadExampleScore();
        };
        
        reader.readAsArrayBuffer(file);
    }
}

// Player'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new musesedoPlayer();
});

// Mscz dosya işleme için placeholder fonksiyonlar
class MsczProcessor {
    static async processMsczFile(arrayBuffer) {
        // Gerçek .mscz işleme kodu buraya gelecek
        console.log('Mscz dosyası işleniyor...', arrayBuffer);
        return "X:1\nT:İşlenmiş Dosya\nK:C\n| C D E F |";
    }
}
