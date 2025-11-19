// musesedo Müzik Player
class MusesedoPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentScore = null;
        this.visualObj = null;
        this.currentTime = 0;
        this.totalTime = 120; // 2 dakika demo
        
        this.initializeElements();
        this.setupEventListeners();
        this.setupUploadArea();
    }

    initializeElements() {
        // Kontrol elementleri
        this.playBtn = document.getElementById('play-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');
        
        // Progress ve ses
        this.progressBar = document.getElementById('progress-bar');
        this.volumeControl = document.getElementById('volume');
        this.currentTimeDisplay = document.getElementById('current-time');
        this.totalTimeDisplay = document.getElementById('total-time');
        
        // Notasyon
        this.notationDiv = document.getElementById('notation');
        this.scoreTitle = document.querySelector('.score-title');
        this.scoreComposer = document.querySelector('.score-composer');
        
        // Dosya yükleme
        this.fileUpload = document.getElementById('mscz-upload');
        this.uploadTrigger = document.getElementById('upload-trigger');
        this.uploadArea = document.getElementById('upload-area');
    }

    setupEventListeners() {
        // Player kontrolleri
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.prevBtn.addEventListener('click', () => this.previous());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Zoom kontrolleri
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        
        // Progress bar
        this.progressBar.addEventListener('input', (e) => this.seek(e.target.value));
        
        // Ses kontrolü
        this.volumeControl.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });

        // Demo zaman güncellemesi
        this.updateTimeDisplay();
    }

    setupUploadArea() {
        // Upload alanı tıklama
        this.uploadTrigger.addEventListener('click', () => {
            this.fileUpload.click();
        });

        this.uploadArea.addEventListener('click', () => {
            this.fileUpload.click();
        });

        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#3498db';
            this.uploadArea.style.background = '#f8f9fa';
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.style.borderColor = '#dee2e6';
            this.uploadArea.style.background = 'white';
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#dee2e6';
            this.uploadArea.style.background = 'white';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // Dosya seçimi değiştiğinde
        this.fileUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }

    handleFileUpload(file) {
        console.log('Dosya yüklendi:', file.name);
        
        // Demo: Basit bir ABC notasyonu oluştur
        const demoABC = this.createDemoABC(file.name);
        this.loadScore(demoABC, file.name);
        
        // Upload alanını gizle, notayı göster
        this.hideUploadArea();
    }

    createDemoABC(filename) {
        const title = filename.replace('.mscz', '').replace('.mscx', '');
        
        return `
X:1
T:${title}
C:musesedo Demo
M:4/4
L:1/4
K:C
| C D E F | G A B c | c B A G | F E D C |
| E G B d | c A F D | C E G B | A G F E |
| C D E F | G F E D | C C C C | G G G G |
`;
    }

    loadScore(abcNotation, filename) {
        // Önceki notasyonu temizle
        this.notationDiv.innerHTML = '';
        
        // ABC notasyonunu render et
        this.visualObj = ABCJS.renderAbc("notation", abcNotation, {
            responsive: "resize",
            scale: 1.0,
            staffwidth: 800
        });
        
        this.currentScore = abcNotation;
        
        // Başlık ve besteci bilgisini güncelle
        this.updateScoreInfo(filename.replace('.mscz', '').replace('.mscx', ''), 'musesedo Demo');
        
        console.log('Nota yüklendi:', filename);
    }

    updateScoreInfo(title, composer) {
        this.scoreTitle.textContent = title;
        this.scoreComposer.textContent = composer;
    }

    hideUploadArea() {
        this.uploadArea.style.display = 'none';
    }

    showUploadArea() {
        this.uploadArea.style.display = 'block';
    }

    play() {
        this.isPlaying = true;
        this.updateControls();
        console.log('Müzik çalınıyor...');
        
        // Demo: Zamanlayıcı başlat
        this.startDemoTimer();
    }

    pause() {
        this.isPlaying = false;
        this.updateControls();
        console.log('Müzik duraklatıldı');
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.progressBar.value = 0;
        this.updateTimeDisplay();
        this.updateControls();
        console.log('Müzik durduruldu');
    }

    previous() {
        console.log('Önceki nota');
        // Implementasyon için
    }

    next() {
        console.log('Sonraki nota');
        // Implementasyon için
    }

    zoomIn() {
        console.log('Yakınlaştır');
        // Implementasyon için
    }

    zoomOut() {
        console.log('Uzaklaştır');
        // Implementasyon için
    }

    seek(position) {
        this.currentTime = (position / 100) * this.totalTime;
        this.updateTimeDisplay();
        console.log('Konum değiştirildi:', position + '%');
    }

    setVolume(volume) {
        console.log('Ses seviyesi:', Math.round(volume * 100) + '%');
    }

    startDemoTimer() {
        if (this.demoTimer) clearInterval(this.demoTimer);
        
        this.demoTimer = setInterval(() => {
            if (this.isPlaying && this.currentTime < this.totalTime) {
                this.currentTime++;
                const progress = (this.currentTime / this.totalTime) * 100;
                this.progressBar.value = progress;
                this.updateTimeDisplay();
            } else if (this.currentTime >= this.totalTime) {
                this.stop();
            }
        }, 1000);
    }

    updateTimeDisplay() {
        const currentMins = Math.floor(this.currentTime / 60);
        const currentSecs = Math.floor(this.currentTime % 60);
        const totalMins = Math.floor(this.totalTime / 60);
        const totalSecs = Math.floor(this.totalTime % 60);
        
        this.currentTimeDisplay.textContent = 
            `${currentMins}:${currentSecs.toString().padStart(2, '0')}`;
        this.totalTimeDisplay.textContent = 
            `${totalMins}:${totalSecs.toString().padStart(2, '0')}`;
    }

    updateControls() {
        this.playBtn.disabled = this.isPlaying;
        this.pauseBtn.disabled = !this.isPlaying;
        
        // Buton stillerini güncelle
        if (this.isPlaying) {
            this.playBtn.style.opacity = '0.6';
            this.pauseBtn.style.opacity = '1';
        } else {
            this.playBtn.style.opacity = '1';
            this.pauseBtn.style.opacity = '0.6';
        }
    }
}

// Player'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new MusesedoPlayer();
});
