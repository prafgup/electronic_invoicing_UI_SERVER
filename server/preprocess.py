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
    # cv2.imshow("abcd",final)
    # cv2.imwrite(path, final)
    return final


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input', metavar='', required=True, help="File Path Here")
    args = vars(parser.parse_args())
    filename = str(args["input"])

    image_names=[]
    img=None
    first = True
    if ".pdf" in filename:
        sample = convert_from_path(filename, dpi=400, grayscale=True,
                                   poppler_path=r"./../poppler-0.68.0_x86/poppler-0.68.0/bin")

        for i, curr_image in enumerate(sample):
            fname = 'sample_' + str(i) + '.png'
            curr_image.save(fname, "PNG")
            processed_image = preprocess(fname)
            cv2.imwrite(fname,processed_image)
            image_names.append(fname)

        images = []
        max_width = 0  # find the max width of all the images
        total_height = 0  # the total height of the images (vertical stacking)

        for name in image_names:
            # open all images and find their sizes
            images.append(cv2.imread(name))
            if images[-1].shape[1] > max_width:
                max_width = images[-1].shape[1]
            total_height += images[-1].shape[0]

        # create a new array with a size large enough to contain all the images
        img = np.zeros((total_height, max_width, 3), dtype=np.uint8)

        current_y = 0  # keep track of where your current image was last placed in the y coordinate
        for image in images:
            # add an image to the final array and increment the y coordinate
            img[current_y:image.shape[0] + current_y, :image.shape[1], :] = image
            current_y += image.shape[0]
    else:
        img = preprocess(filename)

    cv2.imwrite(r"./../web/invoice_template/src/preprocessed/sample_0.png", img)

    print("sample_0.png")
