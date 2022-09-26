import numpy as np
import os
import cv2

import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

from sklearn.mixture import GaussianMixture

class GaussianSegmentation:
    BLUE = [255, 0, 0]
    GREEN = [0, 255, 0]
    RED = [0, 0, 255]
    BLACK = [0, 0, 0]

    def __init__(
        self,
        max_iter=100,
        covariance_type="full",     # full, tied, diag, spherical
        init_params="kmeans",       # kmeans, k-means++, random, random_from_data
    ):
        self.max_iter = max_iter
        self.covariance_type = covariance_type
        self.init_params = init_params

    def _fit_gaussian(self, data):
        """
        fits a gaussuan mixture on provided data

        Args:
            data (ndarray): data of shape (n_components, n_features)
        """
        return GaussianMixture(
                    n_components=1,
                    covariance_type = self.covariance_type,
                    max_iter = self.max_iter,
                    init_params = self.init_params,
                ).fit(data)
    
    def _isolate_scribble_pixels(self, image, scribbles, color):
        """
        isolates image pixel under the given colored scribble

        Args:
            scribbles (ndarray): BGR image of scribbles
            color (ndarray): array of foreground colors
        """
        # isolating input 'color' scribbles from all others
        scribbles_color = np.all(scribbles == color,  axis=-1)

        # extracting color scribble pixels from image
        return image[scribbles_color]
    
    def _predict(self, distributions, image):
        """
        predicts class of each iamge pixel based on based on log-likehood score

        Args:
            distributions (list): list of gaussian distribution objects
            image (ndarray): 3D image data
        """
        mask = None
        image_flat = image.reshape(-1, 3)

        # calculating log-likehood score for each distribution
        for dist in distributions:
            # if first distribution
            if mask is None: 
                mask = dist.score_samples(image_flat).reshape(image.shape[0], image.shape[1])
            # if distribution is None (no marker in scribbles)
            elif dist is None:
                mask = np.dstack((mask, np.full((mask.shape[0], mask.shape[1]), 1)))
            else:
                mask = np.dstack((mask, dist.score_samples(image_flat).reshape(image.shape[0], image.shape[1])))
        
        # convert log-likehood score to class
        mask = np.argmax(mask, axis=-1)

        return mask

    def segment(self, image, scribbles):
        # checking present scribbles colors (classes)
        has_blue = np.all(scribbles == self.BLUE, axis=-1).max() 
        has_green = np.all(scribbles == self.GREEN, axis=-1).max() 
        has_red = np.all(scribbles == self.RED, axis=-1).max()

        # fitting gaussian distributions on background scribbles
        distributions = [] 
        distributions.append(
            self._fit_gaussian(
                self._isolate_scribble_pixels(image, scribbles, self.BLACK).reshape(-1, 3)
            )
        )

        # fitting gaussian distributions on scribble regions
        if has_blue:
            distributions.append(
                self._fit_gaussian(
                    self._isolate_scribble_pixels(image, scribbles, self.BLUE).reshape(-1, 3)
                )
            )
        else:
            distributions.append(None)

        if has_green:
            distributions.append(
                self._fit_gaussian(
                    self._isolate_scribble_pixels(image, scribbles, self.GREEN).reshape(-1, 3)
                )
            )
        else:
            distributions.append(None)

        if has_red:
            distributions.append(
                self._fit_gaussian(
                    self._isolate_scribble_pixels(image, scribbles, self.RED).reshape(-1, 3)
                )
            )
        else:
            distributions.append(None)

        # generate mask from distributions
        mask = self._predict(distributions, image)
    
        return mask


if __name__ == "__main__":
    import os
    os.environ["OPENCV_IO_ENABLE_OPENEXR"] = "1"

    img = cv2.imread("input.exr", cv2.IMREAD_ANYDEPTH | cv2.IMREAD_ANYCOLOR)
    scribbles = cv2.imread("scribbles.png")

    GS = GaussianSegmentation()

    mask = GS.segment(img, scribbles)

    print(np.unique(mask))

    plt.imshow(mask)

    



