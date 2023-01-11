import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import { smallBreakPoint } from '../utils/css/breakpoints';
import html2canvas from 'html2canvas'



@customElement('share-card')
export class ShareCard extends LitElement {

  @property() preventClosing = false;
  @property() manifestData = "";
  @property() swData = "";
  @property() securityData = "";
  @property() siteUrl = "";

  


  static get styles() {
    return css`
      .dialog::part(header){
        margin-bottom: 20px;
      }
      .dialog::part(body){
        padding: 0;
        width: 100%;
      }
      .dialog::part(title){
        display: none;
      }
      .dialog::part(panel) {
        width: 460px !important;
        height: 478px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px;
      }
      .dialog::part(overlay){
        backdrop-filter: blur(10px);
      }
      .dialog::part(close-button__base){
        position: absolute;
        padding: 0;
        top: 5px;
        right: 5px;
        z-index: 1000;
        color: #C2C9D1;
      }
      .dialog_header {
        height: 12px !important;
      }
      #frame-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 0 20px;
      }
      #frame-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }
      #score-image {
        width: 100%;   
        height: 330px;
        border-radius: 8px;
        background-image: url("/assets/share_score_backdrop.png");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
      #site-url {
        padding: 15px 15px 0px;
        font-weight: bold;
        font-size: 24px;
        color: rgb(41, 44, 58);
        line-height: 1em;
        max-height: 3em;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      #share-content {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 15px;
      }
      #share-content img {
        margin-right: 5px;
      }
      .standard-button {
        width: 201.96px;
        height: 44px;
        background: transparent;
        color: rgb(79, 63, 182);
        border: 1px solid rgb(79, 63, 182);
        font-size: 16px;
        font-weight: bold;
        border-radius: 50px;
      }
      .standard-button:hover {
        cursor: pointer;
      }
      #share-button {
        color: white;
        background-color: #292C3A;
        border-color: #292C3A;
      }
      #cancel-button {
        display: none;
      }
      #download-button:hover, #cancel-button:hover {
        box-shadow: rgb(0 0 0 / 30%) 0px 0px 10px;
      }
      #share-button:hover {
        outline: rgba(79, 63, 182, 0.7) solid 2px;
      }
      sl-progress-ring {
          --track-width: 4px;
          --indicator-width: 4px;
          --size: 65.32px;
          font-size: 12px;
          height: 65.32px;
          align-self: center;
      }
      sl-progress-ring::part(base) {
        border-radius: 50%;
      }
      sl-progress-ring::part(label){
          color: #4F3FB6;
          font-weight: bold;
      }
      .red {
        --indicator-color: var(--error-color);
      }
      .yellow {
        --indicator-color: var(--warning-color);
      } 
      .green {
        --indicator-color: var(--success-color);
      }
      .red::part(base) {
        background-color: #f7bebe;
      }
      .yellow::part(base) {
        background-color: #FFFAED !important;
      }
      .green::part(base){
        background-color: #E3FFF2;
      }

      .ring-categories {
        display:flex;
        flex-direction: column;
        justify-content: center;
      }

      .ring-label {
        font-size: 14px;
        margin-top: 8px;
        align-self: center;
        font-weight: 400;
        line-height: 20px;
        color: #292C3A;
      }

      #rings {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        height: 150px;
      }

      ${smallBreakPoint(css`
        #score-image {
          min-width: 100%;
          min-height: auto;
          background: url("/assets/share_score_backdrop_mobile.png") center center no-repeat;
          background-size: cover;
          background-attachment: scroll;
          -webkit-background: url("/assets/share_score_backdrop_mobile.png") center center cover no-repeat;
          -webkit-background-size: cover;
          -webkit-background-attachment: scroll;
          -moz-background: url("/assets/share_score_backdrop_mobile.png") center center cover no-repeat; 
          -moz-background-size: cover;
          -moz-background-attachment: scroll;
        }
        .standard-button {
          width: 133px;
        }
        #cancel-button {
          display: none;
        }
        #download-button {
          display: block;
          flex-direction: row;
          align-items: center;
          padding: 0px 15px;  
        }
      `)}
    `
  }

  renderProgressRings(cardData: any){
    let data = cardData.split('/');
    let validCounter = parseFloat(data[0]);
    let totalScore = parseFloat(data[1]);
    let color = JSON.parse(data[2]);
    let categoryName = data[3];
    
    return html`
      <div class="ring-categories">
        <sl-progress-ring
          id=${categoryName}
          class=${classMap(color)}
          value="${(validCounter / totalScore) * 100}"
        >
          ${validCounter} / ${totalScore}
        </sl-progress-ring>
        <div class="ring-label"> ${categoryName} </div>
      </div>
    `
  }

  htmlToImage(shareOption: string) {
    let image = this.shadowRoot!.getElementById("score-image");

    html2canvas(image!)
      .then((canvas: HTMLCanvasElement) => {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        if (shareOption === "download"){
          this.downloadImage(dataUrl, `${this.siteUrl}_pwabuilder_score.png`)
        } else if (shareOption === "share"){
          const file = this.dataURLtoFile(dataUrl, `${this.siteUrl}_pwabuilder_score.png`);
          console.log("file from dataURL()", file);
          this.shareFile(file, `${this.siteUrl} PWABuilder report card score`, "Check out my report card scores from PWABuilder!")
        } else {  
          return;
        }
      });
  }

  downloadImage(url: string, filename: string) {
    let link = document.createElement('a');
    link.href = "data:image/png;base64" + url;
    console.log("File link from downloadImage()", link.href);
    link.download = filename; 
    link.click();

    URL.revokeObjectURL(link.href);
  }

  dataURLtoFile(dataurl: string, filename: string) {
    var arr = dataurl.split(","),
    mimeType = arr[0].match(/:(.*?);/)![1],
    decodedData = atob(arr[1]),
    lengthOfDecodedData = decodedData.length,
    u8array = new Uint8Array(lengthOfDecodedData);
    while (lengthOfDecodedData--) {
      u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData);
    }
    return new File([u8array], filename, { type: mimeType });
  };

  shareFile(file: File, title: string, text: string) {
    console.log("File from shareFile():", file);
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator
        .share({
          files: [file],
          title,
          text
        })
        .then(() => console.log("Share was successful."))
        .catch((error) => console.log("Sharing failed", error));
    } else {
      console.log(`Your system doesn't support sharing files.`);
    }
  };

  hideDialog(){
    let dialog: any = this.shadowRoot!.querySelector(".dialog");
    dialog!.hide();
  }

  handleRequestClose(e: Event){
    if (this.preventClosing) {
      e.preventDefault();
    }
  }

  render() {
    return html`
      <sl-dialog class="dialog" @sl-show=${() => document.body.style.height = "100vh"} @sl-hide=${() => this.hideDialog()} noHeader>
        <div id="frame-wrapper">
          <div id="frame-content">
            <div id="score-image">
              <div id="site-url">
                ${this.siteUrl}
              </div>
              <div id="rings" aria-label="progress ring displays">
                ${[
                    this.manifestData,
                    this.swData,
                    this.securityData
                  ].map((data: any) => this.renderProgressRings(data))}
              </div>
            </div>
            <div id="share-content">        
              <button type="button" id="cancel-button" class="standard-button" @click=${() => this.hideDialog()}>Cancel</button>
              <button type="button" id="download-button" class="standard-button" @click=${() => this.htmlToImage('download')}><img src="/assets/download-icon.png" alt="Download image button icon"/>  Download Image</button>
              <button type="button" id="share-button" class="standard-button" @click=${() => this.htmlToImage('share')}><img src="/assets/modal-share-icon.png" alt="Share image button icon"/>  Share</button>                    
            </div>
          </div>
        </div>
      </sl-dialog>
    `
  }
}