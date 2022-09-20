''' Multi Grabcut Segmentation
supports multi-class segmentation (3 classes) 

Input: 3-channel or EXR image as input
Scrrible: 3-channel image with scribbles marked as follows: 
    - Blue: Class # 1
    - Green: Class # 2
    - Red: Class # 3
    - Black: Background

Output: A binary image with values [0, 3] as follows: 
    - 0: background
    - 1: Blue - Class # 1
    - 2: Green - Class # 2
    - 3: Red - Class # 3

Sample run: 
    python main.py \ 
        --image data/input.png \
        --scribbles data/scribbles.png \ 
        --output data/output.png \
        --resolve_type pixel
'''

import os
import os.path
import argparse

import numpy as np
import cv2
import matplotlib.pyplot as plt

import grabcut

from resolve_overlap import ResolveOverlap

# enable EXR read/ write
os.environ["OPENCV_IO_ENABLE_OPENEXR"] = "1"

BLUE = [255, 0, 0]
GREEN = [0, 255, 0]
RED = [0, 0, 255]
BLACK = [0, 0, 0]


def scribbles_to_trimap(scribbles, color):
    """
    converts scribble image to a trimap for grabcut algorithm

    Args:
        scribbles (ndarray): BGR image of scribbles
        color (ndarray): array of foreground colors
    
    Returns:
        trimap (ndarray): binary mask with values as follows: 
            - 128:  unknown
            - 0:    sure background
            - 255:  sure foreground
    """
    # init output mask
    trimap = np.full(scribbles.shape[:2], fill_value=128)

    # isolating input 'color' scribbles from all others
    scribbles_color = np.all(scribbles == color,  axis=-1)

    # marking sure foreground in trimap
    trimap[scribbles_color] = 255
    
    # isolating all black scribbles
    # used to mark sure background
    scribbles_black = np.all(scribbles == BLACK,  axis=-1)

    # marking sure background in trimap
    trimap[scribbles_black] = 0

    # using other color scribbles as sure background as well
    color_list = [BLUE, GREEN, RED]
    color_list.remove(color)    # skip input color

    for c in color_list:
        # isolating scribbles of color c
        scribbles_c = np.all(scribbles == c,  axis=-1)

        # marking scirrbles of color c as sure background
        trimap[scribbles_c] = 0

    return np.uint8(trimap)


def parse_args():
    parser = argparse.ArgumentParser(
        description='Multi Graphcut Image Segmentation',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    # input image path
    parser.add_argument(
        '--image',
        type=str, 
        help='input image path',
        required=True,
    )

    # scribbles image path
    parser.add_argument(
        '--scribbles',
        type=str, 
        help='scribbles image path',
        required=True,
    )

    # input image path
    parser.add_argument(
        '--output',
        type=str, 
        help='output mask path',
        required=True,
    )

    # number of iterations of grabcut
    parser.add_argument(
        '--iter',
        type=int,
        default=10,
        help='maximum number of grabcut iteraions',
        required=False,
    )

    parser.add_argument(
        '--gamma',
        type=float, 
        default=10.,
        help='grabcut gamma parameter',
        required=False,
    )

    ## overlap resolution parameters 
    # number of iterations of grabcut
    parser.add_argument(
        '--resolve_type',
        type=str,
        default="pixel",
        help="overlap resolution type: 'pixel' or 'blob'",
        required=False,
    )

    parser.add_argument(
        '--iter_overlap',
        type=int,
        default=100,
        help='maximum number iterations of overlap resolution',
        required=False,
    )

    parser.add_argument(
        '--covariance_type',
        type=str,
        default="full",
        help='covariance type of overlap resolution',
        required=False,
    )

    parser.add_argument(
        '--init_params',
        type=str,
        default="kmeans",
        help='parameter initialization model of overlap resolution',
        required=False,
    )

    return parser.parse_args()

def main():
    # fetching arguments
    args = parse_args()

    print("Iterations: " + str(args.iter))
    print("Gamma: " + str(args.gamma))
    print("Resolve type: " + str(args.resolve_type))

    # reading input image
    im_BGR = cv2.imread(args.image, cv2.IMREAD_ANYDEPTH | cv2.IMREAD_ANYCOLOR)
    im = cv2.cvtColor(im_BGR, cv2.COLOR_BGR2BGRA)

    # reading scribble image
    scribbles = cv2.imread(args.scribbles)

    # checking present scribbles colors (classes)
    has_blue = np.all(scribbles == BLUE, axis=-1).max() 
    has_green = np.all(scribbles == GREEN, axis=-1).max() 
    has_red = np.all(scribbles == RED, axis=-1).max() 

    # init output mask
    output_mask = np.zeros(im_BGR.shape[:2])

    # init GrabCut
    gc = grabcut.GrabCut(args.iter)

    ## using grabcut to segment image through scribbles
    # applying grabcut on class BLUE
    if has_blue:
        trimap_b = scribbles_to_trimap(scribbles, BLUE)
        mask_b = gc.estimateSegmentationFromTrimap(im, trimap_b, args.gamma) * 255
        output_mask = np.where(mask_b==255, 1, output_mask) # marking output to output_mask

    # applying grabcut on class GREEN
    if has_green:
        trimap_g = scribbles_to_trimap(scribbles, GREEN)
        mask_g = gc.estimateSegmentationFromTrimap(im, trimap_g, args.gamma) * 255
        output_mask = np.where(mask_g==255, 2, output_mask) # marking output to output_mask

    # applying grabcut on class RED
    if has_red:
        trimap_r = scribbles_to_trimap(scribbles, RED)
        mask_r = gc.estimateSegmentationFromTrimap(im, trimap_r, args.gamma) * 255
        output_mask = np.where(mask_r==255, 3, output_mask) # marking output to output_mask


    ## resolving any common areas
    # init ResolveOverlap
    RO = ResolveOverlap(
        max_iter=args.iter_overlap,
        covariance_type=args.covariance_type,
        init_params=args.init_params,
    )

    # getting resolution function 
    resolve_overlap = RO.pixel_wise_resolution if args.resolve_type =="pixel" else RO.blob_resolution

    # overlap resolution: Blue-Green
    if has_blue and has_green:
        resolve_bg = resolve_overlap(im_BGR, mask_b, mask_g)
        output_mask = np.where(resolve_bg==1, 1, output_mask)
        output_mask = np.where(resolve_bg==2, 2, output_mask)

    # overlap resolution: Green-Red
    if has_green and has_red:
        resolve_gr = resolve_overlap(im_BGR, mask_g, mask_r)
        output_mask = np.where(resolve_gr==1, 2, output_mask)
        output_mask = np.where(resolve_gr==2, 3, output_mask)

    # overlap resolution: Blue-Red
    if has_blue and has_red:
        resolve_br = resolve_overlap(im_BGR, mask_b, mask_r)
        output_mask = np.where(resolve_br==1, 1, output_mask)
        output_mask = np.where(resolve_br==2, 3, output_mask)

    # writing output_mask as binary image
    cv2.imwrite(args.output, output_mask)

    # binary to BGR output_mask
    output_mask_bgr = np.zeros((output_mask.shape[0], output_mask.shape[1], 3))
    output_mask_bgr[:, :, 0] = np.where(output_mask == 1, 255, 0)
    output_mask_bgr[:, :, 1] = np.where(output_mask == 2, 255, 0)
    output_mask_bgr[:, :, 2] = np.where(output_mask == 3, 255, 0)

    # writing output mask as rgb image
    output_path = args.output.split(".")    # extracting path and extension
    path_of_output = args.output.split('.')
    temp = path_of_output[0] + '_rgb.png'
    if os.path.exists(temp):
        os.remove(temp)
    cv2.imwrite(f"{''.join(output_path[:-1])}_rgb.{output_path[-1]}", output_mask_bgr)

if __name__ == "__main__":
    main()