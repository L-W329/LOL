export default function Home() {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Razrai AI 生成工具｜图生图 & 图生视频</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{__html:`
        .loading-spin {
            animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
        #previewImg {
            max-height:320px;
        }
        `}} />
      </head>
      <body className="bg-gray-100 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Razrai AI 生成工具｜图生图 & 图生视频</h1>

            {/* 模式切换 */}
            <div className="mb-5">
                <label className="font-medium">生成模式</label>
                <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-1">
                        <input type="radio" name="mode" value="image" checked className="modeRadio"> 图生图
                    </label>
                    <label className="flex items-center gap-1">
                        <input type="radio" name="mode" value="video" className="modeRadio"> 图生视频
                    </label>
                </div>
            </div>

            {/* 图片上传区域 */}
            <div className="mb-5">
                <label className="block font-medium mb-1">参考图片（可选，最大800KB，前端自动压缩）</label>
                <div id="dropArea" className="border-2 border-dashed border-gray-400 rounded p-6 text-center cursor-pointer hover:bg-gray-50">
                    <p>点击或拖拽图片到此处上传</p>
                    <input type="file" id="imgFile" accept="image/*" className="hidden">
                </div>
                <div id="previewWrap" className="mt-3 hidden">
                    <img id="previewImg" className="rounded border">
                    <p className="text-xs mt-1">压缩后大小：<span id="imgSize">0</span> KB</p>
                </div>
            </div>

            {/* 提示词 */}
            <div className="mb-5">
                <label className="block font-medium mb-1">提示词（必填，1~4000字符）</label>
                <textarea id="prompt" rows="3" placeholder="例如：Animate this reference image with a slow camera move"
                    className="w-full border border-gray-300 rounded px-3 py-2 resize-y"></textarea>
            </div>

            {/* 图生视频参数组 */}
            <div id="videoParams" className="mb-5 hidden border p-4 rounded bg-gray-50">
                <h3 className="font-semibold mb-3">视频参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm">时长 seconds</label>
                        <select id="vidSeconds" className="w-full border rounded px-2 py-1">
                            <option value="5">5秒</option>
                            <option value="8">8秒</option>
                            <option value="10" selected>10秒</option>
                            <option value="12">12秒</option>
                            <option value="15">15秒</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm">画幅 aspect_ratio</label>
                        <select id="vidAspect" className="w-full border rounded px-2 py-1">
                            <option value="16:9 (Widescreen)" selected>16:9 宽屏</option>
                            <option value="9:16">9:16 竖屏</option>
                            <option value="1:1">1:1 正方形</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm">megapixels 清晰度</label>
                        <select id="vidMega" className="w-full border rounded px-2 py-1">
                            <option value="0.5">0.5</option>
                            <option value="0.6" selected>0.6</option>
                            <option value="0.7">0.7</option>
                            <option value="0.8">0.8</option>
                            <option value="0.9">0.9</option>
                            <option value="1">1.0</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm">超分 super_resolution</label>
                        <select id="vidSuper" className="w-full border rounded px-2 py-1">
                            <option value="false" selected>关闭</option>
                            <option value="true">开启</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 图生图参数 */}
            <div id="imgParams" className="mb-5 border p-4 rounded bg-gray-50">
                <h3 className="font-semibold mb-3">图像参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm">尺寸 size</label>
                        <select id="imgSizeSel" className="w-full border rounded px-2 py-1">
                            <option value="1024x1024" selected>1024×1024</option>
                            <option value="1280x720">1280×720</option>
                            <option value="1792x1024">1792×1024</option>
                            <option value="1024x1792">1024×1792</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm">水印 watermark</label>
                        <select id="imgWatermark" className="w-full border rounded px-2 py-1">
                            <option value="false" selected>关闭水印</option>
                            <option value="true">开启水印</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* 提交按钮 */}
            <div className="mb-5">
                <button id="submitBtn" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
                    开始生成
                </button>
            </div>

            {/* 日志与结果区域 */}
            <div className="mb-3">
                <h3 className="font-medium">运行日志</h3>
                <div id="logBox" className="bg-black text-green-400 p-3 rounded h-40 overflow-y-auto text-sm font-mono">等待操作...</div>
            </div>
            <div id="resultBox" className="hidden mt-4">
                <h3 className="font-medium mb-2">生成结果</h3>
                <div id="resultContainer"></div>
            </div>
        </div>

        <script dangerouslySetInnerHTML={{__html:`
        const modeRadios = document.querySelectorAll('.modeRadio');
        const promptEl = document.getElementById('prompt');
        const dropArea = document.getElementById('dropArea');
        const imgFileEl = document.getElementById('imgFile');
        const previewWrap = document.getElementById('previewWrap');
        const previewImg = document.getElementById('previewImg');
        const imgSizeText = document.getElementById('imgSize');
        const submitBtn = document.getElementById('submitBtn');
        const logBox = document.getElementById('logBox');
        const resultBox = document.getElementById('resultBox');
        const resultContainer = document.getElementById('resultContainer');
        const videoParams = document.getElementById('videoParams');
        const imgParams = document.getElementById('imgParams');
        let compressedImageBlob = null;

        modeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'video') {
                    videoParams.classList.remove('hidden');
                    imgParams.classList.add('hidden');
                } else {
                    videoParams.classList.add('hidden');
                    imgParams.classList.remove('hidden');
                }
            })
        })

        dropArea.addEventListener('click', () => imgFileEl.click());
        dropArea.addEventListener('dragover', e => e.preventDefault());
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if(file) handleImageFile(file);
        })
        imgFileEl.addEventListener('change', () => {
            const f = imgFileEl.files[0];
            if(f) handleImageFile(f);
        })

        async function handleImageFile(file) {
            log("正在加载并压缩图片...");
            const img = await createImageBitmap(file);
            const canvas = document.createElement('canvas');
            const maxSide = 1280;
            let w = img.width;
            let h = img.height;
            if(w>maxSide || h>maxSide){
                const ratio = Math.min(maxSide/w, maxSide/h);
                w = w*ratio; h=h*ratio;
            }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img,0,0,w,h);

            let quality = 0.85;
            compressedImageBlob = null;
            while(quality >= 0.30){
                const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", quality));
                if(blob.size <= 800 * 1024){
                    compressedImageBlob = blob;
                    break;
                }
                quality -= 0.05;
            }
            if(!compressedImageBlob){
                log("❌ 压缩失败，图片无法降到800KB以内");
                return;
            }
            previewImg.src = URL.createObjectURL(compressedImageBlob);
            previewWrap.classList.remove('hidden');
            imgSizeText.textContent = (compressedImageBlob.size
