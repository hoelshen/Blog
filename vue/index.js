import tinymce from 'tinymce';
import TapdDocsDialogHelper from './docs-helper';

import './index.less';

const editSvg = `
<svg style="width:12px;fill: #ccc;" width="12" fill="#ccc" class="editTxDoc" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="90.288 58.809 850.394 850.394" enable-background="new 90.288 58.809 850.394 850.394" xml:space="preserve">
<g>
	<path d="M910.682,463.784c-16.568,0-30,13.432-30,30v355.418H150.288V118.809h365.197c16.568,0,30-13.432,30-30s-13.432-30-30-30
		H132.288c-23.159,0-42,18.841-42,42v766.394c0,23.159,18.841,42,42,42h766.394c23.159,0,42-18.841,42-42V493.784
		C940.682,477.216,927.25,463.784,910.682,463.784z"/>
	<path d="M403.993,514.174c-7.169,30.503-11.103,57.471-11.267,58.604c-1.355,9.364,1.787,18.818,8.478,25.509
		c5.667,5.667,13.314,8.787,21.212,8.787c1.427,0,2.864-0.102,4.297-0.31c1.133-0.164,28.101-4.098,58.603-11.267
		c60.477-14.214,79.832-28.219,89.129-37.517L913.15,219.277l0.001,0c36.649-36.65,36.649-96.285-0.001-132.936
		c-36.652-36.65-96.287-36.649-132.936,0L441.509,425.045C432.212,434.343,418.207,453.698,403.993,514.174z M462.356,528.096
		c11.787-50.229,21.188-60.226,21.58-60.625L822.64,128.767c6.629-6.628,15.335-9.942,24.042-9.942
		c8.706,0,17.413,3.314,24.041,9.942c13.257,13.257,13.257,34.827,0,48.084l0.001,0L532.022,515.552
		c-0.399,0.393-10.343,9.745-60.232,21.49c-4.091,0.963-8.13,1.865-12.045,2.703C460.556,535.961,461.427,532.056,462.356,528.096z"
		/>
</g>
</svg>
`;

const deleteSvg = `
  <svg style="width:12px;fill: #ccc;" width="12" fill="#ccc" class="deleteTxDoc" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="90.288 58.809 850.394 850.394" enable-background="new 90.288 58.809 850.394 850.394" xml:space="preserve">
  <g>
    <path d="M905.725,131.016H791.414H651.477v-27.774c0-2.701-0.256-5.341-0.72-7.91c0.466-2.101,0.72-4.282,0.72-6.523
      c0-16.568-13.432-30-30-30h-14.453H423.948h-14.454c-16.568,0-30,13.432-30,30c0,2.241,0.254,4.422,0.72,6.523
      c-0.464,2.569-0.72,5.209-0.72,7.91v27.774H239.558H125.245c-16.568,0-30,13.432-30,30s13.432,30,30,30h71.175v672.143
      c0,25.389,19.352,46.044,43.138,46.044h551.856c23.787,0,43.139-20.655,43.139-46.044V191.016h71.173c16.568,0,30-13.432,30-30
      S922.293,131.016,905.725,131.016z M439.494,118.809h151.983v12.207H439.494V118.809z M774.552,849.202H256.419V191.016h167.529
      h183.076h167.528V849.202z"/>
    <path d="M415.863,279.164c-16.568,0-30,13.432-30,30v421.89c0,16.568,13.432,30,30,30s30-13.432,30-30v-421.89
      C445.863,292.596,432.432,279.164,415.863,279.164z"/>
    <path d="M585.107,309.164v421.89c0,16.568,13.432,30,30,30s30-13.432,30-30v-421.89c0-16.568-13.432-30-30-30
      S585.107,292.596,585.107,309.164z"/>
  </g>
</svg>
`;

const tencent_docs = `<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve">
<style type="text/css">
.st0{fill:none;}
.st1{fill-rule:evenodd;clip-rule:evenodd;fill:#2A65F5;}
.st2{fill-rule:evenodd;clip-rule:evenodd;fill:#00DCFF;}
.st3{fill-rule:evenodd;clip-rule:evenodd;fill:#FFFFFF;}
</style>
<title>icon_64_文档</title>
<desc>Created with Sketch.</desc>
<g>
<rect id="矩形" y="0" class="st0" width="36" height="36"/>
<g id="编组-4">
 <path id="Fill-19" class="st1" d="M26.4,6.1H9c-0.2,0-0.4,0.2-0.5,0.4l-4,22.8c-0.1,0.3,0.2,0.6,0.5,0.6h9.6l0.8-0.2h4.5l0.6,0.2
   h7.4c0.2,0,0.4-0.2,0.5-0.4l3.3-18.7L26.4,6.1z"/>
 <path id="Fill-20" class="st2" d="M26.1,10.7h5.4l-5.2-4.6l-0.7,4C25.6,10.5,25.8,10.7,26.1,10.7"/>
 <polygon id="Fill-21" class="st3" points="18.6,7.1 17.6,12.6 8.1,12.6 12.2,17.1 16.8,17.1 14.5,29.9 20.4,29.9 22.6,17.1 
   29.5,17.1 29.8,17.1 		"/>
</g>
</g>
</svg>`



const svg_slide = `
<svg width="20px" height="20px" viewBox="0 0 35 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 64 (93537) - https://sketch.com -->
    <title>file_slide_64</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <linearGradient x1="100%" y1="39.4645982%" x2="83.1081738%" y2="39.4645982%" id="linearGradient-1">
            <stop stop-color="#F7501C" offset="0%"></stop>
            <stop stop-color="#D93213" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="82.8871475%" y1="0%" x2="9.5%" y2="100%" id="linearGradient-2">
            <stop stop-color="#FF8759" offset="0%"></stop>
            <stop stop-color="#FF5B0F" offset="100%"></stop>
        </linearGradient>
        <path d="M10.2659627,0.0168504055 L10.2666667,11.7260807 L21.975897,11.7267847 C21.5981897,17.4596751 16.8284727,21.9927474 11,21.9927474 C4.92486775,21.9927474 -3.12638804e-14,17.0678796 -3.12638804e-14,10.9927474 C-3.12638804e-14,5.16427463 4.53307224,0.394557637 10.2659627,0.0168504055 Z" id="path-3"></path>
        <filter x="-13.7%" y="-9.1%" width="136.4%" height="136.4%" filterUnits="objectBoundingBox" id="filter-4">
            <feOffset dx="1" dy="2" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.08 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
        <path d="M12.8415321,-1.7606858e-05 C17.8235745,0.192622324 21.8248798,4.20843311 21.9944054,9.19637229 L12.8413816,9.19598239 Z" id="path-5"></path>
        <filter x="-27.3%" y="-27.2%" width="176.5%" height="176.1%" filterUnits="objectBoundingBox" id="filter-6">
            <feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="1" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0.457455842   0 0 0 0 0   0 0 0 0 0  0 0 0 0.16 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
    </defs>
    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Mobile-doc-icon" transform="translate(-77.000000, -114.000000)">
            <g id="file/slide/64" transform="translate(77.000000, 114.000000)">
                <rect id="矩形" x="0" y="0" width="36" height="36"></rect>
                <g id="编组-8" stroke-width="1" fill-rule="evenodd" transform="translate(10.000000, 10.000000)">
                    <path d="M10.6206897,10.6206897 L40.9655172,10.6206897 C42.6414158,10.6206897 44,11.9792739 44,13.6551724 L44,42.4827586 C44,44.1586572 42.6414158,45.5172414 40.9655172,45.5172414 L10.6206897,45.5172414 C8.9447911,45.5172414 7.5862069,44.1586572 7.5862069,42.4827586 L7.5862069,13.6551724 C7.5862069,11.9792739 8.9447911,10.6206897 10.6206897,10.6206897 Z" id="蒙版备份" fill="url(#linearGradient-1)"></path>
                    <path d="M34.8965517,0 C36.5724503,-3.07857569e-16 37.9310345,1.35858421 37.9310345,3.03448276 L37.9310345,42.4827586 L37.9310345,42.4827586 C37.9310345,44.1586572 39.2896187,45.5172414 40.9655172,45.5172414 L3.03448276,45.5172414 C1.35858421,45.5172414 1.0934168e-15,44.1586572 0,42.4827586 L0,3.03448276 C-2.0523838e-16,1.35858421 1.35858421,1.19603599e-15 3.03448276,0 L34.8965517,0 Z" id="蒙版" fill="url(#linearGradient-2)"></path>
                    <g id="编组-3" transform="translate(8.000000, 15.000000)">
                        <g id="形状结合">
                            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
                            <use fill="#FFCFC0" fill-rule="evenodd" xlink:href="#path-3"></use>
                        </g>
                        <g id="形状结合">
                            <use fill="black" fill-opacity="1" filter="url(#filter-6)" xlink:href="#path-5"></use>
                            <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-5"></use>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`;

const svg_sheet = `
<svg width="20px" height="20px" viewBox="0 0 35 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>icon_64_表格</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <linearGradient x1="100%" y1="45.5294345%" x2="76.3801654%" y2="45.5294345%" id="linearGradient-1">
            <stop stop-color="#009F57" offset="0%"></stop>
            <stop stop-color="#00732E" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="67.7856111%" y1="-25.6459977%" x2="27.9148297%" y2="72.6276774%" id="linearGradient-2">
            <stop stop-color="#00C6A8" offset="0%"></stop>
            <stop stop-color="#00A558" offset="100%"></stop>
        </linearGradient>
        <path d="M19.1831897,0 C20.1044578,1.46726668e-15 20.8512931,0.746835353 20.8512931,1.66810345 L20.8512931,23.3534483 L20.8512931,23.3534483 C20.8512931,24.2747164 21.5981285,25.0215517 22.5193966,25.0215517 L1.66810345,25.0215517 C0.746835353,25.0215517 4.60093956e-15,24.2747164 0,23.3534483 L0,1.66810345 C-3.34867407e-16,0.746835353 0.746835353,-7.18944216e-16 1.66810345,0 L19.1831897,0 Z" id="path-3"></path>
        <filter x="-4.4%" y="-4.0%" width="108.9%" height="108.0%" filterUnits="objectBoundingBox" id="filter-4">
            <feGaussianBlur stdDeviation="0.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
            <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.16 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
        <rect id="path-5" x="11.6767241" y="17.5150862" width="6.25538793" height="2.50215517"></rect>
        <filter x="-16.0%" y="-40.0%" width="163.9%" height="259.9%" filterUnits="objectBoundingBox" id="filter-6">
            <feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
        <rect id="path-7" x="3.75323276" y="17.5150862" width="6.25538793" height="2.50215517"></rect>
        <filter x="-32.0%" y="-40.0%" width="163.9%" height="259.9%" filterUnits="objectBoundingBox" id="filter-8">
            <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
        <rect id="path-9" x="11.6767241" y="13.3448276" width="6.25538793" height="2.50215517"></rect>
        <filter x="-16.0%" y="-40.0%" width="163.9%" height="259.9%" filterUnits="objectBoundingBox" id="filter-10">
            <feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
        <rect id="path-11" x="3.75323276" y="13.3448276" width="6.25538793" height="2.50215517"></rect>
        <filter x="-32.0%" y="-40.0%" width="163.9%" height="259.9%" filterUnits="objectBoundingBox" id="filter-12">
            <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
    </defs>
    <g id="彩色图标" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="PC-新图标" transform="translate(-147.000000, -114.000000)">
            <g id="icon/64/表格" transform="translate(147.000000, 114.000000)">
                <rect id="矩形" x="0" y="0" width="36" height="36"></rect>
                <g id="编组-6" transform="translate(6.187500, 5.625000)">
                    <path d="M5.83836207,5.83836207 L22.5193966,5.83836207 C23.4406646,5.83836207 24.1875,6.58519742 24.1875,7.50646552 L24.1875,23.3534483 C24.1875,24.2747164 23.4406646,25.0215517 22.5193966,25.0215517 L5.83836207,25.0215517 C4.91709397,25.0215517 4.17025862,24.2747164 4.17025862,23.3534483 L4.17025862,7.50646552 C4.17025862,6.58519742 4.91709397,5.83836207 5.83836207,5.83836207 Z" id="蒙版备份" fill="url(#linearGradient-1)"></path>
                    <g id="蒙版">
                        <use fill="url(#linearGradient-2)" fill-rule="evenodd" xlink:href="#path-3"></use>
                        <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
                    </g>
                    <g id="Rectangle-19-Copy-5备份-2">
                        <use fill="black" fill-opacity="1" filter="url(#filter-6)" xlink:href="#path-5"></use>
                        <use fill="#83EDAF" fill-rule="evenodd" xlink:href="#path-5"></use>
                    </g>
                    <g id="Rectangle-19-Copy-4备份-3">
                        <use fill="black" fill-opacity="1" filter="url(#filter-8)" xlink:href="#path-7"></use>
                        <use fill="#B2F8EA" fill-rule="evenodd" xlink:href="#path-7"></use>
                    </g>
                    <g id="Rectangle-19-Copy-5备份">
                        <use fill="black" fill-opacity="1" filter="url(#filter-10)" xlink:href="#path-9"></use>
                        <use fill="#B2F8EA" fill-rule="evenodd" xlink:href="#path-9"></use>
                    </g>
                    <g id="Rectangle-19-Copy-4">
                        <use fill="black" fill-opacity="1" filter="url(#filter-12)" xlink:href="#path-11"></use>
                        <use fill="#E0FFF9" fill-rule="evenodd" xlink:href="#path-11"></use>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`;

const svg_doc = `
<svg width="20px" height="20px" viewBox="0 0 35 35" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 64 (93537) - https://sketch.com -->
    <title>icon_64_文档</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <linearGradient x1="100%" y1="29.7818714%" x2="83.6208606%" y2="29.7818714%" id="linearGradient-1">
            <stop stop-color="#4776FA" offset="0%"></stop>
            <stop stop-color="#194CE9" offset="100%"></stop>
        </linearGradient>
        <radialGradient cx="71.859375%" cy="0%" fx="71.859375%" fy="0%" r="149.097942%" gradientTransform="translate(0.718594,0.000000),scale(1.000000,0.900000),rotate(98.417576),translate(-0.718594,-0.000000)" id="radialGradient-2">
            <stop stop-color="#359FFF" offset="0%"></stop>
            <stop stop-color="#0D75FF" offset="99.9234586%"></stop>
        </radialGradient>
        <path d="M19.1831897,0 C20.1044578,-1.69234204e-16 20.8512931,0.746835353 20.8512931,1.66810345 L20.8512931,23.3534483 L20.8512931,23.3534483 C20.8512931,24.2747164 21.5981285,25.0215517 22.5193966,25.0215517 L1.66810345,25.0215517 C0.746835353,25.0215517 -9.97400222e-16,24.2747164 0,23.3534483 L0,1.66810345 C-1.12822802e-16,0.746835353 0.746835353,-7.18944216e-16 1.66810345,0 L19.1831897,0 Z" id="path-3"></path>
        <filter x="-4.4%" y="-4.0%" width="108.9%" height="108.0%" filterUnits="objectBoundingBox" id="filter-4">
            <feGaussianBlur stdDeviation="0.5" in="SourceAlpha" result="shadowBlurInner1"></feGaussianBlur>
            <feOffset dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.14 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
        <polygon id="path-5" points="4.58728448 17.5150862 17.0980603 17.5150862 17.0980603 20.0172414 4.58728448 20.0172414"></polygon>
        <filter x="-8.0%" y="-40.0%" width="132.0%" height="259.9%" filterUnits="objectBoundingBox" id="filter-6">
            <feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
        <polygon id="path-7" points="4.58728448 13.3448276 17.0980603 13.3448276 17.0980603 15.8469828 4.58728448 15.8469828"></polygon>
        <filter x="-8.0%" y="-40.0%" width="132.0%" height="259.9%" filterUnits="objectBoundingBox" id="filter-8">
            <feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
        </filter>
    </defs>
    <g id="彩色图标" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="PC-新图标" transform="translate(-77.000000, -114.000000)">
            <g id="icon/36/文档" transform="translate(77.000000, 114.000000)">
                <rect id="矩形" x="0" y="0" width="36" height="36"></rect>
                <g id="编组-2" transform="translate(6.187500, 5.625000)">
                    <path d="M5.83836207,5.83836207 L22.5193966,5.83836207 C23.4406646,5.83836207 24.1875,6.58519742 24.1875,7.50646552 L24.1875,23.3534483 C24.1875,24.2747164 23.4406646,25.0215517 22.5193966,25.0215517 L5.83836207,25.0215517 C4.91709397,25.0215517 4.17025862,24.2747164 4.17025862,23.3534483 L4.17025862,7.50646552 C4.17025862,6.58519742 4.91709397,5.83836207 5.83836207,5.83836207 Z" id="蒙版备份" fill="url(#linearGradient-1)"></path>
                    <g id="蒙版">
                        <use fill="url(#radialGradient-2)" fill-rule="evenodd" xlink:href="#path-3"></use>
                        <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
                    </g>
                    <g id="形状结合备份">
                        <use fill="black" fill-opacity="1" filter="url(#filter-6)" xlink:href="#path-5"></use>
                        <use fill="#98D3FF" fill-rule="evenodd" xlink:href="#path-5"></use>
                    </g>
                    <g id="形状结合">
                        <use fill="black" fill-opacity="1" filter="url(#filter-8)" xlink:href="#path-7"></use>
                        <use fill="#D3F3FF" fill-rule="evenodd" xlink:href="#path-7"></use>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`;

const svg_related = `
<svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 16 16" style="enable-background:new 0 0 16 16;" xml:space="preserve">
<style type="text/css">
	.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#008ED7;}
	.st1{fill-rule:evenodd;clip-rule:evenodd;fill:url(#矩形_1_);}
	.st2{fill-rule:evenodd;clip-rule:evenodd;}
	.st3{fill-rule:evenodd;clip-rule:evenodd;fill:#E7F9FF;}
	.st4{fill-rule:evenodd;clip-rule:evenodd;fill:#CAEBFF;}
</style>
<title>file_sharefolder_16</title>
<desc>Created with Sketch.</desc>
<g>
	<path id="形状结合" class="st0" d="M1.3,1h5.7c0.2,0,0.3,0.1,0.5,0.2L9.3,3l0,0H0.6V1.7C0.6,1.3,0.9,1,1.3,1z"/>
	
		<linearGradient id="矩形_1_" gradientUnits="userSpaceOnUse" x1="-110.0091" y1="78.9085" x2="-111.4926" y2="78.0421" gradientTransform="matrix(15 0 0 -11.3333 1666.6068 899.0601)">
		<stop  offset="0" style="stop-color:#1ECCF2"/>
		<stop  offset="1" style="stop-color:#40BEFC"/>
	</linearGradient>
	<path id="矩形" class="st1" d="M0.6,2.9h14.2c0.4,0,0.8,0.4,0.8,0.8v9.8c0,0.4-0.4,0.8-0.8,0.8H1.4c-0.4,0-0.8-0.4-0.8-0.8V2.9
		L0.6,2.9z"/>
	<g>
		<polygon id="path-7" class="st2" points="3.4,6.8 7.5,6.8 7.5,8.5 3.4,8.5 		"/>
	</g>
	<g>
		<polygon class="st3" points="3.4,6.8 7.5,6.8 7.5,8.5 3.4,8.5 		"/>
	</g>
	<g>
		<polygon id="path-7_1_" class="st2" points="8.5,6.8 12.6,6.8 12.6,8.5 8.5,8.5 		"/>
	</g>
	<g>
		<polygon class="st3" points="8.5,6.8 12.6,6.8 12.6,8.5 8.5,8.5 		"/>
	</g>
	<g>
		<polygon id="path-7_3_" class="st2" points="3.4,9.3 7.5,9.3 7.5,11 3.4,11 		"/>
	</g>
	<g>
		<polygon class="st4" points="3.4,9.3 7.5,9.3 7.5,11 3.4,11 		"/>
	</g>
	<g>
		<polygon id="path-7_2_" class="st2" points="8.5,9.3 12.6,9.3 12.6,11 8.5,11 		"/>
	</g>
	<g>
		<polygon class="st4" points="8.5,9.3 12.6,9.3 12.6,11 8.5,11 		"/>
	</g>
</g>
</svg>
`;

const TAPD_DELETE_DIALOG = `
    <div class="tapd-delete-dialog__mask">
    <div class="tapd-delete-dialog__content">
        <div class="tapd-delete-dialog__head">
          <a href="#" class="ui-dialog-action ui-dialog-close font font-close" title="关闭"><span></span></a>
        </div>
        <div class="tapd-delete-dialog__body">
          <div id="tconfirm" class="ui-dialog-content webkit-scrollbar" style="height: auto; min-height: 0px; width: auto;">
              <div id="tconfirm-icon">
                <i class="font font-warning"></i>
                </div><div id="tconfirm-content"> 确定删除吗？</div>
              </div>
        </div>
        <div class="tapd-delete-dialog__foot">
        <div class="tapd-delete-dialog__foot-btns">
            <span class="foot-btn foot-btn__ensure j-foot-btn__ensure">确定</span>
            <span class="foot-btn foot-btn__cancel j-close-dialog">取消</span>
        </div>
        </div>
    </div>
    </div>
`;

const TAPD_TITLEBLOCK_STYLES = `
  .deleteTxDoc .editTxDoc{
    margin: 0 5px;
  }
  .docs-div {
    border: none;
    outline: none!important;
    border-radius: 4px;
    display: flex;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: #EFF6FF;
    padding: 0 10px;
    margin: 10px 0;
    box-sizing: border-box;
  }
`

const TAPD_DELETE_DIALOG_STYLES = `
    img[data-control="tapd-graph"] {
        cursor: pointer;
    }
    .tapd-delete-dialog {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .tapd-delete-dialog--fullscreen .tapd-delete-dialog__content{
        width: 100%;
        height: 100%;
    }
    .tapd-delete-dialog--fullscreen .tapd-delete-dialog__mask{
        padding-top: 0;
    }
    .tapd-delete-dialog__mask {
        width: 100%;
        height: 100%;
        padding-top: 200px;
        background-color: rgba(0, 0, 0, .1);
    }
    .tapd-delete-dialog__content {
        width: 20%;
        height: 20%;
        margin: 0 auto;
        background-color: #fff;
        opacity: 1;
        border-radius: 3px;
        border: solid 1px #aab5c1;
        -moz-box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        -webkit-box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        -o-box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .tapd-delete-dialog__head {
        padding: 0 18px;
        height: 43px;
        line-height: 43px;
        background-color: transparent;
        border-bottom: 1px solid #dfe6ee;
        border-top-right-radius: 3px;
        border-top-left-radius: 3px;
        text-align: left;
    }
    .tapd-delete-dialog__head .ch-icon:hover {
        color: #3582fb;
    }
    .tapd-delete-dialog__head-title {
        font-size: 14px;
        color: #3f4a56;
    }
    .tapd-delete-dialog__head-close,
    .tapd-delete-dialog__head-fullscreen {
        float: right;
        margin-left: 15px;
        color: #8091a5;
        font-size: 14px;
        cursor: pointer;
    }
    .tapd-delete-dialog .tapd-delete-dialog__head-close{
        line-height: 43px;
        margin-top: 10px;
    }
    .tapd-delete-dialog__body {
        line-height: 20px;
        font-size: 12px;
        color: #8091a5;
        position: relative;
        height: calc(100% - 100px);
    }
    .tapd-delete-dialog__body--loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100% - 50px);
        line-height: 50px;
        color: #3f4a56;
        background-color: rgba(255, 255, 255, .5);
    }
    .tapd-delete-dialog__body--loading_icon {
        background-repeat: no-repeat;
    }
    .tapd-delete-dialog__foot {
        height: 55px;
    }
    .tapd-delete-dialog__foot-btns {
        float: right;
        margin-top: 12px;
    }
    .tapd-delete-dialog__foot-btns .foot-btn {
        display: inline-block;
        min-width: 60px;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        cursor: pointer;
        text-decoration: none;
        outline: 0;
        border-radius: 2px;
        text-align: center;
        vertical-align: middle;
        font-size: 12px;
    }
    .tapd-delete-dialog__foot-btns .foot-btn__ensure {
        color: #fff;
        border: 1px solid #3582fb;
        background-color: #3582fb;
    }
    .tapd-delete-dialog__foot-btns .foot-btn__ensure:hover {
        border: 1px solid #5d9bfc;
        background-color: #5d9bfc
    }
    .tapd-delete-dialog__foot-btns .foot-btn__cancel {
        margin-right: 25px;
        color: #3582fb;
        border: 1px solid #d7e6fe;
        background-color: #fff;
    }
    .tapd-delete-dialog__foot-btns .foot-btn__cancel:hover {
        color: #5d9bfc;
        border: 1px solid #5d9bfc;
        background-color: #fff
    }

`;

export default () => {
  tinymce.PluginManager.add('tencent-docs', function (editor, url) {
    TapdDocsDialogHelper.init(editor)
    const setDelete = function (target) {
      var node = editor.selection.getNode()
      node.getElementsByClassName(`${target}`)[0].remove();
    }
    function setExecmd(target) {
      document.querySelector('.j-close-dialog').addEventListener('click', (e) => {
        document.getElementsByClassName('tapd-delete-dialog')[0].style.display = 'none';
      });
      document.getElementsByClassName('j-foot-btn__ensure')[0].addEventListener('click', (e) => {
        setDelete(target);
        document.getElementsByClassName('tapd-delete-dialog')[0].style.display = 'none';
      })
    };
    const openDialog = function (title, type) {
      // 权限获取
      const titleBlock = function (iconSvg, title, ID, url) {
        let svg
        if(iconSvg == 'sheet'){
           svg = svg_sheet;
        } else if(iconSvg == 'doc'){
          svg = svg_doc;
        } else {
          svg = svg_slide;
        }
        // 在文档里面显示
        const dom = document.createElement('div');
        dom.innerHTML = `
          <div class="docs-div" fileid="${ID}" cm-name=${ID} title="${title}" fileurl=${url} style="
              border: none;
              outline: none!important;
              border-radius: 4px;
              display: flex;
              width:100%;
              height: 50px;
              line-height: 50px;
              background: #EFF6FF;
              padding: 0 10px;
              margin: 10px 0;
              box-sizing: border-box;
              display: inline-flex;
              align-items: center;">
            ${svg}
            <span fileid="${ID}">${title}</span>
            <span class="editTxDoc" fileid="${ID}" cm-eventflag="editTxDoc" style="margin: 0 5px;
            ">
            ${editSvg}
            </span>
            <span class="deleteTxDoc" fileid="${ID}" cm-eventflag="deleteTxDoc" style="margin: 0 5px;
            ">
            ${deleteSvg}
            </span>
          </div>
        `;
        const style = document.createElement('style');
        style.innerHTML = TAPD_TITLEBLOCK_STYLES;
        document.head.appendChild(style);

        dom.setAttribute('contenteditable', 'false');
        dom.setAttribute("class", ID);
        dom.setAttribute('style', 'width: 400px;border: none;cursor:move');
        editor.insertContent(dom.outerHTML);
      };

      const editorBlock = function(title){
        // docuemnt.getElementsByClassName('');

      };
      
      if (title == '关联文档') {
        const dialog = document.getElementById('relatedDocs');
        if (dialog){
          dialog.setAttribute('style', 'display: block')
        } else {
          const getDocs = editor.getParam('getDocs')
          if (getDocs) {
            TapdDocsDialogHelper.realteIframe(getDocs, function(value){
              titleBlock(value.type, value.title, value.ID, value.url)
            })
          }
        }
      } else {
        const getTxDocAuthorized = editor.getParam('getTxDocAuthorized');
        if (getTxDocAuthorized) {
          // 弹出文档框
          getTxDocAuthorized((value) => {
            if (value.is_authorized == 1) {
              const getIframeSrc = editor.getParam('getIframeSrc')
              if (getIframeSrc) {
                getIframeSrc(title, type, function (value) {
                  if (value) {
                    TapdDocsDialogHelper.createIframe(value, function (iconSvg, title, type, url) {
                      titleBlock(iconSvg, title, type, url)
                    }, function(title){
                      editorBlock(title)
                    })
                  }
                })
              }
            } else {
              // 跳转认证
              TapdDocsDialogHelper.authorized_iframe(value.authorize_url, function () {
                const getIframeSrc = editor.getParam('getIframeSrc')
                if (getIframeSrc) {
                  getIframeSrc(title, type, function (value) {
                    if (value) {
                      TapdDocsDialogHelper.createIframe(value, function (iconSvg, title, type, url) {
                        titleBlock(iconSvg, title, type, url)
                      }, function(title){
                        editorBlock(title)
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    };
    editor.on('click', function (event) {
      var value = getCherryModuleEventInfo(event);
      function getCherryModuleEventInfo(event) {
        let cherryModuleName = '';
        let cherryModuleEventFlag = '';
        let cherryFileid = '';
        let cherryTitle = '';
        
        for (let index = event.path.length - 1; index >= 0; index--) {
          const element = event.path[index];
          if (!element.getAttribute) {
            continue;
          }
          if (element.getAttribute('cm-name')) {
            cherryModuleName = element.getAttribute('cm-name');
          }
          if (cherryModuleName && element.getAttribute('cm-eventflag')) {
            cherryModuleEventFlag = element.getAttribute('cm-eventflag');
          }
          if (cherryModuleName && element.getAttribute('fileid')) {
            cherryFileid = element.getAttribute('fileid')
          }
          if (cherryModuleName && element.getAttribute('title')) {
            cherryTitle = element.getAttribute('title')
          }
        }
        return {
          fileid: cherryFileid,
          title: cherryTitle,
          clickModule: !!cherryModuleName,
          moduleName: cherryModuleName,
          eventFlag: cherryModuleEventFlag,
        }
      }

      if (value.eventFlag == 'editTxDoc') {
        const getTempSrc = editor.getParam('getTempSrc')
        if (getTempSrc) {
          getTempSrc(value.fileid, function (val) {
            if(value && value.title){
              TapdDocsDialogHelper.editIframe(val.doc_id, val.tempURL, value.title, function(value){
                editorBlock(value)
              });
            }
          })
        }
      }
      if (value.eventFlag == 'deleteTxDoc') {
        const dialog = document.getElementsByClassName('j-tapd-delete-dialog')[0];
        if (dialog){
          dialog.setAttribute('style', 'display: block')
        } else {
          const style = document.createElement('style');
          style.innerHTML = TAPD_DELETE_DIALOG_STYLES;
          document.head.appendChild(style);
          const dialog = document.createElement('div');
          dialog.setAttribute('class', 'tapd-delete-dialog j-tapd-delete-dialog');
          dialog.style = 'display:block;';
          dialog.innerHTML = TAPD_DELETE_DIALOG;
          document.body.appendChild(dialog);
        }
        setExecmd(value.fileid)
      }
    });
    // 注册一个工具栏按钮名称
    editor.ui.registry.addIcon('txdoc_slide', svg_slide);
    editor.ui.registry.addIcon('txdoc_sheet', svg_sheet);
    editor.ui.registry.addIcon('txdoc_related', svg_related);
    editor.ui.registry.addIcon('txdoc_doc', svg_doc);
    editor.ui.registry.addIcon('tencent_docs', tencent_docs);

    
    editor.ui.registry.addMenuButton('tencent-docs', {
      icon: 'tencent_docs',
      tooltip: '腾讯文档',
      fetch(callback) {
        const items = [{
          icon: 'txdoc_related',
          type: 'togglemenuitem',
          text: '关联文档',
          onAction() {
            openDialog('关联文档', 'doc');
          }
        }, {
          icon: 'txdoc_doc',
          type: 'togglemenuitem',
          text: '新建在线文档',
          onAction() {
            openDialog('新建在线文档', 'doc');
          }
        }, {
          icon: 'txdoc_sheet',
          type: 'togglemenuitem',
          text: '新建在线表格',
          onAction() {
            openDialog('新建在线表格', 'sheet');
          }
        }, {
          icon: 'txdoc_slide',
          type: 'togglemenuitem',
          text: '新建在线幻灯片',
          onAction() {
            openDialog('新建在线幻灯片', 'slide');
          }
        }];
        callback(items);
      },
      setup(editor) {
      },
      before_insert_link(data) {
        return true;
      },
    });
    return {
      getMetadata: function () {
        return {
          // 插件名和链接会显示在“帮助”→“插件”→“已安装的插件”中
          name: 'Example plugin', // 插件名称
          url: 'http://exampleplugindocsurl.com', // 作者网址
        };
      }
    };
  });

};