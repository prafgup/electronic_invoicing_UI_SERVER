# Electronic Invoicing Code for Flipkart Grid Challenge (Team NoobEZ)
Created by Rohit Tuli and Praful Gupta. Please read completely.  
For a quick walk through, have a look at the video. [DRIVE LINK](https://drive.google.com/file/d/1xO7jqSNhcDzyHVCRvw3UJ_GhQulhTiam/view?usp=sharing) [YOUTUBE LINK](https://youtu.be/Nk5S6KUU7vk)  
** NOTE: IN THE TEMPLATE GENERATION STEP, IT IS REQUIRED TO CREATE A BOX ON THE TOPMOST TEXT THAT IS THERE IN THE TEMPLATE AND NAME IT 0 (AS IT WAS in "TAX INVOICE" IN SAMPLE 16) ELSE IT MAY PRODUCE WRONG RESULTS **  

## Overview
This is our solution to the problem of digitising invoices and extracting Relevant Data from them. The software, once trained on each invoice template beforehand, is able to
get the data out of it with high accuracy. The entire process involves 3 major steps- Preprocessing, Template Generation / Selection, and Template Matching, OCR & Data Entry

## Image Generation and Preprocessing
First we generate different images from each page of the scanned pdf using a Python Package called Pdf2Image.
As Invoices are bound to come from different scanners, have different resolutions and potential errors in scanning, we preprocess the scans using standard Image Processing techniques.

### Deskewing
As the scan might be rotated, we perform deskewing of the scan to get a vertically aligned image.
### Grayscaling
It is performed because standard OCR Engines perform best on a grayscale Image
### Denoising
Noise can be present in Image due to a variety of reasons and removing noise is essential for successful text detection
### Adaptive Gaussian Thresholding
Scans may be lighter somewhere and darker somewhere else which causes problems in text recognition, so adaptive gaussian thresholding is performed to get a uniform Image.

## Template Generation / Selection
For the first time a particular type of invoice (new vendor or new format) is seen, it needs to be trained first. Once it is trained, all invoices that have the same format can be 
directy processed without the need of training again. The training process involves creating bounding boxes around all the relevant fields and labelling them with numbers 0-29 as described in the video.
It Generates a json file which contains bounding box info of all relevant information. PLEASE MAKE SURE ALL THE AREA WHERE TEXT CAN BE IN ANY OF THE RECEIPTS WHICH WILL USE THIS TEMPLATE, IS A PART OF THE SQUARE. 
FOR EXAMPLE IF IN TEMPLATE THE ADDRESS IS SMALL, STILL CREATE A BOX OF THE WHOLE AREA WHERE A LONG ADDRESS CAN BE.
Ofcourse if the template for the scan already exists, this step could be skipped. Once you are done, it creates a JSON file for the template which you have to upload to colab for the next step.

## Template Matching, OCR and Data Entry
### Template Matching
As the receipt can be small and present at various positions on the image (for example template was trained with the receipt on top left corner but in another receipt, its in the bottom right corner)
To handle such inconsistancies, we perform OCR on the whole image once, find the topmost element, and based on the positions of topmost element in scans and in the template, account for this error. That is why it is necessary to
also put the topmost element in the scan while making the template, whether its useful or not. 
### OCR
OCR or Optical Character Recognition is done to take out the relevant text from the image based on the bounding boxes in the modified template. We used pytesseract which is a toned 
down version of Teserract OCR Engine by Google. We did not use teserract to make the process faster. We crop the image using the bounding box and pass the cropped image to Pyteserract to have maximum efficiency in text detection.
### Data Entry
We use openpyxl package to feed the recognised text from OCR to the template excel sheet provided, in the specific row and column.

