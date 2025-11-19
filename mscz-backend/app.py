from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import subprocess
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/convert-mscz', methods=['POST'])
def convert_mscz():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Dosya yüklenmedi'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Dosya seçilmedi'}), 400
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mscz') as temp_mscz:
            file.save(temp_mscz.name)
            
            temp_xml = tempfile.NamedTemporaryFile(delete=False, suffix='.musicxml')
            temp_xml.close()
            
            try:
                subprocess.run([
                    '/home/aob/İndirilenler/MuseScore-3.6.2.548021370-x86_64.AppImage', 
                    '-o', temp_xml.name, 
                    temp_mscz.name
                ], check=True, timeout=30)
                
                abc_notation = musicxml_to_abc(temp_xml.name)
                
                return jsonify({
                    'success': True,
                    'abc': abc_notation,
                    'filename': file.filename
                })
                
            except subprocess.TimeoutExpired:
                return jsonify({'error': 'Dönüşüm zaman aşımı'}), 500
            except Exception as e:
                return jsonify({'error': f'MuseScore hatası: {str(e)}'}), 500
            finally:
                os.unlink(temp_mscz.name)
                if os.path.exists(temp_xml.name):
                    os.unlink(temp_xml.name)
                    
    except Exception as e:
        return jsonify({'error': f'Server hatası: {str(e)}'}), 500

def musicxml_to_abc(xml_file_path):
    return "X:1\nT:Converted Score\nM:4/4\nL:1/4\nK:C\n| C D E F | G A B c |"

if __name__ == '__main__':
    app.run(debug=True, port=5000)
