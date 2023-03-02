import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import firetoast from "./../../../../../Helpers/FireToast";

var fileChangedHandler = (file, minWidth, minHeight) => {
  var fileInput = false;
  if (file) {
    fileInput = true;
  }
  if (fileInput) {
    try {
      var resizer = Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          return uri;
        },
        "file",
        minWidth,
        minHeight
      );
      return resizer;
    } catch (err) {
      console.log(err);
      return firetoast(
        "Something went wrong while getting image",
        "error",
        3000,
        "top-right"
      );
    }
  }
};
var UpdateVarantValueImage = async (VariantIndex, ValueIndex, file) => {
  var array = [...Options];

  if (file) {
    // console.log(await VariantImageResizer(file,1,1))

    await Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        array[VariantIndex].Small[ValueIndex] = uri;
      },
      "file",
      1,
      1
    );
    await Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        array[VariantIndex].Medium[ValueIndex] = uri;
      },
      "file",
      10,
      10
    );
    await Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        array[VariantIndex].Large[ValueIndex] = uri;
      },
      "file",
      100,
      100
    );
  }
  console.log(array);
};
async function VariantImageResizer(file) {
  let array = [];
  // console.log(file)
  let Small = await fileChangedHandler(file, 1, 1);
  let Medium = await fileChangedHandler(file, 10, 10);
  let Large = await fileChangedHandler(file, 100, 1);
  array.push(Small);
  array.push(Medium);
  array.push(Large);

  console.log(Small);
  return Small;
}
export default VariantImageResizer;
