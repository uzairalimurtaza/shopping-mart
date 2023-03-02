import { BrowserQRCodeReader } from "@zxing/library";
import jsQR from "jsqr";
export function Test() {
  var qrCodeUploaded = (files) => {
    const codeReader = new BrowserQRCodeReader();

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(files[0]);

    fileReader.onload = (e) => {
      // BrowserQRCodeReader
      //   var image = document.createElement("img");
      //   image.src = e.target.result;
      //   setTimeout(
      //     () =>
      //       codeReader
      //         .decodeFromImage(image, e.target.result)
      //         .then((res) => console.log(res)),
      //     100
      //   );

      //   jsQR;
      console.log(new Uint8ClampedArray(e.target.result));
      console.log(jsQR(new Uint8ClampedArray(e.target.result), 250, 250));
    };
  };

  return (
    <>
      <input
        type="file"
        name="file"
        id="file"
        accept="image/*"
        onChange={(event) => qrCodeUploaded(event.target.files)}
      />
    </>
  );
}
