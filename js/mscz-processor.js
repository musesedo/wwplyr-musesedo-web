// musesedo .mscz Dosya İşleyici
class MsczProcessor {
    constructor() {
        this.supportedFormats = ['.mscz', '.mscx', '.xml', '.musicxml'];
    }

    async processMsczFile(file) {
        try {
            console.log('Dosya işleniyor:', file.name);
            
            // Dosya uzantısını kontrol et
            const extension = this.getFileExtension(file.name);
            if (!this.supportedFormats.includes(extension.toLowerCase())) {
                throw new Error('Desteklenmeyen dosya formatı: ' + extension);
            }

            // Dosya türüne göre işleme yönlendir
            switch (extension) {
                case '.mscz':
                    return await this.processMscz(file);
                case '.mscx':
                case '.xml':
                case '.musicxml':
                    return await this.processMusicXML(file);
                default:
                    throw new Error('Bilinmeyen dosya formatı');
            }
        } catch (error) {
            console.error('Dosya işleme hatası:', error);
            throw error;
        }
    }

    async processMscz(file) {
        // .mscz dosyasını işle (MuseScore compressed format)
        // NOT: Gerçek implementasyon için backend API gerekli
        console.log('.mscz dosyası işleniyor:', file.name);
        
        // Demo: Basit bir ABC notasyonu döndür
        return this.createDemoABC(file.name);
    }

    async processMusicXML(file) {
        // MusicXML dosyasını işle
        console.log('MusicXML dosyası işleniyor:', file.name);
        
        const text = await this.readFileAsText(file);
        return this.convertMusicXMLToABC(text);
    }

    async readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    async readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }

    convertMusicXMLToABC(musicXML) {
        // Basit MusicXML → ABC dönüşümü (demo)
        // Gerçek implementasyon için kompleks parser gerekli
        console.log('MusicXML ABC ye dönüştürülüyor...');
        
        // Demo ABC notasyonu
        return `
X:1
T:MusicXML Dönüşümü
C:musesedo Converter
M:4/4
L:1/4
K:C
| C E G c | B G E C | D F A B | G F E D |
| C D E F | G A B c | d c B A | G F E D |
`;
    }

    createDemoABC(filename) {
        // Dosya adına göre demo ABC oluştur
        const title = filename.replace('.mscz', '').replace('.mscx', '');
        
        return `
X:1
T:${title}
C:musesedo Player
M:4/4
L:1/4
K:C
| C D E F | G A B c | c B A G | F E D C |
| E G B d | c A F D | C C C C | G G G G |
`;
    }

    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    // Nota metadata çıkarımı
    extractMetadata(abcNotation) {
        const metadata = {
            title: 'Bilinmeyen Parça',
            composer: 'Bilinmeyen Besteci',
            key: 'C',
            meter: '4/4'
        };

        const lines = abcNotation.split('\n');
        lines.forEach(line => {
            if (line.startsWith('T:')) metadata.title = line.substring(2).trim();
            if (line.startsWith('C:')) metadata.composer = line.substring(2).trim();
            if (line.startsWith('K:')) metadata.key = line.substring(2).trim();
            if (line.startsWith('M:')) metadata.meter = line.substring(2).trim();
        });

        return metadata;
    }
}

// Global erişim için
window.MsczProcessor = MsczProcessor;

// Hızlı test fonksiyonu
MsczProcessor.testProcessor = async function(fileInput) {
    if (!fileInput.files[0]) {
        alert('Lütfen bir dosya seçin!');
        return;
    }

    const processor = new MsczProcessor();
    try {
        const abcNotation = await processor.processMsczFile(fileInput.files[0]);
        const metadata = processor.extractMetadata(abcNotation);
        
        console.log('İşlenen nota:', metadata);
        console.log('ABC Notasyonu:', abcNotation);
        
        return { abcNotation, metadata };
    } catch (error) {
        console.error('İşleme hatası:', error);
        alert('Dosya işlenirken hata: ' + error.message);
    }
};
