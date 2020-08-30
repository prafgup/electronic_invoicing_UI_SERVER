from pdf2image import convert_from_path

from pdf2image.exceptions import (
    PDFInfoNotInstalledError,
    PDFPageCountError,
    PDFSyntaxError
)
import cv2
import numpy as np
import sys
import argparse
import os

def preprocess(path):
    # Read Image from Path
    image = cv2.imread(path)

    # Apply Deskewing for scans that are not aligned vertically
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)
    thresh = cv2.threshold(gray, 0, 255,
                           cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    coords = np.column_stack(np.where(thresh > 0))
    angle = cv2.minAreaRect(coords)[-1]

    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h),
                             flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    # Apply Grayscaling
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Denoise the Image
    denoised_image = cv2.fastNlMeansDenoising(gray_image, None)
    # Apply Adaptive Gaussian Thresholding
    final = cv2.adaptiveThreshold(denoised_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    # Resizing Image to 1920*1080
    final = cv2.resize(final, (1080, 1920))
    cv2.imshow("abcd",final)
    cv2.imwrite(path, final)
    print("sample_0.png")



if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('-i', '--input', metavar='', required=True, help="File Path Here")
    args = vars(parser.parse_args())
    filename=str(args["input"])


    if ".pdf" in filename:
        sample = convert_from_path(filename, dpi=400, grayscale=True,poppler_path=r"./../poppler-0.68.0_x86/poppler-0.68.0/bin")

        for i, curr_image in enumerate(sample):
            fname = 'sample_' + str(i) + '.png'
            curr_image.save(fname, "PNG")
            preprocess(fname)
    else:
        preprocess(filename)

